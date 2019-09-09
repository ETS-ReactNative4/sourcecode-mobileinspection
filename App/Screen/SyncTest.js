import React from 'react';
import { Linking, NetInfo, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content } from 'native-base'
import Colors from '../Constant/Colors';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import IMEI from 'react-native-imei'

import ServerTimeAction from '../Redux/ServerTimeRedux';
import RegionAction from '../Redux/RegionRedux';
import BlockAction from '../Redux/BlockRedux';
import AfdAction from '../Redux/AfdRedux';
import EstAction from '../Redux/EstRedux';
import KriteriaAction from '../Redux/KriteriaRedux';
import UserAuthAction from '../Redux/UserAuthRedux';
import LandUseAction from '../Redux/LandUseRedux';
import CompAction from '../Redux/CompRedux';
import ContentAction from '../Redux/ContentRedux';
import ContentLabelAction from '../Redux/ContentLabelRedux';
import ContactAction from '../Redux/ContactRedux';
import CategoryAction from '../Redux/CategoryRedux';
import FindingAction from '../Redux/FindingRedux';
import FindingImageAction from '../Redux/FindingImageRedux';
import ParamTrackAction from '../Redux/ParamTrackRedux'
import KualitasAction from '../Redux/KualitasRedux'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { dirPhotoKategori, dirPhotoTemuan } from '../Lib/dirStorage';
import { connect } from 'react-redux';
import R from 'ramda'
import RNFetchBlob from 'rn-fetch-blob'
import TaskServices from '../Database/TaskServices'
import ServerName from '../Constant/ServerName'
import { convertTimestampToDate, getTodayDate } from '../Lib/Utils';
import ModalAlert from '../Component/ModalAlert';
import { fetchFormPostAPI, fetchPostAPI } from '../Api/FetchingApi';
import ProgressSync from '../Component/ProgressSync';
import { storeData } from '../Database/Resources';

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

class SyncScreen extends React.Component {

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

            //downlaod
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

    /** CREATE BY AMINJU SPRINT 16 ==> 02-06 SEPT 2019 */
    syncDownload = async () => {

        /* DOWNLOAD FINDING */
        /* INCLUDE NOTIFICATION FINDING */
        await getFinding().then((data) => {
            console.log('Data Callback Finding : ', data)
            this.setState({
                progressFinding: 1,
                valueFindingDownload: data.downloadCount,
                totalFindingDownload: data.totalCount
            })
        })

        /* DOWNLOAD FINDING IMAGE */
        await getFindingImage().then((data) => {
            console.log('Data Callback Finding Image: ', data)
            this.setState({
                progressFindingImage: 1,
                valueFindingImageDownload: data.downloadCount,
                totalFindingImageDownload: data.totalCount
            })
        })

        /* DOWNLOAD FINDING COMMENT */
        await getFindingComment().then((data) => {
            console.log('Data Callback Finding Comment: ', data)
            this.setState({
                progressFindingCommentDownload: 1,
                valueFindingCommentDownload: data.downloadCount,
                totalFindingCommentDownload: data.totalCount
            })
        })

        /* DOWNLOAD BLOCK */
        await getBlock().then((data) => {
            console.log('Data Callback Block : ', data)
            this.setState({
                progress: 1,
                valueDownload: data.downloadCount,
                totalDownload: data.totalCount
            })
        })

        /* DOWNLOAD AFDELING */
        await getAfd().then((data) => {
            console.log('Data Callback Afd : ', data)
            this.setState({
                progressAfd: 1,
                valueAfdDownload: data.downloadCount,
                totalAfdDownload: data.totalCount
            })
        })

        /* DOWNLOAD REGION */
        await getRegion().then((data) => {
            console.log('Data Callback Region : ', data)
            this.setState({
                progressRegion: 1,
                valueRegionDownload: data.downloadCount,
                totalRegionDownload: data.totalCount
            })
        })

        /* DOWNLOAD ESTATE */
        await getEstate().then((data) => {
            console.log('Data Callback Estate : ', data)
            this.setState({
                progressEst: 1,
                valueEstDownload: data.downloadCount,
                totalEstDownload: data.totalCount
            })
        })

        /* DOWNLOAD LANDUSE */
        await getLandUse().then((data) => {
            console.log('Data Callback LandUse : ', data)
            this.setState({
                progressLandUse: 1,
                valueLandUseDownload: data.downloadCount,
                totalLandUseDownload: data.totalCount
            })
        })

        /* DOWNLOAD COMP */
        await getComp().then((data) => {
            console.log('Data Callback Comp : ', data)
            this.setState({
                progressComp: 1,
                valueCompDownload: data.downloadCount,
                totalCompDownload: data.totalCount
            })
        })

        /* DOWNLOAD CONTENT */
        await getContent().then((data) => {
            console.log('Data Callback Content : ', data)
            this.setState({
                progressContent: 1,
                valueContentDownload: data.downloadCount,
                totalContentDownload: data.totalCount
            })
        })

        /* DOWNLOAD KRITERIA */
        await getKriteria().then((data) => {
            console.log('Data Callback Kriteria : ', data)
            this.setState({
                progressKriteria: 1,
                valueKriteriaDownload: data.downloadCount,
                totalKriteriaDownload: data.totalCount
            })
        })

        /* DOWNLOAD CATEGORY */
        await getCategory().then((data) => {
            console.log('Data Callback Category : ', data)
            this.setState({
                progressCategory: 1,
                valueCategoryDownload: data.downloadCount,
                totalCategoryDownload: data.totalCount
            })
        })

        /* DOWNLOAD CATEGORY */
        await getContact().then((data) => {
            console.log('Data Callback Contact : ', data)
            this.setState({
                progressContact: 1,
                valueContactDownload: data.downloadCount,
                totalContactDownload: data.totalCount
            })
        })

        /* DOWNLOAD PARAM TRACK INSPECTION */
        await getParamTrack().then((data) => {
            console.log('Data Callback Param Track  : ', data)
            this.setState({
                progressParamInspection: 1,
                valueParamInspection: data.downloadCount,
                totalParamInspection: data.totalCount
            })
        })

        /* DOWNLOAD PARAM KUALITAS */
        await getKualitas().then((data) => {
            console.log('Data Callback Kualitas : ', data)
            this.setState({
                progressKualitas: 1,
                valueKualitas: data.downloadCount,
                totalKualitas: data.totalCount
            })
        })

        /* DOWNLOAD TIME SERVER */
        await getTimeServer().then((isSync) => {
            console.log('Data Callback Time Server : ', isSync)

            if (isSync) {
                getResetToken(isSync).then((data) => {
                    console.log('Data Callback Reset Token : ', data)
                    if (data.isResetSync) {
                        this.setState({
                            showModal: true,
                            title: 'Sync Berhasil',
                            message: 'Yeay sinkronisasi udah selesai!',
                            icon: require('../Images/ic-sync-berhasil.png'),
                            showButton: true,
                            finishedSync: true,
                            pickedWerks: data.pickedWerks
                        });
                    } else {
                        this.setState({
                            showButton: true,
                            showModal: true,
                            title: 'Tidak Sinkron',
                            message: 'Jam di HP kamu salah',
                            icon: require('../Images/ic-sync-gagal.png')
                        })
                    }
                });
            }

        })
    }

