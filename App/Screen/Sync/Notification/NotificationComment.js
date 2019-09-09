
import TaskServices from '../../../Database/TaskServices'
import moment from 'moment'

export function NotificationComment(param, user) {
    let getFinding = TaskServices.findBy("TR_FINDING", "FINDING_CODE", param.FINDING_CODE).sorted('INSERT_TIME', true);
    if (getFinding !== undefined) {

        let newNotif = {
            NOTIFICATION_ID: param.FINDING_COMMENT_ID + "$" + param.USERNAME,
            NOTIFICATION_TIME: new Date(),
            FINDING_UPDATE_TIME: moment(param.INSERT_TIME, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
            FINDING_CODE: param.FINDING_CODE
        };

        /* INBOX COMMENT KALO DI ASSIGN OR NGE ASSIGN */
        getFinding.map(data => {
            if (data.ASSIGN_TO == user.USER_AUTH_CODE || data.INSERT_USER == user.USER_AUTH_CODE) {
                let newData = { ...newNotif, NOTIFICATION_TYPE: 6 }
                TaskServices.saveData('TR_NOTIFICATION', newData);
            }
        })

        /* INBOX COMMENT KALO DI TAGGED */
        param.TAGS.map((data) => {
            if (data.USER_AUTH_CODE === user.USER_AUTH_CODE) {
                let newData = { ...newNotif, NOTIFICATION_TYPE: 7 }
                TaskServices.saveData('TR_NOTIFICATION', newData);
            }
        })
    }
}