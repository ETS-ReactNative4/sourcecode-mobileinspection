import RNFS from 'react-native-fs';
import TaskServices from "../../../../Database/TaskServices";
import { convertTimestampToDate, getTodayDate } from "../../../../Lib/Utils";
import { fetchPostForm } from "../../../../Api/FetchingApi";

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
            getImages.map(async (imageModel) => {
                let imagePath = 'file://' + imageModel.IMAGE_PATH_LOCAL;
                await RNFS.exists(imagePath)
                    .then(async (isExist) => {
                        if (!isExist) {
                            await RNFS.copyFileAssets('img_not_found.png', imagePath);
                        }

                        await postImage(imageModel)
                            .then((response) => {
                                if (response) {
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

async function postImage(paramImageModel) {
    let fetchStatus = false;

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
        .then((response) => {
            if (response !== undefined) {
                if (response.status) {
                    fetchStatus = true;
                }
                //temporary di hardcode (HARDCODE - 10 sept 2019)
                else if (response.status === false && response.message === "Image Code sudah ada di database, gunakan Image Code yang lain."){
                    fetchStatus = true;
                }
                else {
                    fetchStatus = false;
                    console.log("upload postImage failed");
                    console.log("upload postImage response", response);
                }
            }
            else {
                fetchStatus = false;
                console.log("upload postImage Server Timeout")
            }
        });
    return fetchStatus
}
