import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getContact() {

    let dbLocal = TaskServices.getAllData('TR_CONTACT');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-CONTACT').then((data) => {

        try {
            if (data != null) {


                /* DELETE DATA CONTACT */
                if (data.hapus.length > 0 && dbLocal.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TR_CONTACT', 'USER_AUTH_CODE', item.USER_AUTH_CODE);
                    });
                }

                /* INSERT DATA CONTACT */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            TaskServices.saveData('TR_CONTACT', item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE DATA CONTACT */
                if (data.ubah.length > 0 && dbLocal.length > 0) {
                    data.ubah.map(item => {
                        TaskServices.updateByPrimaryKey('TR_CONTACT', item);
                    })
                }

                 /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/contact'
                }

                postMobileSync(param, 'TR_CONTACT')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH CONTACT : ', error)
        }


    })

    return downloadLabels;
}