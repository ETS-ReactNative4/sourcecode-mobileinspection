import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getComp() {

    let dbLocal = TaskServices.getAllData('TM_COMP');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-HS-COMP').then((data) => {

        if (data != null) {
            if (data.simpan.length > 0) {
                Promise.all(
                    data.simpan.map(item => {
                        TaskServices.saveData('TM_COMP', item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })
                )

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/comp'
                }

                postMobileSync(param, 'TM_COMP')
            }

            if (data.ubah.length > 0 && allData.length > 0) {
                data.ubah.map(item => {
                    TaskServices.updateByPrimaryKey('TM_COMP', item);
                })
            }

            if (data.hapus.length > 0 && allData.length > 0) {
                data.hapus.map(item => {
                    TaskServices.deleteRecordByPK('TM_COMP', 'COMP_CODE', item.COMP_CODE);
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