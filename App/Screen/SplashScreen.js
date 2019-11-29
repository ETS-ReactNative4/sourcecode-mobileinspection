import React, { Component } from 'react';
import { View, ImageBackground, Linking, StatusBar, BackHandler } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { NavigationActions, StackActions } from 'react-navigation';
import { getPermission } from '../Lib/Utils'
import TaskServices from '../Database/TaskServices'
import {
    dirSummary,
    dirMaps,
    dirPhotoEbccJanjang,
    dirPhotoEbccSelfie,
    dirPhotoInspeksiBaris,
    dirPhotoInspeksiSelfie,
    dirPhotoKategori,
    dirPhotoTemuan,
    dirPhotoUser, dirDatabase
} from '../Lib/dirStorage';
import ModalAlert from "../Component/ModalAlert";
import { retrieveData } from '../Database/Resources';
import { Images } from '../Themes';
import { createNotificationChannel, getFCMToken } from '../Notification/NotificationListener';

var RNFS = require('react-native-fs');
const skm = require('../Data/MegaKuningan.json');

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            json: '',
            value: true,
            showModal: true,
            position: null,

            modalUpdate: {
                title: 'Title',
                message: 'Message',
                showModal: false,
                icon: '',
                titleType: ''
            }
        }
    }

    static navigationOptions = {
        header: null
    }

    navigateScreen(screenName) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: screenName })],
        });
        navigation.dispatch(resetAction);
    }

    checkUser() {

        retrieveData('expiredToken').then((token) => {
            if (token != null) {
                const dateToday = new Date();
                const dateExpired = new Date(token.tanggal);
                let data = TaskServices.getAllData('TR_LOGIN')

                if (dateToday > dateExpired) {
                    this.navigateScreen('Login');
                } else {
                    if (data !== undefined && data.length > 0) {
                        if (data[0].STATUS == 'LOGIN') {
                            if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
                                this.navigateScreen('MainMenuMil');
                            } else {
                                this.navigateScreen('MainMenu');
                            }
                        } else {
                            this.navigateScreen('Login');
                        }
                    } else {
                        this.navigateScreen('Login');
                    }
                }
            } else {
                this.navigateScreen('Login');
            }
        })

    }

    makeFolder() {
        //di pake untuk export database, copy semua file ke mobileinspection folder
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.fs.mkdir(dirs.SDCardDir + "/" + "MobileInspection");
        //buat folder internal
        RNFS.mkdir(dirDatabase);
        RNFS.mkdir(dirSummary);
        RNFS.mkdir(dirPhotoInspeksiBaris);
        RNFS.mkdir(dirPhotoInspeksiSelfie);
        RNFS.mkdir(dirPhotoTemuan);
        RNFS.mkdir(dirPhotoKategori);
        RNFS.mkdir(dirPhotoEbccJanjang);
        RNFS.mkdir(dirPhotoEbccSelfie);
        RNFS.mkdir(dirPhotoUser);
        RNFS.mkdir(dirMaps);
    }

    detectFakeGPS() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Mocked : ', position.mocked)
                if (position.mocked) {
                    this.validateType(position.mocked)
                }

            },
            (error) => {
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }

            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    validateType(type) {
        retrieveData('typeApp').then(data => {
            if (data != null) {
                if (data == 'PROD') {
                    this.setState({
                        modalUpdate: {
                            title: 'Lokasi Palsu Terdeteksi',
                            message: 'Kamu harus non-aktifkan lokasi palsu untuk bisa menggunakan Mobile Inspection',
                            showModal: true,
                            icon: Images.ic_blm_input_lokasi,
                            titleType: 'KEMBALI'
                        },
                        type: 'mock'
                    })
                }
            }
        })
    }


    async componentDidMount() {

        var isAllGrandted = await getPermission();
        if (isAllGrandted === true) {

            this.checkUpdate();
            this.detectFakeGPS();

            createNotificationChannel();
            await getFCMToken()
                .then((token)=>{
                    console.log("token",token);
                });

            this.makeFolder()
            setTimeout(() => {
                if (!this.state.modalUpdate.showModal) {
                    this.checkUser();
                }
            }, 2000);
        } else {
            Alert.alert('Seluruh Permission harus di hidupkan')
        }
    }

    checkUpdate() {
        let TRCONFIG = TaskServices.getAllData("TR_CONFIG")[0];
        if (TRCONFIG !== undefined) {
            if (TRCONFIG.FORCE_UPDATE) {
                this.setState({
                    modalUpdate: {
                        title: 'Versi Aplikasi',
                        message: 'Kamu harus lakukan update aplikasi',
                        showModal: true,
                        icon: require('../Images/icon/icon_update_apps.png'),
                        titleType: 'UPDATE'
                    },
                    type: 'update'
                })
            }
        }
    }


    render() {
        return (
            <View>
                <ModalAlert
                    icon={this.state.modalUpdate.icon}
                    visible={this.state.modalUpdate.showModal}
                    onPressCancel={() => {
                        if (this.state.type == 'update') {
                            Linking.openURL("market://details?id=com.bluezoneinspection.app")
                        } else {
                            BackHandler.exitApp();
                        }
                    }}
                    title={this.state.modalUpdate.title}
                    message={this.state.modalUpdate.message}
                    closeText={this.state.modalUpdate.titleType}
                />
                <StatusBar
                    hidden={true}
                    barStyle="light-content"
                />
                <ImageBackground source={require('../Images/splash.png')} style={{ flex: 1 }} />

            </View>

        )
    }
}

export default SplashScreen;
