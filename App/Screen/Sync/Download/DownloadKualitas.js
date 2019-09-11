import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import moment from 'moment'
import { postMobileSync } from '../Upload/UploadMobileSync';

export async function getKualitas() {

    let dbLocal = TaskServices.getAllData('TM_KUALITAS');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-SYNC-EBCC-KUALITAS').then((data) => {

        try {
            if (data != null) {
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            item.ID_KUALITAS = item.ID_KUALITAS.toString();
                            TaskServices.saveData('TM_KUALITAS', item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })

                    )
                }

                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                        item.ID_KUALITAS = item.ID_KUALITAS.toString();
                        TaskServices.updateByPrimaryKey('TM_KUALITAS', item);
                    })
                }

                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        item.ID_KUALITAS = item.ID_KUALITAS.toString();
                        TaskServices.deleteRecordByPK('TM_KUALITAS', 'ID_KUALITAS', item.ID_KUALITAS);
                    });
                }

                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'ebcc/kualitas'
                }

                postMobileSync(param, 'TM_KUALITAS')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH KUALITAS : ', error)
        }
    })

    return downloadLabels;
}