import TaskServices from "../../../Database/TaskServices";
import {fetchPost} from "../../../Api/FetchingApi";
import {convertTimestampToDate, getTodayDate} from "../../../Lib/Utils";

//Global Var
const user = TaskServices.getAllData('TR_LOGIN')[0];

//Header
export async function uploadInspectionHeader(){
    let getInspectionHeader = TaskServices.getAllData('TR_BLOCK_INSPECTION_H').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getInspectionHeader.length,
        syncStatus: true
    };

    if (getInspectionHeader.length > 0) {
        await Promise.all(
            getInspectionHeader.map(async (inspectionHeaderModel)=>{
                let fulfill = isFulfillBaris(inspectionHeaderModel.ID_INSPECTION);
                if (fulfill) {
                    await postInspectionHeader(inspectionHeaderModel)
                        .then((response)=>{
                            if(response){
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
                        });
                }
            })
        );
    }
    return {
        uploadCount: uploadLabels.uploadCount,
        totalCount: uploadLabels.totalCount,
        syncStatus: uploadLabels.syncStatus
    };
}

async function postInspectionHeader(headerModel){
    let fetchStatus = false;
    let inspectionHeaderModel = {
        BLOCK_INSPECTION_CODE: headerModel.BLOCK_INSPECTION_CODE,
        WERKS: headerModel.WERKS,
        AFD_CODE: headerModel.AFD_CODE,
        BLOCK_CODE: headerModel.BLOCK_CODE,
        AREAL: headerModel.AREAL,
        INSPECTION_TYPE: "PANEN",
        INSPECTION_DATE: parseInt(convertTimestampToDate(headerModel.INSPECTION_DATE, 'YYYYMMDDkkmmss')),
        INSPECTION_SCORE: headerModel.INSPECTION_SCORE !== '' ? parseInt(headerModel.INSPECTION_SCORE) : 0,
        INSPECTION_RESULT: headerModel.INSPECTION_RESULT,
        STATUS_SYNC: 'Y',
        SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
        START_INSPECTION: parseInt(convertTimestampToDate(headerModel.START_INSPECTION, 'YYYYMMDDkkmmss')),
        END_INSPECTION: parseInt(convertTimestampToDate(headerModel.END_INSPECTION, 'YYYYMMDDkkmmss')),
        LAT_START_INSPECTION: headerModel.LAT_START_INSPECTION,
        LONG_START_INSPECTION: headerModel.LONG_START_INSPECTION,
        LAT_END_INSPECTION: headerModel.LAT_END_INSPECTION,
        LONG_END_INSPECTION: headerModel.LONG_END_INSPECTION,
        INSERT_TIME: parseInt(convertTimestampToDate(headerModel.INSERT_TIME, 'YYYYMMDDkkmmss')),
        INSERT_USER: user.USER_AUTH_CODE
    };

    await fetchPost("INSPECTION-HEADER-INSERT", inspectionHeaderModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TR_BLOCK_INSPECTION_H', {
                        "BLOCK_INSPECTION_CODE": inspectionHeaderModel.BLOCK_INSPECTION_CODE,
                        "STATUS_SYNC": "Y"
                    });
                    TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION',{
                        "ID_INSPECTION": headerModel.ID_INSPECTION,
                        "syncHeader": "Y"
                    });
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("postInspectionHeader upload failed", inspectionHeaderModel);
                }
            }
            else {
                fetchStatus = false;
                console.log("postInspectionHeader Server Timeout")
            }
        }));
    return fetchStatus;
}

//DETAIL
export async function uploadInspectionDetail(){
    let getInspectionDetail = TaskServices.getAllData('TR_BLOCK_INSPECTION_D').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getInspectionDetail.length,
        syncStatus: true
    };

    if (getInspectionDetail.length > 0) {
        await Promise.all(
            getInspectionDetail.map(async (inspectionHeaderModel)=>{
                let fulfill = isFulfillBaris(inspectionHeaderModel.ID_INSPECTION);
                if (fulfill) {
                    await postInspectionDetail(inspectionHeaderModel)
                        .then((response)=>{
                            if(response){
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
                        });
                }
            })
        );
    }
    return {
        uploadCount: uploadLabels.uploadCount,
        totalCount: uploadLabels.totalCount,
        syncStatus: uploadLabels.syncStatus
    };
}

