import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getAfd() {

    let dbLocal = TaskServices.getAllData('TM_AFD');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    /* DEFAULT MIDLEWARE */
    await getAPIFunction('AUTH-SYNC-HS-AFD').then((data) => {

        try {
            if (data != null) {

                /* DELETE DATA AFD */
                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TM_AFD', 'WERKS_AFD_CODE', item.WERKS_AFD_CODE);
                    });
                }

                /* INSERT DATA AFD */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {

                            TaskServices.saveData('TM_AFD', item);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE DATA AFD */
                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                        TaskServices.updateByPrimaryKey('TM_AFD', item);
                    })
                }

                /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/afdeling'
                }

                postMobileSync(param, 'TM_AFD');

            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH AFD : ', error)
        }


    })

    return downloadLabels;
}