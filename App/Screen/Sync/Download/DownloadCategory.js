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

        try {
            if (data != null) {

                /* DELETE DATA CATEGORY */
                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TR_CATEGORY', 'CATEGORY_CODE', item.CATEGORY_CODE);
                    });
                }

                /* INSERT DATA CATEGORY */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            TaskServices.saveData('TR_CATEGORY', item);
                            downloadImageCategory(item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE DATA CATEGORY */
                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                        TaskServices.updateByPrimaryKey('TR_CATEGORY', item);
                    })
                }

                /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/category'
                }

                postMobileSync(param, 'TR_CATEGORY')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH CATEGORY : ', error)
        }

    })

    return downloadLabels;
}