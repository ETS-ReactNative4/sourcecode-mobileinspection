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
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {

                            /* INSERT DATA AFD */
                            TaskServices.saveData('TM_AFD', item);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )

                    const param = {
                        TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                        TABEL_UPDATE: 'hectare-statement/afdeling'
                    }

                    /* UPDATE MOBILE SYNC DATA */
                    postMobileSync(param, 'TM_AFD');
                }

                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                          /* UPDATE DATA AFD */
                        TaskServices.updateByPrimaryKey('TM_AFD', item);
                    })
                }

                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                          /* DELETE DATA AFD */
                        TaskServices.deleteRecordByPK('TM_AFD', 'WERKS_AFD_CODE', item.WERKS_AFD_CODE);
                    });
                }
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