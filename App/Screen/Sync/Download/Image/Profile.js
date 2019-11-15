//Download - Image - Profile
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";

import {fetchPost} from "../../../../Api/FetchingApi";
import {dirPhotoUser} from "../../../../Lib/dirStorage";
import TaskServices from "../../../../Database/TaskServices";
import moment from "moment";

export async function downloadProfileImage(userAuthCode){
    let getImageProfile = TaskServices.findBy2('TR_IMAGE_PROFILE', 'USER_AUTH_CODE', userAuthCode);
    let imageUrl = await getProfileImageUrl(userAuthCode);
    let profileImageDownloadStatus = false;
    if (imageUrl.status){
        if(getImageProfile !== undefined){
            //update
            if(moment(imageUrl.imageInsertTime).isAfter(getImageProfile.INSERT_TIME)){
                await RNFS.unlink(`${dirPhotoUser}/${imageUrl.imageName}`)
                profileImageDownloadStatus = await getProfileImagePhysical(imageUrl);
            }
        }
        else {
            //create new
            profileImageDownloadStatus = await getProfileImagePhysical(imageUrl);
        }
    }
    return profileImageDownloadStatus;
}

async function getProfileImageUrl(userAuthCode){
    let getProfileImageHeader = {
        "Content-Type": "application/json",
        "accept-version": "1.0.0"
    };
    let getProfileImageModel = {
        "USER_AUTH_CODE": userAuthCode
    };
    let imageUrl = {
        status: false,
        USER_AUTH_CODE: null,
        imageURL: null,
        imageName: null,
        imageInsertTime: null
    };
    await fetchPost("IMAGES-PROFILE-GET-BY-ID", getProfileImageModel, getProfileImageHeader)
        .then((response)=>{
            if (response !== undefined) {
                if(response.status !== false){
                    imageUrl = {
                        status: true,
                        USER_AUTH_CODE: userAuthCode,
                        imageURL: response.data.URL,
                        imageName: response.data.IMAGE_NAME,
                        imageInsertTime: response.data.INSERT_TIME
                    }
                }
            }
        });
    return imageUrl;
}

async function getProfileImagePhysical(profileImageUrl){
    let statusDownload = false;
    let imageExist = await RNFS.exists(`${dirPhotoUser}/${profileImageUrl.imageName}`);
    if (!imageExist) {
        let options = {
            fileCache: false,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirPhotoUser}/${profileImageUrl.imageName}`,
                description: 'Profile image'
            }
        };

        await RNFetchBlob.config(options).fetch('GET', profileImageUrl.imageURL)
            .then((res)=>{
                statusDownload = true;
                let imageProfileModel = {
                    USER_AUTH_CODE: profileImageUrl.USER_AUTH_CODE,
                    IMAGE_NAME: profileImageUrl.imageName,
                    IMAGE_PATH_LOCAL: dirPhotoUser + '/' + profileImageUrl.imageName,
                    IMAGE_URL: profileImageUrl.imageURL,
                    STATUS_IMAGE: 'SELFIE_V',
                    STATUS_SYNC: 'Y',
                    INSERT_TIME: moment().format("YYYY-MM-DD HH:mm:ss")
                };
                TaskServices.saveData("TR_IMAGE_PROFILE", imageProfileModel);
                RNFetchBlob.android.actionViewIntent(res.path(), '/')
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return statusDownload
}
