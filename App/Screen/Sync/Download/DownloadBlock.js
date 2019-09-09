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

    await getAPIFunction('AUTH-SYNC-HS-BLOCK').then((data) => {

        if (data != null) {
            if (data.simpan.length > 0) {
                Promise.all(
                    data.simpan.map(item => {
                        TaskServices.saveData('TM_BLOCK', item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })

                )

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/block'
                }

                postMobileSync(param, 'TM_BLOCK');
            }

            if (data.ubah.length > 0 && allData.length > 0) {
                data.ubah.map(item => {
                    TaskServices.updateByPrimaryKey('TM_BLOCK', item);
                })
            }

            if (data.hapus.length > 0 && allData.length > 0) {
                data.hapus.map(item => {
                    TaskServices.deleteRecordByPK('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
                });
            }
        } else {
            downloadLabels = {
                ...downloadLabels
            }
        }
    })

    return downloadLabels;
}