import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import { getTodayDate } from '../../../Lib/Utils';

export async function getNotificationInbox() {

    let dbLocal = TaskServices.getAllData('TR_NOTIFICATION_1');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    /* DEFAULT MIDLEWARE */
    await getAPIFunction('AUTH-SYNC-NOTIFICATION').then((data) => {

        console.log('Data Notification : ', data)
        try {
            if (data != null) {

                /* INSERT DATA FINDING */
                if (data.length > 0) {
                    Promise.all(
                        data.map(item => {

                            let newItem = {
                                ...item,
                                INSERT_TIME: item.INSERT_TIME.toString(),
                                NOTIFICATION_STATUS: 0
                            };

                            TaskServices.saveData('TR_NOTIFICATION_1', newItem);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE TM_MOBILE_SYNC  */
                const param = {
                    TGL_MOBILE_SYNC: getTodayDate('YYYY-MM-DD HH:mm:ss'),
                    TABEL_UPDATE: 'notification'
                }
                postMobileSync(param, 'TR_NOTIFICATION_1');
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH NOTIFICATION INBOX : ', error)
        }
    })

    return downloadLabels;
}
