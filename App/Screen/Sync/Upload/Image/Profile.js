
//Upload - Image - Profile
import TaskServices from "../../../../Database/TaskServices";
import RNFS from "react-native-fs";
import {fetchPostForm} from "../../../../Api/FetchingApi";

export async function uploadImageProfile(){
    let getImageProfile = TaskServices.getAllData('TR_IMAGE_PROFILE').filtered(`STATUS_SYNC = 'N'`);

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getImageProfile.length,
        syncStatus: true
    };

    if (getImageProfile.length > 0) {
        await Promise.all(
            getImageProfile.map(async (imageModel)=>{
                await RNFS.exists(`file://${imageModel.IMAGE_PATH_LOCAL}`).
                then(async(exists) => {
                    if (exists) {
                        await postImageUser(imageModel)
                            .then((response)=>{
                                if(response){
                                    uploadLabels = {
                                        ...uploadLabels,
                                        uploadCount: uploadLabels.uploadCount + 1
                                    };
                                    TaskServices.updateByPrimaryKey('TR_IMAGE_PROFILE', {
                                        "USER_AUTH_CODE": imageModel.USER_AUTH_CODE,
                                        "STATUS_SYNC": "Y"
                                    });
                                }
                                else {
                                    uploadLabels = {
                                        ...uploadLabels,
                                        syncStatus: false
                                    }
                                }
                            })
                    } else {
                        TaskServices.deleteRecordByPK('TR_IMAGE', 'USER_AUTH_CODE', imageModel.USER_AUTH_CODE)
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

async function postImageUser(paramImageModel){
    let fetchStatus = true;

    let imageModel = new FormData();
    imageModel.append('FILENAME', {
        uri: `file://${paramImageModel.IMAGE_PATH_LOCAL}`,
        type: 'image/jpeg',
        name: paramImageModel.IMAGE_NAME,
    });

    await fetchPostForm("IMAGES-PROFILE", imageModel, null)
        .then((response)=>{
            if (response !== undefined) {
                if (response.status) {
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("upload postImageUser failed")
                }
            }
            else {
                fetchStatus = false;
                console.log("upload postImageUser Server Timeout")
            }
        });
    return fetchStatus
}
