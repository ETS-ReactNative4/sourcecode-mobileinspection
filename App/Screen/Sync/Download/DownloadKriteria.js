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

        try {
            if (data != null) {

                /* DELETE DATA KRITERIA */
                if (data.hapus.length > 0 && allData.length > 0) {
                    data.hapus.map(item => {
                        TaskServices.deleteRecordByPK('TM_KRITERIA', 'KRITERIA_CODE', item.KRITERIA_CODE);
                    });
                }

                /* INSERT DATA KRITERIA */
                if (data.simpan.length > 0) {
                    Promise.all(
                        data.simpan.map(item => {
                            TaskServices.saveData('TM_KRITERIA', item);
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )

                }

                /* UPDATE DATA KRITERIA */
                if (data.ubah.length > 0 && allData.length > 0) {
                    data.ubah.map(item => {
                        TaskServices.updateByPrimaryKey('TM_KRITERIA', item);
                    })
                }

                 /* UPDATE TM_MOBILE_SYNC */
                const param = {
                    TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                    TABEL_UPDATE: 'auth/kriteria'
                }

                postMobileSync(param, 'TM_KRITERIA')
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH KRITERIA  : ', error)
        }


    })

    return downloadLabels;
}