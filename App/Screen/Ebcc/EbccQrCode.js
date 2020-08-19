import React, { Component } from "react";
import { Image, StyleSheet, View, BackHandler } from "react-native"
import { RNCamera } from "react-native-camera"
import Colors from '../../Constant/Colors'
import base64 from 'react-native-base64'
import ActionButton from 'react-native-action-button'
import moment from 'moment'
import { getTodayDate, isNotUserMill } from '../../Lib/Utils'
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from "../../Database/TaskServices";
import ModalAlertQrCode from "../../Component/ModalAlertQrCode";
import HeaderDefault from "../../Component/Header/HeaderDefault";

const defaultBarcodeTypes = [RNCamera.Constants.BarCodeType.qr];


class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // qrcode: "",
      currentDate: getTodayDate('YYMMDDkkmmss'),

      //modal
      showModal: false,
      title: null,
      message: null,
      icon: null,
      qrDecode: null,

      // your other states
      barcodeType: '',
      barcodeValue: null,
      isBarcodeRead: false, //
      isFocused: true
    };


    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      console.log('Masuk Did Focus')
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
    const data = TaskServices.getAllData('TR_LOGIN')
    const { navigation } = this.props;
    if (data != undefined) {
      if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
        Promise.all([
          navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'MainMenuMil' })]
            })
          )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'))
      } else {
        Promise.all([
          navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'MainMenu' })]
            })
          )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'))
      }
    }
    return true;
  }

  onBarCodeRead = event => {
    // //tph-afd-werks-blockcode
    // //002-1-4122-235
    if (!this.state.showModal) {
      let decode = base64.decode(event.data)
      if (this.refRoleAuth(decode)) {
        this.setState({
          isBarcodeRead: true,
          showModal: true,
          title: "Scan QR CODE TPH Berhasil",
          message: "Kamu bisa lanjutkan untuk scan delivery ticket",
          icon: require('../../Images/icon/ic_scan_qrcode.png'),
          qrDecode: decode
        });
      }
      else {
        this.setState({
          isBarcodeRead: true,
          showModal: true,
          title: "Bukan Wilayah Otorisasimu",
          message: "Kamu tidak bisa sampling EBCC di wilayah ini",
          icon: require('../../Images/ic-blm-input-lokasi.png')
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

  goingManual() {
    // this.navigateScreen('ReasonManualTPH', '');
    this.props.navigation.navigate('ReasonManualTPH', {
      statusScan: 'MANUAL'
    })
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
              qrDecode: null
            })
          }}
          onPressButton={() => {
            if (this.state.qrDecode !== null) {
              this.setState({
                showModal: false,
                isBarcodeRead: false,
              })
              this.navigateScreen('DeliveryTicketQrCode', this.state.qrDecode);
            }
          }
          }
          title={this.state.title}
          message={this.state.message} />

        {isFocused && <RNCamera
          barCodeTypes={isBarcodeRead ? [] : defaultBarcodeTypes}
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
