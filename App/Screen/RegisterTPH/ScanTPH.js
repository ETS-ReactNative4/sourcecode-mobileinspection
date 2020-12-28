import React, { Component } from "react";
import { Image, StyleSheet, View, BackHandler, Text } from "react-native"
import { RNCamera } from "react-native-camera"
import base64 from 'react-native-base64'
import moment from 'moment'
import { getTodayDate } from '../../Lib/Utils'
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from "../../Database/TaskServices";
import ModalAlertQrCode from "../../Component/ModalAlertQrCode";
import HeaderDefault from "../../Component/Header/HeaderDefault";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Fonts } from "../../Themes";


class Scanner extends Component {
    constructor(props) {
        super(props);

        const location = props.navigation.getParam('location');

        this.state = {
            // qrcode: "",
            currentDate: getTodayDate('YYMMDDkkmmss'),

            //modal
            showModal: false,
            title: null,
            message: null,
            icon: null,
            qrDecode: null,
            tph: "",

            // your other states
            barcodeType: '',
            barcodeValue: null,
            isBarcodeRead: false, //
            isFocused: true,

            location: location
        };


        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.camera;
            this.setState({ isFocused: true, isBarcodeRead: false, barcodeType: '', qrDecode: null })
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

    componentWillUnmount() {
        this.focusListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    onBarCodeRead = event => {
        // //tph-afd-werks-blockcode
        // //002-1-4122-235
        if (!this.state.showModal) {
            let decode = base64.decode(event.data)
            // let decode = event.data;

            if (decode.length == 14) {
                const splitBlockCodeTPH = decode.split("-");
                let queryBlock = TaskServices.findBy2("TM_BLOCK", "BLOCK_CODE", splitBlockCodeTPH[3].toString())
                
                if (this.state.location.block_code == splitBlockCodeTPH[3].toString()) {
                    this.setState({
                        isBarcodeRead: true,
                        showModal: true,
                        isFocused: false,
                        title: "Scan QR CODE TPH Berhasil",
                        message: "Kamu bisa lanjutkan untuk simpan data TPH",
                        icon: require('../../Images/icon/ic_scan_qrcode.png'),
                        qrDecode: decode,
                        tph: decode.substring(0, 3)
                    });
                }
                else {
                    this.setState({
                        isBarcodeRead: false,
                        isFocused: false,
                        showModal: true,
                        title: "QR Code TPH Salah",
                        message: `Kamu memilih blok ${this.state.location.block_name} tapi scan QR Code TPH blok ${queryBlock.BLOCK_NAME} `,
                        icon: require('../../Images/icon/ic_scan_qrcode.png')
                    });
                }
            } else {
                this.setState({
                    isBarcodeRead: false,
                    isFocused: false,
                    showModal: true,
                    title: "Scan TPH Gagal",
                    message: "QR Code tidak sesuai",
                    icon: require('../../Images/icon/ic_scan_qrcode.png')
                });
            }
        }
    };


    refRoleAuth(qrCode) {
        let qrCodeValue = qrCode.split("-");

        let loginData = TaskServices.getAllData('TR_LOGIN')[0];
        let userRefCode = loginData.REFFERENCE_ROLE;
        let locationCode = loginData.LOCATION_CODE.split(',');

        let auth = false;
        switch (userRefCode) {
            case 'AFD_CODE':
                locationCode.map((data) => {
                    if (data === qrCodeValue[2] + qrCodeValue[1]) {
                        auth = true;
                    }
                });
                return auth;
            case 'BA_CODE':
                locationCode.map((data) => {
                    if (data.includes(qrCodeValue[2])) {
                        auth = true;
                    }
                });
                return auth;
            case 'COMP_CODE':
                locationCode.map((data) => {
                    if (data.slice(0, 2) === qrCodeValue[2].slice(0, 2)) {
                        auth = true;
                    }
                });
                return auth;
            case 'REGION_CODE':
                let trEst = TaskServices.findBy2('TM_EST', 'WERKS', qrCodeValue[2]);
                if (trEst !== undefined) {
                    locationCode.map((data) => {
                        if (data === trEst.REGION_CODE) {
                            auth = true;
                        }
                    })
                }
                return auth;
            case 'NATIONAL':
                return true;
            default:
                return false;
        }
    }

    navigateScreen(screenName, decode) {
        this.setState({ isFocused: false })
        this.props.navigation.navigate(screenName, {
            params: {
                statusScan: 'AUTOMATIC',
                tphAfdWerksBlockCode: decode,
                reason: ''
            }
        });
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                var timestamp = moment(position.timestamp).format('YYMMDDkkmmss');
                setState({ currentDate: timestamp, latitude: lat, longitude: lon })
            },
            (error) => {
                // this.setState({ error: error.message, fetchingLocation: false })
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    _backToRegisterScreen = (location) => {
        this.setState({
            showModal: false,
            isBarcodeRead: false,
            isFocused: true
        })


        let loginData = TaskServices.getAllData('TR_LOGIN')[0];

        var qrCodeTPH = this.state.tph + "-" + location.afd_code + "-" + location.werks + "-" + location.block_code
        const obj = {
            QRCODE_TPH: qrCodeTPH,
            WERKS: location.werks,
            AFD_CODE: location.afd_code,
            BLOCK_CODE: location.block_code,
            NO_TPH: this.state.tph,
            LAT_TPH: location.latitude.toString(),
            LON_TPH: location.longitude.toString(),
            STATUS_SYNC: "N",
            SYNC_TIME: "",
            INSERT_USER: loginData.USERNAME,
            INSERT_TIME: moment().format("YYYY-MM-DD HH:mm:ss")
        }

        console.log('Obj : ', obj);

        TaskServices.saveData('TR_REGISTER_TPH', obj);

        this.props.navigation.state.params._updateDataMarkers(this.state.tph);
        this.props.navigation.goBack();
        // this.navigateScreen('DeliveryTicketQrCode', this.state.qrDecode);
    }

    render() {

        const { isBarcodeRead, isFocused } = this.state;
        return (
            <View style={styles.container}>
                <HeaderDefault title={'Scan TPH'} onPress={() => this.handleBackButtonClick()} />
                <ModalAlertQrCode
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    closeText={this.state.qrDecode !== null ? "LANJUT" : "TUTUP"}
                    onPressCancel={() => {
                        this.setState({
                            isBarcodeRead: false,
                            showModal: false,
                            qrDecode: null,
                            isFocused: true
                        })
                    }}
                    onPressButton={() => {
                        if (this.state.qrDecode !== null) {
                            this._backToRegisterScreen(this.state.location);
                        } else {
                            this.setState({ showModal: false, qrDecode: null, isFocused: true })
                        }
                    }
                    }
                    title={this.state.title}
                    message={this.state.message} />

                {/* {isFocused && <RNCamera
          barCodeTypes={isBarcodeRead ? [] : defaultBarcodeTypes}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          ref={cam => (this.camera = cam)}>
        </RNCamera>} */}

                <Text style={{ fontFamily: Fonts.book, paddingHorizontal: 16, textAlign: "center", alignSelf: 'center', paddingTop: 40 }}>
                    Tips : Scan QR Code TPH dengan benar.{"\n"}
          Pastikan TPH bersih {"&"} arahkan kamera ponsel ke QR code sehingga berada dalam kotak yang terlihat di layar.
          </Text>

                {isFocused && <QRCodeScanner
                    flashMode={RNCamera.Constants.FlashMode.off}
                    onRead={this.onBarCodeRead}>
                </QRCodeScanner>}


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    preview: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    }
});

export default Scanner;
