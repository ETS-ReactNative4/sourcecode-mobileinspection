import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getRegion() {

    let dbLocal = TaskServices.getAllData('TM_REGION');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-HS-REGION').then((data) => {

        if (data != null) {
            if (data.simpan.length > 0) {
                Promise.all(
                    data.simpan.map(item => {
                        TaskServices.saveData('TM_REGION', item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })
                )

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/region'
                }

                postMobileSync(param, 'TM_REGION');
            }

            if (data.ubah.length > 0 && allData.length > 0) {
                data.ubah.map(item => {
                    TaskServices.updateByPrimaryKey('TM_REGION', item);
                })
            }

            if (data.hapus.length > 0 && allData.length > 0) {
                data.hapus.map(item => {
                    TaskServices.deleteRecordByPK('TM_REGION', 'REGION_CODE', item.REGION_CODE);
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