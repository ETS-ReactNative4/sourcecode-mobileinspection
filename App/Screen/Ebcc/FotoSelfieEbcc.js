import React, { Component } from 'react';
import { BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../Constant/Colors';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import {dirPhotoEbccJanjang, dirPhotoEbccSelfie} from '../../Lib/dirStorage'
import R from 'ramda';
import moment from 'moment'
import ModalAlertBack from '../../Component/ModalAlert';
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from '../../Database/TaskServices';

var RNFS = require('react-native-fs');
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

class FotoSelfieEbcc extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: Colors.tintColorPrimary
    },
    title: 'Ambil Foto Selfie',
    headerTintColor: '#fff',
    headerTitleStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '400'
    },
  };

  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let tphAfdWerksBlockCode = R.clone(params.tphAfdWerksBlockCode)
    let fotoJanjang = R.clone(params.fotoJanjang);
    let ebccValCode = R.clone(params.ebccValCode);
    let totalJanjang = R.clone(params.totalJanjang);
    let kriteriaBuah = R.clone(params.kriteriaBuah);
    let dataHeader = R.clone(params.dataHeader);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      hasPhoto: false,
      path: null,
      pathImg: null,
      dataModel: null,
      tphAfdWerksBlockCode,
      fotoJanjang,
      ebccValCode,
      totalJanjang,
      kriteriaBuah,
      dataHeader,
      pathCache: '',
      timestamp: getTodayDate('YYMMDDkkmmss'),
      title: 'Title',
      message: 'Message',
      showModalBack: false,
      icon: ''
    };
  }

  componentDidMount() {
    this.setParameter()
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    if (this.state.hasPhoto) {
      this.deleteFoto()
    }
    this.props.navigation.goBack(null);
    return true;
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude);
        var lon = parseFloat(position.coords.longitude);
        var timestamp = moment(position.timestamp).format('YYMMDDkkmmss');
        this.setState({ currentDate: timestamp });
        this.setParameter();

      },
      (error) => {
        // this.setState({ error: error.message, fetchingLocation: false })
        let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
        if (error && error.message == "No location provider available.") {
          message = "Mohon nyalakan GPS anda terlebih dahulu.";
        }
        this.setParameter();
      }, // go here if error while fetch location
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    );
  }

  deleteFoto() {
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`)
      .then(() => {
        console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
      });
    RNFS.unlink(this.state.path)
    this.setState({ path: null, hasPhoto: false });
  }

  setParameter() {
    let dataLogin = TaskServices.getAllData('TR_LOGIN')[0];
    var imgCode = `VP${dataLogin.USER_AUTH_CODE}${this.state.timestamp}`;
    var imageName = imgCode + '.jpg';
    var image = {
      TR_CODE: this.state.ebccValCode,
      IMAGE_CODE: imgCode,
      IMAGE_NAME: imageName,
      IMAGE_PATH_LOCAL: dirPhotoEbccSelfie + '/' + imageName,
      IMAGE_URL: '',
      STATUS_IMAGE: 'SELFIE_V',
      STATUS_SYNC: 'N',
      INSERT_USER: dataLogin.USER_AUTH_CODE,
      INSERT_TIME: ''
    }
    this.setState({ dataModel: image });

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
          var imgPath = `${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`;

          RNFS.copyFile(data.uri, imgPath);
          this.setState(
              {
                  path: imgPath,
                  pathImg: dirPhotoEbccSelfie,
                  hasPhoto: true
              },()=>{
                  this.resize(imgPath)
              });
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoEbccSelfie).then((response) => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      // response.path is the path of the new image
      // response.name is the name of the new image with the extension
      // response.size is the size of the new image
      RNFS.copyFile(response.path, this.state.path);
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
        type={'front'}
        mirrorImage={false}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
      </Camera>
    );
  }

  async insertDB() {
    RNFS.unlink(this.state.pathCache);
    let isImageContain = await RNFS.exists(`file://${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`);
    if (isImageContain) {
      let tempHeader = this.state.dataHeader;
      tempHeader = {
        ...tempHeader,
        syncImage: 'N',
        syncDetail: 'N'
      }
      //insert TR_H_EBCC_VALIDATION
      TaskServices.saveData('TR_H_EBCC_VALIDATION', tempHeader);

      // insert TR_D_EBCC_VALIDATION
      if (this.state.kriteriaBuah !== null) {
        this.state.kriteriaBuah.map(item => {

          /* CONDITION IF JUMLAH STRING KOSONG / NULL */
          if (item.JUMLAH == '' || item.JUMLAH == null) {
            itemJumlah = 0
          } else {
            itemJumlah = parseInt(item.JUMLAH)
          }

          let newItem = { ...item, JUMLAH: itemJumlah }

          TaskServices.saveData('TR_D_EBCC_VALIDATION', newItem);
        })
      }

      //insert TR_IMAGE
      TaskServices.saveData('TR_IMAGE', this.state.fotoJanjang);
      TaskServices.saveData('TR_IMAGE', this.state.dataModel);

      this.setState({ showModalBack: true, title: 'Berhasil Disimpan', message: 'Yeaay! Data kamu berhasil disimpan', icon: require('../../Images/ic-save-berhasil.png') });
    } else {
      alert('Ada kesalahan, Ulangi ambil gambar baris')
    }
  }

  selesai = () => {
    const navigation = this.props.navigation;
    let data = TaskServices.getAllData('TR_LOGIN')
    if (data != undefined) {
      let routeName = ''
      if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
        routeName = 'MainMenuMil'
      } else {
        routeName = 'MainMenu';
      }
      Promise.all([
        navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName })]
          })
        )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('Riwayat'))
      this.setState({ showModalBack: false })
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
        <ModalAlertBack
          visible={this.state.showModalBack}
          icon={this.state.icon}
          onPressCancel={() => this.selesai()}
          title={this.state.title}
          message={this.state.message} />
        <View style={{ flex: 2 }}>
          {this.state.path ? this.renderImage() : this.renderCamera()}
        </View>
        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={[styles.takePicture, { marginTop: 15 }]} onPress={this.takePicture.bind(this)}>
            {this.renderIcon()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default FotoSelfieEbcc;

const styles = StyleSheet.create({
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
