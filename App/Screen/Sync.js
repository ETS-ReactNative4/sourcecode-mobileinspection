import React from 'react';
import { Linking, NetInfo, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content } from 'native-base'
import Colors from '../Constant/Colors';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

import { ProgressDialog } from 'react-native-simple-dialogs';
import { dirPhotoKategori, dirPhotoTemuan } from '../Lib/dirStorage';
import TaskServices from '../Database/TaskServices'
import ServerName from '../Constant/ServerName'
import ModalAlert from '../Component/ModalAlert';
import ProgressSync from '../Component/ProgressSync';

import RNFS from 'react-native-fs';

//Sync
//finding
import { uploadFindingComment } from './Sync/Upload/Finding/Comment';
import { uploadFinding } from './Sync/Upload/Finding/Finding'
//image
import { uploadImage } from './Sync/Upload/Image/Image';
import { uploadImageProfile } from './Sync/Upload/Image/Profile';
//inspection
import { uploadInspectionHeader, uploadInspectionDetail, uploadInspectionTrack, inspectionImageSyncStatus, updateInspectionStatus, uploadGenba } from './Sync/Upload/Inspection/Inspection'
//EBCC
import { uploadEbccHeader, uploadEbccDetail, EBCCImageSyncStatus } from './Sync/Upload/EBCC/Ebcc';

/* DOWNLOAD */
import { getFinding } from './Sync/Download/DownloadFinding';
import { getBlock } from './Sync/Download/DownloadBlock';
import { getAfd } from './Sync/Download/DownloadAfd';
import { getRegion } from './Sync/Download/DownloadRegion';
import { getEstate } from './Sync/Download/DownloadEstate';
import { getLandUse } from './Sync/Download/DownloadLandUse';
import { getComp } from './Sync/Download/DownloadComp';
import { getContent } from './Sync/Download/DownloadContent';
import { getKriteria } from './Sync/Download/DownloadKriteria';
import { getCategory } from './Sync/Download/DownloadCategory';
import { getContact } from './Sync/Download/DownloadContact';
import { getParamTrack } from './Sync/Download/DownloadParamTrack';
import { getKualitas } from './Sync/Download/DownloadKualitas';
import { getFindingComment } from './Sync/Download/DownloadFindingComment';
import { getFindingImage } from './Sync/Download/DownloadFindingImage';
import { getTimeServer } from './Sync/Download/DownloadTimeServer';
import { getResetToken } from './Sync/Download/DownloadResetToken';
import { AlertContent, Fonts } from '../Themes';
import { postWeeklySummary } from './Sync/Upload/UploadWeeklySummary';
import { getTitikRestan } from './Sync/Download/Restan/TitikRestan';
import { getFCMToken } from "../Notification/NotificationListener";
import { fetchGet, fetchPost, fetchPut } from "../Api/FetchingApi";
import { getPetaPanenDetail, getPetaPanenHeader } from "./Sync/Download/PetaPanen/PetaPanen";

