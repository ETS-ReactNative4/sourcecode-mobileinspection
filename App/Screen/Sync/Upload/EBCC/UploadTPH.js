import TaskServices from "../../../../Database/TaskServices";
import { fetchPost } from "../../../../Api/FetchingApi";
import { syncFetchPost } from "../../../../Api";
import { convertTimestampToDate, getTodayDate } from "../../../../Lib/Utils";

//Upload-Register-TPH
export async function uploadTPH() {
    let getData = TaskServices.getAllData('TR_REGISTER_TPH').filtered('STATUS_SYNC == "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getData.length,
        syncStatus: true
    };

    if (getData.length > 0) {
        await Promise.all(
            getData.map(async (modelData) => {
                await postDataTPH(modelData)
                    .then((response) => {
                        if (response) {
                            uploadLabels = {
                                ...uploadLabels,
                                uploadCount: uploadLabels.uploadCount + 1
                            }
                        }
                        else {
                            uploadLabels = {
                                ...uploadLabels,
                                syncStatus: false
                            }
                        }
                    })
            })
        );
    }
    return {
        uploadCount: uploadLabels.uploadCount,
        totalCount: uploadLabels.totalCount,
        syncStatus: uploadLabels.syncStatus
    };
}

async function postDataTPH(dataModel) {

    let fetchStatus = false;

    let modelData = {
        QRCODE_TPH: dataModel.QRCODE_TPH,
        WERKS: dataModel.WERKS,
        AFD_CODE: dataModel.AFD_CODE,
        BLOCK_CODE: dataModel.BLOCK_CODE,
        NO_TPH: dataModel.NO_TPH,
        LAT: dataModel.LAT_TPH,
        LONG: dataModel.LON_TPH,
        STATUS_SYNC: 'Y',
        SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
        INSERT_USER: dataModel.INSERT_USER,
        INSERT_TIME: parseInt(convertTimestampToDate(dataModel.INSERT_TIME, 'YYYYMMDDkkmmss'))
    }

    await syncFetchPost("TPH-INSERT", modelData, null)
        .then(((response) => {
            if (response !== null) {
                console.log('Response : ', response)
                let getData = TaskServices.getAllData('TR_REGISTER_TPH');
                getData.map((item, index) => {
                    if (item.STATUS_SYNC == "N") {
                        TaskServices.updateTPH(index)
                    }
                })
                fetchStatus = true
            }
        }));
    return fetchStatus;
}


