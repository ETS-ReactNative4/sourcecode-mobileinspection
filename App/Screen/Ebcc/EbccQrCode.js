import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image
} from "react-native"
import { RNCamera } from "react-native-camera"
import Colors from '../../Constant/Colors'
import base64 from 'react-native-base64'
import ActionButton from 'react-native-action-button'
import moment from 'moment'
import { getTodayDate } from '../../Lib/Utils'

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // qrcode: "",
      currentDate: getTodayDate('YYMMDDkkmmss')
    };
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: Colors.tintColorPrimary
    },
    title: 'Scan TPH',
    headerTintColor: '#fff',
    headerTitleStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '400'
    },
  };

  onBarCodeRead = e => {
    //tph-afd-werks-blockcode
    //002-1-4122-235
    let decode = base64.decode(e.data)
    this.props.navigation.navigate('FotoJanjang',{ 
      tphAfdWerksBlockCode: decode
    });

    // let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
    // let data = {
    //   USER_AUTH: dataLogin.USER_AUTH_CODE,
    //   TPH_AFD_WERKS_BLOCKCODE: decode
    // }

    // this.setState({ qrcode: decode });
  };

  getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);   
            var timestamp = moment(position.timestamp).format('YYMMDDkkmmss');
            setState({currentDate: timestamp})
                     
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

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={styles.preview}
          onBarCodeRead={this.onBarCodeRead}
          ref={cam => (this.camera = cam)}
        >
          {/* <Text
            style={{
              backgroundColor: "white"
            }}
          >
            {this.state.qrcode}
          </Text> */}

          <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
            buttonColor={'transparent'}
            // onPress={() => { this.actionButtonClick() }}
            icon={<Image source={require('../../Images/icon-tdk-bs-scan.png')} style={{ height: 45, width: 45 }} />}>
          </ActionButton>

        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});

export default Scanner;