import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'
import { downloadImageFinding } from './DownloadImage';

export async function getFindingImage() {

    let dbLocal = TaskServices.getAllData('TR_IMAGE');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-FINDING-IMAGES').then((data) => {

        try {
            if (data != null) {

                /* INSERT DATA FINDING IMAGE */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            let tempItem = {
                                ...item,
                                STATUS_SYNC: 'Y'
                            }
                            TaskServices.saveData('TR_IMAGE', tempItem);
                            downloadImageFinding(item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })

                    )
                }

                /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'finding-image'
                }

                postMobileSync(param, 'TR_IMAGE FINDING');
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH FINDING IMAGE : ', error)
        }

    })

    return downloadLabels;
}
