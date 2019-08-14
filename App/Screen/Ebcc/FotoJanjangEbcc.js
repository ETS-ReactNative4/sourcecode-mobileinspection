import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Dimensions,
  StatusBar,
  BackHandler
} from 'react-native';
import Colors from '../../Constant/Colors';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import MapView, { Polygon, ProviderPropType, Marker } from 'react-native-maps';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoEbccJanjang } from '../../Lib/dirStorage'
import TaskService from '../../Database/TaskServices'
import R from 'ramda';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { NavigationActions, StackActions } from 'react-navigation';

import ModalAlertConfirmation from '../../Component/ModalAlertConfirmation';
import ModalAlert from '../../Component/ModalAlert';

var RNFS = require('react-native-fs');
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

class FotoJanjang extends Component {

  // static navigationOptions = {
  //   headerStyle: {
  //     backgroundColor: Colors.tintColorPrimary
  //   },
  //   title: 'Ambil Foto Janjang',
  //   headerTintColor: '#fff',
  //   headerTitleStyle: {
  //     flex: 1,
  //     fontSize: 18,
  //     fontWeight: '400'
  //   },
  // };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: Colors.tintColorPrimary
      },
      title: 'Ambil Foto Janjang',
      headerTintColor: '#fff',
      headerTitleStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
      },
      headerLeft: (
        <TouchableOpacity onPress={() => { params.handleBackButtonClick() }}>
          <Icon2 style={{ marginLeft: 12 }} name={'ios-arrow-round-back'} size={45} color={'white'} />
        </TouchableOpacity>
      )
    };
  }

  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let tphAfdWerksBlockCode = R.clone(params.tphAfdWerksBlockCode)
    let statusScan = R.clone(params.statusScan)
    let reason = R.clone(params.reason)

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      hasPhoto: false,
      path: null,
      pathImg: null,
      dataModel: null,
      tphAfdWerksBlockCode,
      reason,
      pathCache: '',
      timestamp: getTodayDate('YYYYMMDDkkmmss'),
      ebccValCode: '',
      dataHeader: null,
      statusScan,
      latitude: 0.0,
      longitude: 0.0,
      track: true,
      title: 'Title',
      message: 'Message',
      showModal: false,
      showModal2: false,
      icon: ''
    };
  }

  componentDidMount() {
    this.setParamImage()
    this.getLocation()
    this.props.navigation.setParams({ handleBackButtonClick: this.handleBackButtonClick })
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.setState({
      showModal: true, title: 'Data Hilang',
      message: 'Datamu belum tersimpan loh. Yakin mau dilanjutin?',
      icon: require('../../Images/ic-not-save.png')
    });
    return true;
  }

  backAndDeletePhoto() {
    if (this.state.hasPhoto) {
      this.deleteFoto()
    }
    const navigation = this.props.navigation;
    let routeName = 'MainMenu';
    this.setState({ showModal: false })
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    Promise.all([
      navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: routeName })]
        })
      )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'))

    // Promise.all([navigation.dispatch(NavigationActions.navigate({ routeName : routeName}))]).
    //   then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'));
  }

  getLocation() {
    this.setParameter();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude);
        var lon = parseFloat(position.coords.longitude);
        this.setState({ latitude: lat, longitude: lon });

      },
      (error) => {
        // this.setState({ error: error.message, fetchingLocation: false })
        let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
        if (error && error.message == "No location provider available.") {
          message = "Mohon nyalakan GPS anda terlebih dahulu.";
        }
        this.setState({
          showModal2: true, title: 'Lokasi GPS',
          message: 'Kamu belum bisa lanjut sebelum lokasi GPS kamu belum ditemukan, lanjut cari lokasi?',
          icon: require('../../Images/ic-no-gps.png')
        });
      }, // go here if error while fetch location
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    );
  }

  deleteFoto() {
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoEbccJanjang}/${this.state.dataModel.IMAGE_NAME}`)
      .then(() => {
        console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
      });
    RNFS.unlink(this.state.path)
    this.setState({ path: null, hasPhoto: false });
  }

  setParamImage() {
    let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
    var imgCode = `VP${dataLogin.USER_AUTH_CODE}${this.state.timestamp}`;
    var imageName = imgCode + '.jpg';
    var arrTph = this.state.tphAfdWerksBlockCode.split('-') //tph-afd-werks-blockcode
    var ebccValCode = `V${dataLogin.USER_AUTH_CODE}${this.state.timestamp}${arrTph[0]}${arrTph[3]}`

    var image = {
      TR_CODE: ebccValCode,
      IMAGE_CODE: imgCode,
      IMAGE_NAME: imageName,
      IMAGE_PATH_LOCAL: dirPhotoEbccJanjang + '/' + imageName,
      IMAGE_URL: '',
      STATUS_IMAGE: 'JANJANG',
      STATUS_SYNC: 'N',
      INSERT_USER: dataLogin.USER_AUTH_CODE,
      INSERT_TIME: getTodayDate('YYYY-MM-DD kk:mm:ss')
    }
    this.setState({ dataModel: image });
  }

  setParameter() {
    let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
    var arrTph = this.state.tphAfdWerksBlockCode.split('-') //tph-afd-werks-blockcode
    var ebccValCode = `V${dataLogin.USER_AUTH_CODE}${this.state.timestamp}${arrTph[0]}${arrTph[3]}`
    var alasan = '';
    if (this.state.reason !== '') {
      alasan = this.state.reason == 'RUSAK' ? '1' : '2'
    }
    var header = {
      EBCC_VALIDATION_CODE: ebccValCode,
      WERKS: arrTph[2],
      AFD_CODE: arrTph[1],
      BLOCK_CODE: arrTph[3],
      NO_TPH: arrTph[0],
      STATUS_TPH_SCAN: this.state.statusScan, //manual dan automatics
      ALASAN_MANUAL: alasan,//1 rusak, 2 hilang
      LAT_TPH: this.state.latitude.toString(),
      LON_TPH: this.state.longitude.toString(),
      DELIVERY_CODE: '',
      STATUS_DELIVERY_CODE: '',
      TOTAL_JANJANG: '0',
      STATUS_SYNC: 'N',
      SYNC_TIME: '',
      INSERT_USER: dataLogin.USER_AUTH_CODE,
      INSERT_TIME: getTodayDate('YYYY-MM-DD kk:mm:ss')
    }
    this.setState({ ebccValCode, dataHeader: header });

  }

  takePicture = async () => {
    try {
      if (this.state.hasPhoto) {
        this.insertDB();
      } else {
        const takeCameraOptions = {
          // quality : 0.5,  //just in case want to reduce the quality too
          skipProcessing: false,
          fixOrientation: true
        };
        const data = await this.camera.takePictureAsync(takeCameraOptions);
        this.setState({ path: data.uri, pathImg: dirPhotoEbccJanjang, hasPhoto: true });
        RNFS.copyFile(data.uri, `${dirPhotoEbccJanjang}/${this.state.dataModel.IMAGE_NAME}`);
        this.resize(`${dirPhotoEbccJanjang}/${this.state.dataModel.IMAGE_NAME}`)
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoEbccJanjang).then((response) => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      // response.path is the path of the new image
      // response.name is the name of the new image with the extension
      // response.size is the size of the new image
      RNFS.copyFile(response.path, `${dirPhotoEbccJanjang}/${this.state.dataModel.IMAGE_NAME}`);
      this.setState({
        path: response.uri,
        pathCache: response.path
      });
    }).catch((err) => {
      console.log(err)
    });
  }

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        flashMode={Camera.Constants.FlashMode.auto}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
      </Camera>
    );
  }

  async insertDB() {
    if (this.state.dataHeader !== null && this.state.dataHeader.LAT_TPH != 0 && this.state.dataHeader.LON_TPH != 0) {
      RNFS.unlink(this.state.pathCache);
      let isImageContain = await RNFS.exists(`file://${dirPhotoEbccJanjang}/${this.state.dataModel.IMAGE_NAME}`);
      if (isImageContain) {
        this.props.navigation.navigate('KriteriaBuah',
          {
            fotoJanjang: this.state.dataModel,
            tphAfdWerksBlockCode: this.state.tphAfdWerksBlockCode,
            ebccValCode: this.state.ebccValCode,
            dataHeader: this.state.dataHeader
          });
      } else {
        this.setState({
          showModal: true, title: 'GAGAL',
          message: 'Kamu gagal untuk menyimpan gambar, coba ulangin lagi',
          icon: require('../../Images/ic-not-save.png')
        });
      }
    } else {
      this.setState({
        showModal2: true, title: 'Lokasi GPS',
        message: 'Kamu belum bisa lanjut sebelum lokasi GPS kamu belum ditemukan, lanjut cari lokasi?',
        icon: require('../../Images/ic-no-gps.png')
      });
    }

  }

  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
      </View>
    );
  }

  renderIcon = () => {
    var imgSource = this.state.hasPhoto ? imgNextPhoto : imgTakePhoto;
    return (
      <Image
        style={styles.icon}
        source={imgSource}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor={Colors.tintColorPrimary}
        />
        <MapView
          ref={ref => this.map = ref}
          style={styles.map}
          provider="google"
          initialRegion={this.state.region}
          region={this.state.region}
          liteMode={true}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          zoomEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          moveOnMarkerPress={false}
          zoomControlEnabled={false}
          minZoomLevel={10}
          onUserLocationChange={event => {
            if (this.state.track) {
              let lat = event.nativeEvent.coordinate.latitude;
              let lon = event.nativeEvent.coordinate.longitude;
              this.setState({
                track: false,
                latitude: lat,
                longitude: lon,
                region: {
                  latitude: lat,
                  longitude: lon,
                  latitudeDelta: 0.0075,
                  longitudeDelta: 0.00721
                }
              });
              this.setParameter();
              setTimeout(() => {
                this.setState({ track: true })
              }, 5000);
            }
          }}
        >
        </MapView >
        <ModalAlert
          icon={this.state.icon}
          visible={this.state.showModal2}
          onPressCancel={() => { this.getLocation(); this.setState({ showModal2: false }) }}
          title={this.state.title}
          message={this.state.message}
        />
        <ModalAlertConfirmation
          icon={this.state.icon}
          visible={this.state.showModal}
          onPressCancel={() => this.setState({ showModal: false })}
          onPressSubmit={() => { this.backAndDeletePhoto(); this.setState({ showModal: false }) }}
          title={this.state.title}
          message={this.state.message}
        />
        <View style={{ flex: 2 }}>
          {this.state.path ? this.renderImage() : this.renderCamera()}
        </View>
        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          {this.state.dataModel !== null &&
            <TouchableOpacity style={[styles.takePicture, { marginTop: 15 }]} onPress={this.takePicture.bind(this)}>
              {this.renderIcon()}
            </TouchableOpacity>}
        </View>
      </View>
    );
  }
}

export default FotoJanjang;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    height: 0.1,
    top: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
  icon: {
    alignContent: 'flex-end',
    height: 64,
    width: 64,
    resizeMode: 'stretch',
    alignItems: 'center',
  }
});
