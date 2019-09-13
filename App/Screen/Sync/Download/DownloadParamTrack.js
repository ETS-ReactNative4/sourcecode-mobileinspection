import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";

export async function getParamTrack() {

    let dbLocal = TaskServices.getAllData('TM_TIME_TRACK');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('AUTH-PARAMETER-TRACK').then((data) => {

        try {
            /* INSERT DATA PARAM TRACK INSPECTION */
            if (data != null) {
                TaskServices.saveData('TM_TIME_TRACK', data);
                downloadLabels = {
                    ...downloadLabels,
                    downloadCount: downloadLabels.downloadCount + 1
                }
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH PARAM TRACK INSPECTION : ', error)
        }
    })

    return downloadLabels;
}