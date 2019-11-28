import TaskServices from '../../../../Database/TaskServices'
import { getAPIFunction } from ".././ApiFunction";

export async function getTitikRestan() {

    let dbLocal = TaskServices.getAllData('TM_REGION');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    await getAPIFunction('REPORT-TITIK-RESTAN').then((restanModel) => {
        try {
            if (restanModel !== null) {
                Promise.all(
                    restanModel.map(item => {
                        TaskServices.saveData('TR_TITIK_RESTAN', item);
                        downloadLabels = {
                            ...downloadLabels,
                            downloadCount: downloadLabels.downloadCount + 1
                        }
                    })
                )
            }
        }
        catch (error) {
            console.log('CATCH REGION : ', error)
        }
    });

    return downloadLabels;
}
