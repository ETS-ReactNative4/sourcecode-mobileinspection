import TaskServices from "../../../../Database/TaskServices";
import { fetchPost } from "../../../../Api/FetchingApi";
import {getTodayDate} from "../../../../Lib/Utils";

//Upload-Finding
export async function uploadFinding() {
    let getFinding = TaskServices.getAllData('TR_FINDING').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getFinding.length,
        syncStatus: true
    };

    if (getFinding.length > 0) {
        await Promise.all(
            getFinding.map(async (findingModel) => {
                await postFinding(findingModel)
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

async function postFinding(paramFindingModel){
    let fetchStatus = true;

    let findingModel = {
        FINDING_CODE: paramFindingModel.FINDING_CODE,
        WERKS: paramFindingModel.WERKS,
        AFD_CODE: paramFindingModel.AFD_CODE,
        BLOCK_CODE: paramFindingModel.BLOCK_CODE,
        FINDING_CATEGORY: paramFindingModel.FINDING_CATEGORY,
        FINDING_DESC: paramFindingModel.FINDING_DESC,
        FINDING_PRIORITY: paramFindingModel.FINDING_PRIORITY,
        DUE_DATE: dueDateFinding(paramFindingModel.DUE_DATE),
        ASSIGN_TO: paramFindingModel.ASSIGN_TO,
        PROGRESS: paramFindingModel.PROGRESS.toString(),
        LAT_FINDING: paramFindingModel.LAT_FINDING,
        LONG_FINDING: paramFindingModel.LONG_FINDING,
        REFFERENCE_INS_CODE: paramFindingModel.REFFERENCE_INS_CODE,
        STATUS_SYNC: 'Y',
        INSERT_USER: paramFindingModel.INSERT_USER,
        INSERT_TIME: paramFindingModel.INSERT_TIME === '' ? parseInt(getTodayDate('YYYYMMDDkkmmss')) : parseInt(paramFindingModel.INSERT_TIME.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')),
        UPDATE_USER: paramFindingModel.UPDATE_USER,
        UPDATE_TIME: paramFindingModel.UPDATE_TIME === '' ? parseInt(getTodayDate('YYYYMMDDkkmmss')) : parseInt(paramFindingModel.UPDATE_TIME.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')),
        RATING_VALUE: paramFindingModel.RATING_VALUE,
        RATING_MESSAGE: paramFindingModel.RATING_MESSAGE,
        END_TIME: paramFindingModel.END_TIME !== "" ? parseInt(paramFindingModel.END_TIME) : "",
    };

    await fetchPost("FINDING-INSERT", findingModel, null)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    console.log("RESPONSE",response);
                    //check if image finding is sync
                    let getImage = TaskServices.findBy("TR_IMAGE", "TR_CODE", findingModel.FINDING_CODE).filtered('STATUS_SYNC = "N"');
                    if(getImage === undefined){
                        TaskServices.updateByPrimaryKey('TR_FINDING', {
                            "FINDING_CODE": paramFindingModel.FINDING_CODE,
                            "STATUS_SYNC": "Y"
                        });
                    }
                    else {
                        console.log("postFinding Image not yet sync!", getImage)
                    }
                }
                else {
                    fetchStatus = false;
                    console.log("upload postFinding failed");
                }
            }
            else {
                fetchStatus = false;
                console.log("upload postFinding Server Timeout")
            }
        }));
    return fetchStatus;
}

function dueDateFinding(paramDueDate){
    let dueDate = paramDueDate;
    if (dueDate.includes(' ')) {
        dueDate = dueDate.substring(0, dueDate.indexOf(' '))
    }
    if (dueDate.length > 0) {
        dueDate += " 00:00:00"
    }

    return dueDate
}
