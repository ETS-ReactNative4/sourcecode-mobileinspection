import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');
import { dirPhotoKategori, dirPhotoTemuan } from '../../../Lib/dirStorage';

export async function downloadImageCategory(data) {
    let isExist = await RNFS.exists(`${dirPhotoKategori}/${data.ICON}`)
    if (!isExist) {
        var url = data.ICON_URL;
        const { config } = RNFetchBlob
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirPhotoKategori}/${data.ICON}`,
                description: 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            // console.log(res)
            console.log('Response Image Category Success Insert')
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
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirPhotoTemuan}/${data.IMAGE_NAME}`,
                description: 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            // console.log('Reponse : ', res)
            console.log('Response Image Finding Success Insert')
        }).catch((error) => {
            console.log(error);
        });
    }
}
