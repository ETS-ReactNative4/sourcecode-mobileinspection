import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { postMobileSync } from "../Upload/UploadMobileSync";
import moment from 'moment'

export async function getRoad() {

    let dbLocal = TaskServices.getAllData('TM_ROAD');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-HS-ROAD').then((data) => {

        console.log('Data Road : ', data);

        try {
            if (data != null) {

                /* DELETE DATA CONTENT */
                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TM_ROAD', 'ROAD_CODE', item.ROAD_CODE);
                    });
                }

                /* INSERT DATA CONTENT */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {

                            let strWerks = item.WERKS.toString();

                            let newItem = {
                                ...item,
                                WERKS: strWerks
                            };

                            TaskServices.saveData('TM_ROAD', newItem);
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
                        TaskServices.updateByPrimaryKey('TM_ROAD', item);
                    })
                }

                /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'hectare-statement/road'
                }

                postMobileSync(param, 'TM_ROAD')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH ROAD : ', error)
        }
    })

    return downloadLabels;
}