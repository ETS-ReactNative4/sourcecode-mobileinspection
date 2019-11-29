import TaskServices from '../../../../Database/TaskServices'
import { getAPIFunction } from ".././ApiFunction";

export async function getTitikRestan() {

    let dbLocal = TaskServices.getAllData('TM_REGION');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length,
        downloadStatus: true
    };

    await getAPIFunction('REPORT-TITIK-RESTAN').then((restanModel) => {
        try {
            if (restanModel !== null) {
                TaskServices.deleteAllData("TR_TITIK_RESTAN");

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
            else {
                downloadLabels = {
                    ...downloadLabels,
                    downloadStatus: false
                };
            }
        }
        catch (error) {
            downloadLabels = {
                ...downloadLabels,
                downloadStatus: false
            };
        }
    });

    return downloadLabels;
}
