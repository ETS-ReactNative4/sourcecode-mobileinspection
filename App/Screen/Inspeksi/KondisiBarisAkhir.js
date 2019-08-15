import React, { Component } from 'react';
import {
    Text, Dimensions, StatusBar, TextInput, TouchableOpacity, View, Switch
} from 'react-native';
import {
    Card,
    CardItem,
} from 'native-base';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Polygon, ProviderPropType, Marker, Polyline } from 'react-native-maps';
import { RNSlidingButton, SlideDirection } from 'rn-sliding-button';
import TaskService from '../../Database/TaskServices';
import { getTodayDate, getCalculateTime } from '../../Lib/Utils'
import { NavigationActions, StackActions } from 'react-navigation';
import R from 'ramda';
import geolib from 'geolib';
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import ModalAlert from '../../Component/ModalAlert';

import TaskServices from '../../Database/TaskServices';
import { retrieveData, removeData } from '../../Database/Resources';

const skm = require('../../Data/MegaKuningan.json');

const LATITUDE = -2.1890660;
const LONGITUDE = 111.3609873;
const DATA_LOGIN = TaskServices.getAllData('TR_LOGIN')


class KondisiBarisAkhir extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColorPrimary
        },
        title: 'Buat Inspeksi',
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        }
    };

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        let fotoBaris = R.clone(params.fotoBaris);
        let fotoSelfie = R.clone(params.fotoSelfie);
        let inspeksiHeader = R.clone(params.inspeksiHeader);
        let kondisiBaris1 = R.clone(params.kondisiBaris1);
        let kondisiBaris2 = R.clone(params.kondisiBaris2);
        let dataUsual = R.clone(params.dataUsual);
        let statusBlok = R.clone(params.statusBlok);
        let from = R.clone(params.from);
        let intervalId = R.clone(params.intervalId);
        let dataInspeksi = R.clone(params.dataInspeksi);


        console.log('DATA LOGIN : ', DATA_LOGIN[0].USER_ROLE);

        this.state = {
            intervalId,
            latitude: 0.0,
            longitude: 0.0,
            error: null,
            switchLanjut: true,
            fulFillMandatory: false,
            txtBaris: '',
            tumbButtonSlide: {
                width: 55,
                height: 45,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#C8C8C8',
                backgroundColor: Colors.tintColor,
            },
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.00721
            },
            fotoBaris,
            fotoSelfie,
            inspeksiHeader,
            kondisiBaris1,
            kondisiBaris2,
            dataUsual,
            idBaris: 0,
            menit: '',
            jarak: '',
            statusBlok,
            dataInspeksi,
            fetchLocation: false,
            from,
            distance: '',
            polyTrack: [],
            poligons: [],

            //Add Modal Alert by Aminju 
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: '',
            inspectionType: props.navigation.getParam('inspectionType', 'normal')
        };
    }

    componentDidMount() {
        if (this.state.from === 'history') {
            let time = this.state.inspeksiHeader.TIME;
            let distance = this.state.inspeksiHeader.DISTANCE;
            this.setState({ menit: time, distance: distance, jarak: distance });
        } else {
            let sda = this.totalWaktu();
            this.setState({ menit: sda.toString() })
        }
        this.getLocation();
        this.makeLineTrack();
    }

    totalWaktu() {
        let now = new Date();
        let startTime = this.state.inspeksiHeader.START_INSPECTION;
        startTime = startTime.replace(' ', 'T');
        startTime = new Date(startTime);
        let time = getCalculateTime(startTime, now);
        return time;
    }

    totalJarak(coord) {
        let distance = geolib.getDistance(coord, {
            latitude: parseFloat(this.state.inspeksiHeader.LAT_START_INSPECTION),
            longitude: parseFloat(this.state.inspeksiHeader.LONG_START_INSPECTION)
        });
        return distance;
    }

    searchLocation = () => {
        this.setState({ fetchLocation: true })
        this.getLocation();
    }

    getLocation() {
        retrieveData('PoligonsInspeksi').then(data => {
            if (data != null) {
                let lastTrack = TaskService.getLastTracking(this.state.dataUsual.BLOCK_INSPECTION_CODE);
                var lat = parseFloat(lastTrack.LAT_TRACK);
                var lon = parseFloat(lastTrack.LONG_TRACK);
                let totalJarak = this.state.from == 'history' ? this.state.distance : this.totalJarak({ latitude: lat, longitude: lon });
                region = {
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.0075,
                    longitudeDelta: 0.00721
                }
                this.setState({ latitude: lat, longitude: lon, jarak: totalJarak.toString(), fetchLocation: false, region, poligons: data });
            } else {
                let lastTrack = TaskService.getLastTracking(this.state.dataUsual.BLOCK_INSPECTION_CODE);
                var lat = parseFloat(lastTrack.LAT_TRACK);
                var lon = parseFloat(lastTrack.LONG_TRACK);
                let totalJarak = this.state.from == 'history' ? this.state.distance : this.totalJarak({ latitude: lat, longitude: lon });
                region = {
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.0075,
                    longitudeDelta: 0.00721
                }
                this.setState({ latitude: lat, longitude: lon, jarak: totalJarak.toString(), fetchLocation: false, region });
            }
        })
    }

    makeLineTrack() {
        if (this.state.from === 'history') {
            let header = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION)
            if (header !== null) {
                header.map(hdr => {
                    let data = TaskService.findBy('TM_INSPECTION_TRACK', 'BLOCK_INSPECTION_CODE', hdr.BLOCK_INSPECTION_CODE)
                    if (data !== undefined) {
                        data.map(item => {
                            let arr = { latitude: parseFloat(item.LAT_TRACK), longitude: parseFloat(item.LONG_TRACK) }
                            this.state.polyTrack.push(arr)
                        })
                    }
                })
            }
        } else {
            let data = TaskService.findBy('TM_INSPECTION_TRACK', 'BLOCK_INSPECTION_CODE', this.state.dataInspeksi.BLOCK_INSPECTION_CODE)
            if (data !== undefined) {
                data.map(item => {
                    let arr = { latitude: parseFloat(item.LAT_TRACK), longitude: parseFloat(item.LONG_TRACK) }
                    this.state.polyTrack.push(arr)
                })
            }
        }
    }

    centerCoordinate(coordinates) {
        let x = coordinates.map(c => c.latitude)
        let y = coordinates.map(c => c.longitude)

        let minX = Math.min.apply(null, x)
        let maxX = Math.max.apply(null, x)

        let minY = Math.min.apply(null, y)
        let maxY = Math.max.apply(null, y)

        return {
            latitude: (minX + maxX) / 2,
            longitude: (minY + maxY) / 2
        }
    }

    has2Row() {
        let total = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION).length;
        if (this.state.from !== 'history') {
            if (total >= 1) {
                return true
            } else {
                return false
            }
        } else {
            if (total >= 2) {
                return true
            } else {
                return false
            }
        }
    }
    changeColorSlide() {
        if (this.state.inspectionType === 'genba' || DATA_LOGIN[0].USER_ROLE != 'ASISTEN_LAPANGAN') {
            if (!this.state.switchLanjut) {
                this.setState({ fulFillMandatory: false, txtBaris: '' })
                btn = {
                    width: 55,
                    height: 45,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#C8C8C8',
                    backgroundColor: Colors.tintColor,
                }
            } else {
                this.setState({ fulFillMandatory: true, txtBaris: '' })
                btn = {
                    width: 55,
                    height: 45,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#C8C8C8',
                    backgroundColor: Colors.brandSecondary,
                }
            }
            this.setState({ tumbButtonSlide: btn })
        }
        else {

            console.log('DATA USER LOGIN ASU : ', );

            if (this.has2Row() >= 1 ) {
                if (!this.state.switchLanjut) {
                    this.setState({ fulFillMandatory: false, txtBaris: '' })
                    btn = {
                        width: 55,
                        height: 45,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#C8C8C8',
                        backgroundColor: Colors.tintColor,
                    }
                } else {
                    this.setState({ fulFillMandatory: true, txtBaris: '' })
                    btn = {
                        width: 55,
                        height: 45,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#C8C8C8',
                        backgroundColor: Colors.brandSecondary,
                    }
                }
                this.setState({ tumbButtonSlide: btn })
            } else {
                this.setState({ switchLanjut: true })
                this.setState({
                    showModal: true, title: 'Lanjutkan Inspeksi', message: 'Sesuai SOP nih, inspeksi tuh minimal 2 baris per blok.',
                    icon: require('../../Images/ic-1-baris-lagi.png')
                });
            }
        }

    }

    onSlideRight = () => {
        this.validation()
    };

    checkJarakBaris(inputBaris) {
        let prevRangeMax = parseInt(this.state.dataUsual.BARIS) + 4;
        let prevRangeMin = parseInt(this.state.dataUsual.BARIS) <= 5 ? 1 : parseInt(this.state.dataUsual.BARIS) - 4;

        //check textInput kondisiBarisAkhir (musti di check lagi karena ini belum masuk database)
        if (parseInt(this.state.txtBaris) <= prevRangeMax && parseInt(this.state.txtBaris) >= prevRangeMin) {
            return true
        }

        let idInspection = this.state.inspeksiHeader.ID_INSPECTION;
        let data = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection)
        //cek baris inspection udh ada ato blom
        if (data !== undefined) {
            let header = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection)
            //cek di TR_BLOCK_INSPECTION_H udh ad apa belum
            if (header !== undefined && header.length > 0) {
                //check database
                let rangeMin = parseInt(inputBaris) <= 5 ? 1 : parseInt(inputBaris) - 4;
                let rangeMax = parseInt(inputBaris) + 4;
                let inputNo = [];
                let validation = header.some((val) => {
                    inputNo.push(val.AREAL)
                    return (val.AREAL <= rangeMax && val.AREAL >= rangeMin)
                });
                return validation;
            }
        }
        return false
    }

    validation() {
        if (this.state.txtBaris == '' && this.state.switchLanjut) {
            this.setState({
                showModal: true, title: 'Isi Baris', message: 'Kamu harus selalu pilih baris yaa :)',
                icon: require('../../Images/ic-blm-input-lokasi.png')
            });
        }
        else if (this.state.txtBaris == this.state.dataUsual.BARIS && this.state.switchLanjut) {
            this.setState({
                showModal: true, title: 'Baris Sama', message: 'Opps, baris tidak boleh sama dengan sebelumnya ya',
                icon: require('../../Images/ic-blm-input-lokasi.png')
            });
        }
        else {
            if (!this.checkJarakBaris(this.state.txtBaris)) {
                this.saveData()
            }
            else {
                this.setState({
                    showModal: true, title: 'Baris terlalu dekat', message: 'Opps, minimum jarak barisnya lebih dari 5 ya ! ',
                    icon: require('../../Images/ic-blm-input-lokasi.png')
                });
            }
        }
    }

    calculateBaris(blockInspectionCode) {

        var piringan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0007', blockInspectionCode]);
        var sarkul = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0008', blockInspectionCode]);
        var tph = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0009', blockInspectionCode]);
        var gawangan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0010', blockInspectionCode]);
        var prunning = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0011', blockInspectionCode]);

        var jmlNilaiPiringan = this.getTotalNilaiComponent(piringan);
        var jmlNilaiSarkul = this.getTotalNilaiComponent(sarkul);
        var jmlNilaiTph = this.getTotalNilaiComponent(tph);
        var jmlNilaiGwg = this.getTotalNilaiComponent(gawangan);
        var jmlNilaiPrun = this.getTotalNilaiComponent(prunning);

        var avg_piringan = jmlNilaiPiringan / 1;
        var avg_sarkul = jmlNilaiSarkul / 1;
        var avg_tph = jmlNilaiTph / 1;
        var avg_gwg = jmlNilaiGwg / 1;
        var avg_prun = jmlNilaiPrun / 1;

        let bobotPiringan = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0007').BOBOT //4;
        let bobotSarkul = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0008').BOBOT //5;
        let bobotTph = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0009').BOBOT //2;
        let bobotGwg = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0010').BOBOT //1;
        let bobotPrun = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0011').BOBOT //3;

        let nilai = 0;
        if (this.state.statusBlok === 'TM') {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg) + (avg_tph * bobotTph) + (avg_prun * bobotPrun)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg + bobotPrun);
        } else if (this.state.statusBlok === 'TBM 3') {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg) + (avg_tph * bobotTph)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg);
        } else {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg)) / (bobotPiringan + bobotSarkul + bobotGwg);
        }
        var result = this.getKonversiNilaiKeHuruf(nilai);
        return [nilai.toString(), result] //[0]score [1]value
    }

    calculate() {
        let barisPembagi = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION);

        var piringan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0007', this.state.dataInspeksi.ID_INSPECTION]);
        var sarkul = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0008', this.state.dataInspeksi.ID_INSPECTION]);
        var tph = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0009', this.state.dataInspeksi.ID_INSPECTION]);
        var gawangan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0010', this.state.dataInspeksi.ID_INSPECTION]);
        var prunning = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0011', this.state.dataInspeksi.ID_INSPECTION]);

        var jmlNilaiPiringan = this.getTotalNilaiComponent(piringan);
        var jmlNilaiSarkul = this.getTotalNilaiComponent(sarkul);
        var jmlNilaiTph = this.getTotalNilaiComponent(tph);
        var jmlNilaiGwg = this.getTotalNilaiComponent(gawangan);
        var jmlNilaiPrun = this.getTotalNilaiComponent(prunning);

        var avg_piringan = jmlNilaiPiringan / barisPembagi.length;
        var avg_sarkul = jmlNilaiSarkul / barisPembagi.length;
        var avg_tph = jmlNilaiTph / barisPembagi.length;
        var avg_gwg = jmlNilaiGwg / barisPembagi.length;
        var avg_prun = jmlNilaiPrun / barisPembagi.length;

        let bobotPiringan = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0007').BOBOT //4;
        let bobotSarkul = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0008').BOBOT //5;
        let bobotTph = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0009').BOBOT //2;
        let bobotGwg = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0010').BOBOT //1;
        let bobotPrun = TaskService.findBy2('TM_CONTENT', 'CONTENT_CODE', 'CC0011').BOBOT //3;

        let nilai = 0;
        if (this.state.statusBlok === 'TM') {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg) + (avg_tph * bobotTph) + (avg_prun * bobotPrun)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg + bobotPrun);
        } else if (this.state.statusBlok === 'TBM 3') {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg) + (avg_tph * bobotTph)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg);
        } else {
            nilai = ((avg_piringan * bobotPiringan) + (avg_sarkul * bobotSarkul) + (avg_gwg * bobotGwg)) / (bobotPiringan + bobotSarkul + bobotGwg);
        }
        var result = this.getKonversiNilaiKeHuruf(nilai);


        let param = [nilai.toString(), result, 'Y']
        let dataInspeksi = TaskService.getAllData('TR_BARIS_INSPECTION')
        let indexData = R.findIndex(R.propEq('ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION))(dataInspeksi);
        TaskService.updateScoreInspeksi(param, indexData);

        let val = this.calculateBaris(this.state.inspeksiHeader.BLOCK_INSPECTION_CODE)
        TaskService.updateInspectionHScore(this.state.inspeksiHeader.BLOCK_INSPECTION_CODE, val)

        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'SelesaiInspeksi',
                params: {
                    inspeksiHeader: this.state.inspeksiHeader,
                    statusBlok: this.state.statusBlok,
                    dataInspeksi: dataInspeksi[indexData],
                    inspectionType: this.state.inspectionType
                }
            })]
        });
        clearInterval(this.state.intervalId)
        navigation.dispatch(resetAction);

    }

    getKonversiNilaiKeHuruf(param) {
        if (param > 2.5 && param <= 3) {
            return 'A';
        } else if (param > 2 && param <= 2.5) {
            return 'B';
        } else if (param > 1 && param <= 2) {
            return 'C';
        } else if (param >= 0 && param <= 1) {
            return 'F';
        }
    }

    getTotalNilaiComponent(allComponent) {
        var val = 0;
        for (var i = 0; i < allComponent.length; i++) {
            if (i == 0) {
                val = this.getKonversiNilai(allComponent[i].VALUE);
            } else {
                val = val + this.getKonversiNilai(allComponent[i].VALUE);
            }
        }
        return val;
    }

    getKonversiNilai(param) {
        if (param === 'REHAB') {
            return 0;
        } else if (param === 'KURANG') {
            return 1;
        } else if (param === 'SEDANG') {
            return 2;
        } else if (param === 'BAIK') {
            return 3;
        } else {
            return 0;
        }
    }

    saveData() {
        // let lat = '0.0';
        // let lon = '0.0';
        // if(this.state.latitude === 0.0 && this.state.longitude === 0.0){
        //     let data = TaskService.findBy2('TM_INSPECTION_TRACK', 'BLOCK_INSPECTION_CODE', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE);
        //     if(data !== undefined){
        //         let record = data[0];
        //         lat = record.LAT_TRACK;
        //         lon = record.LONG_TRACK;
        //     }
        // }else{
        //     lat = this.state.latitude.toString();
        //     lon = this.state.longitude.toString();
        // }
        let insertTime = getTodayDate('YYYY-MM-DD HH:mm:ss');

        if (this.state.from !== 'history') {
            var modelInspeksiH = {
                BLOCK_INSPECTION_CODE: this.state.inspeksiHeader.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                WERKS: this.state.inspeksiHeader.WERKS,
                AFD_CODE: this.state.inspeksiHeader.AFD_CODE,
                BLOCK_CODE: this.state.inspeksiHeader.BLOCK_CODE,
                AREAL: this.state.inspeksiHeader.AREAL,
                INSPECTION_TYPE: "PANEN",
                STATUS_BLOCK: this.state.inspeksiHeader.STATUS_BLOCK,
                INSPECTION_DATE: this.state.inspeksiHeader.INSPECTION_DATE, //getTodayDate('DD MMM YYYY HH:mm:ss'), //12 oct 2018 01:01:01
                INSPECTION_SCORE: '',
                INSPECTION_RESULT: '',
                STATUS_SYNC: 'N',
                SYNC_TIME: '',
                START_INSPECTION: this.state.inspeksiHeader.START_INSPECTION,
                END_INSPECTION: insertTime,
                LAT_START_INSPECTION: this.state.inspeksiHeader.LAT_START_INSPECTION,
                LONG_START_INSPECTION: this.state.inspeksiHeader.LONG_START_INSPECTION,
                LAT_END_INSPECTION: this.state.latitude.toString(),
                LONG_END_INSPECTION: this.state.longitude.toString(),
                INSERT_TIME: insertTime,
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                TIME: this.state.menit,
                DISTANCE: this.state.jarak,

                //localParam:
                inspectionType: this.state.inspectionType
            }
            TaskService.saveData('TR_BLOCK_INSPECTION_H', modelInspeksiH);

            var image = {
                TR_CODE: this.state.fotoBaris.TR_CODE,
                IMAGE_CODE: this.state.fotoBaris.IMAGE_CODE,
                IMAGE_NAME: this.state.fotoBaris.IMAGE_NAME,
                IMAGE_PATH_LOCAL: this.state.fotoBaris.IMAGE_PATH_LOCAL,
                IMAGE_URL: '',
                STATUS_IMAGE: 'BARIS',
                STATUS_SYNC: 'N',
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                INSERT_TIME: insertTime
            }
            TaskService.saveData('TR_IMAGE', image);

            var selfie = {
                TR_CODE: this.state.fotoSelfie.TR_CODE,
                IMAGE_CODE: this.state.fotoSelfie.IMAGE_CODE,
                IMAGE_NAME: this.state.fotoSelfie.IMAGE_NAME,
                IMAGE_PATH_LOCAL: this.state.fotoSelfie.IMAGE_PATH_LOCAL,
                IMAGE_URL: '',
                STATUS_IMAGE: 'SELFIE',
                STATUS_SYNC: 'N',
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                INSERT_TIME: insertTime
            }
            TaskService.saveData('TR_IMAGE', selfie);

            if (this.state.kondisiBaris1 !== 'undefined') {
                for (var i = 0; i < this.state.kondisiBaris1.length; i++) {
                    var model = this.state.kondisiBaris1[i];
                    mdl = {
                        BLOCK_INSPECTION_CODE_D: model.BLOCK_INSPECTION_CODE_D,
                        BLOCK_INSPECTION_CODE: model.BLOCK_INSPECTION_CODE,
                        ID_INSPECTION: model.ID_INSPECTION,
                        CONTENT_INSPECTION_CODE: model.CONTENT_INSPECTION_CODE,
                        VALUE: model.VALUE,
                        AREAL: this.state.dataUsual.BARIS,
                        STATUS_SYNC: 'N',
                        INSERT_USER: this.state.dataUsual.USER_AUTH,
                        INSERT_TIME: insertTime

                    }
                    TaskService.saveData('TR_BLOCK_INSPECTION_D', mdl);
                }
            }

            if (this.state.kondisiBaris2 !== 'undefined') {
                for (var i = 0; i < this.state.kondisiBaris2.length; i++) {
                    var model = this.state.kondisiBaris2[i];
                    mdl = {
                        BLOCK_INSPECTION_CODE_D: model.BLOCK_INSPECTION_CODE_D,
                        BLOCK_INSPECTION_CODE: model.BLOCK_INSPECTION_CODE,
                        ID_INSPECTION: model.ID_INSPECTION,
                        CONTENT_INSPECTION_CODE: model.CONTENT_INSPECTION_CODE,
                        VALUE: model.VALUE,
                        AREAL: this.state.dataUsual.BARIS,
                        STATUS_SYNC: 'N',
                        INSERT_USER: this.state.dataUsual.USER_AUTH,
                        INSERT_TIME: insertTime
                    }
                    TaskService.saveData('TR_BLOCK_INSPECTION_D', mdl);
                }
            }

            let getBarisInspection = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION);
            if (getBarisInspection !== null && typeof getBarisInspection !== undefined) {
                TaskService.deleteRecordByPK('TR_BARIS_INSPECTION', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION);
            }

            let dataInspeksiRemoveDuplicate = this.state.dataInspeksi;
            dataInspeksiRemoveDuplicate.TR_FINDING_CODES = [...new Set(dataInspeksiRemoveDuplicate.TR_FINDING_CODES)];
            TaskService.saveData('TR_BARIS_INSPECTION', dataInspeksiRemoveDuplicate);

            //TAMBAHAN GEMBA

            if (this.state.inspectionType === "genba") {
                let selectedGenbaUser = TaskServices.getAllData("TR_GENBA_SELECTED");
                let model_TR_GENBA_INSPECTION = {
                    BLOCK_INSPECTION_CODE: this.state.inspeksiHeader.BLOCK_INSPECTION_CODE,
                    GENBA_USER: selectedGenbaUser,
                    STATUS_SYNC: "N"
                }
                TaskService.saveData("TR_GENBA_INSPECTION", model_TR_GENBA_INSPECTION);
            }
        }

        let today = getTodayDate('YYMMDDHHmmss');
        let blokInspectionCode = `I${this.state.dataUsual.USER_AUTH}${today}`
        var params = {
            USER_AUTH: this.state.dataUsual.USER_AUTH,
            BA: this.state.dataUsual.BA,
            AFD: this.state.dataUsual.AFD,
            BLOK: this.state.dataUsual.BLOK,
            BARIS: this.state.txtBaris,
            BLOCK_INSPECTION_CODE: blokInspectionCode
        }

        if (this.state.fulFillMandatory) {
            this.calculate();
        } else {

            let param = this.calculateBaris(this.state.dataUsual.BLOCK_INSPECTION_CODE)
            TaskService.updateInspectionHScore(this.state.dataUsual.BLOCK_INSPECTION_CODE, param)

            var modelInspeksi = {
                BLOCK_INSPECTION_CODE: blokInspectionCode,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                WERKS: this.state.inspeksiHeader.WERKS,
                AFD_CODE: this.state.inspeksiHeader.AFD_CODE,
                BLOCK_CODE: this.state.inspeksiHeader.BLOCK_CODE,
                AREAL: this.state.txtBaris,
                INSPECTION_TYPE: "PANEN",
                STATUS_BLOCK: this.state.inspeksiHeader.STATUS_BLOCK,
                INSPECTION_DATE: this.state.inspeksiHeader.INSPECTION_DATE,
                INSPECTION_SCORE: '',
                INSPECTION_RESULT: '',
                STATUS_SYNC: 'N',
                SYNC_TIME: '',
                START_INSPECTION: insertTime,
                END_INSPECTION: '',
                LAT_START_INSPECTION: this.state.inspeksiHeader.LAT_START_INSPECTION,
                LONG_START_INSPECTION: this.state.inspeksiHeader.LONG_START_INSPECTION,
                LAT_END_INSPECTION: '',
                LONG_END_INSPECTION: '',
            }
            let model = {
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                BLOCK_INSPECTION_CODE: blokInspectionCode,
                EST_NAME: this.state.dataInspeksi.EST_NAME,
                WERKS: this.state.dataInspeksi.WERKS,
                BLOCK_CODE: this.state.dataInspeksi.BLOCK_CODE,
                AFD_CODE: this.state.dataInspeksi.AFD_CODE,
                WERKS_AFD_BLOCK_CODE: this.state.dataInspeksi.WERKS_AFD_BLOCK_CODE,
                INSPECTION_DATE: this.state.dataInspeksi.INSPECTION_DATE,
                STATUS_SYNC: 'N',
                INSPECTION_RESULT: '',
                INSPECTION_SCORE: '',
                FULFILL_BARIS: this.state.dataInspeksi.FULFILL_BARIS,
                TR_FINDING_CODES: []
            }

            if (this.state.from !== 'history') {
                //for track
                clearInterval(this.state.intervalId)
            }

            let time = TaskService.getAllData('TM_TIME_TRACK')[0];
            let duration = 10000
            if (time !== undefined) {
                duration = parseFloat(time.DESC);
            }
            let id = 0;//setInterval(()=> this.getLocation2(blokInspectionCode), duration);
            this.navigateScreen('TakeFotoBaris', params, modelInspeksi, model, id);

            // REMOVE ASYNSTORAGE MAPS
            // removeData('PoligonsInspeksi');
        }

    }

    getLocation2(blokInsCode) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.insertTrackLokasi(blokInsCode, lat, lon)
            },
            (error) => {
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    insertTrackLokasi(blokInsCode, lat, lon) {
        try {
            var curr = getTodayDate('YYMMDDkkmmss');
            var trInsCode = `T${this.state.dataUsual.USER_AUTH}${curr}`;
            // var today = getTodayDate('YYYY-MM-DD HH:mm:ss');
            data = {
                TRACK_INSPECTION_CODE: trInsCode,
                BLOCK_INSPECTION_CODE: blokInsCode,
                DATE_TRACK: curr,
                LAT_TRACK: lat.toString(),
                LONG_TRACK: lon.toString(),
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                INSERT_TIME: curr,
                STATUS_SYNC: 'N'
            }
            TaskService.saveData('TM_INSPECTION_TRACK', data)
        } catch (error) {
            alert('insert track lokasi baris akhir inspeksi ' + error)
        }
    }

    navigateScreen(screenName, params, inspeksiH, dataInspeksi, intervalId) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: screenName, params: {
                    dataUsual: params,
                    inspeksiHeader: inspeksiH,
                    from: 'kondisiBaris',
                    statusBlok: this.state.statusBlok,
                    intervalId: intervalId,
                    dataInspeksi: dataInspeksi,
                    inspectionType: this.state.inspectionType === 'genba' ? 'genba' : 'normal'
                }
            })]
        });
        navigation.dispatch(resetAction);
    }

    onMapReady() {
        //lakukan aoa yg mau dilakukan disini setelah map selesai
        this.map.animateToCoordinate(this.state.region, 1)
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
                />
                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    title={this.state.title}
                    message={this.state.message} />

                {/*STEPPER*/}
                <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.brand }]}>
                            <Text style={styles.stepperNumberText}>1</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.brand }]}>Pilih Lokasi</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.brand}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.buttonDisabled }]}>
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary }]}>Kondisi Baris</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.buttonDisabled}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.buttonDisabled }]}>
                            <Text style={styles.stepperNumberText}>3</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary }]}>Summary</Text>
                    </View>
                </View>

                {/*MAPS*/}
                <View style={styles.containerMap}>
                    {this.state.latitude !== 0.0 && this.state.longitude !== 0.0 &&
                        <MapView
                            ref={map => this.map = map}
                            provider={this.props.provider}
                            style={styles.map}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                            showsCompass={true}
                            showScale={true}
                            showsIndoors={true}
                            initialRegion={this.state.region}
                            followsUserLocation={true}
                            onMapReady={() => this.onMapReady()}
                        >
                            {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
                                <View key={index}>
                                    <Polygon
                                        coordinates={poly.coords}
                                        fillColor="rgba(0, 200, 0, 0.5)"
                                        strokeColor="rgba(0,0,0,0.5)"
                                        strokeWidth={2}
                                        tappable={true}
                                    />
                                    <Marker
                                        ref={ref => poly.marker = ref}
                                        coordinate={this.centerCoordinate(poly.coords)}>
                                        <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                                            <View style={styles.marker}>
                                                <Text style={{ color: '#000000', fontSize: 20 }}>{poly.blokname}</Text>
                                            </View>
                                        </View>
                                    </Marker>
                                </View>
                            ))}
                            <Marker
                                coordinate={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,
                                }}
                                centerOffset={{ x: -42, y: -60 }}
                                anchor={{ x: 0.84, y: 1 }}
                            >
                            </Marker>

                            <Polyline
                                coordinates={this.state.polyTrack}
                                strokeColor="#7F0000"
                                strokeWidth={3}
                            />
                        </MapView>
                    }

                    {/* <IconLoc
                        onPress={() => { this.searchLocation() }}
                        name="location-arrow"
                        size={24}
                        style={{ alignSelf: 'flex-start', marginBottom: 210, marginLeft: 10 }} /> */}

                    <View style={{ height: 250, marginLeft: 20, marginRight: 20 }}>
                        <Card style={[styles.cardContainer]}>
                            <CardItem>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: 'black' }}>Total Waktu dan Jarak:</Text>
                                    <Text style={{ color: 'black' }}>{this.state.menit} Menit dan {this.state.jarak} m</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{ color: 'grey' }}>Lanjut Baris Berikutnya ?</Text>
                                        <Switch
                                            thumbTintColor={this.state.switchLanjut ? Colors.brand : 'red'}
                                            onTintColor={'#5bc236'}
                                            tintColor={'#ff8080'}
                                            onValueChange={(value) => { this.setState({ switchLanjut: value }); this.changeColorSlide() }}
                                            // style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginBottom: 10, position: 'absolute', right: 0 }}
                                            style={{ marginBottom: 10, position: 'absolute', right: 0 }}
                                            value={this.state.switchLanjut} />
                                    </View>
                                    {this.state.switchLanjut &&
                                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                            <Text style={{ color: 'grey', marginTop: 15 }}>ke Baris Berapa ?</Text>
                                            <TextInput
                                                keyboardType={'numeric'}
                                                underlineColorAndroid={'transparent'}
                                                style={[styles.searchInput, { marginBottom: 10, position: 'absolute', right: 0 }]}
                                                value={this.state.txtBaris}
                                                onChangeText={(baris) => {
                                                    baris = baris.replace(/[^0-9]/g, '');
                                                    if (baris !== "0") {
                                                        this.setState({ txtBaris: baris })
                                                    }
                                                }} />
                                        </View>
                                    }
                                    {/*SLIDER*/}
                                    <View style={{ padding: 10, alignItems: 'center', marginTop: 15 }}>
                                        <RNSlidingButton
                                            style={styles.buttonSlide}
                                            height={45}
                                            onSlidingSuccess={this.onSlideRight}
                                            slideDirection={SlideDirection.RIGHT}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={[styles.bubble, this.state.tumbButtonSlide]} onPress={() => { }}>
                                                    <Icon name={"chevron-right"} size={20} color="white" />
                                                </TouchableOpacity>
                                                <Text numberOfLines={1} style={[styles.titleText, { alignItems: 'center' }]}>
                                                    {this.state.switchLanjut ? 'Lanjut' : 'Selesai'}
                                                </Text>
                                            </View>
                                        </RNSlidingButton>
                                    </View>
                                </View>
                            </CardItem>
                        </Card>
                    </View>

                </View>

                {<ProgressDialog
                    visible={this.state.fetchLocation}
                    activityIndicatorSize="large"
                    message="Mencari Lokasi..."
                />}

            </View>
        )
    }
}

