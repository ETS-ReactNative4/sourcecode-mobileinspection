import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import moment from 'moment'
import { storeData } from '../../../Database/Resources';
import RNFS from 'react-native-fs';

export async function getResetToken(isSync) {

    let sync = isSync;

    let callbackValue = {
        isResetSync: false,
        isUpdateToken: false,
        pickedWerks: false
    };

    await getAPIFunction('AUTH-GENERATE-TOKEN').then((data) => {

        // console.log('AUTH-GENERATE-TOKEN : ', data)

        try {
            if (data != null) {
                if (sync) {
                    let newToken = data.data;
                    let allLoginData = TaskServices.findBy('TR_LOGIN', 'STATUS', 'LOGIN');
                    if (allLoginData.length > 0) {
                        let loginData = {
                            ...allLoginData[0],
                            ACCESS_TOKEN: newToken
                        };

                        TaskServices.updateByPrimaryKey('TR_LOGIN', loginData);
                        let newLoginData = TaskServices.findBy('TR_LOGIN', 'STATUS', 'LOGIN');

                        /* COPY DATABASE TO FOLDER MOBILE INSPECTION  */
                        RNFS.copyFile(TaskServices.getPath(), 'file:///storage/emulated/0/MobileInspection/data.realm');

                        /* UPDATE TOKEN +7 Hari  */
                        tokenExpired();

                        /* SAVE LOG SYNC */
                        saveSyncLog();

                        callbackValue = {
                            ...callbackValue,
                            isResetSync: true,
                            isUpdateToken: true,
                            pickedWerks: (newLoginData[0].CURR_WERKS ? true : false)
                        }
                    }
                    else {
                        callbackValue = {
                            ...callbackValue
                        }
                    }
                }
            } else {
                callbackValue = {
                    ...callbackValue
                }
            }
        } catch (error) {
            console.log('CATCH RESET TOKEN : ', error)
        }
    })

    return callbackValue;
}

function tokenExpired() {
    const newDate = moment().add(7, 'days');
    const date = { tanggal: newDate }
    storeData('expiredToken', date);
}

function saveSyncLog() {
    let today = new Date();
    let data = {
        SYNC_TIME_ID: today.getTime(),
        SYNC_TIME: today
    }
    TaskServices.saveData('TR_SYNC_LOG', data);
}