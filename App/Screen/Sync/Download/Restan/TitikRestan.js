import { AsyncStorage } from 'react-native';
import moment from 'moment';
import TaskServices from '../../../../Database/TaskServices'
import { getAPIFunction } from ".././ApiFunction";

export async function getTitikRestan() {

    let titikRestan = TaskServices.getAllData('TR_TITIK_RESTAN');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: titikRestan.length,
        downloadStatus: true
    };

    await getAPIFunction('INTERNAL-TITIK-RESTAN').then((restanModel) => {
        try {
            if (restanModel !== null) {
                AsyncStorage.setItem('SYNCTIME-titikRestan', JSON.stringify({
                    latestSyncTime: moment().format("DD MMM YYYY")
                }));

                TaskServices.deleteAllData("TR_TITIK_RESTAN");

                Promise.all(
                    restanModel.map(item => {
                        console.log(JSON.stringify(item));
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
