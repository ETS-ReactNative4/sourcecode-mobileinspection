import TaskServices from "../../../Database/TaskServices";
import { fetchPost } from "../../../Api/FetchingApi";

//Global Var
const user = TaskServices.getAllData('TR_LOGIN')[0];

//Upload-Finding-Comment
export async function uploadFindingComment() {
    let filteredComment = TaskServices.getAllData('TR_FINDING_COMMENT').filtered('STATUS_SYNC = "N"');

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: filteredComment.length,
        syncStatus: true
    };

    if (filteredComment.length > 0) {
        await Promise.all(
            filteredComment.map(async (data, index) => {
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
                    "TAGS": taggedUser
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

    console.log('Param Finding Comment : ', model)

    let fetchStatus = true;

    await fetchPost("FINDING-COMMENT-INSERT", model, null)
        .then(((response) => {
            if (response !== undefined) {
                console.log('Response Finding Comment : ', response)
                if (response.status) {
                    TaskServices.updateByPrimaryKey('TR_FINDING_COMMENT', {
                        "FINDING_COMMENT_ID": model.FINDING_COMMENT_ID,
                        "STATUS_SYNC": "Y"
                    });
                }
                else {
                    fetchStatus = false;
                    console.log("postFindingComment upload failed");
                }
            }
            else {
                fetchStatus = false;
                console.log("finding comment Server Timeout")
            }
        }));
    return fetchStatus;
}
