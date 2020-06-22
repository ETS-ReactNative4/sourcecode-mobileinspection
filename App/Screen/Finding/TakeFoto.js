import React, { Component } from 'react';
import { BackHandler, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../Constant/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera as Camera } from 'react-native-camera';
import TaskServices from '../../Database/TaskServices';
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoTemuan } from '../../Lib/dirStorage';
import R from 'ramda';
import { getTodayDate } from '../../Lib/Utils';
import ModalAlert from '../../Component/ModalAlert';
import { AlertContent, Images } from '../../Themes';
import HeaderDefault from '../../Component/Header/HeaderDefault';

var RNFS = require('react-native-fs');

class TakeFoto extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.clearFoto = this.clearFoto.bind(this);

    let params = props.navigation.state.params;
    let baris = R.clone(params.authCode);
    let from = R.clone(params.from)

    this.state = {
      user: TaskServices.getAllData('TR_LOGIN')[0],
      hasPhoto: false,
      path: '',
      pathView: '',
      pathCacheInternal: '',
      pathCacheResize: '',
      baris,
      from
    };
  }

  clearFoto() {
    if (this.state.hasPhoto) {
      RNFS.unlink(this.state.path);
      RNFS.unlink(this.state.pathCacheInternal);
      RNFS.unlink(this.state.pathCacheResize);
      this.setState({ path: '', pathView: '', hasPhoto: false });
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    if (this.state.hasPhoto) {
      this.clearFoto();
      return true
    }
    this.props.navigation.goBack();
    return true
  }

  takePicture = async () => {
    try {
      if (this.state.hasPhoto) {
        this.goBack();
      } else {
        const takeCameraOptions = {
          width: 640,
          quality: 0.5,
          base64: true,
          fixOrientation: true,
          skipProcessing: false,
        };
        const data = await this.camera.takePictureAsync(takeCameraOptions);
        var today = getTodayDate('YYMMDDHHmmss');
        var pname = `P${this.state.user.USER_AUTH_CODE}${today}.jpg`;//'F' + this.state.user.USER_AUTH_CODE + random({ length: 3 }).toUpperCase() + ".jpg";
        var imgPath = dirPhotoTemuan + '/' + pname;

        this.setState({
          pathView: data.uri,
          path: imgPath,
          pathCacheInternal: data.uri,
          hasPhoto: true
        }, async () => {
          await RNFS.copyFile(data.uri, imgPath);
        });
      }
    } catch (err) {
      console.log('err: ', err);
      this.validatePhotoExists();
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoTemuan).then((response) => {
      RNFS.unlink(this.state.path).then((unlink) => {
        RNFS.moveFile(response.path, this.state.path);
      });
    }).catch((err) => {
      console.log('Error Resize : ', err);
    });
  }

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        captureAudio={false}
        style={styles.preview}
        flashMode={Camera.Constants.FlashMode.auto}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
      </Camera>
    );
  }

  goBack() {
    RNFS.exists(this.state.path)
      .then((exists) => {
        if (exists) {
          this.resize(this.state.path);
          if (this.state.from == 'BuktiKerja') {
            this.props.navigation.state.params.addImage(this.state.path);
          } else {
            this.props.navigation.state.params.onRefresh(this.state.path);
          }
          RNFS.unlink(this.state.pathCacheInternal);
          RNFS.unlink(this.state.pathCacheResize);
          this.props.navigation.goBack();
        } else {
          this.validatePhotoExists();
        }
      });
  }

  validatePhotoExists() {
    this.setState(AlertContent.foto_gagal);
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
    var imgSource = this.state.hasPhoto ? Images.ic_next_photo : Images.ic_take_photo;
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
        <HeaderDefault
          onPress={() => this.handleBackButtonClick()}
          title={'Ambil Foto'} />
        <ModalAlert
          icon={this.state.icon}
          visible={this.state.showModal}
          onPressCancel={() => this.props.navigation.goBack()}
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

export default TakeFoto;

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

