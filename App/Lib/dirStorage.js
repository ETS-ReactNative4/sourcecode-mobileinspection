import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';


export const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}`,
  android: `${RNFS.ExternalDirectoryPath}`
});

// export const dirPicutures = `${dirHome}/Pictures`;
// export const dirAudio = `${dirHome}/Audio`;

export const dirLocal = `${dirHome}/Local`;
export const dirSummary = `${dirHome}/Summary`;

export const dirDatabase = `${dirHome}/Local/Database`;
export const dirPhotoTemuan = `${dirHome}/Local/Photo/Temuan`;
export const dirPhotoKategori = `${dirHome}/Local/Photo/Temuan/Kategori`;
export const dirPhotoInspeksiBaris = `${dirHome}/Local/Photo/Inspeksi/Baris`;
export const dirPhotoInspeksiSelfie = `${dirHome}/Local/Photo/Inspeksi/Selfie`;
export const dirPhotoEbccJanjang = `${dirHome}/Local/Photo/Ebcc/Janjang`;
export const dirPhotoEbccSelfie = `${dirHome}/Local/Photo/Ebcc/Selfie`;
export const dirPhotoUser = `${dirHome}/Local/Photo/User`;
export const dirMaps = `${dirHome}/Local/Maps`;

const dirs = RNFetchBlob.fs.dirs;
export const dirsRoot = `${dirs.SDCardDir}`;
export const dirsHome = `${dirsRoot}/Android/data/com.bluezoneinspection.app/files`;
export const dirsPhotouser = `${dirsHome}/Local/Photo/User`;
