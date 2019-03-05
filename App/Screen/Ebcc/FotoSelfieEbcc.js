import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Platform,
    BackHandler,
    Dimensions,
    StatusBar
  } from 'react-native';
import Colors from '../../Constant/Colors';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoEbccSelfie } from '../../Lib/dirStorage'
import TaskService from '../../Database/TaskServices'
import R from 'ramda';
import moment from 'moment'

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
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      hasPhoto: false,
      path: null,
      pathImg: null,
      dataModel: null,
      tphAfdWerksBlockCode,
      pathCache: '',
      timestamp: getTodayDate('YYMMDDkkmmss')
    };
  }

  componentDidMount(){
    this.getLocation()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackButtonClick() { 
    if(this.state.hasPhoto){
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
            this.setState({currentDate: timestamp});            
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

  deleteFoto(){
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`)
    .then(() => {
      console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
    });
    RNFS.unlink(this.state.path)
    this.setState({ path: null, hasPhoto: false });
  }

  setParameter() {
    let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
    var imgCode = `V${dataLogin.USER_AUTH_CODE}${this.state.timestamp}`;
    var imageName = imgCode + '.jpg';
    var arrTph = this.state.tphAfdWerksBlockCode.split('-') //tph-afd-werks-blockcode
    var image = {
      TR_CODE: `V${dataLogin.USER_AUTH_CODE}${this.state.timestamp}${arrTph[0]}${arrTph[3]}`,
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
      if(this.state.hasPhoto){  
        this.insertDB();     
      }else{
        const takeCameraOptions = {
          // quality : 0.5,  //just in case want to reduce the quality too
          skipProcessing: false,
          fixOrientation: true
        };        
        const data = await this.camera.takePictureAsync(takeCameraOptions);
        this.setState({ path: data.uri, pathImg: dirPhotoEbccSelfie, hasPhoto: true });
        RNFS.copyFile(data.uri, `${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`);
        this.resize(`${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`)
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
      RNFS.copyFile(response.path, `${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`);
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
    RNFS.unlink(this.state.pathCache);
    let isImageContain = await RNFS.exists(`file://${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`);
    if(isImageContain){
      this.props.navigation.navigate('KriteriaBuah',
      { 
          fotoJanjang: this.state.dataModel, 
          tphAfdWerksBlockCode: this.state.tphAfdWerksBlockCode
      }); 
    }else{
      alert('Ada kesalahan, Ulangi ambil gambar baris')
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
