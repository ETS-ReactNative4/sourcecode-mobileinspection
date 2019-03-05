import { Platform } from 'react-native';
const RNFS = require('react-native-fs');

export const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}`,
  android: `${RNFS.ExternalDirectoryPath}`
});

// export const dirPicutures = `${dirHome}/Pictures`;
// export const dirAudio = `${dirHome}/Audio`;
export const dirPhotoTemuan = `${dirHome}/Photo/Temuan`;
export const dirPhotoKategori = `${dirHome}/Photo/Temuan/Kategori`;
export const dirPhotoInspeksiBaris = `${dirHome}/Photo/Inspeksi/Baris`;
export const dirPhotoInspeksiSelfie = `${dirHome}/Photo/Inspeksi/Selfie`;
export const dirPhotoEbccJanjang = `${dirHome}/Photo/Ebcc/Janjang`;
export const dirPhotoEbccSelfie = `${dirHome}/Photo/Ebcc/Selfie`;