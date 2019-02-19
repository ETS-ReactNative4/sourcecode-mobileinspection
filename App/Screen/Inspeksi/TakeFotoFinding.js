
import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    BackHandler,
    Dimensions,
  } from 'react-native';
import Colors from '../../Constant/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import TaskServices from '../../Database/TaskServices';
import { NavigationActions, StackActions } from 'react-navigation';
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoTemuan } from '../../Lib/dirStorage'
import random from 'random-string'

const moment = require('moment');
var RNFS = require('react-native-fs');
import R from 'ramda';
import { getTodayDate } from '../../Lib/Utils';

class TakeFoto extends Component{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: Colors.tintColorPrimary
      },
      title: 'Ambil Foto',
      headerTintColor: '#fff',
      headerTitleStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
      },
      headerLeft: (
          <TouchableOpacity onPress={() => {params.clearFoto()}}>
              <Icon style={{marginLeft: 12}} name={'ios-arrow-round-back'} size={45} color={'white'} />
          </TouchableOpacity>
      )
    };
  }
    
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
      
  clearFoto(){
    if(this.state.hasPhoto){
      RNFS.unlink(this.state.path);
      RNFS.unlink(this.state.pathCacheInternal);
      RNFS.unlink(this.state.pathCacheResize);
      this.setState({ pathView: '', hasPhoto: false });
    }
    this.props.navigation.goBack(); 
  }

  componentDidMount(){
    this.props.navigation.setParams({ clearFoto: this.clearFoto })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackButtonClick() { 
    this.clearFoto();
    return true;
  }

  takePicture = async () => {
    try {
      if(this.state.hasPhoto){  
        this.goBack();     
      }else{
        const takeCameraOptions = {
          // quality : 0.5,  //just in case want to reduce the quality too
          skipProcessing: false,
          fixOrientation: true
        };
        const data = await this.camera.takePictureAsync(takeCameraOptions);            
        var pname = `P${this.state.user.USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}.jpg`//'F' + this.state.user.USER_AUTH_CODE + random({ length: 3 }).toUpperCase() + ".jpg";
        var imgPath = dirPhotoTemuan + '/' + pname;

        RNFS.copyFile(data.uri, imgPath);
        this.setState({ path: imgPath, pathCacheInternal: data.uri, hasPhoto: true });
        this.resize(imgPath);
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoTemuan).then((response) => {
      RNFS.copyFile(response.path, this.state.path);
      this.setState({
        pathView: response.uri,
        pathCacheResize: response.path
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

  goBack() {
    if(this.state.from == 'BuktiKerja'){
      this.props.navigation.state.params.addImage(this.state.path);
    }else{
      this.props.navigation.state.params.onRefresh(this.state.path);
    }
    
    RNFS.unlink(this.state.pathCacheInternal);
    RNFS.unlink(this.state.pathCacheResize);
    this.props.navigation.goBack();
    
  }

  renderImage() {
    return (
      <View>
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