export default class SyncScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: Colors.tintColorPrimary
        },
        headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
        title: 'Sync',
        headerTintColor: '#fff'
    })

    constructor() {
        super();
        let user = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            user,
            //upload
            uploadErrorFlag: false,
            progressInspeksiHeader: 0,
            progressInspeksiDetail: 0,
            progressUploadImage: 0,
            progressUploadImageUser: 0,
            progressFindingData: 0,
            progressFindingCommentData: 0,
            progressInspectionTrack: 0,
            progressEbcc: 0,
            progressEbccDetail: 0,
            progressGenbaInspection: 0,

            //labelUpload
            valueInspeksiHeaderUpload: '0',
            totalInspeksiHeaderUpload: '0',
            valueInspeksiDetailUpload: '0',
            totalInspeksiDetailUpload: '0',
            valueFindingDataUpload: '0',
            totalFindingDataUpload: '0',
            valueFindingCommentDataUpload: '0',
            totalFindingCommentDataUpload: '0',
            valueImageUpload: '0',
            totalImagelUpload: '0',
            valueImageUserUpload: '0',
            totalImageUserUpload: '0',
            valueInspectionTrack: '0',
            totalInspectionTrack: '0',
            valueEbcc: '0',
            totalEbcc: '0',
            valueEbccDetail: '0',
            totalEbccDetail: '0',
            valueGenbaInspection: '0',
            totalGenbaInspection: '0',

            //download
            progress: 0,
            progressAfd: 0,
            progressRegion: 0,
            progressEst: 0,
            progressLandUse: 0,
            progressComp: 0,
            progressContent: 0,
            progressContentLabel: 0,
            progressKriteria: 0,
            progressCategory: 0,
            progressContact: 0,
            progressFinding: 0,
            progressFindingImage: 0,
            progressFindingCommentDownload: 0,
            progressParamInspection: 0,
            progressKualitas: 0,
            progressTitikRestan: 0,
            progressPetaPanenHeader: 0,
            progressPetaPanenDetail: 0,

            //labelDownload
            downloadApa: 'Download sedang dalam proses',
            valueDownload: '0',
            totalDownload: '0',
            valueAfdDownload: '0',
            totalAfdDownload: '0',
            valueRegionDownload: '0',
            totalRegionDownload: '0',
            valueEstDownload: '0',
            totalEstDownload: '0',
            valueCompDownload: '0',
            totalCompDownload: '0',
            valueLandUseDownload: '0',
            totalLandUseDownload: '0',
            valueContentDownload: '0',
            totalContentDownload: '0',
            valueContentLabelDownload: '0',
            totalContentLabelDownload: '0',
            valueKriteriaDownload: '0',
            totalKriteriaDownload: '0',
            valueFindingDownload: '0',
            totalFindingDownload: '0',
            valueFindingCommentDownload: '0',
            totalFindingCommentDownload: '0',
            valueCategoryDownload: '0',
            totalCategoryDownload: '0',
            valueContactDownload: '0',
            totalContactDownload: '0',
            valueFindingImageDownload: '0',
            totalFindingImageDownload: '0',
            valueParamInspection: '0',
            totalParamInspection: '0',
            valueKualitas: '0',
            totalKualitas: '0',
            valueTitikRestan: 0,
            totalTitikRestan: 0,
            valuePetaPanenHeader: 0,
            totalPetaPanenHeader: 0,
            valuePetaPanenDetail: 0,
            totalPetaPanenDetail: 0,
            valueServiceList: 0,
            totalServiceList: 0,


            indeterminate: false,
            downloadInspeksiParam: false,
            fetchLocation: false,
            isBtnEnable: false,
            syncTime: true,

            dataFinding: [],
            dataInspeksi: [],
            dataInspeksiDetail: [],
            dataTrack: [],

            showButton: true,
            isFirstInstall: false,

            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: '',
            isDeleteImage: false,

            modalUpdate: {
                title: 'Title',
                message: 'Message',
                showModal: false,
                icon: '',
            }
        }
    }

    async downloadReport(){
        /* Peta Restan */
        /* DOWNLOAD TITIK RESTAN */
        await getTitikRestan().then((data) => {
            this.setState({
                progressTitikRestan: 1,
                valueTitikRestan: data.downloadCount,
                totalTitikRestan: data.totalCount
            })
        })

        /* Peta Panen Header */
        /* DOWNLOAD PETA PANEN HEADER */
        await getPetaPanenHeader().then((data) => {
            this.setState({
                progressPetaPanenHeader: 1,
                valuePetaPanenHeader: data.downloadCount,
                totalPetaPanenHeader: data.totalCount
            })
        })

        /* Peta Panen Detail */
        /* DOWNLOAD PETA PANEN DETAIL */
        await getPetaPanenDetail().then((data) => {
            this.setState({
                progressPetaPanenDetail: 1,
                valuePetaPanenDetail: data.downloadCount,
                totalPetaPanenDetail: data.totalCount
            })
        })
    }

    /** CREATE BY AMINJU SPRINT 16 ==> 02-06 SEPT 2019 */
    syncDownload = async () => {

        /* Temuan */
        /* DOWNLOAD FINDING */
        /* INCLUDE NOTIFICATION FINDING */
        await getFinding().then((data) => {
            // console.log('Data Callback Finding : ', data)
            this.setState({
                progressFinding: 1,
                valueFindingDownload: data.downloadCount,
                totalFindingDownload: data.totalCount
            })
        })

        /* Temuan - Foto */
        /* DOWNLOAD FINDING IMAGE */
        await getFindingImage().then((data) => {
            // console.log('Data Callback Finding Image: ', data)
            this.setState({
                progressFindingImage: 1,
                valueFindingImageDownload: data.downloadCount,
                totalFindingImageDownload: data.totalCount
            })
        })

        /* Temuan - Komentar */
        /* DOWNLOAD FINDING COMMENT */
        await getFindingComment().then((data) => {
            // console.log('Data Callback Finding Comment: ', data)
            this.setState({
                progressFindingCommentDownload: 1,
                valueFindingCommentDownload: data.downloadCount,
                totalFindingCommentDownload: data.totalCount
            })
        })

        /* Master Block */
        /* DOWNLOAD BLOCK */
        await getBlock().then((data) => {
            // console.log('Data Callback Block : ', data)
            this.setState({
                progress: 1,
                valueDownload: data.downloadCount,
                totalDownload: data.totalCount
            })
        })

        /* Master Afdeling */
        /* DOWNLOAD AFDELING */
        await getAfd().then((data) => {
            // console.log('Data Callback Afd : ', data)
            this.setState({
                progressAfd: 1,
                valueAfdDownload: data.downloadCount,
                totalAfdDownload: data.totalCount
            })
        })

        /* Master Estate */
        /* DOWNLOAD ESTATE */
        await getEstate().then((data) => {
            // console.log('Data Callback Estate : ', data)
            this.setState({
                progressEst: 1,
                valueEstDownload: data.downloadCount,
                totalEstDownload: data.totalCount
            })
        })

        /* Master PT */
        /* DOWNLOAD COMP */
        await getComp().then((data) => {
            // console.log('Data Callback Comp : ', data)
            this.setState({
                progressComp: 1,
                valueCompDownload: data.downloadCount,
                totalCompDownload: data.totalCount
            })
        })

        /* Master Region */
        /* DOWNLOAD REGION */
        await getRegion().then((data) => {
            // console.log('Data Callback Region : ', data)
            this.setState({
                progressRegion: 1,
                valueRegionDownload: data.downloadCount,
                totalRegionDownload: data.totalCount
            })
        })

        /* Master Status Blok */
        /* DOWNLOAD LANDUSE */
        await getLandUse().then((data) => {
            // console.log('Data Callback LandUse : ', data)
            this.setState({
                progressLandUse: 1,
                valueLandUseDownload: data.downloadCount,
                totalLandUseDownload: data.totalCount
            })
        })

        /* Master Pengguna */
        /* DOWNLOAD CONTACT */
        await getContact().then((data) => {
            // console.log('Data Callback Contact : ', data)
            this.setState({
                progressContact: 1,
                valueContactDownload: data.downloadCount,
                totalContactDownload: data.totalCount
            })
        })

        /* Parameter Penilaian Inspeksi */
        /* DOWNLOAD CONTENT */
        await getContent().then((data) => {
            // console.log('Data Callback Content : ', data)
            this.setState({
                progressContent: 1,
                valueContentDownload: data.downloadCount,
                totalContentDownload: data.totalCount
            })
        })

        /* Parameter Kriteria Inspeksi */
        /* DOWNLOAD KRITERIA */
        await getKriteria().then((data) => {
            // console.log('Data Callback Kriteria : ', data)
            this.setState({
                progressKriteria: 1,
                valueKriteriaDownload: data.downloadCount,
                totalKriteriaDownload: data.totalCount
            })
        })

        /* Parameter Rute Inspeksi */
        /* DOWNLOAD PARAM TRACK INSPECTION */
        await getParamTrack().then((data) => {
            // console.log('Data Callback Param Track  : ', data)
            this.setState({
                progressParamInspection: 1,
                valueParamInspection: data.downloadCount,
                totalParamInspection: data.totalCount
            })
        })

        /* Parameter Kategori Temuan */
        /* DOWNLOAD CATEGORY */
        await getCategory().then((data) => {
            // console.log('Data Callback Category : ', data)
            this.setState({
                progressCategory: 1,
                valueCategoryDownload: data.downloadCount,
                totalCategoryDownload: data.totalCount
            })
        })

        /* Parameter Kualitas Buah*/
        /* DOWNLOAD PARAM KUALITAS */
        await getKualitas().then((data) => {
            // console.log('Data Callback Kualitas : ', data)
            this.setState({
                progressKualitas: 1,
                valueKualitas: data.downloadCount,
                totalKualitas: data.totalCount
            })
        })

        /* DOWNLOAD TIME SERVER */
        await getTimeServer().then((isSync) => {

            if (isSync) {
                getResetToken(isSync).then((data) => {
                    if (data.isResetSync) {
                        if (data.isUpdateToken) {

                            let tempSync = {
                                ...AlertContent.sync_berhasil,
                                pickedWerks: data.pickedWerks
                            }

                            this.setState(tempSync)

                        } else {
                            this.setState(AlertContent.sync_gagal_token);
                        }
                    } else {
                        this.setState(AlertContent.sync_tidak_sinkron)
                    }
                });
            } else {
                this.setState(AlertContent.sync_tidak_sinkron)
            }

        })
    }

    insertLink() {
        let serviceList = TaskServices.getAllData("TM_SERVICE");

        fetch(ServerName[this.state.user.SERVER_NAME_INDEX].service, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.user.ACCESS_TOKEN}`
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status) {
                    TaskServices.deleteAllData('TM_SERVICE');
                    let totalDownload = 0;
                    for (let i in data.data) {
                        let newService = {
                            SERVICE_ID: parseInt(i),
                            MOBILE_VERSION: data.data[i].MOBILE_VERSION,
                            API_NAME: data.data[i].API_NAME,
                            KETERANGAN: data.data[i].KETERANGAN,
                            BODY: data.data[i].BODY ? JSON.stringify(data.data[i].BODY) : '',
                            METHOD: data.data[i].METHOD,
                            API_URL: data.data[i].API_URL
                        };
                        TaskServices.saveData('TM_SERVICE', newService);
                        totalDownload++;
                    }

                    this.setState({
                        progressServiceList: 1,
                        valueServiceList: totalDownload,
                        totalServiceList: serviceList.length
                    })
                }

                // this.downloadWeeklySummary();
                this._onSync()
            });
    }

    /* obsolete data ebcc by akbar */
    deleteEbccHeader() {
        var data = TaskServices.getAllData('TR_H_EBCC_VALIDATION').filtered('SYNC_TIME == "Y"');
        var now = moment(new Date());
        if (data != undefined) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].INSERT_TIME !== '') {
                    let insertTime = data[i].INSERT_TIME;
                    if (insertTime.includes(' ')) {
                        insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                    }
                    var diff = moment(new Date(insertTime)).diff(now, 'day');
                    if (diff < -7) {
                        this.deleteImages(data[i].EBCC_VALIDATION_CODE)
                        TaskServices.deleteRecordByPK('TR_H_EBCC_VALIDATION', 'EBCC_VALIDATION_CODE', data[i].EBCC_VALIDATION_CODE)
                    }
                }
            }
        }
    }

    deleteEbccDetail() {
        var data = TaskServices.getAllData('TR_D_EBCC_VALIDATION');
        var now = moment(new Date());
        if (data != undefined) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].INSERT_TIME !== '') {
                    let insertTime = data[i].INSERT_TIME;
                    if (insertTime.includes(' ')) {
                        insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                    }
                    var diff = moment(new Date(insertTime)).diff(now, 'day');
                    if (diff < -7) {
                        this.deleteImages(data[i].EBCC_VALIDATION_CODE_D)
                        TaskServices.deleteRecordByPK('TR_D_EBCC_VALIDATION', 'EBCC_VALIDATION_CODE_D', data[i].EBCC_VALIDATION_CODE_D)
                    }
                }
            }
        }
    }
    /* obsolete data genba by gani */
    // deleteGenbaSelected() {
    //     var data = TaskServices.getAllData('TR_GENBA_SELECTED');
    //     var now = moment(new Date());
    //     if (data !== undefined) {
    //         for (var i = 0; i < data.length; i++) {
    //             if (data[i].INSERT_TIME !== '') {
    //                 let insertTime = data[i].INSERT_TIME;
    //                 if (insertTime.includes(' ')) {
    //                     insertTime = insertTime.substring(0, insertTime.indexOf(' '))
    //                 }
    //                 var diff = moment(new Date(insertTime)).diff(now, 'day');
    //                 if (diff < -7) {
    //                     this.deleteImages(data[i].USER_AUTH_CODE)
    //                     TaskServices.deleteRecordByPK('TR_GENBA_SELECTED', 'USER_AUTH_CODE', data[i].USER_AUTH_CODE)
    //                 }
    //             }
    //         }
    //     }
    // }
    // deleteGenbaInspection() {
    //     var data = TaskServices.getAllData('TR_GENBA_INSPECTION').filtered('STATUS_SYNC = "Y"');
    //     var now = moment(new Date());
    //     if (data != undefined) {
    //         for (var i = 0; i < data.length; i++) {
    //             if (data[i].INSERT_TIME !== '') {
    //                 let insertTime = data[i].INSERT_TIME;
    //                 if (insertTime.includes(' ')) {
    //                     insertTime = insertTime.substring(0, insertTime.indexOf(' '))
    //                 }
    //                 var diff = moment(new Date(insertTime)).diff(now, 'day');
    //                 if (diff < -7) {
    //                     this.deleteImages(data[i].BLOCK_INSPECTION_CODE)
    //                     TaskServices.deleteRecordByPK('TR_GENBA_INSPECTION', 'BLOCK_INSPECTION_CODE', data[i].BLOCK_INSPECTION_CODE)
    //                 }
    //             }
    //         }
    //     }
    // }

    deleteImages(trCode) {
        // let dataImage = TaskServices.findBy('TR_IMAGE', 'TR_CODE', trCode);
        let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${trCode}"`);

        if (dataImage != undefined) {
            dataImage.map(item => {
                this.deleteImageFile2(item.IMAGE_PATH_LOCAL)
            })
        }
    }

    deleteImageFile2(path) {
        RNFS.exists(path)
            .then((result) => {
                if (result) {
                    RNFS.unlink(`${FILE_PREFIX}${path}`)
                        .then(() => {
                            console.log(`${path} DELETED`);
                            TaskServices.deleteRecordByPK('TR_IMAGE', 'TR_CODE', trCode)
                        });
                } else {
                    TaskServices.deleteRecordByPK('TR_IMAGE', 'TR_CODE', trCode)
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    _deleteTRLog() {
        TaskServices.deleteAllData("TR_LOG");
    }

    _deleteFinding() {
        this._deleteInspeksiHeader();
        var data = TaskServices.query('TR_FINDING', `PROGRESS = '100' AND STATUS_SYNC = 'Y'`);
        var now = moment(new Date());

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let dueDate = data[i].DUE_DATE;
                if (dueDate.includes(' ')) {
                    dueDate = dueDate.substring(0, dueDate.indexOf(' '))
                }
                var diff = moment(new Date(dueDate)).diff(now, 'day');
                if (diff < -7) {
                    this.deleteImage(data[i]);
                }
            }
        }
    }

    _deleteInspeksiHeader() {
        var data = TaskServices.getAllData('TR_BLOCK_INSPECTION_H').filtered('STATUS_SYNC = "Y"');
        var now = moment(new Date());
        if (data != undefined) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].INSERT_TIME !== '') {
                    let insertTime = data[i].INSERT_TIME;
                    if (insertTime.includes(' ')) {
                        insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                    }
                    var diff = moment(new Date(insertTime)).diff(now, 'day');
                    if (diff < -7) {
                        this.deleteImageInspeksi(data[i].BLOCK_INSPECTION_CODE, data[i].ID_INSPECTION,
                            this.deleteImageFileInspeksi, this.deleteRecordByPK);
                    }
                }
            }
        }
    }

    async deleteImageInspeksi(INSPECTION_CODE, ID_INSPECTION, delImgFunc, delFunc) {
        // let dataImage = TaskServices.findBy('TR_IMAGE', 'TR_CODE', INSPECTION_CODE);
        let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${INSPECTION_CODE}"`);
        if (dataImage != undefined) {
            delImgFunc(dataImage, INSPECTION_CODE, ID_INSPECTION, delFunc);
        }
    }

    async deleteImage(FINDING_CODE) {
        let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${FINDING_CODE}"`);
        if (dataImage != undefined) {
            this.deleteImageFile(dataImage, FINDING_CODE);
        }
    }

    async deleteRecordByPK(table, whereClause, value) {
        return TaskServices.deleteRecordByPK(table, whereClause, value);
    }

    async deleteImageFileInspeksi(image, INSPECTION_CODE, ID_INSPECTION, callback) {
        const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
        for (let i = 0; i < image.length; i++) {
            const PATH = `${FILE_PREFIX}${image[i].IMAGE_PATH_LOCAL}`;
            RNFS.exists(PATH)
                .then((result) => {
                    if (result) {
                        return RNFS.unlink(PATH)
                            .then(() => {
                                callback('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', INSPECTION_CODE)
                                callback('TR_BLOCK_INSPECTION_H', 'BLOCK_INSPECTION_CODE', INSPECTION_CODE)
                                callback('TR_BARIS_INSPECTION', 'ID_INSPECTION', ID_INSPECTION)
                            })
                            // `unlink` will throw an error, if the item to unlink does not exist
                            .catch((err) => {
                                console.log(err.message);
                            });
                    }
                    else {
                        callback('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', INSPECTION_CODE)
                        callback('TR_BLOCK_INSPECTION_H', 'BLOCK_INSPECTION_CODE', INSPECTION_CODE)
                        callback('TR_BARIS_INSPECTION', 'ID_INSPECTION', ID_INSPECTION)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }
    async deleteImageFile(IMAGE, FINDING_CODE) {
        const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
        for (let i = 0; i < IMAGE.length; i++) {
            const PATH = `${FILE_PREFIX}${dirPhotoTemuan}/${IMAGE[i].IMAGE_NAME}`;
            RNFS.exists(PATH)
                .then((result) => {
                    if (result) {
                        return RNFS.unlink(PATH)
                            .then(() => {
                                // this.setState({ isDeleteImage: true });
                                TaskServices.deleteRecordPrimaryKey('TR_FINDING', FINDING_CODE)
                            })
                            // `unlink` will throw an error, if the item to unlink does not exist
                            .catch((err) => {
                                console.log(err.message);
                            });
                    }
                    else {
                        TaskServices.deleteRecordPrimaryKey('TR_FINDING', FINDING_CODE)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }

    componentDidMount() {
        let data = TaskServices.getTotalData('TM_BLOCK');
        if (data > 0) {
            this.setState({ isFirstInstall: false });
        } else {
            this.setState({ isFirstInstall: true });
        }
    }

    /* UPLOAD WEEKLY SUMMARY */
    downloadWeeklySummary = async () => {
        await postWeeklySummary('INSPECTION-SUMMARY')
        await postWeeklySummary('FINDING-SUMMARY')
        await postWeeklySummary('EBCC-SUMMARY')
    };

    //upload fcm token to server
    async putFCMConfig() {
        let fcmTokenRequest = null;
        await getFCMToken()
            .then((fcmToken) => {
                if (fcmToken !== null) {
                    fcmTokenRequest = {
                        FIREBASE_TOKEN: fcmToken
                    }
                }
            });

        await fetchPut("FIREBASE-TOKEN", fcmTokenRequest, null);
    };

    //refresh MOBILE INSPECTION token
    async _refreshToken() {
        let refreshStatus = false;
        if (this.state.user !== undefined && this.state.user !== null) {
            await fetchGet("AUTH-GENERATE-TOKEN", null)
                .then((response) => {
                    if (response !== undefined) {
                        if (response.status !== false) {
                            let currentUser = { ...this.state.user, ACCESS_TOKEN: response.data };
                            TaskServices.updateByPrimaryKey('TR_LOGIN', currentUser);
                            refreshStatus = true;
                        }
                    }
                });
        }
        return refreshStatus;
    }

    async _onSync() {
        console.log("#################### SYNC START ####################");

        this.putFCMConfig();

        this._deleteTRLog();
        this._deleteFinding();
        // this.deleteEbccHeader();
        // this.deleteEbccDetail();
        // this.deleteGenbaSelected();
        // this.deleteGenbaInspection();

        //Upload Image
        await uploadImage()
            .then((response) => {
                if (response.syncStatus) {
                    this.SyncUploadFinding()
                        .then(() => { });
                    this.SyncUploadInspection()
                        .then(() => { });
                    this.SyncUploadEBCC()
                        .then(() => { });

                    this.setState({
                        progressUploadImage: 1,
                        valueImageUpload: response.uploadCount,
                        totalImagelUpload: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: "upload-image",
                        progressUploadImage: 1,
                        valueImageUpload: 0,
                        totalImagelUpload: 0
                    });
                }
            });
        // this.kirimUserImage();
        await uploadImageProfile()
            .then((response) => {
                if (response.syncStatus) {
                    this.setState({
                        progressUploadImageUser: 1,
                        valueImageUserUpload: response.uploadCount,
                        totalImageUserUpload: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: "upload-image-profile",
                        progressUploadImageUser: 1,
                        valueImageUserUpload: 0,
                        totalImageUserUpload: 0
                    });
                }
            });

        this.downloadWeeklySummary();
        this.downloadReport();

        this.checkUpdate()
            .then((callback) => {
                if (this.state.uploadErrorFlag === false) {
                    if (callback) {
                        this.setState({
                            modalUpdate: {
                                title: 'Versi Aplikasi',
                                message: 'Kamu harus lakukan update aplikasi',
                                showModal: true,
                                icon: require('../Images/icon/icon_update_apps.png'),
                            }
                        })
                    }
                    else {
                        this.syncDownload()
                    }
                }
                else {
                    this.setState({
                        showButton: true,
                        showModal: true,
                        title: 'Sync Upload Putus (' + this.state.uploadErrorFlag + ')',
                        message: 'Yaaah jaringannya mati, coba Sync lagi yaa.',
                        icon: require('../Images/ic-sync-gagal.png')
                    })
                }
            });
    }

    async SyncUploadFinding() {
        await uploadFinding()
            .then(async (response) => {
                if (response.syncStatus) {
                    await this.setState({
                        progressFindingData: 1,
                        valueFindingDataUpload: response.uploadCount,
                        totalFindingDataUpload: response.totalCount
                    });
                }
                else {
                    //error
                    await this.setState({
                        uploadErrorFlag: "upload-finding",
                        progressFindingData: 1,
                        valueFindingDataUpload: 0,
                        totalFindingDataUpload: 0,
                    });
                }
            });

        await uploadFindingComment()
            .then(async (response) => {
                if (response.syncStatus) {
                    await this.setState({
                        progressFindingCommentData: 1,
                        valueFindingCommentDataUpload: response.uploadCount,
                        totalFindingCommentDataUpload: response.totalCount
                    });
                }
                else {
                    //error
                    await this.setState({
                        uploadErrorFlag: "upload-finding-comment",
                        progressFindingCommentData: 1,
                        valueFindingCommentDataUpload: 0,
                        totalFindingCommentDataUpload: 0,
                    });
                }
            });
    }

    async SyncUploadInspection() {
        //Upload Inspection Header
        await uploadInspectionHeader()
            .then(async (response) => {
                if (response.syncStatus) {
                    await this.setState({
                        progressInspeksiHeader: 1,
                        valueInspeksiHeaderUpload: response.uploadCount,
                        totalInspeksiHeaderUpload: response.totalCount
                    });
                }
                else {
                    //error
                    await this.setState({
                        uploadErrorFlag: "upload-inspection-header",
                        progressInspeksiHeader: 1,
                        valueInspeksiHeaderUpload: 0,
                        totalInspeksiHeaderUpload: 0,
                    });
                }
            });

        //Upload Inspection Detail
        await uploadInspectionDetail()
            .then(async (response) => {
                if (response.syncStatus) {
                    await this.setState({
                        progressInspeksiDetail: 1,
                        valueInspeksiDetailUpload: response.uploadCount,
                        totalInspeksiDetailUpload: response.totalCount
                    });
                }
                else {
                    //error
                    await this.setState({
                        uploadErrorFlag: "upload-inspection-detail",
                        progressInspeksiDetail: 1,
                        valueInspeksiDetailUpload: 0,
                        totalInspeksiDetailUpload: 0
                    });
                }
            });

        //Upload Inspection Track
        await uploadInspectionTrack()
            .then(async (response) => {
                if (response.syncStatus) {
                    await this.setState({
                        progressInspectionTrack: 1,
                        valueInspectionTrack: response.uploadCount,
                        totalInspectionTrack: response.totalCount
                    });
                }
                else {
                    //error
                    await this.setState({
                        uploadErrorFlag: "upload-inspection-track",
                        progressInspectionTrack: 1,
                        valueInspectionTrack: 0,
                        totalInspectionTrack: 0
                    });
                }
            });

        // check inspection image klo sudah terkirim, imageSync = "Y"
        // response = true, semua image sudah terkirim.
        await inspectionImageSyncStatus()
            .then((response) => {
            });

        await updateInspectionStatus()
            .then((response) => {
            });

        await uploadGenba()
            .then((response) => {
                if (response.syncStatus) {
                    this.setState({
                        progressGenbaInspection: 1,
                        valueGenbaInspection: response.uploadCount,
                        totalGenbaInspection: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: "upload-genba",
                        progressGenbaInspection: 1,
                        valueGenbaInspection: 0,
                        totalGenbaInspection: 0
                    });
                }
            });

    }

    async SyncUploadEBCC() {
        await uploadEbccHeader()
            .then((response) => {
                if (response.syncStatus) {
                    this.setState({
                        progressEbcc: 1,
                        valueEbcc: response.uploadCount,
                        totalEbcc: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: "upload-ebcc-header",
                        progressEbcc: 1,
                        valueEbcc: 0,
                        totalEbcc: 0
                    });
                }
            });

        await uploadEbccDetail()
            .then((response) => {
                if (response.syncStatus) {
                    this.setState({
                        progressEbccDetail: 1,
                        valueEbccDetail: response.uploadCount,
                        totalEbccDetail: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: "upload-ebcc-detail",
                        progressEbccDetail: 1,
                        valueEbccDetail: 0,
                        totalEbccDetail: 0
                    });
                }
            });

        await EBCCImageSyncStatus()
            .then((reponse) => { })
    }

    async checkUpdate() {
        let deviceVersion = DeviceInfo.getVersion();
        let imei = await DeviceInfo.getDeviceId();

        let model = {
            INSERT_USER: this.state.user.USER_AUTH_CODE.toString(),
            APK_VERSION: deviceVersion,
            DEVICE_ID: imei,
            INSERT_TIME: moment().format('YYYYMMDDHHmmss').toString()
        };
        let TM_SERVICE = await TaskServices.findBy2("TM_SERVICE", 'API_NAME', 'AUTH-SERVER-APK-VERSION');
        try {
            return await fetch(TM_SERVICE.API_URL, {
                method: TM_SERVICE.METHOD,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.user.ACCESS_TOKEN}`
                },
                body: JSON.stringify(model)
            })
                .then((response) => {
                    return response.json();
                })
                .then(async (callback) => {
                    if (callback.status) {
                        await TaskServices.deleteAllData('TR_CONFIG');

                        await TaskServices.saveData('TR_CONFIG', {
                            VERSION: model.APK_VERSION.toString(),
                            FORCE_UPDATE: callback.force_update
                        });

                        return callback.force_update;
                    }
                })
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    render() {
        const checkBlock = TaskServices.getAllData('TM_BLOCK');
        return (
            <Container style={{ flex: 1 }}>

                {/* Create by Aminju 0609 10:10 */}
                {/* Warning belum melakukan sync */}
                {checkBlock.length == 0 && <View style={{
                    padding: 10,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: Colors.colorWhite, fontSize: 12, fontFamily: Fonts.medium }}>Kamu belum pernah melakukan sync data</Text>
                </View>}
                <Content>
                    <ModalAlert
                        icon={this.state.icon}
                        visible={this.state.showModal}
                        onPressCancel={() => {
                            if (this.state.pickedWerks === false) {
                                this.props.navigation.navigate('PilihPeta', { more: 'Sync' })
                            }
                            this.setState({ showModal: false, finishedSync: false, pickedWerks: true });
                        }}
                        title={this.state.title}
                        message={this.state.message} />

                    <ModalAlert
                        icon={this.state.modalUpdate.icon}
                        visible={this.state.modalUpdate.showModal}
                        onPressCancel={() => {
                            Linking.openURL("market://details?id=com.bluezoneinspection.app")
                        }}
                        title={this.state.modalUpdate.title}
                        message={this.state.modalUpdate.message}
                        closeText={"UPDATE"}
                    />

                    <View style={{ flex: 1, padding: 16 }}>
                        {this.state.showButton && <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={styles.button}
                                disabled={this.state.isBtnEnable}
                                onPress={() => {
                                    this.setState(
                                        {
                                            showButton: false,

                                            //reset sync count
                                            //upload
                                            progressInspeksiHeader: 0,
                                            progressInspeksiDetail: 0,
                                            progressUploadImage: 0,
                                            progressFindingData: 0,
                                            progressFindingUploadData: 0,
                                            progressInspectionTrack: 0,

                                            //labelUpload
                                            valueInspeksiHeaderUpload: '0',
                                            totalInspeksiHeaderUpload: '0',
                                            valueInspeksiDetailUpload: '0',
                                            totalInspeksiDetailUpload: '0',
                                            valueFindingDataUpload: '0',
                                            totalFindingDataUpload: '0',
                                            valueFindingCommentDataUpload: '0',
                                            totalFindingCommentDataUpload: '0',
                                            valueImageUpload: '0',
                                            totalImagelUpload: '0',
                                            valueInspectionTrack: '0',
                                            totalInspectionTrack: '0',

                                            //download
                                            progressFinding: 0,
                                            progressFindingImage: 0,
                                            progress: 0,
                                            progressAfd: 0,
                                            progressRegion: 0,
                                            progressEst: 0,
                                            progressLandUse: 0,
                                            progressComp: 0,
                                            progressContent: 0,
                                            progressContentLabel: 0,
                                            progressKriteria: 0,
                                            progressCategory: 0,
                                            progressContact: 0,
                                            progressParamInspection: 0,
                                            progressKualitas: 0,
                                            progressServiceList:0,

                                            //labelDownload
                                            valueDownload: '0',
                                            valueAfdDownload: '0',
                                            valueRegionDownload: '0',
                                            valueEstDownload: '0',
                                            valueCompDownload: '0',
                                            valueLandUseDownload: '0',
                                            valueContentDownload: '0',
                                            valueContentLabelDownload: '0',
                                            valueKriteriaDownload: '0',
                                            valueFindingDownload: '0',
                                            valueCategoryDownload: '0',
                                            valueContactDownload: '0',
                                            valueFindingImageDownload: '0',
                                            valueParamInspection: '0',
                                            valueKualitas: '0',
                                            valueServiceList: '0',

                                            totalDownload: '0',
                                            totalAfdDownload: '0',
                                            totalRegionDownload: '0',
                                            totalEstDownload: '0',
                                            totalCompDownload: '0',
                                            totalLandUseDownload: '0',
                                            totalContentDownload: '0',
                                            totalContentLabelDownload: '0',
                                            totalKriteriaDownload: '0',
                                            totalFindingDownload: '0',
                                            totalCategoryDownload: '0',
                                            totalContactDownload: '0',
                                            totalFindingImageDownload: '0',
                                            totalParamInspection: '0',
                                            totalKualitas: '0',
                                            totalServiceList: '0',

                                            fetchLocation: false,
                                            isBtnEnable: false,
                                            uploadErrorFlag: false,
                                        },
                                        () => {

                                            NetInfo.isConnected.fetch().then(isConnected => {
                                                if (isConnected) {
                                                    this._refreshToken()
                                                        .then((response) => {
                                                            //if new token generated, continue sync
                                                            if (response) {
                                                                //refresh tm services
                                                                this.insertLink()
                                                            }
                                                            else {
                                                                this.setState({
                                                                    showButton: true,
                                                                    showModal: true,
                                                                    title: 'Refresh token gagal!',
                                                                    message: 'Gagal mendapatkan token baru!',
                                                                    icon: require('../Images/ic-sync-gagal.png')
                                                                })
                                                            }
                                                        });
                                                }
                                                else {
                                                    this.setState({
                                                        showButton: true,
                                                        showModal: true,
                                                        title: 'Tidak Ada Jaringan',
                                                        message: 'Untuk bisa sync, kamu harus terhubung ke Internet',
                                                        icon: require('../Images/ic-no-internet.png')
                                                    });
                                                }
                                            });
                                        }
                                    );
                                }}>
                                <Text style={styles.buttonText}>Sync</Text>
                            </TouchableOpacity>
                        </View>}

                        {/* Section Upload by Aminju */}
                        <Text style={{ fontSize: 15, color: 'blue', marginTop: 24, fontFamily: Fonts.demi }}>UPLOAD</Text>
                        <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                        <ProgressSync
                            title={'Foto'}
                            value={this.state.valueImageUpload}
                            total={this.state.totalImagelUpload}
                            progress={this.state.progressUploadImage} />

                        <ProgressSync
                            title={'Foto Profil'}
                            value={this.state.valueImageUserUpload}
                            total={this.state.totalImageUserUpload}
                            progress={this.state.progressUploadImageUser} />

                        <ProgressSync
                            title={'Inspeksi - Rute'}
                            value={this.state.valueInspectionTrack}
                            total={this.state.totalInspectionTrack}
                            progress={this.state.progressInspectionTrack} />

                        <ProgressSync
                            title={'Inspeksi - Header'}
                            value={this.state.valueInspeksiHeaderUpload}
                            total={this.state.totalInspeksiHeaderUpload}
                            progress={this.state.progressInspeksiHeader} />

                        <ProgressSync
                            title={'Inspeksi - Detail'}
                            value={this.state.valueInspeksiDetailUpload}
                            total={this.state.totalInspeksiDetailUpload}
                            progress={this.state.progressInspeksiDetail} />

                        <ProgressSync
                            title={'Inspeksi - Genba'}
                            value={this.state.valueGenbaInspection}
                            total={this.state.totalGenbaInspection}
                            progress={this.state.progressGenbaInspection} />

                        <ProgressSync
                            title={'Temuan'}
                            value={this.state.valueFindingDataUpload}
                            total={this.state.totalFindingDataUpload}
                            progress={this.state.progressFindingData} />

                        <ProgressSync
                            title={'Temuan - Komentar'}
                            value={this.state.valueFindingCommentDataUpload}
                            total={this.state.totalFindingCommentDataUpload}
                            progress={this.state.progressFindingCommentData} />

                        <ProgressSync
                            title={'Sampling - Header'}
                            value={this.state.valueEbcc}
                            total={this.state.totalEbcc}
                            progress={this.state.progressEbcc} />

                        <ProgressSync
                            title={'Sampling - Detail'}
                            value={this.state.valueEbccDetail}
                            total={this.state.totalEbccDetail}
                            progress={this.state.progressEbccDetail} />

                        <Text style={{ fontSize: 14, color: Colors.tintColor, marginTop: 16, fontFamily: Fonts.demi }}>REPORT</Text>
                        <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                        <ProgressSync
                            title={'Peta Restan'}
                            color={Colors.brand}
                            value={this.state.valueTitikRestan}
                            total={this.state.totalTitikRestan}
                            progress={this.state.progressTitikRestan} />

                        <ProgressSync
                            title={'Peta Panen - Header'}
                            color={Colors.brand}
                            value={this.state.valuePetaPanenHeader}
                            total={this.state.totalPetaPanenHeader}
                            progress={this.state.progressPetaPanenHeader} />

                        <ProgressSync
                            title={'Peta Panen - Detail'}
                            color={Colors.brand}
                            value={this.state.valuePetaPanenDetail}
                            total={this.state.totalPetaPanenDetail}
                            progress={this.state.progressPetaPanenDetail} />

                        {/* Section Download by Aminju */}
                        <Text style={{ fontSize: 14, color: Colors.tintColor, marginTop: 16, fontFamily: Fonts.demi }}>DOWNLOAD</Text>
                        <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                        <ProgressSync
                            title={'Master Server'}
                            color={Colors.brand}
                            value={this.state.valueServiceList}
                            total={this.state.totalServiceList}
                            progress={this.state.progressServiceList} />

                        <ProgressSync
                            title={'Temuan'}
                            color={Colors.brand}
                            value={this.state.valueFindingDownload}
                            total={this.state.totalFindingDownload}
                            progress={this.state.progressFinding} />

                        <ProgressSync
                            title={'Temuan - Foto'}
                            color={Colors.brand}
                            value={this.state.valueFindingImageDownload}
                            total={this.state.totalFindingImageDownload}
                            progress={this.state.progressFindingImage} />

                        <ProgressSync
                            title={'Temuan - Komentar'}
                            color={Colors.brand}
                            value={this.state.valueFindingCommentDownload}
                            total={this.state.totalFindingCommentDownload}
                            progress={this.state.progressFindingCommentDownload} />

                        <ProgressSync
                            title={'Master Blok'}
                            color={Colors.brand}
                            value={this.state.valueDownload}
                            total={this.state.totalDownload}
                            progress={this.state.progress} />

                        <ProgressSync
                            title={'Master Afdeling'}
                            color={Colors.brand}
                            value={this.state.valueAfdDownload}
                            total={this.state.totalAfdDownload}
                            progress={this.state.progressAfd} />

                        <ProgressSync
                            title={'Master Estate'}
                            color={Colors.brand}
                            value={this.state.valueEstDownload}
                            total={this.state.totalEstDownload}
                            progress={this.state.progressEst} />

                        <ProgressSync
                            title={'Master PT'}
                            color={Colors.brand}
                            value={this.state.valueCompDownload}
                            total={this.state.totalCompDownload}
                            progress={this.state.progressComp} />

                        <ProgressSync
                            title={'Master Region'}
                            color={Colors.brand}
                            value={this.state.valueRegionDownload}
                            total={this.state.totalRegionDownload}
                            progress={this.state.progressRegion} />


                        <ProgressSync
                            title={'Master Status Blok'}
                            color={Colors.brand}
                            value={this.state.valueLandUseDownload}
                            total={this.state.totalLandUseDownload}
                            progress={this.state.progressLandUse} />

                        <ProgressSync
                            title={'Master Pengguna'}
                            color={Colors.brand}
                            value={this.state.valueContactDownload}
                            total={this.state.totalContactDownload}
                            progress={this.state.progressContact} />

                        <ProgressSync
                            title={'Parameter Penilaian Inspeksi'}
                            color={Colors.brand}
                            value={this.state.valueContentDownload}
                            total={this.state.totalContentDownload}
                            progress={this.state.progressContent} />

                        <ProgressSync
                            title={'Parameter Kriteria Inspeksi'}
                            color={Colors.brand}
                            value={this.state.valueKriteriaDownload}
                            total={this.state.totalKriteriaDownload}
                            progress={this.state.progressKriteria} />

                        <ProgressSync
                            title={'Parameter Rute Inspeksi'}
                            color={Colors.brand}
                            value={this.state.valueParamInspection}
                            total={this.state.totalParamInspection}
                            progress={this.state.progressParamInspection} />

                        <ProgressSync
                            title={'Parameter Kategori Temuan'}
                            color={Colors.brand}
                            value={this.state.valueCategoryDownload}
                            total={this.state.totalCategoryDownload}
                            progress={this.state.progressCategory} />


                        <ProgressSync
                            title={'Parameter Kualitas Buah'}
                            color={Colors.brand}
                            value={this.state.valueKualitas}
                            total={this.state.totalKualitas}
                            progress={this.state.progressKualitas} />

                        <ProgressDialog
                            visible={this.state.fetchLocation}
                            activityIndicatorSize="small"
                            message={this.state.downloadApa} />
                    </View>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 220,
        backgroundColor: Colors.brand,
        borderRadius: 25,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center'
    }
});

