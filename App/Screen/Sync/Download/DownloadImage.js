import RNFetchBlob from 'rn-fetch-blob';
var RNFS = require('react-native-fs');
import { dirPhotoKategori, dirPhotoTemuan } from '../../../Lib/dirStorage';
import TaskServices from '../../../Database/TaskServices';
import ServerName from '../../../Constant/ServerName'

export async function downloadImageCategory(data) {
    let isExist = await RNFS.exists(`${dirPhotoKategori}/${data.ICON}`)
    if (!isExist) {
        var url = data.ICON_URL;
        const { config } = RNFetchBlob
        let options = {
            fileCache: false,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirPhotoKategori}/${data.ICON}`,
                description: 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            RNFetchBlob.android.actionViewIntent(res.path(), '/')
            // console.log(res)h
            // console.log('Response Image Category Success Insert')
        }).catch((error) => {
            console.log(error);
        });
    }
}

export async function downloadImageFinding(data) {
    let isExist = await RNFS.exists(`${dirPhotoTemuan}/${data.IMAGE_NAME}`)
    if (!isExist) {
        var url = data.IMAGE_URL;
        const { config } = RNFetchBlob
        let options = {
            fileCache: false,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirPhotoTemuan}/${data.IMAGE_NAME}`,
                description: 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            RNFetchBlob.android.actionViewIntent(res.path(), '/')
            // console.log('Reponse : ', res)
            console.log('Response Image Finding Success Insert')
        }).catch((error) => {
            console.log(error);
        });
    }
}

export async function getImageBaseOnFindingCode(findingCode) {
    const user = TaskServices.getAllData('TR_LOGIN')[0];
    let serv = TaskServices.getAllData("TM_SERVICE")
        .filtered('API_NAME="IMAGES-GET-BY-ID" AND MOBILE_VERSION="' + ServerName.verAPK + '"')[0];
    fetch(serv.API_URL + "" + findingCode, {
        method: serv.METHOD,
        headers: {
            'Cache-Control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.ACCESS_TOKEN}`,
        }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status) {
                if (responseJson.data.length > 0) {
                    for (var i = 0; i < responseJson.data.length; i++) {
                        let dataImage = responseJson.data[i];
                        TaskServices.saveData('TR_IMAGE', dataImage);
                        downloadImageFinding(dataImage)
                    }
                } else {
                    console.log(`Image ${findingCode} kosong`);
                }
            } else {
                console.log(`Image ${findingCode} kosong`);
            }


        }).catch((error) => {
            console.error(error);
        });
}
