import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getBlock() {

    let dbLocal = TaskServices.getAllData('TM_BLOCK');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    /* DEFAULT MIDLEWARE */
    await getAPIFunction('AUTH-SYNC-HS-BLOCK').then((data) => {

        try {
            if (data != null) {
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {

                            /* INSERT DATA BLOCK */
                            TaskServices.saveData('TM_BLOCK', item);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })

                    )
                }

                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                         /* UPDATE DATA BLOCK */
                        TaskServices.updateByPrimaryKey('TM_BLOCK', item);
                    })
                }

                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        /* DELETE DATA BLOCK */
                        TaskServices.deleteRecordByPK('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
                    });
                }

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/block'
                }

                /* UPDATE MOBILE SYNC DATA */
                postMobileSync(param, 'TM_BLOCK');
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH BLOCK : ', error)
        }


    })

    return downloadLabels;
}