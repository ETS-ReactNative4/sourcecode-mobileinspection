import { AsyncStorage } from 'react-native';
import moment from 'moment';
import TaskServices from '../../../../Database/TaskServices'
import { getAPIFunction } from ".././ApiFunction";

export async function getPetaPanenHeader() {

    let petaPanen = TaskServices.getAllData('TR_PETAPANEN_HEADER');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: petaPanen.length,
        downloadStatus: true
    };

    await getAPIFunction('INTERNAL-PETA-PANEN-HEADER').then((petapanenHeaderModel) => {
        try {
            if (petapanenHeaderModel !== null) {
                AsyncStorage.setItem('SYNCTIME-PetaPanenHeader', JSON.stringify({
                    latestSyncTime: moment().format("DD MMM YYYY")
                }));

                TaskServices.deleteAllData("TR_PETAPANEN_HEADER");

                Promise.all(
                    petapanenHeaderModel.map(item => {
                        TaskServices.saveData('TR_PETAPANEN_HEADER', item);
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