    getAPIURL(apiName) {
        let serv = TaskServices.getAllData("TM_SERVICE").filtered('API_NAME="' + apiName + '" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
        if (serv.length > 0) {
            serv = serv[0]
        }
        return serv;
    }
    insertLink() {
        // FuntionCRUD.DELETE_FINDING();
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
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
                            let index = 0;
                            for (let i in data.data) {
                                let newService = {
                                    SERVICE_ID: parseInt(i),
                                    MOBILE_VERSION: data.data[i].MOBILE_VERSION,
                                    API_NAME: data.data[i].API_NAME,
                                    KETERANGAN: data.data[i].KETERANGAN,
                                    BODY: data.data[i].BODY ? JSON.stringify(data.data[i].BODY) : '',
                                    METHOD: data.data[i].METHOD,
                                    API_URL: data.data[i].API_URL
                                }
                                TaskServices.saveData('TM_SERVICE', newService);
                                index++;
                            }
                        }

                        this._onSync()
                    });
            } else {
                this.setState({
                    showButton: true,
                    showModal: true,
                    title: 'Tidak Ada Jaringan',
                    message: 'Untuk bisa sync, kamu harus terhubung ke Internet',
                    icon: require('../Images/ic-no-internet.png')
                });
            }
        });
        function handleFirstConnectivityChange(isConnected) {
            NetInfo.isConnected.removeEventListener(
                'connectionChange',
                handleFirstConnectivityChange
            );
        }
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            handleFirstConnectivityChange
        );
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
    deleteGenbaSelected() {
        var data = TaskServices.getAllData('TR_GENBA_SELECTED');
        var now = moment(new Date());
        if (data !== undefined) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].INSERT_TIME !== '') {
                    let insertTime = data[i].INSERT_TIME;
                    if (insertTime.includes(' ')) {
                        insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                    }
                    var diff = moment(new Date(insertTime)).diff(now, 'day');
                    if (diff < -7) {
                        this.deleteImages(data[i].USER_AUTH_CODE)
                        TaskServices.deleteRecordByPK('TR_GENBA_SELECTED', 'USER_AUTH_CODE', data[i].USER_AUTH_CODE)
                    }
                }
            }
        }
    }
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

    kirimEbccHeader() {
        let dataHeader = TaskServices.getAllData('TR_H_EBCC_VALIDATION');
        var query = dataHeader.filtered('STATUS_SYNC = "N"');
        let countData = query;
        this.setState({ progressEbcc: 1, valueEbcc: countData.length, totalEbcc: countData.length });
        if (countData.length > 0) {
            for (var i = 0; i < countData.length; i++) {
                this.postEbccHeader(countData[i]);
            }
        } else {
            this.setState({ progressEbcc: 1, valueEbcc: 0, totalEbcc: 0 });
        }
    }

    kirimEbccDetail() {
        let dataHeader = TaskServices.getAllData('TR_D_EBCC_VALIDATION');
        var query = dataHeader.filtered('STATUS_SYNC = "N"');
        let countData = query;
        this.setState({ progressEbccDetail: 1, valueEbccDetail: countData.length, totalEbccDetail: countData.length });
        if (countData.length > 0) {
            for (var i = 0; i < countData.length; i++) {
                this.postEbccDetail(countData[i]);
            }
        } else {
            this.setState({ progressEbccDetail: 1, valueEbccDetail: 0, totalEbccDetail: 0 });
        }
    }

    kirimUserImage() {
        try {
            const user = TaskServices.getAllData('TR_LOGIN')[0];
            let all = TaskServices.getAllData('TR_IMAGE_PROFILE');
            var dataImageUser = TaskServices.query('TR_IMAGE_PROFILE', `STATUS_SYNC = 'N'`);
            if (all !== undefined && dataImageUser !== undefined) {
                this.setState({ totalImageUserUpload: dataImageUser.length })
                for (let i = 0; i < dataImageUser.length; ++i) {
                    let model = dataImageUser[i];
                    RNFS.exists(`file://${model.IMAGE_PATH_LOCAL}`).
                        then((exists) => {
                            if (exists) {
                                var data = new FormData();
                                data.append('FILENAME', {
                                    uri: `file://${model.IMAGE_PATH_LOCAL}`,
                                    type: 'image/jpeg',
                                    name: model.IMAGE_NAME,
                                });
                                const url = this.getAPIURL("IMAGES-PROFILE");
                                fetchFormPostAPI(this.state.user.ACCESS_TOKEN, url.API_URL, data).then(((result) => {
                                    if (result != undefined) {
                                        if (result.status) {
                                            this.setState({ valueImageUserUpload: i + 1 });
                                            TaskServices.updateByPrimaryKey('TR_IMAGE_PROFILE', {
                                                "USER_AUTH_CODE": model.USER_AUTH_CODE,
                                                "STATUS_SYNC": "Y"
                                            });
                                        }
                                    } else {
                                        this.setState({
                                            uploadErrorFlag: true
                                        }, () => { console.log("kirimUserImage Server Timeout") })
                                    }
                                }));
                            } else {
                                let data = TaskServices.getAllData('TR_IMAGE');
                                let indexData = R.findIndex(R.propEq('IMAGE_CODE', model.IMAGE_CODE))(data);
                                TaskServices.deleteRecord('TR_IMAGE', indexData)
                            }
                        })
                }
            }
            this.setState({ progressUploadImageUser: 1 });
        } catch (error) {
            this.setState({ progressUploadImageUser: 1, valueImageUserUpload: 0, totalImageUserUpload: 0 });
        }
    }

    downloadFindingComment() {
        let TM_SERVICE = TaskServices.findBy2("TM_SERVICE", 'API_NAME', 'AUTH-SYNC-FINDING-COMMENT');
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        fetch(TM_SERVICE.API_URL, {
            method: TM_SERVICE.METHOD,
            headers: {
                'Authorization': `Bearer ${user.ACCESS_TOKEN}`
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((callback) => {
                console.log("RESPONSE COMMENT", callback);
                if (callback.status) {
                    let getComment = TaskServices.getAllData("TR_FINDING_COMMENT");
                    if (callback.data.hapus.length > 0 && getComment.length > 0) {
                        callback.data.hapus.map(data => {
                            TaskServices.deleteRecordByPK('TR_FINDING_COMMENT', 'FINDING_COMMENT_ID', data.FINDING_COMMENT_ID);
                        });
                    }
                    if (callback.data.ubah.length > 0 && getComment.length > 0) {
                        callback.data.ubah.map(data => {
                            let model = {
                                FINDING_COMMENT_ID: data.FINDING_COMMENT_ID,
                                FINDING_CODE: data.FINDING_CODE,
                                USER_AUTH_CODE: data.USER_AUTH_CODE,
                                MESSAGE: data.MESSAGE,
                                INSERT_TIME: data.INSERT_TIME !== undefined ? data.INSERT_TIME.toString() : "0",
                                TAGS: data.TAGS !== undefined ? data.TAGS : [],
                                //LOCAL PARAM
                                STATUS_SYNC: 'Y',
                                USERNAME: data.FULLNAME !== undefined ? data.FULLNAME : "NO_NAME"
                            };
                            if (model.USER_AUTH_CODE !== this.state.user.USER_AUTH_CODE) {
                                this._updateTR_Notif_Comment(model);
                            }
                            TaskServices.updateByPrimaryKey('TR_FINDING_COMMENT', model)
                        })
                    }
                    if (callback.data.simpan.length > 0) {
                        this.setState({
                            totalFindingCommentDownload: callback.data.simpan.length.toString()
                        })
                        callback.data.simpan.map((data) => {
                            let model = {
                                FINDING_COMMENT_ID: data.FINDING_COMMENT_ID,
                                FINDING_CODE: data.FINDING_CODE,
                                USER_AUTH_CODE: data.USER_AUTH_CODE,
                                MESSAGE: data.MESSAGE,
                                INSERT_TIME: data.INSERT_TIME !== undefined ? data.INSERT_TIME.toString() : "0",
                                TAGS: data.TAGS !== undefined ? data.TAGS : [],
                                //LOCAL PARAM
                                STATUS_SYNC: 'Y',
                                USERNAME: data.FULLNAME !== undefined ? data.FULLNAME : "NO_NAME"
                            };
                            if (model.USER_AUTH_CODE !== this.state.user.USER_AUTH_CODE) {
                                this._updateTR_Notif_Comment(model);
                            }
                            TaskServices.saveData('TR_FINDING_COMMENT', model);
                        });
                    }
                    this.setState({
                        valueFindingCommentDownload: callback.data.simpan.length.toString(),
                    })
                }
            })
            .catch((e) => {
                console.log(e)
            })
        this.setState({
            progressFindingCommentDownload: 1
        })
    }

    // Aminju => Weekly Summary
    downloadWeeklySummary() {

        const param = {
            IS_VIEW: 1
        }
        let urlInspeksi = this.getAPIURL("INSPECTION-SUMMARY")
        let urlFinding = this.getAPIURL("FINDING-SUMMARY")
        let urlEbcc = this.getAPIURL("EBCC-SUMMARY")

        const user = TaskServices.getAllData('TR_LOGIN')[0];

        this.fetchWeeklySummary(user.ACCESS_TOKEN, urlInspeksi.API_URL, param, 'inspeksi');
        this.fetchWeeklySummary(user.ACCESS_TOKEN, urlFinding.API_URL, param, 'finding');
        this.fetchWeeklySummary(user.ACCESS_TOKEN, urlEbcc.API_URL, param, 'ebcc');
    }

    //Fetch Weekly Summary
    fetchWeeklySummary(token, url, param, type) {
        fetchPostAPI(token, url, param).then(((result) => {
            if (result != undefined) {
                if (type == 'inspeksi') {
                    // console.log('Result Weekly InspectionSummary : ', result)
                    storeData('InspectionSummary', result)
                } else if (type == 'finding') {
                    // console.log('Result Weekly FindingSummary : ', result)
                    storeData('FindingSummary', result)
                } else if (type == 'ebcc') {
                    // console.log('Result Weekly EbccSummary : ', result)
                    storeData('EbccSummary', result)
                }
            } else {
                this.setState({
                    uploadErrorFlag: true
                }, () => { console.log("weekly summary Server Timeout"); })
            }
        }));
    }

    uploadData(URL, dataPost, table, idInspection) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        fetchPostAPI(user.ACCESS_TOKEN, URL.API_URL, dataPost).then(((result) => {
            console.log('Result Upload Data : ' + table, result)
            if (result != undefined) {
                if (result.status) {
                    if (table == 'header') {
                        this.updateInspeksi(dataPost);
                        // this.updateInspeksiBaris(idInspection);
                    } else if (table == 'detailHeader') {
                        this.updateInspeksiDetail(dataPost)
                        this.updateSyncInpesctionBaris()
                    } else if (table == 'tracking') {
                        console.log("track", result);
                        this.updateInspeksiTrack(dataPost)
                    } else if (table == 'finding') {
                        //let imgHasSent = this.checkImageHasSent(dataPost.FINDING_CODE)
                        //if(imgHasSent){
                        this.updateFinding(dataPost)
                        //}
                    } else if (table == 'ebccH') {
                        //let imgHasSent = this.checkImageHasSent(dataPost.EBCC_VALIDATION_CODE)
                        //if(imgHasSent){
                        this.updateEbccHeader(dataPost)
                        //}
                    } else if (table == 'ebccD') {
                        this.updateEbccDetail(dataPost, idInspection)
                    }
                }
            } else {
                this.setState({
                    uploadErrorFlag: true
                }, () => { console.log("upload data Server Timeout") })
            }
        }));
    }

    checkImageHasSent(trCode) {
        let images = TaskServices.findBy('TR_IMAGE', 'TR_CODE', trCode);
        if (images !== undefined) {
            for (var i = 0; i < images.length; i++) {
                if (images.STATUS_SYNC == 'N') {
                    return false;
                }
            }
        }
        return true;
    }

    headerHasSent(idInspection) {
        let header = TaskServices.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection);
        if (header !== undefined) {
            for (var i = 0; i < header.length; i++) {
                let image = this.checkImageHasSent(header[i].BLOCK_INSPECTION_CODE)
                if (image && header[i].STATUS_SYNC == 'N') {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    detailHasSent(blockInsCode) {
        let detail = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'ID_INSPECTION', blockInsCode);
        if (detail !== undefined) {
            for (var j = 0; j < detail.length; j++) {
                if (detail[j].STATUS_SYNC == 'N') {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    updateSyncInpesctionBaris() {
        let barisIns = TaskServices.findBy('TR_BARIS_INSPECTION', 'STATUS_SYNC', 'N')
        if (barisIns !== undefined) {
            barisIns.map(item => {
                let header = this.headerHasSent(item.ID_INSPECTION)
                let detail = this.detailHasSent(item.ID_INSPECTION)
                if (header && detail) {
                    this.updateInspeksiBaris(item.ID_INSPECTION)
                }
            })
        }
    }

    updateInspeksi = param => {
        if (param !== null) {
            /*let allData = TaskServices.getAllData('TR_BLOCK_INSPECTION_H')
            let indexData = R.findIndex(R.propEq('BLOCK_INSPECTION_CODE', param.BLOCK_INSPECTION_CODE))(allData);
            TaskServices.updateInspeksiSync('TR_BLOCK_INSPECTION_H', 'Y', indexData);*/
            TaskServices.updateByPrimaryKey('TR_BLOCK_INSPECTION_H', {
                "BLOCK_INSPECTION_CODE": param.BLOCK_INSPECTION_CODE,
                "STATUS_SYNC": "Y"
            });
        }
    }

    updateInspeksiDetail = param => {
        if (param !== null) {
            /*let allData = TaskServices.getAllData('TR_BLOCK_INSPECTION_D')
            let indexData = R.findIndex(R.propEq('BLOCK_INSPECTION_CODE_D', param.BLOCK_INSPECTION_CODE_D))(allData);
            TaskServices.updateInspeksiSync('TR_BLOCK_INSPECTION_D', 'Y', indexData);*/
            TaskServices.updateByPrimaryKey('TR_BLOCK_INSPECTION_D', {
                "BLOCK_INSPECTION_CODE_D": param.BLOCK_INSPECTION_CODE_D,
                "STATUS_SYNC": "Y"
            });
        }
    }

    updateInspeksiTrack = param => {
        if (param !== null) {
            /*let allData = TaskServices.getAllData('TM_INSPECTION_TRACK')
            let indexData = R.findIndex(R.propEq('TRACK_INSPECTION_CODE', param.TRACK_INSPECTION_CODE))(allData);
            TaskServices.updateInspeksiSync('TM_INSPECTION_TRACK', 'Y', indexData);*/
            TaskServices.updateByPrimaryKey('TM_INSPECTION_TRACK', {
                "TRACK_INSPECTION_CODE": param.TRACK_INSPECTION_CODE,
                "STATUS_SYNC": "Y"
            });
        }
    }

    updateInspeksiBaris = param => {
        if (param !== null) {
            /*let allData = TaskServices.getAllData('TR_BARIS_INSPECTION');
            let indexData = R.findIndex(R.propEq('ID_INSPECTION', param))(allData);
            TaskServices.updateInspeksiSync('TR_BARIS_INSPECTION', 'Y', indexData);*/
            TaskServices.updateByPrimaryKey('TR_BARIS_INSPECTION', {
                "ID_INSPECTION": param,
                "STATUS_SYNC": "Y"
            });
        }
    }

    updateFinding = param => {
        if (param !== undefined) {
            try {
                TaskServices.updateByPrimaryKey('TR_FINDING', {
                    "FINDING_CODE": param.FINDING_CODE,
                    "STATUS_SYNC": "Y"
                });
            }
            catch (e) {
                console.log("error updateFinding", e);
            }
        }
    }
    updateEbccHeader = param => {
        if (param !== undefined) {
            TaskServices.updateByPrimaryKey('TR_H_EBCC_VALIDATION', {
                "EBCC_VALIDATION_CODE": param.EBCC_VALIDATION_CODE,
                "STATUS_SYNC": "Y"
            });
        }
    }

    updateEbccDetail = (param, ebccValCodeD) => {
        if (param !== undefined) {
            TaskServices.updateByPrimaryKey('TR_D_EBCC_VALIDATION', {
                "EBCC_VALIDATION_CODE_D": ebccValCodeD,
                "STATUS_SYNC": "Y"
            });
        }
    }

    kirimFinding(param) {

        let dueDate = param.DUE_DATE;
        if (dueDate.includes(' ')) {
            dueDate = dueDate.substring(0, dueDate.indexOf(' '))
        }
        if (dueDate.length > 0) {
            dueDate += " 00:00:00"
        }
        let data = {
            FINDING_CODE: param.FINDING_CODE,
            WERKS: param.WERKS,
            AFD_CODE: param.AFD_CODE,
            BLOCK_CODE: param.BLOCK_CODE,
            FINDING_CATEGORY: param.FINDING_CATEGORY,
            FINDING_DESC: param.FINDING_DESC,
            FINDING_PRIORITY: param.FINDING_PRIORITY,
            DUE_DATE: dueDate,
            ASSIGN_TO: param.ASSIGN_TO,
            PROGRESS: param.PROGRESS.toString(),
            LAT_FINDING: param.LAT_FINDING,
            LONG_FINDING: param.LONG_FINDING,
            //STATUS_TRACK: param.STATUS_LAT_LONG,
            REFFERENCE_INS_CODE: param.REFFERENCE_INS_CODE,
            STATUS_SYNC: 'Y',
            INSERT_USER: param.INSERT_USER,
            INSERT_TIME: param.INSERT_TIME == '' ? parseInt(getTodayDate('YYYYMMDDkkmmss')) : parseInt(param.INSERT_TIME.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')),
            UPDATE_USER: param.UPDATE_USER,
            UPDATE_TIME: param.UPDATE_TIME == '' ? parseInt(getTodayDate('YYYYMMDDkkmmss')) : parseInt(param.UPDATE_TIME.replace(/-/g, '').replace(/ /g, '').replace(/:/g, '')),
            RATING_VALUE: param.RATING_VALUE,
            RATING_MESSAGE: param.RATING_MESSAGE,
            END_TIME: param.END_TIME != "" ? parseInt(param.END_TIME) : "",
        }

        console.log('Param Finding : ', data)
        // if (param.RATING) {
        //     data.RATING = param.RATING;
        // }
        this.uploadData(this.getAPIURL("FINDING-INSERT"), data, 'finding', '');
    }

    postEbccHeader(param) {
        let data = {
            EBCC_VALIDATION_CODE: param.EBCC_VALIDATION_CODE,
            WERKS: param.WERKS,
            AFD_CODE: param.AFD_CODE,
            BLOCK_CODE: param.BLOCK_CODE,
            NO_TPH: param.NO_TPH,
            STATUS_TPH_SCAN: param.STATUS_TPH_SCAN,
            ALASAN_MANUAL: param.ALASAN_MANUAL,
            LAT_TPH: param.LAT_TPH,
            LON_TPH: param.LON_TPH,
            DELIVERY_CODE: param.DELIVERY_CODE,
            STATUS_DELIVERY_CODE: param.STATUS_DELIVERY_CODE,
            STATUS_SYNC: 'SYNC',
            SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
            INSERT_USER: param.INSERT_USER,
            INSERT_TIME: parseInt(convertTimestampToDate(param.INSERT_TIME, 'YYYYMMDDkkmmss')),
            UPDATE_USER: '',
            UPDATE_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss'))
        }
        this.uploadData(this.getAPIURL("EBCC-VALIDATION-HEADER-INSERT"), data, 'ebccH', '');
    }

    postEbccDetail(param) {
        let data = {
            EBCC_VALIDATION_CODE: param.EBCC_VALIDATION_CODE,
            ID_KUALITAS: param.ID_KUALITAS,
            JUMLAH: param.JUMLAH,
            STATUS_SYNC: 'SYNC',
            SYNC_TIME: parseInt(getTodayDate('YYYYMMDDkkmmss')),
            INSERT_TIME: parseInt(convertTimestampToDate(param.INSERT_TIME, 'YYYYMMDDkkmmss')),
            INSERT_USER: param.INSERT_USER,
            UPDATE_USER: '',
            UPDATE_TIME: 0
        }
        this.uploadData(this.getAPIURL("EBCC-VALIDATION-DETAIL-INSERT"), data, 'ebccD', param.EBCC_VALIDATION_CODE_D);
    }

    hasDownload(item, total) {
        if (this.state.isFirstInstall) {
            if (total > 0) {
                this.fetchingMobileSync(item);
            } else {
                if (item !== 'finding') {
                    this.setState({
                        showButton: true,
                        showModal: true,
                        title: 'Gagal Download' + item,
                        message: 'Opps, Download bermasalah, silahkan coba lagi ya..',
                        icon: require('../Images/ic-sync-gagal.png')
                    })
                }

            }
        } else {
            this.fetchingMobileSync(item);
        }
    }

    _crudTM_Block(data) {
        let allData = TaskServices.getAllData('TM_BLOCK');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progress: i / data.simpan.length, totalDownload: data.simpan.length })
            }
            data.simpan.map(item => {
                TaskServices.saveData('TM_BLOCK', item);
                let countDataInsert = TaskServices.getTotalData('TM_BLOCK');
                this.setState({ valueDownload: countDataInsert })
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_BLOCK');
            this.setState({ progress: 1, valueDownload: countDataInsert, totalDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_BLOCK', item)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_BLOCK');
        this.hasDownload('hectare-statement/block', countDataInsert);
    }

    _crudTM_Afd(data) {
        let allData = TaskServices.getAllData('TM_AFD');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressAfd: i / data.simpan.length, totalAfdDownload: data.simpan.length })
            }
            data.simpan.map(item => {
                TaskServices.saveData('TM_AFD', item);
                let countDataInsert = TaskServices.getTotalData('TM_AFD');
                this.setState({ valueAfdDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_AFD');
            this.setState({ progressAfd: 1, valueAfdDownload: countDataInsert, totalAfdDownload: 0 })
        }

        //update
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_AFD', item)
                // let indexData = R.findIndex(R.propEq('WERKS_AFD_CODE', item.WERKS_AFD_CODE))(allData);
                //TaskServices.updateAfdeling(item, indexData)
            })
        }
        //hapus data
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_AFD', 'WERKS_AFD_CODE', item.WERKS_AFD_CODE);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_AFD');
        this.hasDownload('hectare-statement/afdeling', countDataInsert);
    }

    _crudTM_Region(data) {
        let allData = TaskServices.getAllData('TM_REGION');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressRegion: i / data.simpan.length, totalRegionDownload: data.simpan.length });
            }
            data.simpan.map(item => {
                TaskServices.saveData('TM_REGION', item);
                let countDataInsert = TaskServices.getTotalData('TM_REGION');
                this.setState({ valueRegionDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_REGION');
            this.setState({ progressRegion: 1, valueRegionDownload: countDataInsert, totalRegionDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_REGION', item)
                // let indexData = R.findIndex(R.propEq('REGION_CODE', item.REGION_CODE))(allData);
                //TaskServices.updateRegion(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_REGION', 'REGION_CODE', item.REGION_CODE);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_REGION');
        this.hasDownload('hectare-statement/region', countDataInsert);
    }

    _crudTM_Est(data) {
        let allData = TaskServices.getAllData('TM_EST');
        if (data.simpan.length > 0 && data) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressEst: i / data.simpan.length, totalEstDownload: data.simpan.length })
            }
            data.simpan.map(item => {
                TaskServices.saveData('TM_EST', item);
                let countDataInsert = TaskServices.getTotalData('TM_EST');
                this.setState({ valueEstDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_EST');
            this.setState({ progressEst: 1, valueEstDownload: countDataInsert, totalEstDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_EST', item)
                // let indexData = R.findIndex(R.propEq('WERKS', item.WERKS))(allData);
                //TaskServices.updateEstate(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_EST', 'WERKS', item.WERKS);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_EST');
        this.hasDownload('hectare-statement/est', countDataInsert);
    }

    _crudTM_LandUse(data) {
        let allData = TaskServices.getAllData('TM_LAND_USE');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressLandUse: i / data.simpan.length, totalLandUseDownload: data.simpan.length });
            }
            data.simpan.map(item => {
                TaskServices.saveData('TM_LAND_USE', item);
                let countDataInsert = TaskServices.getTotalData('TM_LAND_USE');
                this.setState({ valueLandUseDownload: countDataInsert });
            })
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_LAND_USE');
            this.setState({ progressLandUse: 1, valueLandUseDownload: countDataInsert, totalLandUseDownload: 0 });

        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_LAND_USE', item)
                // let indexData = R.findIndex(R.propEq('WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE))(allData);
                //TaskServices.updateLandUse(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_LAND_USE');
        this.hasDownload('hectare-statement/land-use', countDataInsert);
    }

    _crudTM_Comp(data) {
        let allData = TaskServices.getAllData('TM_COMP');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressComp: i / data.simpan.length, valueCompDownload: i, totalCompDownload: data.simpan.length });
            }

            data.simpan.map(item => {
                TaskServices.saveData('TM_COMP', item);
                let countDataInsert = TaskServices.getTotalData('TM_COMP');
                this.setState({ valueCompDownload: countDataInsert });
            })
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_COMP');
            this.setState({ progressComp: 1, valueCompDownload: countDataInsert, totalCompDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                TaskServices.updateByPrimaryKey('TM_COMP', item)
                // let indexData = R.findIndex(R.propEq('COMP_CODE', item.COMP_CODE))(allData);
                //TaskServices.updateComp(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteRecordByPK('TM_COMP', 'COMP_CODE', item.COMP_CODE);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_COMP');
        this.hasDownload('hectare-statement/comp', countDataInsert);
    }

    _crudTM_Content(data) {
        if (data.length > 0) {
            for (var i = 1; i <= data.length; i++) {
                this.setState({ progressContent: i / data.length, totalContentDownload: data.length });
            }
            data.map(item => {
                TaskServices.saveData('TM_CONTENT', item);
                let countDataInsert = TaskServices.getTotalData('TM_CONTENT');
                this.setState({ valueContentDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_CONTENT');
            this.setState({ progressContent: 1, valueContentDownload: countDataInsert, totalContentDownload: 0 });
        }

        let countDataInsert = TaskServices.getTotalData('TM_CONTENT');
        this.hasDownload('auth/content', countDataInsert);
    }

    _crudTM_Kriteria(data) {
        if (data.length > 0) {
            for (var i = 1; i <= data.length; i++) {
                this.setState({ progressKriteria: i / data.length, totalKriteriaDownload: data.length });
            }
            data.map(item => {
                TaskServices.saveData('TM_KRITERIA', item);
                let countDataInsert = TaskServices.getTotalData('TM_KRITERIA');
                this.setState({ valueKriteriaDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_KRITERIA');
            this.setState({ progressKriteria: 1, valueKriteriaDownload: countDataInsert, totalKriteriaDownload: 0 });
        }

        let countDataInsert = TaskServices.getTotalData('TM_KRITERIA');
        this.hasDownload('auth/kriteria', countDataInsert);
    }

    _crudTM_Category(data) {
        if (data.length > 0) {
            for (var i = 1; i <= data.length; i++) {
                this.setState({ progressCategory: i / data.length, totalCategoryDownload: data.length });
            }
            data.map(item => {
                TaskServices.saveData('TR_CATEGORY', item);
                let countDataInsert = TaskServices.getTotalData('TR_CATEGORY');
                this.setState({ valueCategoryDownload: countDataInsert });
                this.downloadImageCategory(item);
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TR_CATEGORY');
            this.setState({ progressCategory: 1, valueCategoryDownload: countDataInsert, totalCategoryDownload: 0 });
        }

        let countDataInsert = TaskServices.getTotalData('TR_CATEGORY');
        this.hasDownload('auth/category', countDataInsert);
    }


    _crudTM_Contact(data) {
        // let allData = TaskServices.getAllData('TR_CONTACT');
        if (data.length > 0) {
            for (var i = 1; i <= data.length; i++) {
                this.setState({ progressContact: i / data.length, totalContactDownload: data.length });
            }
            data.map(item => {
                TaskServices.saveData('TR_CONTACT', item);
                let countDataInsert = TaskServices.getTotalData('TR_CONTACT');

                this.setState({ valueContactDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TR_CONTACT');
            this.setState({ progressContact: 1, valueContactDownload: countDataInsert, totalContactDownload: 0 });
        }

        let countDataInsert = TaskServices.getTotalData('TR_CONTACT');
        this.hasDownload('auth/contact', countDataInsert);
    }

    _crudTM_Finding(data) {
        let allData = TaskServices.getAllData('TR_FINDING');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressFinding: i / data.simpan.length, totalFindingDownload: data.simpan.length });
            }
            data.simpan.map(item => {
                let newRating = item.RATING;
                let newItem = {
                    ...item,
                    RATING: newRating,
                    syncImage: "Y"
                };
                this._updateTR_Notif(newItem);
                TaskServices.saveData('TR_FINDING', newItem);
                let countDataInsert = TaskServices.getTotalData('TR_FINDING');
                this.setState({ valueFindingDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TR_FINDING');
            this.setState({ progressFinding: 1, valueFindingDownload: countDataInsert, totalFindingDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                let newRating = item.RATING ? item.RATING[0] : null;
                let newItem = { ...item, STATUS_SYNC: 'Y', RATING: newRating };
                // console.log("crudTM:" + JSON.stringify(newItem));
                this._updateTR_Notif(newItem);
                TaskServices.updateByPrimaryKey('TR_FINDING', newItem)
                // TaskServices.updateByPrimaryKey('TR_FINDING', item)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                let newRating = item.RATING ? item.RATING[0] : null;
                let newItem = { ...item, STATUS_SYNC: 'Y', RATING: newRating };
                this._updateTR_Notif(newItem);
                this.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
            });
        }

        this.downloadFindingComment();
    }

    _updateTR_Notif(data) {
        let today = moment(new Date());
        let newNotif = {
            NOTIFICATION_ID: data.FINDING_CODE + "$",
            NOTIFICATION_TIME: new Date(),
            NOTIFICATION_STATUS: 0,
            FINDING_UPDATE_TIME: data.UPDATE_TIME,
            FINDING_CODE: data.FINDING_CODE
        }
        if (data.UPDATE_USER == '') {
            if (data.ASSIGN_TO == this.state.user.USER_AUTH_CODE && data.INSERT_USER !== this.state.user.USER_AUTH_CODE) {
                //finding baru diasign ke user
                let newData = { ...newNotif, NOTIFICATION_TYPE: 0 }
                TaskServices.saveData('TR_NOTIFICATION', newData);
            }
            let createDate = moment(data.INSERT_TIME, "YYYYMMDDHHmmss");
            let diffDays = today.diff(createDate, 'days');
            if (diffDays > 6) {
                //belum di respon 7 hari setelah pembuatan
                if (data.ASSIGN_TO == this.state.user.USER_AUTH_CODE) {
                    //diasign tapi belum merespon
                    newNotif.NOTIFICATION_TYPE = 2;
                    TaskServices.saveData('TR_NOTIFICATION', newNotif);
                }
                // else if (data.INSERT_USER == this.state.user.USER_AUTH_CODE) {
                //     //membuat finding tapi belum mendapat respon
                //     newNotif.NOTIFICATION_TYPE = 3;
                //     TaskServices.saveData('TR_NOTIFICATION', newNotif);
                // }
            }
        }
        else if (data.INSERT_USER == this.state.user.USER_AUTH_CODE
            && data.INSERT_USER != data.ASSIGN_TO) {
            //     if(data.PROGRESS < 100){
            //         newNotif.NOTIFICATION_TYPE = 1;
            //         TaskServices.saveData('TR_NOTIFICATION', newNotif);
            //     }
            if (data.PROGRESS >= 100) {
                //Progress sudah selesai
                newNotif.NOTIFICATION_TYPE = 4;
                TaskServices.saveData('TR_NOTIFICATION', newNotif);
            }
            //     else {
            //         //terjadi update pada finding yang user buat
            //         newNotif.NOTIFICATION_TYPE = 1;
            //         TaskServices.saveData('TR_NOTIFICATION', newNotif);
            //     }
        }
        else if (data.ASSIGN_TO == this.state.user.USER_AUTH_CODE) {
            if (data.PROGRESS >= 100 && data.RATING_VALUE > 0) {
                //yang ditugaskan mendapat rating
                newNotif.NOTIFICATION_TYPE = 5;
                newNotif.NOTIFICATION_STATUS = 0;
                TaskServices.saveData('TR_NOTIFICATION', newNotif);
            }
        }
    }

    _updateTR_Notif_Comment(param) {
        let getFindingNgakak = TaskServices.findBy("TR_FINDING", "FINDING_CODE", param.FINDING_CODE).sorted('INSERT_TIME', true);
        if (getFindingNgakak !== undefined) {
            let newNotif = {
                NOTIFICATION_ID: param.FINDING_COMMENT_ID + "$" + param.USERNAME,
                NOTIFICATION_TIME: new Date(),
                FINDING_UPDATE_TIME: moment(param.INSERT_TIME, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
                FINDING_CODE: param.FINDING_CODE
            };
            //inbox comment kalo di assign/nge assign
            getFindingNgakak.map(data => {
                if (data.ASSIGN_TO == this.state.user.USER_AUTH_CODE || data.INSERT_USER == this.state.user.USER_AUTH_CODE) {
                    let newData = { ...newNotif, NOTIFICATION_TYPE: 6 }
                    TaskServices.saveData('TR_NOTIFICATION', newData);
                }
            })

            //inbox comment kalo di tagged
            param.TAGS.map((data) => {
                if (data.USER_AUTH_CODE === this.state.user.USER_AUTH_CODE) {
                    let newData = { ...newNotif, NOTIFICATION_TYPE: 7 }
                    TaskServices.saveData('TR_NOTIFICATION', newData);
                }
            })
        }
    }

    _crudTM_Finding_Image(data) {
        var dataSimpan = data.simpan;
        if (dataSimpan.length > 0) {
            for (var i = 1; i <= dataSimpan.length; i++) {
                this.setState({ progressFindingImage: i / dataSimpan.length, totalFindingImageDownload: dataSimpan.length });
            }
            dataSimpan.map(item => {
                // console.log('Finding Image : ', item);
                let tempItem = item;
                tempItem = {
                    ...tempItem,
                    STATUS_SYNC: "Y"
                }
                TaskServices.saveData('TR_IMAGE', tempItem);
                this._downloadImageFinding(item);
                let countDataInsert = TaskServices.getTotalData('TR_IMAGE');
                this.setState({ valueFindingImageDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TR_IMAGE');
            this.setState({ progressFindingImage: 1, valueFindingImageDownload: countDataInsert, totalFindingImageDownload: 0 })
        }

        let countDataInsert = TaskServices.getTotalData('TR_IMAGE');
        this.hasDownload('finding', countDataInsert);
    }

    _crudTM_Inspeksi_Param(data) {
        TaskServices.saveData('TM_TIME_TRACK', data);
        this.setState({ progressParamInspection: 1, valueParamInspection: 1, totalParamInspection: 1 });
    }
    _save_sync_log() {
        let today = new Date();
        let data = {
            SYNC_TIME_ID: today.getTime(),
            SYNC_TIME: today
        }
        TaskServices.saveData('TR_SYNC_LOG', data);
    }

    _reset_token(trueSync) {
        let allLoginData = TaskServices.findBy('TR_LOGIN', 'STATUS', 'LOGIN');
        if (allLoginData.length > 0) {
            let token = allLoginData[0].ACCESS_TOKEN;
            let serv = TaskServices.getAllData("TM_SERVICE")
                .filtered('API_NAME="AUTH-GENERATE-TOKEN" AND MOBILE_VERSION="' + ServerName.verAPK + '"')[0];

            fetch(serv.API_URL, {
                method: serv.METHOD,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    console.log('Response Reset Token : ', response)
                    return response.json();
                })
                .then((data) => {
                    if (trueSync) {
                        if (data.status) {
                            let newToken = data.data;
                            let allLoginData = TaskServices.findBy('TR_LOGIN', 'STATUS', 'LOGIN');
                            if (allLoginData.length > 0) {
                                let loginData = {
                                    ...allLoginData[0],
                                    ACCESS_TOKEN: newToken
                                };
                                var new_date = moment().add(7, 'days');
                                const date = { tanggal: new_date }
                                storeData('expiredToken', date);
                                TaskServices.updateByPrimaryKey('TR_LOGIN', loginData);
                                let newLoginData = TaskServices.findBy('TR_LOGIN', 'STATUS', 'LOGIN');
                                RNFS.copyFile(TaskServices.getPath(), 'file:///storage/emulated/0/MobileInspection/data.realm');
                                this.setState({
                                    showModal: true,
                                    title: 'Sync Berhasil',
                                    message: 'Yeay sinkronisasi udah selesai!',
                                    icon: require('../Images/ic-sync-berhasil.png'),
                                    showButton: true,
                                    finishedSync: true,
                                    pickedWerks: (newLoginData[0].CURR_WERKS ? true : false)
                                });
                            }
                            else {
                                this.setState({
                                    showModal: true,
                                    title: 'Sync Gagal',
                                    message: 'Gagal mendapatkan informasi user',
                                    icon: require('../Images/ic-sync-gagal.png'),
                                    showButton: true
                                });
                            }
                        }
                        else {
                            this.setState({
                                showModal: true,
                                title: 'Sync Gagal',
                                message: 'Gagal memperbarui token',
                                icon: require('../Images/ic-sync-gagal.png'),
                                showButton: true
                            });
                        }
                    }
                    else {
                        this.setState({
                            showButton: true,
                            showModal: true,
                            title: 'Tidak Sinkron',
                            message: 'Jam di HP kamu salah',
                            icon: require('../Images/ic-sync-gagal.png')
                        })
                    }
                })
                .catch((data) => {
                    console.log("catch MY OWN", data)
                });
        }
        else {
            this.setState({
                showModal: true,
                title: 'Sync Gagal',
                message: 'Anda belum login',
                icon: require('../Images/ic-sync-gagal.png'),
                showButton: true
            });
        }
    }

    _crudTM_Kualitas(data) {
        let allData = TaskServices.getAllData('TM_KUALITAS');
        if (data.simpan.length > 0) {
            for (var i = 1; i <= data.simpan.length; i++) {
                this.setState({ progressKualitas: i / data.simpan.length, totalKualitas: data.simpan.length });
            }
            data.simpan.map(item => {
                item.ID_KUALITAS = item.ID_KUALITAS.toString();
                TaskServices.saveData('TM_KUALITAS', item);
                let countDataInsert = TaskServices.getTotalData('TM_KUALITAS');
                this.setState({ valueKualitas: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_KUALITAS');
            this.setState({ progressKualitas: 1, valueKualitas: countDataInsert, totalKualitas: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                item.ID_KUALITAS = item.ID_KUALITAS.toString();
                TaskServices.updateByPrimaryKey('TM_KUALITAS', item)
                // let indexData = R.findIndex(R.propEq('ID_KUALITAS', item.ID_KUALITAS))(allData);
                //TaskServices.updateFindingDownload(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                item.ID_KUALITAS = item.ID_KUALITAS.toString();
                this.deleteRecordByPK('TM_KUALITAS', 'ID_KUALITAS', item.ID_KUALITAS);
            });
        }

        let countDataInsert = TaskServices.getTotalData('TM_KUALITAS');
        this.hasDownload('ebcc/kualitas', countDataInsert);
    }

    //download image
    async _downloadImageFinding(data) {
        let isExist = await RNFS.exists(`${dirPhotoTemuan}/${data.IMAGE_NAME}`)
        if (!isExist) {
            var url = data.IMAGE_URL;
            // console.log('URL Image : ', url)
            const { config, fs } = RNFetchBlob
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
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    async downloadImageCategory(data) {
        let isExist = await RNFS.exists(`${dirPhotoKategori}/${data.ICON}`)
        if (!isExist) {
            var url = data.ICON_URL;
            const { config, fs } = RNFetchBlob
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
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    resetSagas() {
        this.props.resetServerTime();
        // this.props.resetFinding();
        this.props.resetFindingImage();
        this.props.resetBlock();
        this.props.resetAfd();
        this.props.resetRegion();
        this.props.resetEst();
        this.props.resetLandUse();
        this.props.resetComp();
        this.props.resetContent();
        this.props.resetKriteria();
        this.props.resetCategory();
        this.props.resetContact();
        this.props.resetParamTrack();
        this.props.resetKualitas();
    }

    async _onSync() {
        this._deleteFinding();
        // DELETE_FINDING();
        this.deleteEbccHeader();
        this.deleteEbccDetail();
        // this.deleteGenbaSelected();
        // this.deleteGenbaInspection();
        // Gani

        //comment
        this.resetSagas();

        this.setState({

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

            fetchLocation: false,
            isBtnEnable: false,
            uploadErrorFlag: false,
        });

        //Upload Image
        await uploadImage()
            .then((response) => {
                if (response.syncStatus) {
                    this.SyncUploadFinding()
                        .then(() => { });
                    this.SyncUploadInspection()
                        .then(() => { });
                    this.SyncUploadEBCC()
                        .then(() => { })

                    // this.kirimEbccHeader();
                    // this.kirimEbccDetail();

                    this.setState({
                        progressUploadImage: 1,
                        valueImageUpload: response.uploadCount,
                        totalImagelUpload: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: true,
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
                        uploadErrorFlag: true,
                        progressUploadImageUser: 1,
                        valueImageUserUpload: 0,
                        totalImageUserUpload: 0
                    });
                }
            });

        //Upload Finding Comment
        // await uploadFindingComment()
        // this.SyncInspection()
        //     .then((response) => { });

        uploadGenba()
            .then((response) => {
                if (response.syncStatus) {
                    this.setState({
                        progressFindingCommentData: 1,
                        valueFindingCommentDataUpload: response.uploadCount,
                        totalFindingCommentDataUpload: response.totalCount
                    });
                }
                else {
                    //error
                    this.setState({
                        uploadErrorFlag: true,
                        progressFindingCommentData: 1,
                        valueFindingCommentDataUpload: 0,
                        totalFindingCommentDataUpload: 0
                    });
                }
            });

        this.downloadWeeklySummary();

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
                        //cara redux saga
                        // this.props.findingRequest();
                        // this.props.blockRequest();
                        this.syncDownload()
                    }
                }
                else {
                    this.setState({
                        showButton: true,
                        showModal: true,
                        title: 'Sync Putus (Upload)',
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
                        uploadErrorFlag: true,
                        progressFindingData: 1,
                        valueFindingDataUpload: 0,
                        totalFindingDataUpload: 0,
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
                        uploadErrorFlag: true,
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
                        uploadErrorFlag: true,
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
                        uploadErrorFlag: true,
                        progressInspectionTrack: 1,
                        valueInspectionTrack: 0,
                        totalInspectionTrack: 0
                    });
                }
            });

        uploadGenba()
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
                        uploadErrorFlag: true,
                        progressGenbaInspection: 1,
                        valueGenbaInspection: 0,
                        totalGenbaInspection: 0
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
                        uploadErrorFlag: true,
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
                        uploadErrorFlag: true,
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
        let model = {
            INSERT_USER: this.state.user.USER_AUTH_CODE.toString(),
            APK_VERSION: deviceVersion,
            IMEI: IMEI.getImei().toString(),
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

    fetchingMobileSync(param) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        let api = this.getAPIURL("AUTH-SYNC");
        fetch(api.API_URL, {
            method: api.METHOD,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.ACCESS_TOKEN}`
            },
            body: JSON.stringify({ TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'), TABEL_UPDATE: param })
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // if(data.status){
                //     if(param == 'finding'){
                //         this.setState({ showButton: true });
                //         alert('Sync Data Selesai')
                //     }
                // }else{
                //     alert('Gagal proses log mobile '+param)
                // }
            })
    }

    componentWillReceiveProps(newProps) {
        //Gani
        let errorFlag = false;
        if (newProps.finding.error) {
            errorFlag = true;
        }
        else if (newProps.findingImage.error) {
            errorFlag = true;
        }
        else if (newProps.block.error) {
            errorFlag = true;
        }
        else if (newProps.afd.error) {
            errorFlag = true;
        }
        else if (newProps.region.error) {
            errorFlag = true;
        }
        else if (newProps.est.error) {
            errorFlag = true;
        }
        else if (newProps.landUse.error) {
            errorFlag = true;
        }
        else if (newProps.comp.error) {
            errorFlag = true;
        }
        else if (newProps.content.error) {
            errorFlag = true;
        }
        else if (newProps.kriteria.error) {
            errorFlag = true;
        }
        else if (newProps.category.error) {
            errorFlag = true;
        }
        else if (newProps.contact.error) {
            errorFlag = true;
        }
        else if (newProps.paramTrack.error) {
            errorFlag = true;
        }
        else if (newProps.kualitas.error) {
            errorFlag = true;
        }
        if (errorFlag) {
            let newFinding = Object.assign({}, newProps.finding);
            newFinding.error = false;
            let newParamTrack = Object.assign({}, newProps.paramTrack);
            newParamTrack.error = false;
            let newContact = Object.assign({}, newProps.contact);
            newContact.error = false;
            let newCategory = Object.assign({}, newProps.category);
            newCategory.error = false;
            let newKriteria = Object.assign({}, newProps.kriteria);
            newKriteria.error = false;
            let newContent = Object.assign({}, newProps.content);
            newContent.error = false;
            let newComp = Object.assign({}, newProps.comp);
            newComp.error = false;
            let newLandUse = Object.assign({}, newProps.landUse);
            newLandUse.error = false;
            let newEst = Object.assign({}, newProps.est);
            newEst.error = false;
            let newRegion = Object.assign({}, newProps.region);
            newRegion.error = false;
            let newAfd = Object.assign({}, newProps.afd);
            newAfd.error = false;
            let newBlock = Object.assign({}, newProps.block);
            newBlock.error = false;
            let newFindingImage = Object.assign({}, newProps.findingImage);
            newFindingImage.error = false;
            let newKualitas = Object.assign({}, newProps.kualitas);
            newKualitas.error = false;
            this.setState({
                showButton: true,
                showModal: true,
                title: 'Sync Putus',
                message: 'Yaaah jaringannya mati, coba Sync lagi yaa.',
                icon: require('../Images/ic-sync-gagal.png')
            });
            this.resetSagas()
            return;
        }

        if (newProps.finding.fetchingFinding !== null && !newProps.finding.fetchingFinding) {
            let dataJSON = newProps.finding.finding;
            if (dataJSON !== null) {
                this._crudTM_Finding(dataJSON);
            }
            this.props.resetFinding()
            this.props.findingImageRequest()
        }

        if (newProps.findingImage.fetchingFindingImage !== null && !newProps.findingImage.fetchingFindingImage) {
            let dataJSON = newProps.findingImage.findingImage;
            if (dataJSON !== null) {
                this._crudTM_Finding_Image(dataJSON);
            }
            this.props.resetFindingImage();
        }

        if (newProps.block.fetchingBlock !== null && !newProps.block.fetchingBlock) {
            let dataJSON = newProps.block.block;
            if (dataJSON !== null) {
                this._crudTM_Block(dataJSON);
            }
            this.props.resetBlock();
            this.props.afdRequest();
        }

        if (newProps.afd.fetchingAfd !== null && !newProps.afd.fetchingAfd) {
            let dataJSON = newProps.afd.afd;
            if (dataJSON !== null) {
                this._crudTM_Afd(dataJSON);
            }
            this.props.resetAfd();
            this.props.regionRequest();
        }

        if (newProps.region.fetchingRegion !== null && !newProps.region.fetchingRegion) {
            let dataJSON = newProps.region.region;
            if (dataJSON !== null) {
                this._crudTM_Region(dataJSON);
            }
            this.props.resetRegion();
            this.props.estRequest();
        }

        if (newProps.est.fetchingEst !== null && !newProps.est.fetchingEst) {
            let dataJSON = newProps.est.est;
            this.setState({ downloadEst: true });
            if (dataJSON !== null) {
                this._crudTM_Est(dataJSON);
            }
            this.props.resetEst()
            this.props.landUseRequest();
        }

        if (newProps.landUse.fetchingLandUse !== null && !newProps.landUse.fetchingLandUse) {
            let dataJSON = newProps.landUse.landUse;
            this.setState({ downloadLandUse: true });
            if (dataJSON !== null) {
                this._crudTM_LandUse(dataJSON);
            }
            this.props.resetLandUse();
            this.props.compRequest();
        }

        if (newProps.comp.fetchingComp !== null && !newProps.comp.fetchingComp) {
            let dataJSON = newProps.comp.comp;
            if (dataJSON !== null) {
                this._crudTM_Comp(dataJSON);
            }
            this.props.resetComp();
            this.props.contentRequest();
        }

        if (newProps.content.fetchingContent !== null && !newProps.content.fetchingContent) {
            let dataJSON = newProps.content.content;
            if (dataJSON !== null) {
                this._crudTM_Content(dataJSON);
            }
            this.props.resetContent();
            // this.props.contentLabelRequest();
            this.props.kriteriaRequest();

        }

        if (newProps.kriteria.fetchingKriteria !== null && !newProps.kriteria.fetchingKriteria) {
            let dataJSON = newProps.kriteria.kriteria;
            if (dataJSON !== null) {
                this._crudTM_Kriteria(dataJSON);
            }
            this.props.resetKriteria();
            this.props.categoryRequest();
        }

        if (newProps.category.fetchingCategory !== null && !newProps.category.fetchingCategory) {
            let dataJSON = newProps.category.category;
            if (dataJSON !== null) {
                this._crudTM_Category(dataJSON);
            }
            this.props.resetCategory();
            this.props.contactRequest();
        }

        if (newProps.contact.fetchingContact !== null && !newProps.contact.fetchingContact) {
            let dataJSON = newProps.contact.contact.data;
            if (dataJSON !== null) {
                this._crudTM_Contact(dataJSON);
            }
            this.props.resetContact();
            this.props.paramTrackRequest();
        }

        if (newProps.paramTrack.fetchingParamTrack !== null && !newProps.paramTrack.fetchingParamTrack) {
            let dataJSON = newProps.paramTrack.paramTrack;
            if (dataJSON !== null) {
                this._crudTM_Inspeksi_Param(dataJSON);
            }
            this.props.resetParamTrack();
            this.props.kualitasRequest();

        }

        if (newProps.kualitas.fetchingKualitas !== null && !newProps.kualitas.fetchingKualitas) {
            let dataJSON = newProps.kualitas.kualitas;
            if (dataJSON !== null) {
                this._crudTM_Kualitas(dataJSON);
            }
            this.props.resetKualitas();
            this.props.serverTimeRequest();
        }
        if (newProps.serverTime.fetchingServerTime !== null && !newProps.serverTime.fetchingServerTime) {
            let dataJSON = newProps.serverTime.serverTime;
            console.log('Data Servertime : ', dataJSON);
            let trueSync = true;
            if (dataJSON !== null) {
                let serverTime = new Date(dataJSON.time.replace(' ', 'T') + "+07:00");
                let localTime = new Date();
                serverTime.setMinutes(0, 0, 0);
                localTime.setMinutes(0, 0, 0);
                if (serverTime.getTime() !== localTime.getTime()) {
                    trueSync = false;
                }
            }
            this._reset_token(trueSync);
            this.props.resetServerTime();
            this._save_sync_log();
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
                    <Text style={{ color: Colors.colorWhite, fontSize: 12 }}>Kamu belum pernah melakukan sync data</Text>
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
                            <TouchableOpacity disabled={this.state.isBtnEnable} style={styles.button}
                                onPress={() => { this.setState({ showButton: false }); this.insertLink() }}>
                                <Text style={styles.buttonText}>Sync</Text>
                            </TouchableOpacity>
                        </View>}

                        {/* Section Upload by Aminju */}
                        <Text style={{ fontSize: 14, color: 'blue', marginTop: 24 }}>UPLOAD</Text>
                        <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                        <ProgressSync
                            title={'IMAGE'}
                            value={this.state.valueImageUpload}
                            total={this.state.totalImagelUpload}
                            progress={this.state.progressUploadImage} />

                        <ProgressSync
                            title={'IMAGE USER'}
                            value={this.state.valueImageUserUpload}
                            total={this.state.totalImageUserUpload}
                            progress={this.state.progressUploadImageUser} />

                        <ProgressSync
                            title={'INSPEKSI TRACK'}
                            value={this.state.valueInspectionTrack}
                            total={this.state.totalInspectionTrack}
                            progress={this.state.progressInspectionTrack} />

                        <ProgressSync
                            title={'INSPEKSI HEADER'}
                            value={this.state.valueInspeksiHeaderUpload}
                            total={this.state.totalInspeksiHeaderUpload}
                            progress={this.state.progressInspeksiHeader} />

                        <ProgressSync
                            title={'INSPEKSI DETAIL'}
                            value={this.state.valueInspeksiDetailUpload}
                            total={this.state.totalInspeksiDetailUpload}
                            progress={this.state.progressInspeksiDetail} />

                        <ProgressSync
                            title={'FINDING DATA'}
                            value={this.state.valueFindingDataUpload}
                            total={this.state.totalFindingDataUpload}
                            progress={this.state.progressFindingData} />

                        <ProgressSync
                            title={'FINDING COMMENT'}
                            value={this.state.valueFindingCommentDataUpload}
                            total={this.state.totalFindingCommentDataUpload}
                            progress={this.state.progressFindingCommentData} />

                        <ProgressSync
                            title={'SAMPLING EBCC HEADER'}
                            value={this.state.valueEbcc}
                            total={this.state.totalEbcc}
                            progress={this.state.progressEbcc} />

                        <ProgressSync
                            title={'SAMPLING EBCC DETAIL'}
                            value={this.state.valueEbccDetail}
                            total={this.state.totalEbccDetail}
                            progress={this.state.progressEbccDetail} />

                        <ProgressSync
                            title={'GENBA INSPECTION'}
                            value={this.state.valueGenbaInspection}
                            total={this.state.totalGenbaInspection}
                            progress={this.state.progressGenbaInspection} />

                        {/* Section Download by Aminju */}
                        <Text style={{ fontSize: 14, color: Colors.tintColor, marginTop: 16 }}>DOWNLOAD</Text>
                        <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                        <ProgressSync
                            title={'FINDING'}
                            color={Colors.brand}
                            value={this.state.valueFindingDownload}
                            total={this.state.totalFindingDownload}
                            progress={this.state.progressFinding} />

                        <ProgressSync
                            title={'FINDING IMAGE'}
                            color={Colors.brand}
                            value={this.state.valueFindingImageDownload}
                            total={this.state.totalFindingImageDownload}
                            progress={this.state.progressFindingImage} />

                        <ProgressSync
                            title={'FINDING COMMENT'}
                            color={Colors.brand}
                            value={this.state.valueFindingCommentDownload}
                            total={this.state.totalFindingCommentDownload}
                            progress={this.state.progressFindingCommentDownload} />

                        <ProgressSync
                            title={'BLOCK'}
                            color={Colors.brand}
                            value={this.state.valueDownload}
                            total={this.state.totalDownload}
                            progress={this.state.progress} />

                        <ProgressSync
                            title={'AFD'}
                            color={Colors.brand}
                            value={this.state.valueAfdDownload}
                            total={this.state.totalAfdDownload}
                            progress={this.state.progressAfd} />

                        <ProgressSync
                            title={'REGION'}
                            color={Colors.brand}
                            value={this.state.valueRegionDownload}
                            total={this.state.totalRegionDownload}
                            progress={this.state.progressRegion} />

                        <ProgressSync
                            title={'ESTATE'}
                            color={Colors.brand}
                            value={this.state.valueEstDownload}
                            total={this.state.totalEstDownload}
                            progress={this.state.progressEst} />

                        <ProgressSync
                            title={'LAND USE'}
                            color={Colors.brand}
                            value={this.state.valueLandUseDownload}
                            total={this.state.totalLandUseDownload}
                            progress={this.state.progressLandUse} />

                        <ProgressSync
                            title={'COMP'}
                            color={Colors.brand}
                            value={this.state.valueCompDownload}
                            total={this.state.totalCompDownload}
                            progress={this.state.progressComp} />

                        <ProgressSync
                            title={'CONTENT'}
                            color={Colors.brand}
                            value={this.state.valueContentDownload}
                            total={this.state.totalContentDownload}
                            progress={this.state.progressContent} />

                        <ProgressSync
                            title={'KRITERIA'}
                            color={Colors.brand}
                            value={this.state.valueKriteriaDownload}
                            total={this.state.totalKriteriaDownload}
                            progress={this.state.progressKriteria} />

                        <ProgressSync
                            title={'CATEGORY'}
                            color={Colors.brand}
                            value={this.state.valueCategoryDownload}
                            total={this.state.totalCategoryDownload}
                            progress={this.state.progressCategory} />

                        <ProgressSync
                            title={'CONTACT'}
                            color={Colors.brand}
                            value={this.state.valueContactDownload}
                            total={this.state.totalContactDownload}
                            progress={this.state.progressContact} />

                        <ProgressSync
                            title={'PARAMATER TRACK INSPECTION'}
                            color={Colors.brand}
                            value={this.state.valueParamInspection}
                            total={this.state.totalParamInspection}
                            progress={this.state.progressParamInspection} />

                        <ProgressSync
                            title={'TM KUALITAS'}
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

const mapStateToProps = state => {
    return {
        serverTime: state.serverTime,
        region: state.region,
        block: state.block,
        afd: state.afd,
        est: state.est,
        landUse: state.landUse,
        comp: state.comp,
        content: state.content,
        contentLabel: state.contentLabel,
        kriteria: state.kriteria,
        contact: state.contact,
        finding: state.finding,
        category: state.category,
        findingImage: state.findingImage,
        inspeksi: state.inspeksi,
        findingUpload: state.findingUpload,
        paramTrack: state.paramTrack,
        kualitas: state.kualitas
    };
};

const mapDispatchToProps = dispatch => {
    return {
        serverTimeRequest: () => dispatch(ServerTimeAction.serverTimeRequest()),
        regionRequest: () => dispatch(RegionAction.regionRequest()),
        blockRequest: () => dispatch(BlockAction.blockRequest()),
        // blockPost: obj => dispatch(BlockAction.blockPost(obj)),
        afdRequest: () => dispatch(AfdAction.afdRequest()),
        // afdPost: obj => dispatch(AfdAction.afdPost(obj)),
        estRequest: () => dispatch(EstAction.estRequest()),
        // estPost: obj => dispatch(EstAction.estPost(obj)),
        kriteriaRequest: () => dispatch(KriteriaAction.kriteriaRequest()),
        // kriteriaPost: obj => dispatch(KriteriaAction.kriteriaPost(obj)),
        userAuthRequest: () => dispatch(UserAuthAction.userAuthRequest()),
        // userAuthPost: obj => dispatch(UserAuthAction.userAuthPost(obj)),
        landUseRequest: () => dispatch(LandUseAction.landUseRequest()),
        // landUsePost: obj => dispatch(LandUseAction.landUsePost(obj)),
        compRequest: () => dispatch(CompAction.compRequest()),
        // compPost: obj => dispatch(CompAction.compPost(obj)),
        contentRequest: () => dispatch(ContentAction.contentRequest()),
        // contentPost: obj => dispatch(ContentAction.contentPost(obj)),
        contentLabelRequest: () => dispatch(ContentLabelAction.contentLabelRequest()),
        // contentLabelPost: obj => dispatch(ContentLabelAction.contentLabelPost(obj)),
        contactRequest: () => dispatch(ContactAction.contactRequest()),
        categoryRequest: () => dispatch(CategoryAction.categoryRequest()),
        // findingRequest: () => dispatch(FindingAction.findingRequest()),
        // findingPost: obj => dispatch(FindingAction.findingPost(obj)),
        findingImageRequest: () => dispatch(FindingImageAction.findingImageRequest()),
        // inspeksiPostHeader: obj => dispatch(InspeksiAction.inspeksiPostHeader(obj)),
        // inspeksiPostDetail: obj => dispatch(InspeksiAction.inspeksiPostDetail(obj)),
        // inspeksiPostTrackingPath: obj => dispatch(InspeksiAction.inspeksiPostTrackingPath(obj)),
        paramTrackRequest: obj => dispatch(ParamTrackAction.paramTrackRequest(obj)),
        // findingPostData: obj => dispatch(FindingUploadAction.findingPostData(obj)),
        // tmPost: obj => dispatch(TMobileAction.tmPost(obj)),
        kualitasRequest: obj => dispatch(KualitasAction.kualitasRequest(obj)),

        resetServerTime: () => dispatch(ServerTimeAction.resetServerTime()),
        resetBlock: () => dispatch(BlockAction.resetBlock()),
        resetAfd: () => dispatch(AfdAction.resetAfd()),
        resetRegion: () => dispatch(RegionAction.resetRegion()),
        resetEst: () => dispatch(EstAction.resetEst()),
        resetLandUse: () => dispatch(LandUseAction.resetLandUse()),
        resetComp: () => dispatch(CompAction.resetComp()),
        resetContent: () => dispatch(ContentAction.resetContent()),
        resetContentLabel: () => dispatch(ContentLabelAction.resetContentLabel()),
        resetKriteria: () => dispatch(KriteriaAction.resetKriteria()),
        resetCategory: () => dispatch(CategoryAction.resetCategory()),
        resetContact: () => dispatch(ContactAction.resetContact()),
        resetParamTrack: () => dispatch(ParamTrackAction.resetParamTrack()),
        // resetFinding: () => dispatch(FindingAction.resetFinding()),
        resetFindingImage: () => dispatch(FindingImageAction.resetFindingImage()),
        resetKualitas: () => dispatch(KualitasAction.resetKualitas())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncScreen);

const styles = StyleSheet.create({
    section: {
        justifyContent: 'center',
        padding: 16,
        height: 140,
        flexDirection: 'row',
        borderWidth: 0.2,
        borderRadius: 5,
        borderColor: Colors.tintColor,

    },
    sectionRow: {
        flex: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignSelf: 'center'
    },
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

