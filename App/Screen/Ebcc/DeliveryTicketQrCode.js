import React, { Component } from "react";
import { StyleSheet, View, BackHandler, StatusBar } from "react-native"
import { RNCamera } from "react-native-camera"
import base64 from 'react-native-base64'
import moment from 'moment'
import { getTodayDate } from '../../Lib/Utils'
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from "../../Database/TaskServices";
import ModalAlertQrCode from "../../Component/ModalAlertQrCode";
import HeaderDefault from "../../Component/Header/HeaderDefault";
import Colors from "../../Constant/Colors";
import R from 'ramda';

const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.qr];

class Scanner extends Component {
  constructor(props) {

    const params = props.navigation.getParam('params');

    super(props);
    this.state = {
      tphAfdWerksBlockCode: params.tphAfdWerksBlockCode,
      statusScan: params.statusScan,
      reason: params.reason,
      // qrcode: "",
      currentDate: getTodayDate('YYMMDDkkmmss'),

      //modal
      showModal: false,
      title: null,
      message: null,
      icon: null,
      qrDecode: null,

      barcodeType: '',
      barcodeValue: '',
      isBarcodeRead: false,
      buttonText: 'Tutup',
      isFocused: true
    };


    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({ isBarcodeRead: false, isFocused: true })
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    this.focusListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  }

  onBarCodeRead = e => {
    //tph-afd-werks-blockcode
    //002-1-4122-235
    if (!this.state.showModal) {
      let decode = e.data;
      if (decode.length > 5) {
        this.setState({
          buttonText: 'TUTUP',
          isBarcodeRead: false,
          showModal: true,
          title: "Scan Delivery Ticket Gagal",
          message: "QR Code tidak sesuai",
          icon: require('../../Images/icon/ic_scan_qrcode.png'),
          qrDecode: decode
        });
      } else {
        this.setState({
          buttonText: 'LANJUT',
          isBarcodeRead: true,
          showModal: true,
          title: "Scan Delivery Ticket Berhasil",
          message: "Kamu bisa lanjutkan untuk foto janjang",
          icon: require('../../Images/icon/ic_scan_qrcode.png'),
          qrDecode: decode
        });
      }

    }
  };

  navigateScreen(screenName, decode) {

    this.setState({
      isFocused: false
    })

    const navigation = this.props.navigation;

    navigation.navigate(screenName, {
      params: {
        statusScan: this.state.statusScan,
        tphAfdWerksBlockCode: this.state.tphAfdWerksBlockCode,
        deliveryTicket: decode,
        reason: this.state.reason
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

  takePicture = async () => {
    try {
      const takeCameraOptions = {
        // quality : 0.5,  //just in case want to reduce the quality too
        skipProcessing: false,
        fixOrientation: true
      };
      const data = await this.camera.takePictureAsync(takeCameraOptions);
      // alert(JSON.stringify(data.uri))

    } catch (err) {
      console.log('err: ', err);
    }
  };

  render() {

    const { isFocused } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.tintColorPrimary} />
        <HeaderDefault title={'Scan Delivery Ticket'} onPress={() => this.handleBackButtonClick()} />
        <ModalAlertQrCode
          icon={this.state.icon}
          visible={this.state.showModal}
          closeText={this.state.buttonText}
          onPressCancel={() => {
            this.setState({
              isBarcodeRead: false,
              showModal: false,
              qrDecode: null
            })
          }}
          onPressButton={() => {
            if (this.state.qrDecode !== null) {
              if (this.state.buttonText == 'LANJUT') {
                this.navigateScreen('FotoJanjang', this.state.qrDecode);
                this.setState({
                  showModal: false
                })
              } else {
                console.log('Masuk Sini')
                this.setState({ showModal: false, qrDecode: null })
              }
            }
          }}
          title={this.state.title}
          message={this.state.message} />

        {isFocused && <RNCamera
          barCodeTypes={this.state.isBarcodeRead ? [] : defaultBarcodeTypes}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          ref={cam => (this.camera = cam)}>
        </RNCamera>}
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
