import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getContent() {

    let dbLocal = TaskServices.getAllData('TM_CONTENT');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-CONTENT').then((data) => {

        try {
            if (data != null) {

                /* DELETE DATA CONTENT */
                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TM_CONTENT', 'CONTENT_CODE', item.CONTENT_CODE);
                    });
                }

                /* INSERT DATA CONTENT */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            TaskServices.saveData('TM_CONTENT', item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }

                /* UPDATE DATA CONTENT */
                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                        TaskServices.updateByPrimaryKey('TM_CONTENT', item);
                    })
                }

                /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/content'
                }

                postMobileSync(param, 'TM_CONTENT')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH CONTENT : ', error)
        }
    })

    return downloadLabels;
}