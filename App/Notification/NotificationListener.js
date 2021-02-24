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
};

export async function getFCMToken() {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        return fcmToken;
    }
    return null;
}

function subscribeTopic(topicName: string) {
    firebase.messaging().subscribeToTopic(topicName);
}

function unsubscribeTopic(topicName: string) {
    firebase.messaging().unsubscribeFromTopic(topicName);
}

//deeplink setup
export function notificationDeeplinkSetup(props) {
    let currentUser = TaskServices.getAllData('TR_LOGIN');
    if (currentUser[0].USER_ROLE === "ASISTEN_LAPANGAN") {

        //deeplink (kalo appny belum kebuka)
        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
                    switch (notificationOpen.notification._data.DEEPLINK) {
                        case "RESTAN":
                            props.navigation.navigate("Restan");
                            break;
                        case "DETAIL_FINDING":
                            props.navigation.navigate("DetailFinding", { ID: notificationOpen.notification._data.FINDING_CODE });
                            break;
                        case "SYNC":
                            props.navigation.navigate("Sync");
                            break;
                        default:
                            break;
                    }
                }

            });

        //setup kalo appny di background
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            if (notificationOpen) {
                firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId);
                switch (notificationOpen.notification._data.DEEPLINK) {
                    case "RESTAN":
                        props.navigation.navigate("Restan");
                        break;
                    case "DETAIL_FINDING":
                        props.navigation.navigate("DetailFinding", { ID: notificationOpen.notification._data.FINDING_CODE  });
                        break;
                    case "SYNC":
                        props.navigation.navigate("Sync");
                        break;
                    default:
                        break;
                }
            }
        });
    }
}

export async function displayNotificationTemuan() {
    const login = TaskServices.getAllData('TR_LOGIN');
    const user_auth = login[0].USER_AUTH_CODE;

    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}"`);

    await Promise.all(
        data.map(async (item) => {
            var now = moment(new Date());
            if (item.DUE_DATE != undefined) {
                const dueDate = item.DUE_DATE.substring(0, 10);
                var diff = moment(new Date(dueDate)).diff(now, 'day');
                if (diff > 0) {
                    const INSERT_USER = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', item.INSERT_USER);
                    let FULLNAME = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME;

                    let body = '';
                    if (item.INSERT_USER === item.ASSIGN_TO) {
                        body = 'Temuan yang kamu buat akan melewati batas waktu pada ' + dateDisplayMobileWithoutHours(item.DUE_DATE)
                            + '. Selesaikan temuan ini yuk!';
                    } else {
                        body = 'Temuan dari ' + FULLNAME + ' akan melewati batas waktu pada ' + dateDisplayMobileWithoutHours(item.DUE_DATE)
                            + '. Selesaikan temuan ini yuk!';
                    }

                    const notification = new firebase.notifications.Notification()
                        .setNotificationId(item.FINDING_CODE + getTodayDate('YYYYMMDDHHmmss'))
                        .setTitle('Temuan Overdue')
                        .setSubtitle('Temuan')
                        .setData({ DEEPLINK: 'DETAIL_FINDING', FINDING_CODE: item.FINDING_CODE })
                        .setSound('default')

                    if (Platform.OS === "android") {
                        notification.android.setChannelId('mobile-inspection-channel');
                        notification.android.setBigText(body)
                        notification.android.setPriority(firebase.notifications.Android.Priority.High);
                        notification.android.setBadgeIconType(firebase.notifications.Android.BadgeIconType.Small);
                        notification.android.setAutoCancel(true);
                        notification.android.setSmallIcon('ic_launcher_notification');
                    }

                    var duedate = item.DUE_DATE.substring(0, 10);

                    // Schedule the notification base on due date in the future
                    var formatDate = moment(duedate).subtract(1, "days").format('YYYY-MM-DD' + " 06:00:00");
                    var scheduleDate = moment(formatDate);

                    // Display the notification
                    await firebase.notifications().scheduleNotification(notification, {
                        fireDate: scheduleDate.valueOf()
                    });

                    // Display the notification
                    // firebase.notifications().displayNotification(notification);

                    // let picNotification = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE)

                    // let showPicNotification;
                    // let pathImage = `file://${dirPhotoTemuan}/${picNotification.IMAGE_NAME}`;
                    // if (picNotification != undefined) {
                    //     if (picNotification.IMAGE_NAME != undefined)
                    //         showPicNotification = pathImage;
                    // }

                    // console.log("Insert User : " + item.INSERT_USER + item.ASSIGN_TO);
                }
            }
        })
    )
}

export function displayNotificationSync() {

    const syncdays = syncDays();

    if (syncdays > 0) {
        const login = TaskServices.getAllData('TR_LOGIN');
        const userauth = login[0].USER_AUTH_CODE;
        const username = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', userauth);

        let body = username.FULLNAME + ' , kamu belum melakukan sync data selama ' + syncdays + ' hari. Segera lakukan sync data ya..';

        const notification = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true,
            largeIcon: "ic_launcher_notification",
            smallIcon: "ic_launcher_notification",
        })
            .setNotificationId(getTodayDate('YYYYMMDDHHmmss'))
            .setTitle('Belum Sync')
            .setSubtitle('Sync')
            .setBody(body)
            .setData({ DEEPLINK: 'SYNC' })
            .setSound('default')

        if (Platform.OS === "android") {
            notification.android.setChannelId('mobile-inspection-channel');
            notification.android.setBigText(body);
            notification.android.setSmallIcon('ic_launcher_notification')
        }

        // Display the notification
        firebase.notifications().displayNotification(notification);
    }
}
