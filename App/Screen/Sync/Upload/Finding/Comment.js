import TaskServices from "../../../../Database/TaskServices";
import { fetchPost } from "../../../../Api/FetchingApi";
import { syncFetchPost } from "../../../../Api";

//Upload-Finding-Comment
export async function uploadFindingComment() {
    let getFindingComment = TaskServices.getAllData('TR_FINDING_COMMENT').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getFindingComment.length,
        syncStatus: true
    };

    if (getFindingComment.length > 0) {
        await Promise.all(
            getFindingComment.map(async (data, index) => {
                let taggedUser = [];
                data.TAGS.map((data) => {
                    taggedUser.push({
                        "USER_AUTH_CODE": data.USER_AUTH_CODE
                    })
                });
                let commentModel = {
                    "FINDING_COMMENT_ID": data.FINDING_COMMENT_ID,
                    "FINDING_CODE": data.FINDING_CODE,
                    "USER_AUTH_CODE": data.USER_AUTH_CODE,
                    "MESSAGE": data.MESSAGE,
                    "INSERT_TIME": data.INSERT_TIME,
                    "TAG_USER": taggedUser
                };

                await postFindingComment(commentModel)
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

async function postFindingComment(model) {
    let fetchStatus = false;

    await syncFetchPost("FINDING-COMMENT-INSERT", model, null)
        .then(((response) => {
            if (response !== null) {
                TaskServices.updateByPrimaryKey('TR_FINDING_COMMENT', {
                    "FINDING_COMMENT_ID": model.FINDING_COMMENT_ID,
                    "STATUS_SYNC": "Y"
                });
                fetchStatus = true
            }
        }));
    return fetchStatus;
}
