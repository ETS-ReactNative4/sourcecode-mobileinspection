import RNFS from 'react-native-fs';
import TaskServices from "../../../../Database/TaskServices";
import {convertTimestampToDate, getTodayDate} from "../../../../Lib/Utils";
import {fetchPostForm} from "../../../../Api/FetchingApi";

//Upload - Image
export async function uploadImage() {
    let getImages = TaskServices.getAllData('TR_IMAGE').filtered(`STATUS_SYNC = 'N'`);

    //Upload labels
    let uploadLabels = {
        uploadCount: 0,
        totalCount: getImages.length,
        syncStatus: true
    };

    if (getImages.length > 0) {
        await Promise.all(
            getImages.map(async (imageModel)=>{
                let imagePath = 'file://'+imageModel.IMAGE_PATH_LOCAL;
                await RNFS.exists(imagePath)
                    .then(async (isExist)=>{
                        if(isExist){
                            await postImage(imageModel)
                                .then((response)=>{
                                    if(response){
                                        uploadLabels = {
                                            ...uploadLabels,
                                            uploadCount: uploadLabels.uploadCount + 1
                                        };
                                        TaskServices.updateByPrimaryKey('TR_IMAGE', {
                                            "IMAGE_CODE": imageModel.IMAGE_CODE,
                                            "STATUS_SYNC": "Y"
                                        });
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
            })
        );
    }
    return {
        uploadCount: uploadLabels.uploadCount,
        totalCount: uploadLabels.totalCount,
        syncStatus: uploadLabels.syncStatus
    };
}

async function postImage(paramImageModel){
    let fetchStatus = true;

    let imageModel = new FormData();
    imageModel.append('IMAGE_CODE', paramImageModel.IMAGE_CODE);
    imageModel.append('IMAGE_PATH_LOCAL', paramImageModel.IMAGE_PATH_LOCAL);
    imageModel.append('TR_CODE', paramImageModel.TR_CODE);
    imageModel.append('STATUS_IMAGE', paramImageModel.STATUS_IMAGE);
    imageModel.append('STATUS_SYNC', paramImageModel.STATUS_SYNC);
    imageModel.append('SYNC_TIME', getTodayDate('YYYYMMDDkkmmss'));
    imageModel.append('INSERT_TIME', convertTimestampToDate(paramImageModel.INSERT_TIME, 'YYYYMMDDkkmmss'));
    imageModel.append('INSERT_USER', paramImageModel.INSERT_USER);
    imageModel.append('FILENAME', {
        uri: `file://${paramImageModel.IMAGE_PATH_LOCAL}`,
        type: 'image/jpeg',
        name: paramImageModel.IMAGE_NAME,
    });

    await fetchPostForm("IMAGES-UPLOAD", imageModel, null)
        .then((response)=>{
            if (response !== undefined) {
                if (response.status) {
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("postImage upload failed")
                }
            }
            else {
                fetchStatus = false;
                console.log("postImage Server Timeout")
            }
        });
    return fetchStatus
}

//Upload - Image - Profile
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
                    console.log("postImageUser upload failed")
                }
            }
            else {
                fetchStatus = false;
                console.log("postImageUser Server Timeout")
            }
        });
    return fetchStatus
}
