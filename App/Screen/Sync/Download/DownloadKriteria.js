import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getKriteria() {

    let dbLocal = TaskServices.getAllData('TM_KRITERIA');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-KRITERIA').then((data) => {

        if (data != null) {
            if (data.length > 0) {
                Promise.all(
                    data.map(item => {
                        TaskServices.saveData('TM_KRITERIA', item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })
                )

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/kriteria'
                }

                postMobileSync(param, 'TM_KRITERIA')
            }
        } else {
            downloadLabels = {
                ...downloadLabels
            }
        }
    })

    return downloadLabels;
}