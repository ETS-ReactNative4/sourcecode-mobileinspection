import TaskServices from "../../../../Database/TaskServices";
import { fetchPost } from "../../../../Api/FetchingApi";
import {convertTimestampToDate, getTodayDate} from "../../../../Lib/Utils";

//Upload-Ebcc-Header
export async function uploadEbccHeader() {
    let getEbccHeader = TaskServices.getAllData('TR_H_EBCC_VALIDATION').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getEbccHeader.length,
        syncStatus: true
    };

    if (getEbccHeader.length > 0) {
        await Promise.all(
            getEbccHeader.map(async (ebccModel) => {
                await postEbccHeader(ebccModel)
                    .then((response)=>{
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

async function postEbccHeader(paramEbccModel){
    let fetchStatus = true;

    let ebccModel = {
        EBCC_VALIDATION_CODE: paramEbccModel.EBCC_VALIDATION_CODE,
        WERKS: paramEbccModel.WERKS,
        AFD_CODE: paramEbccModel.AFD_CODE,
        BLOCK_CODE: paramEbccModel.BLOCK_CODE,
        NO_TPH: paramEbccModel.NO_TPH,
        STATUS_TPH_SCAN: paramEbccModel.STATUS_TPH_SCAN,
        ALASAN_MANUAL: paramEbccModel.ALASAN_MANUAL,
        LAT_TPH: paramEbccModel.LAT_TPH,
        LON_TPH: paramEbccModel.LON_TPH,
        DELIVERY_CODE: paramEbccModel.DELIVERY_CODE,
        STATUS_DELIVERY_CODE: paramEbccModel.STATUS_DELIVERY_CODE,
        STATUS_SYNC: 'SYNC',
        SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
        INSERT_USER: paramEbccModel.INSERT_USER,
        INSERT_TIME: parseInt(convertTimestampToDate(paramEbccModel.INSERT_TIME, 'YYYYMMDDkkmmss')),
        UPDATE_USER: '',
        UPDATE_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss'))
    }

    await fetchPost("EBCC-VALIDATION-HEADER-INSERT", ebccModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TR_H_EBCC_VALIDATION', {
                        "EBCC_VALIDATION_CODE": ebccModel.EBCC_VALIDATION_CODE,
                        "STATUS_SYNC": "Y"
                    });
                }
                else {
                    fetchStatus = false;
                    console.log("upload postEbccHeader failed");
                }
            }
            else {
                fetchStatus = false;
                console.log("upload postEbccHeader Server Timeout")
            }
        }));
    return fetchStatus;
}

//Upload-Ebcc-Detail
export async function uploadEbccDetail() {
    let getEbccDetail = TaskServices.getAllData('TR_D_EBCC_VALIDATION').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getEbccDetail.length,
        syncStatus: true
    };

    if (getEbccDetail.length > 0) {
        await Promise.all(
            getEbccDetail.map(async (ebccModel) => {
                await postEbccDetail(ebccModel)
                    .then((response)=>{
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

async function postEbccDetail(paramEbccModel){
    let fetchStatus = true;

    let ebccModel = {
        EBCC_VALIDATION_CODE: paramEbccModel.EBCC_VALIDATION_CODE,
        ID_KUALITAS: paramEbccModel.ID_KUALITAS,
        JUMLAH: paramEbccModel.JUMLAH,
        STATUS_SYNC: 'SYNC',
        SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
        INSERT_TIME: parseInt(convertTimestampToDate(paramEbccModel.INSERT_TIME, 'YYYYMMDDkkmmss')),
        INSERT_USER: paramEbccModel.INSERT_USER,
        UPDATE_USER: '',
        UPDATE_TIME: 0
    }

    await fetchPost("EBCC-VALIDATION-DETAIL-INSERT", ebccModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TR_D_EBCC_VALIDATION', {
                        "EBCC_VALIDATION_CODE_D": paramEbccModel.EBCC_VALIDATION_CODE_D,
                        "STATUS_SYNC": "Y"
                    });
                    TaskServices.updateByPrimaryKey('TR_H_EBCC_VALIDATION', {
                        "EBCC_VALIDATION_CODE": ebccModel.EBCC_VALIDATION_CODE,
                        "syncDetail": "Y"
                    });
                }
                else {
                    fetchStatus = false;
                    console.log("upload postEbccDetail failed");
                    console.log("upload postEbccDetail request", ebccModel);
                    console.log("upload postEbccDetail response", response);
                }
            }
            else {
                fetchStatus = false;
                console.log("upload postEbccDetail Server Timeout");
            }
        }));
    return fetchStatus;
}

export async function EBCCImageSyncStatus():boolean {
    let isAllSync = true;
    let getEbccValidation = TaskServices.findBy("TR_H_EBCC_VALIDATION", "syncImage", "N");

    await Promise.all(
        getEbccValidation.map(async (ebccValidation)=>{
            console.log("EBCCVAL",ebccValidation);
            let isSync = true;
            let getImage = TaskServices.findBy("TR_IMAGE", "TR_CODE", ebccValidation.EBCC_VALIDATION_CODE).filtered('STATUS_SYNC = "N"');
            if(getImage.length > 0){
                isAllSync = false;
                isSync = false;
            }

            if (isSync){
                await TaskServices.updateByPrimaryKey('TR_H_EBCC_VALIDATION',{
                    "EBCC_VALIDATION_CODE": ebccValidation.EBCC_VALIDATION_CODE,
                    "syncImage": "Y"
                });
            }
        })
    );

    return isAllSync
}