KondisiBarisAkhir.propTypes = {
    provider: ProviderPropType,
};


const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
        // padding:20
    },
    containerStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    stepperNumber: {
        height: 24,
        width: 24,
        backgroundColor: Colors.buttonDisabled,
        borderRadius: 12,
        justifyContent: 'center'
    },
    stepperNumberText: [Fonts.style.caption, { textAlign: 'center', color: Colors.textDark }],
    stepperNext: { alignSelf: 'flex-end', paddingRight: 4 },
    containerMap: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    cardContainer: {
        width: 300,
        paddingTop: 10,
        paddingBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    searchInput: {
        width: 60,
        height: 40,
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#989898',
        color: '#808080',
        textAlign: 'center'
    },
    buttonSlide: {
        width: 200,
        borderRadius: 20,
        backgroundColor: '#DCDCDC',
    },
    bubble: {
        backgroundColor: Colors.tintColor,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    titleText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#A9A9A9',
        paddingHorizontal: 18,
        paddingVertical: 12,

    }
    // bubble: {
    //     backgroundColor: '#ff8080',
    //     paddingHorizontal: 18,
    //     paddingVertical: 12,
    //     borderRadius: 20,
    // },
    // buttonText: {
    //     fontSize:17,
    //     color:'#ffffff',
    //     textAlign:'center'
    // },
    // button: {
    //     width: 200,
    //     paddingHorizontal: 12,
    //     alignItems: 'center',
    //     marginHorizontal: 10,
    //     padding:10 ,
    // },
    // buttonContainer: {
    //     flexDirection: 'row',
    //     marginVertical: 20,
    //     backgroundColor: 'transparent',
    // },
}

export default KondisiBarisAkhir;