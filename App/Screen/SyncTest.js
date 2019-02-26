import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, NetInfo, Platform } from 'react-native'
import { Container, Content } from 'native-base'
import * as Progress from 'react-native-progress';
import Colors from '../Constant/Colors';
import moment from 'moment';

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
import InspeksiAction from '../Redux/InspeksiRedux'
import FindingUploadAction from '../Redux/FindingUploadRedux'
import TMobileAction from '../Redux/TMobileRedux'
import ParamTrackAction from '../Redux/ParamTrackRedux'
import { ProgressDialog } from 'react-native-simple-dialogs';
import { dirPhotoKategori, dirPhotoTemuan } from '../Lib/dirStorage';
import { connect } from 'react-redux';
import R from 'ramda'
import RNFetchBlob from 'rn-fetch-blob'
import TaskServices from '../Database/TaskServices'
import { getTodayDate, convertTimestampToDate } from '../Lib/Utils';
import ModalAlert from '../Component/ModalAlert';

var RNFS = require('react-native-fs');
const link = 'http://149.129.245.230:3008/api/';
const heightProgress = 5;
const colorProgress = '#D5D5D5'

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
        this.state = {
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
            progressInspeksiHeader: 0,
            progressInspeksiDetail: 0,
            progressUploadImage: 0,
            progressFindingData: 0,
            progressInspectionTrack: 0,
            progressParamInspection: 0,
            indeterminate: false,
            downloadInspeksiParam: false,
            fetchLocation: false,
            isBtnEnable: false,
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
            valueCategoryDownload: '0',
            totalCategoryDownload: '0',
            valueContactDownload: '0',
            totalContactDownload: '0',
            valueFindingImageDownload: '0',
            totalFindingImageDownload: '0',
            valueInspeksiHeaderUpload: '0',
            totalInspeksiHeaderUpload: '0',
            valueInspeksiDetailUpload: '0',
            totalInspeksiDetailUpload: '0',
            valueFindingDataUpload: '0',
            totalFindingDataUpload: '0',
            valueImageUpload: '0',
            totalImagelUpload: '0',
            valueImageUpload: '0',
            totalImagelUpload: '0',
            valueInspectionTrack: '0',
            totalInspectionTrack: '0',
            valueParamInspection: '0',
            totalParamInspection: '0',

            dataFinding: [],
            dataInspeksi: [],
            dataInspeksiDetail: [],
            dataBarisInspeksi: [],
            dataTrack: [],

            showButton: true,
            blockInspectionCodes: [],
            isFirstInstall: false,

            //Add Modal Alert by Aminju 
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: '',
            findingCode: [],
            isDeleteImage: false
        }
    }

    _deleteFinding() {
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
        var data = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
        var now = moment(new Date());
        if (data != undefined) {
            for (var i = 0; i > data.length; i++) {
                if (data[i].INSERT_TIME !== '') {
                    let insertTime = data[i].INSERT_TIME;
                    if (insertTime.includes(' ')) {
                        insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                    }
                    var diff = moment(new Date(insertTime)).diff(now, 'day');
                    if (diff < -7) {
                        this.deleteImage(data[i].BLOCK_INSPECTION_CODE);
                        this.deleteDetailInspeksi(data[i].BLOCK_INSPECTION_CODE)
                        this.deleteData('TR_BLOCK_INSPECTION_H', 'BLOCK_INSPECTION_CODE', data[i].BLOCK_INSPECTION_CODE);
                        this.deleteData('TR_BARIS_INSPECTION', 'ID_INSPECTION', data[i].ID_INSPECTION);
                    }
                }
            }
        }
    }

    async deleteImage(FINDING_CODE) {
        let dataImage = TaskServices.findBy('TR_IMAGE', 'TR_CODE', FINDING_CODE.FINDING_CODE);
        if (dataImage != undefined) {
            this.deleteImageFile(dataImage, FINDING_CODE);
        }
    }

    deleteDetailInspeksi(blokInsCode) {
        let data = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', blokInsCode);
        if (data !== undefined) {
            data.map(item => {
                this.deleteData('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE_D', item.BLOCK_INSPECTION_CODE_D);
            });
        }
    }

    deleteDataFinding(table, value) {
        console.log('Value : ' + value)
        TaskServices.deleteRecordPrimaryKey(table, value)
    }

    deleteDataImage(table, value) {
        console.log('Value : ' + value)
        TaskServices.deleteRecordPrimaryKey(table, value)
    }

    deleteData(table, whereClause, value) {
        console.log('Masuk Delete Data : ' + JSON.stringify(data))
        let allData = TaskServices.getAllData(table);
        if (allData !== undefined && allData.length > 0) {
            let indexData = R.findIndex(R.propEq(whereClause, value))(allData);
            console.log('Index Delete : ' + indexData);
            if (indexData >= 0) {
                TaskServices.deleteRecord(table, indexData);
            }
        }
    }

    async deleteImageFile(image, FINDING_CODE) {

        const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
        for (let i = 0; i < image.length; i++) {

            const PATH = `${FILE_PREFIX}${dirPhotoTemuan}/${image[i].IMAGE_NAME}`;
            RNFS.exists(PATH)
                .then((result) => {
                    console.log("File Exist : ", result);
                    if (result) {
                        return RNFS.unlink(PATH)
                            .then(() => {
                                console.log('FILE DELETED');
                                // this.setState({ isDeleteImage: true });
                                TaskServices.deleteRecordPrimaryKey('TR_FINDING', FINDING_CODE)
                            })
                            // `unlink` will throw an error, if the item to unlink does not exist
                            .catch((err) => {
                                console.log(err.message);
                            });
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

    //upload
    loadDataFinding() {
        let countData = TaskServices.getAllData('TR_FINDING');
        var query = countData.filtered('STATUS_SYNC = "N"');
        countData = query;
        this.setState({ progressFindingData: 1, valueFindingDataUpload: countData.length, totalFindingDataUpload: countData.length });
        if (countData.length > 0) {
            for (var i = 0; i < countData.length; i++) {
                this.kirimFinding(countData[i]);
            }
        } else {
            this.setState({ progressFindingData: 1, valueFindingDataUpload: 0, totalFindingDataUpload: 0 });
        }
    }

    loadData() {
        let dataHeader = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
        var query = dataHeader.filtered('STATUS_SYNC = "N"');
        let countData = query;

        this.setState({
            progressInspeksiHeader: 1,
            valueInspeksiHeaderUpload: countData.length,
            totalInspeksiHeaderUpload: countData.length,
        });

        if (countData.length > 0) {
            for (var i = 0; i < countData.length; i++) {
                if (!this.state.dataBarisInspeksi.includes(countData[i].ID_INSPECTION)) {
                    this.state.dataBarisInspeksi.push(countData[i].ID_INSPECTION)
                }
                this.state.blockInspectionCodes.push(countData[i].BLOCK_INSPECTION_CODE)
                this.kirimInspeksiHeader(countData[i]);
            }
        } else {
            this.setState({
                progressInspeksiHeader: 1,
                valueInspeksiHeaderUpload: 0,
                totalInspeksiHeaderUpload: 0,
                progressInspeksiDetail: 1,
                valueInspeksiDetailUpload: 0,
                totalInspeksiDetailUpload: 0
            });
        }

    }

    loadDataDetailInspeksi() {
        let data = TaskServices.getAllData('TR_BLOCK_INSPECTION_D');
        data = data.filtered('STATUS_SYNC = "N"');
        this.setState({
            progressInspeksiDetail: 1, valueInspeksiDetailUpload: data.length, totalInspeksiDetailUpload: data.length,
        });
        if (data.length > 1) {
            for (var i = 0; i < data.length; i++) {
                this.kirimInspeksiDetail(data[i]);
            }
        } else {
            this.setState({ progressInspeksiDetail: 1, valueInspeksiDetailUpload: 0, totalInspeksiDetailUpload: 0 });
        }
    }

    loadDataInspectionTrack() {
        let dataHeader = TaskServices.getAllData('TM_INSPECTION_TRACK');
        var query = dataHeader.filtered('STATUS_SYNC = "N"');
        let countData = query;
        this.setState({ progressInspectionTrack: 1, valueInspectionTrack: countData.length, totalInspectionTrack: countData.length });
        if (countData.length > 0) {
            for (var i = 0; i < countData.length; i++) {
                this.kirimInspectionTrack(countData[i]);
            }
        } else {
            this.setState({ progressInspectionTrack: 1, valueInspectionTrack: 0, totalInspectionTrack: 0 });
        }


    }

    async kirimImage() {
        try {
            const user = TaskServices.getAllData('TR_LOGIN')[0];
            let all = TaskServices.getAllData('TR_IMAGE')
            var dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = 'N'`);
            if (all !== undefined && dataImage !== undefined) {
                for (var i = 0; i < dataImage.length; i++) {
                    let model = dataImage[i]
                    RNFS.exists(`file://${model.IMAGE_PATH_LOCAL}`).
                        then((exists) => {
                            console.log(exists)
                            console.log(model.IMAGE_PATH_LOCAL)
                            if (exists) {
                                var data = new FormData();
                                let idxOrder = null;
                                data.append('IMAGE_CODE', model.IMAGE_CODE)
                                data.append('IMAGE_PATH_LOCAL', model.IMAGE_PATH_LOCAL)
                                data.append('TR_CODE', model.TR_CODE)
                                data.append('STATUS_IMAGE', model.STATUS_IMAGE)
                                data.append('STATUS_SYNC', 'Y')
                                data.append('SYNC_TIME', getTodayDate('YYYYMMDDHHmmss'))
                                data.append('INSERT_TIME', convertTimestampToDate(model.INSERT_TIME, 'YYYYMMDDHHmmss'))
                                data.append('INSERT_USER', model.INSERT_USER)
                                data.append('FILENAME', {
                                    uri: `file://${model.IMAGE_PATH_LOCAL}`,
                                    type: 'image/jpeg',
                                    name: model.IMAGE_NAME,
                                });
                                let indexData = R.findIndex(R.propEq('IMAGE_CODE', model.IMAGE_CODE))(all);
                                idxOrder = indexData
                                console.log(JSON.stringify(data))
                                const url = "http://149.129.245.230:3012/image/upload-file/"
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Cache-Control': 'no-cache',
                                        Accept: 'application/json',
                                        'Content-Type': 'multipart/form-data',
                                        Authorization: `Bearer ${user.ACCESS_TOKEN}`,
                                    },
                                    body: data
                                })
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        console.log(responseJson)
                                        // var dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = 'N'`);
                                        if (responseJson.status) {
                                            this.setState({ progressUploadImage: 1, valueImageUpload: dataImage.length, totalImagelUpload: dataImage.length });
                                            TaskServices.updateStatusImage('TR_IMAGE', 'Y', idxOrder);
                                        }
                                    }).catch((error) => {
                                        console.error(error);
                                    });
                            } else {
                                let data = TaskServices.getAllData('TR_IMAGE');
                                let indexData = R.findIndex(R.propEq('IMAGE_CODE', model.IMAGE_CODE))(data);
                                TaskServices.deleteRecord('TR_IMAGE', indexData)
                            }

                        })
                }
            }
            this.setState({ progressUploadImage: 1, valueImageUpload: 0, totalImagelUpload: 0 });
        } catch (error) {

        }
    }

    uploadData(URL, dataPost, table, idInspection) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.ACCESS_TOKEN}`
            },
            body: JSON.stringify(dataPost)
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data)
                if (data.status) {
                    if (table == 'header') {
                        this.updateInspeksi(dataPost);
                        this.updateInspeksiBaris(idInspection);
                    } else if (table == 'detailHeader') {
                        this.updateInspeksiDetail(dataPost)
                    } else if (table == 'tracking') {
                        this.updateInspeksiTrack(dataPost)
                    } else if (table == 'finding') {
                        this.updateFinding(dataPost)
                    }
                }
            })
    }

    updateInspeksi = param => {
        if (param !== null) {
            let allData = TaskServices.getAllData('TR_BLOCK_INSPECTION_H')
            let indexData = R.findIndex(R.propEq('BLOCK_INSPECTION_CODE', param.BLOCK_INSPECTION_CODE))(allData);
            TaskServices.updateInspeksiSync('TR_BLOCK_INSPECTION_H', 'Y', indexData);
        }
    }

    updateInspeksiDetail = param => {
        if (param !== null) {
            let allData = TaskServices.getAllData('TR_BLOCK_INSPECTION_D')
            let indexData = R.findIndex(R.propEq('BLOCK_INSPECTION_CODE_D', param.BLOCK_INSPECTION_CODE_D))(allData);
            TaskServices.updateInspeksiSync('TR_BLOCK_INSPECTION_D', 'Y', indexData);
        }
    }

    updateInspeksiTrack = param => {
        if (param !== null) {
            let allData = TaskServices.getAllData('TM_INSPECTION_TRACK')
            let indexData = R.findIndex(R.propEq('TRACK_INSPECTION_CODE', param.TRACK_INSPECTION_CODE))(allData);
            TaskServices.updateInspeksiSync('TM_INSPECTION_TRACK', 'Y', indexData);
        }
    }

    updateInspeksiBaris = param => {
        if (param !== null) {
            let allData = TaskServices.getAllData('TR_BARIS_INSPECTION');
            let indexData = R.findIndex(R.propEq('ID_INSPECTION', param))(allData);
            TaskServices.updateInspeksiSync('TR_BARIS_INSPECTION', 'Y', indexData);
        }
    }

    updateFinding = param => {
        if (param !== null) {
            let allData = TaskServices.getAllData('TR_FINDING')
            let indexData = R.findIndex(R.propEq('FINDING_CODE', param.FINDING_CODE))(allData);
            TaskServices.updateInspeksiSync('TR_FINDING', 'Y', indexData);
        }
    }

    //upload to service
    kirimInspeksiHeader(param) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        let data = {
            BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
            WERKS: param.WERKS,
            AFD_CODE: param.AFD_CODE,
            BLOCK_CODE: param.BLOCK_CODE,
            AREAL: param.AREAL,
            INSPECTION_TYPE: "PANEN",
            INSPECTION_DATE: convertTimestampToDate(param.INSPECTION_DATE, 'YYYYMMDDHHmmss'),
            INSPECTION_RESULT: param.INSPECTION_RESULT,
            INSPECTION_SCORE: param.INSPECTION_SCORE,
            STATUS_SYNC: 'Y',
            SYNC_TIME: getTodayDate('YYYYMMDDHHmmss'),
            START_INSPECTION: convertTimestampToDate(param.START_INSPECTION, 'YYYYMMDDHHmmss'),
            END_INSPECTION: param.END_INSPECTION,
            LAT_START_INSPECTION: param.LAT_START_INSPECTION,
            LONG_START_INSPECTION: param.LONG_START_INSPECTION,
            LAT_END_INSPECTION: param.LAT_END_INSPECTION,
            LONG_END_INSPECTION: param.LONG_END_INSPECTION,
            INSERT_TIME: convertTimestampToDate(param.INSERT_TIME, 'YYYYMMDDHHmmss'),
            INSERT_USER: user.USER_AUTH_CODE
        }
        this.uploadData('http://149.129.245.230:3008/api/inspection-header', data, 'header', param.ID_INSPECTION);
    }

    kirimInspeksiDetail(result) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        let data = {
            BLOCK_INSPECTION_CODE_D: result.BLOCK_INSPECTION_CODE_D,
            BLOCK_INSPECTION_CODE: result.BLOCK_INSPECTION_CODE,
            CONTENT_INSPECTION_CODE: result.CONTENT_INSPECTION_CODE,
            VALUE: result.VALUE,
            STATUS_SYNC: 'Y',
            SYNC_TIME: getTodayDate('YYYYMMDDHHmmss'),
            INSERT_USER: user.USER_AUTH_CODE,
            INSERT_TIME: convertTimestampToDate(result.INSERT_TIME, 'YYYYMMDDHHmmss')
        }
        this.uploadData('http://149.129.245.230:3008/api/inspection-detail', data, 'detailHeader', '');
    }

    kirimInspectionTrack(param) {
        let data = {
            TRACK_INSPECTION_CODE: param.TRACK_INSPECTION_CODE,
            BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
            DATE_TRACK: param.DATE_TRACK,
            LAT_TRACK: param.LAT_TRACK,
            LONG_TRACK: param.LONG_TRACK,
            INSERT_USER: param.INSERT_USER,
            INSERT_TIME: param.INSERT_TIME
        }
        this.uploadData('http://149.129.245.230:3008/api/inspection-tracking', data, 'tracking', '');
    }

    kirimFinding(param) {
        let dueDate = param.DUE_DATE;
        if (dueDate.includes(' ')) {
            dueDate = dueDate.substring(0, dueDate.indexOf(' '))
        }
        let data = {
            FINDING_CODE: param.FINDING_CODE,
            WERKS: param.WERKS,
            AFD_CODE: param.AFD_CODE,
            BLOCK_CODE: param.BLOCK_CODE,
            FINDING_CATEGORY: param.FINDING_CATEGORY,
            FINDING_DESC: param.FINDING_DESC,
            FINDING_PRIORITY: param.FINDING_PRIORITY,
            DUE_DATE: `${dueDate} 00:00:00`,
            ASSIGN_TO: param.ASSIGN_TO,
            PROGRESS: param.PROGRESS.toString(),
            LAT_FINDING: param.LAT_FINDING,
            LONG_FINDING: param.LONG_FINDING,
            REFFERENCE_INS_CODE: param.REFFERENCE_INS_CODE,
            INSERT_USER: param.INSERT_USER,
            INSERT_TIME: param.INSERT_TIME
        }
        this.uploadData('http://149.129.245.230:3008/api/finding', data, 'finding', '');
    }


    // POST MOBILE SYNC
    _postMobileSync(param) {
        var moment = require('moment');
        this.props.tmPost({
            TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
            TABEL_UPDATE: param
        });
    }

    deleteData(table, whereClause, value) {
        let allData = TaskServices.getAllData(table);
        if (allData !== undefined && allData.length > 0) {
            let indexData = R.findIndex(R.propEq(whereClause, value))(allData);
            if (indexData >= 0) {
                TaskServices.deleteRecord(table, indexData);
            }

        }
    }

    hasDownload(item, total) {
        if (this.state.isFirstInstall) {
            if (total > 0) {
                this.fetchingMobileSync(item);
            } else {
                this.setState({
                    showButton: true,
                    showModal: true,
                    title: 'Gagal Download' + item,
                    message: 'Opps, Download bermasalah, silahkan coba lagi ya..',
                    icon: require('../Images/ic-sync-gagal.png')
                })
                // alert('gagal download ' + item)

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
        if (data.ubah.length > 0 && all.length > 0) {
            data.ubah.map(item => {
                let indexData = R.findIndex(R.propEq('WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE))(allData);
                TaskServices.updateBlock(item, indexData)
            })
        }
        if (data.hapus.length > 0 && all.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
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
                let indexData = R.findIndex(R.propEq('WERKS_AFD_CODE', item.WERKS_AFD_CODE))(allData);
                TaskServices.updateAfdeling(item, indexData)
            })
        }
        //hapus data
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_AFD', 'WERKS_AFD_CODE', item.WERKS_AFD_CODE);
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
                let indexData = R.findIndex(R.propEq('REGION_CODE', item.REGION_CODE))(allData);
                TaskServices.updateRegion(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_REGION', 'REGION_CODE', item.REGION_CODE);
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
                let indexData = R.findIndex(R.propEq('WERKS', item.WERKS))(allData);
                TaskServices.updateEstate(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_EST', 'WERKS', item.WERKS);
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
                let indexData = R.findIndex(R.propEq('WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE))(allData);
                TaskServices.updateLandUse(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', item.WERKS_AFD_BLOCK_CODE);
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
                let indexData = R.findIndex(R.propEq('COMP_CODE', item.COMP_CODE))(allData);
                TaskServices.updateComp(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TM_COMP', 'COMP_CODE', item.COMP_CODE);
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

    _crudTM_ContentLabel(data) {
        if (data.length > 0) {
            for (var i = 1; i <= data.length; i++) {
                this.setState({ progressContentLabel: i / data.length, totalContentLabelDownload: data.length });
            }
            data.map(item => {
                TaskServices.saveData('TM_CONTENT_LABEL', item);
                let countDataInsert = TaskServices.getTotalData('TM_CONTENT_LABEL');
                this.setState({ valueContentLabelDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TM_CONTENT_LABEL');
            this.setState({ progressContentLabel: 1, valueContentLabelDownload: countDataInsert, totalContentLabelDownload: 0 })
        }

        let countDataInsert = TaskServices.getTotalData('TM_CONTENT_LABEL');
        this.hasDownload('auth/content-label', countDataInsert);
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
        // if (data.ubah.length > 0 && allData.length > 0) {   
        //     data.ubah.map(item => {
        //         let indexData = R.findIndex(R.propEq('USER_AUTH_CODE', item.USER_AUTH_CODE))(allData);
        //         TaskServices.updateContact(item, indexData)
        //     });
        // }
        // if(data.hapus.length > 0 && allData.length > 0){
        //     data.hapus.map(item =>{
        //         this.deleteData('TR_CONTACT', 'USER_AUTH_CODE', item.USER_AUTH_CODE);
        //     });  
        // }  

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
                TaskServices.saveData('TR_FINDING', item);
                let countDataInsert = TaskServices.getTotalData('TR_FINDING');
                this.setState({ valueFindingDownload: countDataInsert });
            });
        } else {
            let countDataInsert = TaskServices.getTotalData('TR_FINDING');
            this.setState({ progressFinding: 1, valueFindingDownload: countDataInsert, totalFindingDownload: 0 })
        }
        if (data.ubah.length > 0 && allData.length > 0) {
            data.ubah.map(item => {
                let indexData = R.findIndex(R.propEq('FINDING_CODE', item.FINDING_CODE))(allData);
                TaskServices.updateFindingDownload(item, indexData)
            })
        }
        if (data.hapus.length > 0 && allData.length > 0) {
            data.hapus.map(item => {
                this.deleteData('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
            });
        }
    }

    _crudTM_Finding_Image(data) {
        var dataSimpan = data.simpan;
        if (dataSimpan.length > 0) {
            for (var i = 1; i <= dataSimpan.length; i++) {
                this.setState({ progressFindingImage: i / dataSimpan.length, totalFindingImageDownload: dataSimpan.length });
            }
            dataSimpan.map(item => {
                TaskServices.saveData('TR_IMAGE', item);
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
        RNFS.copyFile(TaskServices.getPath(), 'file:///storage/emulated/0/MobileInspection/data.realm');
        this.setState({ progressParamInspection: 1, valueParamInspection: 1, totalParamInspection: 1, showButton: true });
        this.setState({
            showModal: true,
            title: 'Sync Berhasil',
            message: 'Yeay sinkronisasi udah selesai!',
            icon: require('../Images/ic-sync-berhasil.png')
        });

        // let arr = ['hectare-statement/block', 'hectare-statement/afdeling', 'hectare-statement/region', 'hectare-statement/est', 
        // 'hectare-statement/land-use', 'hectare-statement/comp', 'auth/content', 'auth/content-label', 'auth/kriteria',
        // 'auth/category', 'auth/contact', 'finding'];

        // arr.map(item =>{
        //     if(isFirstInstall){
        //     }
        //     this.fetchingMobileSync(item);
        // });        
    }

    //download image
    async _downloadImageFinding(data) {
        let isExist = await RNFS.exists(`${dirPhotoTemuan}/${data.IMAGE_NAME}`)
        if (!isExist) {
            var url = data.IMAGE_URL;
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

    _onSync() {
        this._deleteFinding();

        // Gani
        this.props.resetFinding()
        this.props.resetFindingImage();
        this.props.resetBlock();
        this.props.resetAfd();
        this.props.resetRegion();
        this.props.resetEst()
        this.props.resetLandUse();
        this.props.resetComp();
        this.props.resetContent();
        this.props.resetKriteria();
        this.props.resetCategory();
        this.props.resetContact()
        this.props.resetParamTrack();
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.setState({

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
                    progressInspectionTrack: 0,
                    progressParamInspection: 0,
                    progressInspeksiHeader: 0,
                    progressInspeksiDetail: 0,
                    progressFindingData: 0,
                    progressUploadImage: 0,

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
                    valueInspeksiHeaderUpload: '0',
                    valueInspeksiDetailUpload: '0',
                    valueFindingDataUpload: '0',
                    valueImageUpload: '0',
                    valueInspectionTrack: '0',
                    valueParamInspection: '0',

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

                    totalInspeksiHeaderUpload: '0',
                    totalInspeksiDetailUpload: '0',
                    totalFindingDataUpload: '0',
                    totalFindingImageDownload: '0',
                    totalImagelUpload: '0',
                    totalImagelUpload: '0',
                    totalInspectionTrack: '0',
                    totalParamInspection: '0',

                    fetchLocation: false,
                    isBtnEnable: false,

                });

                this.props.resetFinding();
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

                //POST TRANSAKSI
                this.kirimImage();
                this.loadDataFinding();
                this.loadData();
                this.loadDataDetailInspeksi();
                this.loadDataInspectionTrack();

                //cara biasa
                // setTimeout(() => {            
                // this.DownloadData(`${link}mobile-sync/finding`, 'finding');
                // }, 2000);

                //cara redux saga
                setTimeout(() => {
                    this.props.findingRequest();
                    this.props.blockRequest();
                }, 2000);

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
            console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
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

    DownloadData(URL, table) {
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.ACCESS_TOKEN}`
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                alert(JSON.stringify(data));
                if (data.status) {
                    let payload = data.data;
                    if (table == 'finding') {
                        this._crudTM_Finding(payload);
                        this.DownloadData(`${link}mobile-sync/finding-images`, 'image');
                    } else if (table == 'image') {
                        this._crudTM_Finding_Image(payload);
                        // this.DownloadData(`${link}mobile-sync/hectare-statement/block`, 'block');
                    } else if (table == 'block') {
                        this._crudTM_Block(payload);
                        this.DownloadData(`${link}mobile-sync/hectare-statement/afdeling`, 'afd');
                    } else if (table == 'afd') {
                        this._crudTM_Afd(payload);
                        this.DownloadData(`${link}mobile-sync/hectare-statement/region`, 'region');
                    } else if (table == 'region') {
                        this._crudTM_Region(payload);
                        this.DownloadData(`${link}mobile-sync/hectare-statement/est`, 'est');
                    } else if (table == 'est') {
                        this._crudTM_Est(payload);
                        this.DownloadData(`${link}mobile-sync/hectare-statement/land-use`, 'landuse');
                    } else if (table == 'landuse') {
                        this._crudTM_LandUse(payload);
                        this.DownloadData(`${link}mobile-sync/hectare-statement/comp`, 'comp');
                    } else if (table == 'comp') {
                        this._crudTM_Comp(payload);
                        this.DownloadData(`${link}content`, 'content');
                    } else if (table == 'content') {
                        this._crudTM_Content(payload);
                        this.DownloadData(`${link}content-label`, 'contentlabel');
                    } else if (table == 'contentlabel') {
                        this._crudTM_ContentLabel(payload);
                        this.DownloadData(`${link}kriteria`, 'kriteria');
                    } else if (table == 'kriteria') {
                        this._crudTM_Kriteria(payload);
                        this.DownloadData(`${link}category`, 'catogory');
                    } else if (table == 'catogory') {
                        this._crudTM_Category(payload);
                        this.DownloadData(`${link}contacts`, 'contact');
                    } else if (table == 'contact') {
                        this._crudTM_Contact(payload);
                        this.DownloadData(`${link}parameter/track`, 'track');
                    } else if (table == 'track') {
                        this._crudTM_Inspeksi_Param(payload);
                    }
                } else {
                    // alert('Gagal proses download ' + table);
                    this.setState({
                        showButton: true,
                        showModal: true,
                        title: 'Sync Putus',
                        message: 'Yaaah jaringannya mati, coba Sync lagi yaa.',
                        icon: require('../Images/ic-sync-gagal.png')
                    });
                }
            })
    }

    fetchingMobileSync(param) {
        var moment = require('moment');
        const user = TaskServices.getAllData('TR_LOGIN')[0];
        fetch('http://149.129.245.230:3008/api/mobile-sync', {
            method: 'POST',
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

    componentWillReceiveProps(newProps, newState) {
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
            this.setState({
                showButton: true,
                showModal: true,
                title: 'Sync Putus',
                message: 'Yaaah jaringannya mati, coba Sync lagi yaa.',
                icon: require('../Images/ic-sync-gagal.png')
            });
            this.props.resetFinding();
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
            // this.props.blockRequest();
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

        // if (newProps.contentLabel.fetchingContentLabel !== null && !newProps.contentLabel.fetchingContentLabel) {
        //     let dataJSON = newProps.contentLabel.contentLabel;
        //     if (dataJSON !== null) {
        //         this._crudTM_ContentLabel(dataJSON);
        //     }
        //     this.props.resetContentLabel();
        //     this.props.kriteriaRequest();
        // }

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
            this.props.resetContact()
            this.props.paramTrackRequest();
        }

        if (newProps.paramTrack.fetchingParamTrack !== null && !newProps.paramTrack.fetchingParamTrack) {
            let dataJSON = newProps.paramTrack.paramTrack;
            if (dataJSON !== null) {
                this._crudTM_Inspeksi_Param(dataJSON);
            }
            this.props.resetParamTrack();
            this.setState({ showButton: true });
        }

    }

    render() {
        return (
            <Container style={{ flex: 1, padding: 16 }}>
                <Content>

                    <ModalAlert
                        icon={this.state.icon}
                        visible={this.state.showModal}
                        onPressCancel={() => this.setState({ showModal: false })}
                        title={this.state.title}
                        message={this.state.message} />

                    {this.state.showButton && <View style={{ flex: 1, marginTop: 8 }}>
                        <TouchableOpacity disabled={this.state.isBtnEnable} style={styles.button} onPress={() => { this.setState({ showButton: false }); this._onSync() }}>
                            <Text style={styles.buttonText}>Sync</Text>
                        </TouchableOpacity>
                    </View>}

                    <Text style={{ fontSize: 14, color: 'blue', marginTop: 24 }}>UPLOAD</Text>
                    <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>INSPEKSI TRACK</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueInspectionTrack}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalInspectionTrack}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressInspectionTrack}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>INSPEKSI HEADER</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueInspeksiHeaderUpload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalInspeksiHeaderUpload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressInspeksiHeader}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>INSPEKSI DETAIL</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueInspeksiDetailUpload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalInspeksiDetailUpload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressInspeksiDetail}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />

                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>FINDING DATA</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueFindingDataUpload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalFindingDataUpload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressFindingData}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />

                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>IMAGE</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueImageUpload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalImagelUpload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressUploadImage}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <Text style={{ fontSize: 14, color: Colors.tintColor, marginTop: 16 }}>DOWNLOAD</Text>
                    <View style={{ backgroundColor: 'grey', height: 0.5, flex: 1, flexDirection: 'row', marginTop: 3 }} />

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>FINDING</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueFindingDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalFindingDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressFinding}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>FINDING IMAGE</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueFindingImageDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalFindingImageDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressFindingImage}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>BLOCK</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progress}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>AFD</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueAfdDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalAfdDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressAfd}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>REGION</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueRegionDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalRegionDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressRegion}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>ESTATE</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueEstDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalEstDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressEst}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>LAND USE</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueLandUseDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalLandUseDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressLandUse}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>COMP</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueCompDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalCompDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressComp}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>CONTENT</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueContentDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalContentDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressContent}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    {/* <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>CONTENT LABEL</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text>{this.state.valueContentLabelDownload}</Text>
                                <Text>/</Text>
                                <Text>{this.state.totalContentLabelDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={20}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressContentLabel}
                            indeterminate={this.state.indeterminate} />
                    </View> */}

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>KRITERIA</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueKriteriaDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalKriteriaDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressKriteria}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>CATEGORY</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueCategoryDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalCategoryDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressCategory}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>CONTACT</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueContactDownload}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalContactDownload}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            color={Colors.brand}
                            style={{ marginTop: 2 }}
                            progress={this.state.progressContact}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labelProgress}>PARAMATER TRACK INSPECTION</Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.labelProgress}>{this.state.valueParamInspection}</Text>
                                <Text style={styles.labelProgress}>/</Text>
                                <Text style={styles.labelProgress}>{this.state.totalParamInspection}</Text>
                            </View>
                        </View>
                        <Progress.Bar
                            height={heightProgress}
                            width={null}
                            style={{ marginTop: 2 }}
                            color={Colors.brand}
                            progress={this.state.progressParamInspection}
                            backgroundColor={colorProgress}
                            borderColor={'white'}
                            indeterminate={this.state.indeterminate} />
                    </View>

                    <ProgressDialog
                        visible={this.state.fetchLocation}
                        activityIndicatorSize="small"
                        message={this.state.downloadApa} />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
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
        paramTrack: state.paramTrack
    };
};

