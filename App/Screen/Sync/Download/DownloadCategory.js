import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import { downloadImageCategory } from './DownloadImage';
import moment from 'moment'

export async function getCategory() {

    let dbLocal = TaskServices.getAllData('TR_CATEGORY');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-CATEGORY').then((data) => {

        if (data != null) {
            if (data.length > 0) {
                Promise.all(
                    data.map(item => {
                        TaskServices.saveData('TR_CATEGORY', item);
                        downloadImageCategory(item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })
                )

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/category'
                }

                postMobileSync(param, 'TR_CATEGORY')
            }
        } else {
            downloadLabels = {
                ...downloadLabels
            }
        }
    })

    return downloadLabels;
}