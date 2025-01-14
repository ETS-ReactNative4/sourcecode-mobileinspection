import React, { Component } from 'react';
import { BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../Constant/Colors';
import { RNCamera as Camera } from 'react-native-camera';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import R from 'ramda';
import { getTodayDate } from '../../Lib/Utils'
import { dirPhotoInspeksiSelfie } from '../../Lib/dirStorage'
import ImageResizer from 'react-native-image-resizer';
import HeaderDefault from '../../Component/Header/HeaderDefault';

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
var RNFS = require('react-native-fs');

class TakePhotoSelfie extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let fotoBaris = R.clone(params.fotoBaris);
    let inspeksiHeader = R.clone(params.inspeksiHeader);
    let kondisiBaris1 = R.clone(params.kondisiBaris1);
    let kondisiBaris2 = R.clone(params.kondisiBaris2);
    let dataUsual = R.clone(params.dataUsual);
    let statusBlok = R.clone(params.statusBlok);
    let intervalId = R.clone(params.intervalId);
    let dataInspeksi = R.clone(params.dataInspeksi);


    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      intervalId,
      hasPhoto: false,
      path: null,
      pathImg: null,
      dataModel: null,
      fotoBaris,
      inspeksiHeader,
      kondisiBaris1,
      kondisiBaris2,
      dataUsual,
      pathCache: '',
      statusBlok,
      dataInspeksi,
      inspectionType: props.navigation.getParam('inspectionType', 'normal')
    }
  }

  componentDidMount() {
    this.setParameter();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    console.log("takePhotoSelfie:" + this.state.inspectionType)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  setParameter() {
    var today = getTodayDate('YYMMDDHHmmss');
    var imgCode = 'P' + this.state.dataUsual.USER_AUTH + today;
    var imageName = imgCode + '.jpg';

    var image = {
      TR_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
      IMAGE_CODE: imgCode,
      IMAGE_NAME: imageName,
      IMAGE_PATH_LOCAL: dirPhotoInspeksiSelfie + '/' + imageName,
      IMAGE_URL: '',
      STATUS_IMAGE: 'SELFIE',
      STATUS_SYNC: 'N',
      INSERT_USER: this.state.dataUsual.USER_AUTH,
      INSERT_TIME: ''
    }

    this.setState({ dataModel: image });
  }

  handleBackButtonClick() {
    if (this.state.hasPhoto) {
      this.deleteFoto()
      return true;
    }
    this.props.navigation.goBack();
    return true;
  }

  deleteFoto() {
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoInspeksiSelfie}/${this.state.dataModel.IMAGE_NAME}`)
      .then(() => {
        console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
      });
    RNFS.unlink(this.state.path)
    this.setState({ pathView: '', path: null, hasPhoto: false });
  }

  takePicture = async () => {
    try {
      if (this.state.hasPhoto) {
        this.insertDB()
      } else {
        const takeCameraOptions = {
          // quality : 0.5,  //just in case want to reduce the quality too
          skipProcessing: false,
          fixOrientation: true
        };

        const data = await this.camera.takePictureAsync(takeCameraOptions);
        var imgPath = `${dirPhotoInspeksiSelfie}/${this.state.dataModel.IMAGE_NAME}`;

        this.setState(
          {
            pathView: data.uri,
            path: imgPath,
            pathImg: dirPhotoInspeksiSelfie,
            hasPhoto: true
          }, async () => {
            await RNFS.copyFile(data.uri, imgPath);
          });
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoInspeksiSelfie).then((response) => {
      RNFS.unlink(this.state.path).then((unlink) => {
        RNFS.moveFile(response.path, this.state.path);
      })

    }).catch((err) => {
      console.log(err)
    });
  }

  async insertDB() {
    RNFS.unlink(this.state.pathCache);
    let isImageContain = await RNFS.exists(`file://${dirPhotoInspeksiSelfie}/${this.state.dataModel.IMAGE_NAME}`);
    if (isImageContain) {
      this.resize(this.state.path)
      this.props.navigation.navigate('KondisiBarisAkhir', {
        fotoSelfie: this.state.dataModel,
        inspeksiHeader: this.state.inspeksiHeader,
        fotoBaris: this.state.fotoBaris,
        kondisiBaris1: this.state.kondisiBaris1,
        kondisiBaris2: this.state.kondisiBaris2,
        dataUsual: this.state.dataUsual,
        statusBlok: this.state.statusBlok,
        intervalId: this.state.intervalId,
        dataInspeksi: this.state.dataInspeksi,
        inspectionType: this.state.inspectionType === 'genba' ? 'genba' : 'normal'
      });
    } else {
      alert('Ada kesalahan, Ulangi ambil gambar selfie')
    }

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
        mirrorImage={true}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
      </Camera>
    );
  }

  renderImage() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: this.state.pathView }}
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
        <HeaderDefault
          title={'Ambil Foto Diri'}
          onPress={() => this.handleBackButtonClick()}
        />
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

export default TakePhotoSelfie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