const mapDispatchToProps = dispatch => {
    return {
        regionRequest: () => dispatch(RegionAction.regionRequest()),
        blockRequest: () => dispatch(BlockAction.blockRequest()),
        blockPost: obj => dispatch(BlockAction.blockPost(obj)),
        afdRequest: () => dispatch(AfdAction.afdRequest()),
        afdPost: obj => dispatch(AfdAction.afdPost(obj)),
        estRequest: () => dispatch(EstAction.estRequest()),
        estPost: obj => dispatch(EstAction.estPost(obj)),
        kriteriaRequest: () => dispatch(KriteriaAction.kriteriaRequest()),
        kriteriaPost: obj => dispatch(KriteriaAction.kriteriaPost(obj)),
        userAuthRequest: () => dispatch(UserAuthAction.userAuthRequest()),
        userAuthPost: obj => dispatch(UserAuthAction.userAuthPost(obj)),
        landUseRequest: () => dispatch(LandUseAction.landUseRequest()),
        landUsePost: obj => dispatch(LandUseAction.landUsePost(obj)),
        compRequest: () => dispatch(CompAction.compRequest()),
        compPost: obj => dispatch(CompAction.compPost(obj)),
        contentRequest: () => dispatch(ContentAction.contentRequest()),
        contentPost: obj => dispatch(ContentAction.contentPost(obj)),
        contentLabelRequest: () => dispatch(ContentLabelAction.contentLabelRequest()),
        contentLabelPost: obj => dispatch(ContentLabelAction.contentLabelPost(obj)),
        contactRequest: () => dispatch(ContactAction.contactRequest()),
        categoryRequest: () => dispatch(CategoryAction.categoryRequest()),
        findingRequest: () => dispatch(FindingAction.findingRequest()),
        findingPost: obj => dispatch(FindingAction.findingPost(obj)),
        findingImageRequest: () => dispatch(FindingImageAction.findingImageRequest()),
        inspeksiPostHeader: obj => dispatch(InspeksiAction.inspeksiPostHeader(obj)),
        inspeksiPostDetail: obj => dispatch(InspeksiAction.inspeksiPostDetail(obj)),
        inspeksiPostTrackingPath: obj => dispatch(InspeksiAction.inspeksiPostTrackingPath(obj)),
        paramTrackRequest: obj => dispatch(ParamTrackAction.paramTrackRequest(obj)),
        findingPostData: obj => dispatch(FindingUploadAction.findingPostData(obj)),
        tmPost: obj => dispatch(TMobileAction.tmPost(obj)),

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
        resetFinding: () => dispatch(FindingAction.resetFinding()),
        resetFindingImage: () => dispatch(FindingImageAction.resetFindingImage())
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
    },
    labelProgress: {
        fontSize: 12
    }
});

