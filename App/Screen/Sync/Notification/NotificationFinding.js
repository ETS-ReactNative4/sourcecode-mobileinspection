import TaskServices from '../../../Database/TaskServices'
import moment from 'moment'

export function NotificationFinding(data, user) {
    let today = moment(new Date());
    let newNotif = {
        NOTIFICATION_ID: data.FINDING_CODE + "$",
        NOTIFICATION_TIME: new Date(),
        NOTIFICATION_STATUS: 0,
        FINDING_UPDATE_TIME: data.UPDATE_TIME,
        FINDING_CODE: data.FINDING_CODE
    }
    if (data.UPDATE_USER == '') {
        if (data.ASSIGN_TO == user.USER_AUTH_CODE && data.INSERT_USER !== user.USER_AUTH_CODE) {

            /* FINDING BARU DI ASSIGN KE USER */
            let newData = { ...newNotif, NOTIFICATION_TYPE: 0 }
            TaskServices.saveData('TR_NOTIFICATION', newData);
        }
        let createDate = moment(data.INSERT_TIME, "YYYYMMDDHHmmss");
        let diffDays = today.diff(createDate, 'days');
        if (diffDays > 6) {

            /* BELUM DI RESPON 7 HARI SETELAH PEMBUATAN */
            if (data.ASSIGN_TO == user.USER_AUTH_CODE) {

                /* DIASSIGN TAPI BELUM MERESPON */
                newNotif.NOTIFICATION_TYPE = 2;
                TaskServices.saveData('TR_NOTIFICATION', newNotif);
            }
        }
    }
    else if (data.INSERT_USER == user.USER_AUTH_CODE
        && data.INSERT_USER != data.ASSIGN_TO) {
        if (data.PROGRESS >= 100) {

            /* PROGRAM SUDAH SELESAI */
            newNotif.NOTIFICATION_TYPE = 4;
            TaskServices.saveData('TR_NOTIFICATION', newNotif);
        }
    }
    else if (data.ASSIGN_TO == user.USER_AUTH_CODE) {
        if (data.PROGRESS >= 100 && data.RATING_VALUE > 0) {

            /* YANG DITUGASKAN MENDAPAT RATING */
            newNotif.NOTIFICATION_TYPE = 5;
            newNotif.NOTIFICATION_STATUS = 0;
            TaskServices.saveData('TR_NOTIFICATION', newNotif);
        }
    }
}