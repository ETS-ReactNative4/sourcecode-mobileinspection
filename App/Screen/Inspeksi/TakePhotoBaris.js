import React, { Component } from 'react';
import { BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../Constant/Colors';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoInspeksiBaris } from '../../Lib/dirStorage'
import R from 'ramda';
import MapView from 'react-native-maps';
import TaskService from '../../Database/TaskServices';
import HeaderDefault from '../../Component/Header/HeaderDefault';

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
var RNFS = require('react-native-fs');
const LATITUDE = -2.952421;
const LONGITUDE = 112.354931;

class TakePhotoBaris extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let inspeksiHeader = R.clone(params.inspeksiHeader);
    let dataUsual = R.clone(params.dataUsual);
    let from = R.clone(params.from);
    let statusBlok = R.clone(params.statusBlok);
    let intervalId = R.clone(params.intervalId);
    let dataInspeksi = R.clone(params.dataInspeksi);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      track: true,
      latitude: LATITUDE,
      longitude: LONGITUDE,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.00721
      },
      dataLogin: TaskService.getAllData('TR_LOGIN'),
      intervalId,
      hasPhoto: false,
      path: null,
      pathImg: null,
      dataModel: null,
      inspeksiHeader,
      dataUsual,
      from,
      pathCache: '',
      statusBlok,
      dataInspeksi,
      inspectionType: props.navigation.getParam('inspectionType', 'normal')
    };
  }

  componentDidMount() {
    this.setParameter();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`)
      .then(() => {
        console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
      });
    RNFS.unlink(this.state.path)
    this.setState({ pathView: '', path: null, hasPhoto: false });
  }

  setParameter() {
    var today = getTodayDate('YYMMDDHHmmss');
    var imgCode = 'P' + this.state.dataUsual.USER_AUTH + today;
    var imageName = imgCode + '.jpg';

    var image = {
      TR_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
      IMAGE_CODE: imgCode,
      IMAGE_NAME: imageName,
      IMAGE_PATH_LOCAL: dirPhotoInspeksiBaris + '/' + imageName,
      IMAGE_URL: '',
      STATUS_IMAGE: 'BARIS',
      STATUS_SYNC: 'N',
      INSERT_USER: this.state.dataUsual.USER_AUTH,
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
          width: 640,
          quality: 0.5,
          base64: true,
          fixOrientation: true,
          skipProcessing: false,
        };
        const data = await this.camera.takePictureAsync(takeCameraOptions);
        var imgPath = `${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`;

        this.setState(
          {
            pathView: data.uri,
            path: imgPath,
            pathImg: dirPhotoInspeksiBaris,
            hasPhoto: true,
          }, () => {
            RNFS.copyFile(data.uri, imgPath);
          });
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoInspeksiBaris).then((response) => {
      RNFS.unlink(this.state.path).then((unlink) => {
        RNFS.moveFile(response.path, this.state.path);
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  insertTrackLokasi(blokInsCode, lat, lon, success) {
    try {
      var trInsCode = `T${this.state.dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`;
      var today = getTodayDate('YYYY-MM-DD HH:mm:ss');
      data = {
        TRACK_INSPECTION_CODE: trInsCode,
        BLOCK_INSPECTION_CODE: blokInsCode,
        ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
        DATE_TRACK: today,
        LAT_TRACK: lat.toString(),
        LONG_TRACK: lon.toString(),
        STATUS_TRACK: 2,
        INSERT_USER: this.state.dataLogin[0].USER_AUTH_CODE,
        INSERT_TIME: today,
        STATUS_SYNC: 'N'
      }
      TaskService.saveData('TM_INSPECTION_TRACK', data)
    } catch (error) {
      alert('insert track lokasi buat inspeksi ' + error)
    }
  }

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        defaultOnFocusComponent={true}
        onFocusChanged={() => { }}
        flashMode={Camera.Constants.FlashMode.auto}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
      </Camera>
    );
  }

  async insertDB() {
    // RNFS.unlink(this.state.pathCache);
    let isImageContain = await RNFS.exists(`file://${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`);
    if (isImageContain) {
      this.resize(this.state.path)
      this.props.navigation.navigate('KondisiBaris1',
        {
          fotoBaris: this.state.dataModel,
          inspeksiHeader: this.state.inspeksiHeader,
          dataUsual: this.state.dataUsual,
          statusBlok: this.state.statusBlok,
          intervalId: this.state.intervalId,
          dataInspeksi: this.state.dataInspeksi,
          inspectionType: this.state.inspectionType === 'genba' ? 'genba' : 'normal'
        });
    } else {
      alert('Ada kesalahan, Ulangi ambil gambar baris')
    }
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
          onPress={() => this.handleBackButtonClick()}
          title={'Ambil Foto Baris'}
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
              this.insertTrackLokasi(this.state.inspeksiHeader.BLOCK_INSPECTION_CODE, lat, lon, 1);
              setTimeout(() => {
                this.setState({ track: true })
              }, 5000);
            }
          }}
        >
        </MapView >
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

export default TakePhotoBaris;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    height: 0.1,
    top: 0
  },
  container: {
    flex: 1,
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
