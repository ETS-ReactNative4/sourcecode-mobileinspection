import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import { NotificationFinding } from '../Notification/NotificationFinding';
import { getTodayDate } from '../../../Lib/Utils';

export async function getFinding() {

    let dbLocal = TaskServices.getAllData('TR_FINDING');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    /* DEFAULT MIDLEWARE */
    await getAPIFunction('AUTH-SYNC-FINDING').then((data) => {

        let user = TaskServices.getAllData('TR_LOGIN')[0];

        try {
            if (data != null) {

                /* DELETE DATA FINDING */
                if (data.hapus.length > 0 && dbLocal.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
                    });
                }

                /* INSERT DATA FINDING */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            let newRating = item.RATING;

                            let newItem = {
                                ...item,
                                RATING: newRating,
                                syncImage: 'Y'
                            };

                            /* INSERT NOTIFICATION FINDING */
                            NotificationFinding(newItem, user)

                            TaskServices.saveData('TR_FINDING', newItem);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE DATA FINDING */
                if (data.ubah.length > 0 && dbLocal.length > 0) {
                    data.ubah.map(item => {
                        let newRating = item.RATING ? item.RATING[0] : null;
                        let newItem = { ...item, STATUS_SYNC: 'Y', RATING: newRating };

                        TaskServices.updateByPrimaryKey('TR_FINDING', newItem)
                    })
                }

                /* UPDATE TM_MOBILE_SYNC  */
                const param = {
                    TGL_MOBILE_SYNC: getTodayDate('YYYY-MM-DD HH:mm:ss'),
                    TABEL_UPDATE: 'finding'
                }
                postMobileSync(param, 'TR_FINDING');
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH FINDING : ', error)
        }
    })

    return downloadLabels;
}
