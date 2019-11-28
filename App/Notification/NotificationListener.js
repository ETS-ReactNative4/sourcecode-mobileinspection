import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import { getTodayDate, dateDisplayMobileWithoutHours, syncDays } from '../Lib/Utils';
import TaskServices from '../Database/TaskServices';
import { dirPhotoTemuan } from '../Lib/dirStorage'
import moment from 'moment';

export const createNotificationChannel = () => {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel('mobile-inspection-channel', 'Mobile Inspection Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('Mobile Inspection Channel Notification');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
    subscribeTopic("testKeps");
};

async function getFCMToken(){
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    }
    return null;
}

function subscribeTopic(topicName :string){
    firebase.messaging().subscribeToTopic(topicName);
}

function unsubscribeTopic(topicName :string){
    firebase.messaging().unsubscribeFromTopic(topicName);
}

//deeplink setup
export function notificationDeeplinkSetup(props){
    let currentUser = TaskServices.getAllData('TR_LOGIN');
    if(currentUser[0].USER_ROLE === "ASISTEN_LAPANGAN"){
        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                switch (notificationOpen.notification._data.DEEPLINK) {
                    case "RESTAN":
                        props.navigation.navigate("Restan");
                        break;
                    default:
                        break;
                }
            });
    }
}

export const displayNotificationTemuan = () => {
    const login = TaskServices.getAllData('TR_LOGIN');
    const user_auth = login[0].USER_AUTH_CODE;

    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}"`);

    var reminderData = []

    data.map(item => {
        if (item.DUE_DATE != undefined) {
            reminderData.push(item);
        }
    })

    setTimeout(() => {
        reminderData.map(item => {

            const INSERT_USER = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', item.INSERT_USER);
            let FULLNAME = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME;

            let picNotification = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE)

            let showPicNotification;
            let pathImage = `file://${dirPhotoTemuan}/${picNotification.IMAGE_NAME}`;
            if (picNotification != undefined) {
                if (picNotification.IMAGE_NAME != undefined)
                    showPicNotification = pathImage;
            }

            var body = 'Temuan dari ' + FULLNAME + ' akan melewati batas waktu pada ' + dateDisplayMobileWithoutHours(item.DUE_DATE)
                + '. Selesaikan temuan ini yuk!';

            const notification = new firebase.notifications.Notification()
                .setNotificationId(item.FINDING_CODE + getTodayDate('YYYYMMDDHHmmss'))
                .setTitle('Temuan Overdue')
                .setSubtitle('Temuan')
                .setBody(body)
                .setData({ key: 'DetailFinding', findingCode: item.FINDING_CODE })
                .setSound('default')

            if (Platform.OS === "android") {
                notification.android.setChannelId('mobile-inspection-channel');
                notification.android.setBigPicture(showPicNotification);
                notification.android.setBadgeIconType(firebase.notifications.Android.BadgeIconType.Small);
                notification.android.setPriority(firebase.notifications.Android.Priority.High);
                notification.android.setAutoCancel(true);
            }

            // Schedule the notification base on due date in the future
            console.log('DUE DATE : ', item.DUE_DATE);

            var startdate = moment(item.DUE_DATE + ' 15:05:00');
            startdate = startdate.subtract(1, "days");

            console.log('Notification Set');

            // Display the notification
            firebase.notifications().scheduleNotification(notification, {
                fireDate: startdate.valueOf()
            });
        })
    }, 1000)
}

export function displayNotificationSync() {

    const syncdays = syncDays();

    if (syncdays > 0) {
        const login = TaskServices.getAllData('TR_LOGIN');
        const userauth = login[0].USER_AUTH_CODE;
        const username = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', userauth);

        let body = username.FULLNAME + ' , kamu belum melakukan sync data selama ' + syncdays + ' hari. Segera lakukan sync data ya..';

        const notification = new firebase.notifications.Notification()
            .setNotificationId(getTodayDate('YYYYMMDDHHmmss'))
            .setTitle('Belum Sync')
            .setSubtitle('Sync')
            .setBody(body)
            .setData({ key1: 'value1', key2: 'value2', })
            .setSound('default')

        if (Platform.OS === "android") {
            notification.android.setChannelId('mobile-inspection-channel');
            notification.android.setBadgeIconType(firebase.notifications.Android.BadgeIconType.Small);
            notification.android.setBigText(body);
        }

        // Display the notification
        firebase.notifications().displayNotification(notification);
    }
}

export const notificationOpenedListener = (props) => {

    // firebase.notifications().getInitialNotification()
    //     .then((notificationOpen) => {
    //         if (notificationOpen) {
    //             // App was opened by a notification
    //             // Get the action triggered by the notification being opened
    //             const action = notificationOpen.action;
    //             // Get information about the notification that was opened
    //             console.log(action)
    //             const notification = notificationOpen.notification;
    //             firebase.notifications().removeDeliveredNotification(notification.notificationId);
    //             if (notification._data.key === 'DetailFinding') {
    //                 props.navigation.navigate('DetailFinding', { ID: notification._data.findingCode });
    //             }
    //         }
    //     });

    // app in background
    firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log('Notification Open : ', notificationOpen)
        const { notification } = notificationOpen;
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
        if (notification._data.key === 'DetailFinding') {
            props.navigation.navigate('DetailFinding', { ID: notification._data.findingCode });
        }
    })

}