async function postInspectionDetail(detailModel){
    let fetchStatus = false;
    let inspectionDetailModel = {
        BLOCK_INSPECTION_CODE_D: detailModel.BLOCK_INSPECTION_CODE_D,
        BLOCK_INSPECTION_CODE: detailModel.BLOCK_INSPECTION_CODE,
        ID_INSPECTION: detailModel.ID_INSPECTION,
        CONTENT_INSPECTION_CODE: detailModel.CONTENT_INSPECTION_CODE,
        VALUE: detailModel.VALUE,
        STATUS_SYNC: 'Y',
        SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
        INSERT_USER: user.USER_AUTH_CODE,
        INSERT_TIME: parseInt(convertTimestampToDate(detailModel.INSERT_TIME, 'YYYYMMDDkkmmss'))
    };

    await fetchPost("INSPECTION-DETAIL-INSERT", inspectionDetailModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TR_BLOCK_INSPECTION_D', {
                        "BLOCK_INSPECTION_CODE_D": inspectionDetailModel.BLOCK_INSPECTION_CODE_D,
                        "STATUS_SYNC": "Y"
                    });
                    TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION',{
                        "ID_INSPECTION": inspectionDetailModel.ID_INSPECTION,
                        "syncDetail": "Y"
                    });
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("postInspectionHeader upload failed");
                }
            }
            else {
                fetchStatus = false;
                console.log("postInspectionHeader Server Timeout")
            }
        }));
    return fetchStatus;
}


//TRACKING
export async function uploadInspectionTrack(){
    let getInspectionTracking = TaskServices.getAllData('TM_INSPECTION_TRACK').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getInspectionTracking.length,
        syncStatus: true
    };

    if (getInspectionTracking.length > 0) {
        await Promise.all(
            getInspectionTracking.map(async (inspectionTrackingModel)=>{
                await postInspectionTrack(inspectionTrackingModel)
                    .then((response)=>{
                        if(response){
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
                    });
            })
        );
    }
    return {
        uploadCount: uploadLabels.uploadCount,
        totalCount: uploadLabels.totalCount,
        syncStatus: uploadLabels.syncStatus
    };
}

async function postInspectionTrack(trackingModel){
    let fetchStatus = false;
    let inspectionTrackingModel = {
        TRACK_INSPECTION_CODE: trackingModel.TRACK_INSPECTION_CODE,
        BLOCK_INSPECTION_CODE: trackingModel.BLOCK_INSPECTION_CODE,
        DATE_TRACK: parseInt(trackingModel.DATE_TRACK.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')),
        LAT_TRACK: trackingModel.LAT_TRACK,
        LONG_TRACK: trackingModel.LONG_TRACK,
        INSERT_USER: trackingModel.INSERT_USER,
        STATUS_SYNC: 'Y',
        STATUS_TRACK: 1,
        INSERT_TIME: parseInt(trackingModel.INSERT_TIME.replace(/-/g, '').replace(/ /g, '').replace(/:/g, ''))
    };

    await fetchPost("INSPECTION-TRACKING-INSERT", inspectionTrackingModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TM_INSPECTION_TRACK', {
                        "TRACK_INSPECTION_CODE": inspectionTrackingModel.TRACK_INSPECTION_CODE,
                        "STATUS_SYNC": "Y"
                    });
                    TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION',{
                        "ID_INSPECTION": trackingModel.ID_INSPECTION,
                        "syncTracking": "Y"
                    });
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("postInspectionTrack upload failed");
                }
            }
            else {
                fetchStatus = false;
                console.log("postInspectionTrack Server Timeout")
            }
        }));
    return fetchStatus;
}

//Func
function isFulfillBaris(idInspection) {
    let getBarisInspection = TaskServices.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection);
    if (getBarisInspection !== undefined) {
        return getBarisInspection.FULFILL_BARIS === "Y";
    }
    return false
}

//Inspection Image Checker
//cek semua TR_IMAGE berdasarkan BLOCK_INSPECTION_CODE (TR_BARIS_INSPECTION) sudah terkirim atau belum
export async function inspectionImageSyncStatus(){
    let isSync = true;
    let trBarisInspection = TaskServices.findBy("TR_BARIS_INSPECTION", "syncImage", "N");

    await Promise.all(
        trBarisInspection.map(async (barisInspection)=>{
            let getInspectionHeader = TaskServices.findBy("TR_BLOCK_INSPECTION_H", "ID_INSPECTION", barisInspection.ID_INSPECTION);
            let getImage = TaskServices.findBy("TR_IMAGE", "TR_CODE", getInspectionHeader.BLOCK_INSPECTION_CODE).filtered('STATUS_SYNC = "N"');

            if(getImage.length <= 0){
                TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION',{
                    "ID_INSPECTION": barisInspection.ID_INSPECTION,
                    "syncImage": "Y"
                });
            }
            else {
                isSync = false
            }
        })
    );

    return isSync
}

export async function updateInspectionStatus(){
    let trBarisInspection = TaskServices.findBy("TR_BARIS_INSPECTION", "STATUS_SYNC", "N");
    let isSync = true;

    console.log("TOTAL BARIS INSPECTIONNNNNNNNN",trBarisInspection);
    await Promise.all(
        trBarisInspection.map((barisInspection)=>{
            if(barisInspection.syncHeader === "Y" && barisInspection.syncDetail === "Y" && barisInspection.syncTracking === "Y" && barisInspection.syncImage === "Y"){
                TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION',{
                    "ID_INSPECTION": barisInspection.ID_INSPECTION,
                    "STATUS_SYNC": "Y"
                });
            }
            else {
                isSync = false;
                console.log("Inspection Image belum terkirim!", barisInspection)
            }
        })
    );

    return isSync
}
