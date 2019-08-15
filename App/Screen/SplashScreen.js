
import React, { Component } from 'react';
import {ImageBackground, StatusBar, Text, AppRegistry, Linking} from 'react-native';
import { Container } from 'native-base'
import { NavigationActions, StackActions } from 'react-navigation';
import { getPermission } from '../Lib/Utils'
import { connect } from 'react-redux';
import TaskServices from '../Database/TaskServices'
import CategoryAction from '../Redux/CategoryRedux'
import ContactAction from '../Redux/ContactRedux'
import RegionAction from '../Redux/RegionRedux'
import R from 'ramda'
import { dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie,
    dirPhotoTemuan, dirPhotoKategori, dirPhotoEbccJanjang, dirPhotoEbccSelfie, dirMaps, dirPhotoUser } from '../Lib/dirStorage';
import moment from 'moment'
import geolib from 'geolib';
import DeviceInfo from "react-native-device-info";
import ModalAlert from "../Component/ModalAlert";

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

            modalUpdate:{
                title: 'Title',
                message: 'Message',
                showModal: false,
                icon: '',
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
        let data = TaskServices.getAllData('TR_LOGIN')
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

    makeFolder() {
        //buat Folder DiExtrnal
        RNFS.mkdir('file:///storage/emulated/0/MobileInspection');
        //buat folder internal
        RNFS.mkdir(dirPhotoInspeksiBaris);
        RNFS.mkdir(dirPhotoInspeksiSelfie);
        RNFS.mkdir(dirPhotoTemuan);
        RNFS.mkdir(dirPhotoKategori);
        RNFS.mkdir(dirPhotoEbccJanjang);
        RNFS.mkdir(dirPhotoEbccSelfie);
        RNFS.mkdir(dirPhotoUser);
        RNFS.mkdir(dirMaps);
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                position = {
                    latitude: lat, longitude: lon
                }
                this.setState({ position })
                let data = skm.data.polygons
                for (var i = 0; i < data.length; i++) {
                    let coords = data[i];
                    if (geolib.isPointInside(position, coords.coords)) {
                        alert(coords.blokname)
                        break;
                    }
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

    componentWillMount() {
        // this.getLocation()
        this.checkUpdate();
    }

    async componentDidMount() {
        var isAllGrandted = await getPermission();
        if (isAllGrandted === true) {
            this.makeFolder()
            setTimeout(() => {
                if(!this.state.modalUpdate.showModal){
                    this.checkUser();
                }
            }, 2000);
        } else {
            Alert.alert('Seluruh Permission harus di hidupkan')
        }
    }

    checkUpdate(){
        let TRCONFIG = TaskServices.getAllData("TR_CONFIG")[0];
        if(TRCONFIG !== undefined){
            if(TRCONFIG.FORCE_UPDATE){
                this.setState({
                    modalUpdate:{
                        title: 'Versi Aplikasi',
                        message: 'Kamu harus lakukan update aplikasi',
                        showModal: true,
                        icon: require('../Images/icon/icon_update_apps.png'),
                    }
                })
            }
        }
    }


    render() {
        return (
            <Container>
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
                <StatusBar
                    hidden={true}
                    barStyle="light-content"
                />
                <ImageBackground source={require('../Images/splash.png')} style={{ flex: 1 }} />

            </Container>

        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        categoryRequest: () => dispatch(CategoryAction.categoryRequest()),
        contactRequest: () => dispatch(ContactAction.contactRequest()),
        regionRequest: () => dispatch(RegionAction.regionRequest())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
