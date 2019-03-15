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
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate, getUUID } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoInspeksiBaris } from '../../Lib/dirStorage'
import { HeaderBackButton, StackNavigator } from 'react-navigation'
var RNFS = require('react-native-fs');
import R from 'ramda';

class TakePhotoBaris extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: Colors.tintColorPrimary
    },
    title: 'Ambil Foto Baris',
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
    let inspeksiHeader = R.clone(params.inspeksiHeader);
    let dataUsual = R.clone(params.dataUsual);
    let from = R.clone(params.from);
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
      inspeksiHeader,
      dataUsual,
      from,
      pathCache: '',
      statusBlok,
      dataInspeksi
    };
  }

  componentDidMount(){
    this.setParameter();
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

  deleteFoto(){
    RNFS.unlink(`${FILE_PREFIX}${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`)
    .then(() => {
      console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
    });
    RNFS.unlink(this.state.path)
    this.setState({ path: null, hasPhoto: false });
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
      if(this.state.hasPhoto){  
        this.insertDB();     
      }else{
        const takeCameraOptions = {
          // quality : 0.5,  //just in case want to reduce the quality too
          skipProcessing: false,
          fixOrientation: true
        };        
        const data = await this.camera.takePictureAsync(takeCameraOptions);
        this.setState({ path: data.uri, pathImg: dirPhotoInspeksiBaris, hasPhoto: true });
        RNFS.copyFile(data.uri, `${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`);
        this.resize(`${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`)
      }

    } catch (err) {
      console.log('err: ', err);
    }
  };

  resize(data) {
    ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoInspeksiBaris).then((response) => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      // response.path is the path of the new image
      // response.name is the name of the new image with the extension
      // response.size is the size of the new image
      RNFS.copyFile(response.path, `${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`);
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
    let isImageContain = await RNFS.exists(`file://${dirPhotoInspeksiBaris}/${this.state.dataModel.IMAGE_NAME}`);
    if(isImageContain){
      this.props.navigation.navigate('KondisiBaris1',
      { 
          fotoBaris: this.state.dataModel, 
          inspeksiHeader: this.state.inspeksiHeader, 
          dataUsual: this.state.dataUsual, 
          statusBlok: this.state.statusBlok,
          intervalId: this.state.intervalId,
          dataInspeksi: this.state.dataInspeksi
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

export default TakePhotoBaris;

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

// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Slider } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const landmarkSize = 2;
// const flashModeOrder = {
//   off: 'on',
//   on: 'auto',
//   auto: 'torch',
//   torch: 'off',
// };

// const wbOrder = {
//   auto: 'sunny',
//   sunny: 'cloudy',
//   cloudy: 'shadow',
//   shadow: 'fluorescent',
//   fluorescent: 'incandescent',
//   incandescent: 'auto',
// };

// export default class CameraScreen extends React.Component {
//   state = {
//     flash: 'off',
//     zoom: 0,
//     autoFocus: 'on',
//     depth: 0,
//     type: 'back',
//     whiteBalance: 'auto',
//     ratio: '16:9',
//     ratios: [],
//     photoId: 1,
//     showGallery: false,
//     photos: [],
//     faces: [],
//     recordOptions: {
//       mute: false,
//       maxDuration: 5,
//       quality: RNCamera.Constants.VideoQuality["288p"],
//     },
//     isRecording: false
//   };

//   getRatios = async function() {
//     const ratios = await this.camera.getSupportedRatios();
//     return ratios;
//   };

//   toggleView() {
//     this.setState({
//       showGallery: !this.state.showGallery,
//     });
//   }

//   toggleFacing() {
//     this.setState({
//       type: this.state.type === 'back' ? 'front' : 'back',
//     });
//   }

//   toggleFlash() {
//     this.setState({
//       flash: flashModeOrder[this.state.flash],
//     });
//   }

//   setRatio(ratio) {
//     this.setState({
//       ratio,
//     });
//   }

//   toggleWB() {
//     this.setState({
//       whiteBalance: wbOrder[this.state.whiteBalance],
//     });
//   }

//   toggleFocus() {
//     this.setState({
//       autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
//     });
//   }

//   zoomOut() {
//     this.setState({
//       zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
//     });
//   }

//   zoomIn() {
//     this.setState({
//       zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
//     });
//   }

//   setFocusDepth(depth) {
//     this.setState({
//       depth,
//     });
//   }

//   takePicture = async function() {
//     if (this.camera) {
//       this.camera.takePictureAsync().then(data => {
//         console.log('data: ', data);
//       });
//     }
//   };

//   takeVideo = async function() {
//     if (this.camera) {
//       try {
//         const promise = this.camera.recordAsync(this.state.recordOptions);

//         if (promise) {
//           this.setState({ isRecording: true });
//           const data = await promise;
//           this.setState({ isRecording: false });
//           console.warn(data);
//         }
//       } catch (e) {
//         console.warn(e);
//       }
//     }
//   }

//   onFacesDetected = ({ faces }) => this.setState({ faces });
//   onFaceDetectionError = state => console.warn('Faces detection error:', state);

//   renderFace({ bounds, faceID, rollAngle, yawAngle }) {
//     return (
//       <View
//         key={faceID}
//         transform={[
//           { perspective: 600 },
//           { rotateZ: `${rollAngle.toFixed(0)}deg` },
//           { rotateY: `${yawAngle.toFixed(0)}deg` },
//         ]}
//         style={[
//           styles.face,
//           {
//             ...bounds.size,
//             left: bounds.origin.x,
//             top: bounds.origin.y,
//           },
//         ]}
//       >
//         <Text style={styles.faceText}>ID: {faceID}</Text>
//         <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
//         <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
//       </View>
//     );
//   }

//   renderLandmarksOfFace(face) {
//     const renderLandmark = position =>
//       position && (
//         <View
//           style={[
//             styles.landmark,
//             {
//               left: position.x - landmarkSize / 2,
//               top: position.y - landmarkSize / 2,
//             },
//           ]}
//         />
//       );
//     return (
//       <View key={`landmarks-${face.faceID}`}>
//         {renderLandmark(face.leftEyePosition)}
//         {renderLandmark(face.rightEyePosition)}
//         {renderLandmark(face.leftEarPosition)}
//         {renderLandmark(face.rightEarPosition)}
//         {renderLandmark(face.leftCheekPosition)}
//         {renderLandmark(face.rightCheekPosition)}
//         {renderLandmark(face.leftMouthPosition)}
//         {renderLandmark(face.mouthPosition)}
//         {renderLandmark(face.rightMouthPosition)}
//         {renderLandmark(face.noseBasePosition)}
//         {renderLandmark(face.bottomMouthPosition)}
//       </View>
//     );
//   }

//   renderFaces() {
//     return (
//       <View style={styles.facesContainer} pointerEvents="none">
//         {this.state.faces.map(this.renderFace)}
//       </View>
//     );
//   }

//   renderLandmarks() {
//     return (
//       <View style={styles.facesContainer} pointerEvents="none">
//         {this.state.faces.map(this.renderLandmarksOfFace)}
//       </View>
//     );
//   }

//   renderCamera() {
//     return (
//       <RNCamera
//         ref={ref => {
//           this.camera = ref;
//         }}
//         style={{
//           flex: 1,
//         }}
//         type={this.state.type}
//         flashMode={this.state.flash}
//         autoFocus={this.state.autoFocus}
//         zoom={this.state.zoom}
//         whiteBalance={this.state.whiteBalance}
//         ratio={this.state.ratio}
//         faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
//         onFacesDetected={this.onFacesDetected}
//         onFaceDetectionError={this.onFaceDetectionError}
//         focusDepth={this.state.depth}
//         permissionDialogTitle={'Permission to use camera'}
//         permissionDialogMessage={'We need your permission to use your camera phone'}
//       >
//         <View
//           style={{
//             flex: 0.5,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//           }}
//         >
//           <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
//             <Text style={styles.flipText}> FLIP </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
//             <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
//             <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
//           </TouchableOpacity>
//         </View>
//         <View
//           style={{
//             flex: 0.4,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//             alignSelf: 'flex-end',
//           }}
//         >
//           <Slider
//             style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
//             onValueChange={this.setFocusDepth.bind(this)}
//             step={0.1}
//             disabled={this.state.autoFocus === 'on'}
//           />
//         </View>
//         <View
//           style={{
//             flex: 0.1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//             alignSelf: 'flex-end',
//           }}
//         >
//           <TouchableOpacity
//             style={[styles.flipButton, { 
//               flex: 0.3, 
//               alignSelf: 'flex-end',
//               backgroundColor: this.state.isRecording ? 'white' : 'darkred',
//             }]}
//             onPress={this.state.isRecording ? () => {} : this.takeVideo.bind(this)}
//           >
//             {
//               this.state.isRecording ?
//               <Text style={styles.flipText}> ☕ </Text>
//               :
//               <Text style={styles.flipText}> REC </Text>
//             }
//           </TouchableOpacity>
//         </View>
//         <View
//           style={{
//             flex: 0.1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//             alignSelf: 'flex-end',
//           }}
//         >
//           <TouchableOpacity
//             style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
//             onPress={this.zoomIn.bind(this)}
//           >
//             <Text style={styles.flipText}> + </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
//             onPress={this.zoomOut.bind(this)}
//           >
//             <Text style={styles.flipText}> - </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
//             onPress={this.toggleFocus.bind(this)}
//           >
//             <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
//             onPress={this.takePicture.bind(this)}
//           >
//             <Text style={styles.flipText}> SNAP </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: 'flex-end' }]}
//             onPress={this.toggleView.bind(this)}
//           >
//             <Text style={styles.flipText}> Gallery </Text>
//           </TouchableOpacity>
//         </View>
//         {this.renderFaces()}
//         {this.renderLandmarks()}
//       </RNCamera>
//     );
//   }

//   renderImage=()=>{
//     var imgSource = this.state.hasPhoto? imgNextPhoto : imgTakePhoto;
//     return (
//       <Image
//         style={ styles.icon }
//         source={ imgSource }
//       />
//     );
//   }

//   render() {
//     return <View style={styles.container}>{this.renderCamera()}</View>;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: '#000',
//   },
//   navigation: {
//     flex: 1,
//   },
//   gallery: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   flipButton: {
//     flex: 0.3,
//     height: 40,
//     marginHorizontal: 2,
//     marginBottom: 10,
//     marginTop: 20,
//     borderRadius: 8,
//     borderColor: 'white',
//     borderWidth: 1,
//     padding: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   flipText: {
//     color: 'white',
//     fontSize: 15,
//   },
//   item: {
//     margin: 4,
//     backgroundColor: 'indianred',
//     height: 35,
//     width: 80,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   picButton: {
//     backgroundColor: 'darkseagreen',
//   },
//   galleryButton: {
//     backgroundColor: 'indianred',
//   },
//   facesContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     left: 0,
//     top: 0,
//   },
//   face: {
//     padding: 10,
//     borderWidth: 2,
//     borderRadius: 2,
//     position: 'absolute',
//     borderColor: '#FFD700',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   landmark: {
//     width: landmarkSize,
//     height: landmarkSize,
//     position: 'absolute',
//     backgroundColor: 'red',
//   },
//   faceText: {
//     color: '#FFD700',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     margin: 10,
//     backgroundColor: 'transparent',
//   },
//   row: {
//     flexDirection: 'row',
//   },
// });

//contoh untuk save foto
// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   View,
//   StatusBar,
//   Dimensions,
//   TouchableOpacity
// } from 'react-native';
// import Camera from 'react-native-camera';
// import { Icon } from 'native-base';
// import { dirPicutures } from './dirStorage';
// const moment = require('moment');

// let { height, width } = Dimensions.get('window');
// let orientation = height > width ? 'Portrait' : 'Landscape';

// //move the attachment to app folder
// const moveAttachment = async (filePath, newFilepath) => {
//   return new Promise((resolve, reject) => {
//     RNFS.mkdir(dirPicutures)
//       .then(() => {
//         RNFS.moveFile(filePath, newFilepath)
//           .then(() => {
//             console.log('FILE MOVED', filePath, newFilepath);
//             resolve(true);
//           })
//           .catch(error => {
//             console.log('moveFile error', error);
//             reject(error);
//           });
//       }) 
//       .catch(err => {
//         console.log('mkdir error', err);
//         reject(err);
//       });
//   });
// };

// class TakePhotoBaris extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       orientation
//     };
//   }

//   componentWillMount() {
//     Dimensions.addEventListener('change', this.handleOrientationChange);
//   }

//   componentWillUnmount() {
//     Dimensions.removeEventListener('change', this.handleOrientationChange);
//   }

//   handleOrientationChange = dimensions => {
//     ({ height, width } = dimensions.window);
//     orientation = height > width ? 'Portrait' : 'Landscape';
//     this.setState({ orientation });
//   };

//   // ************************** Captur and Save Image *************************
//   saveImage = async filePath => {
//     try {
//       // set new image name and filepath
//       const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
//       const newFilepath = `${dirPicutures}/${newImageName}`;
//       // move and save image to new filepath
//       const imageMoved = await moveAttachment(filePath, newFilepath);
//       console.log('image moved', imageMoved);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // takePicture = async function() {
//   //   if (this.camera) {
//   //     this.camera.takePictureAsync().then(data => {
//   //       console.log('data: ', data);
//   //     });
//   //   }
//   // };

//   // takePicture() {
//   //   if(this.camera){
//   //     this.camera.capture().then(data => {
//   //       console.log('sjdnas')
//   //       //data is an object with the file path
//   //       //save the file to app  folder
//   //       this.saveImage(data.path);
//   //     })
//   //     .catch(err => {
//   //       console.error('capture picture error', err);
//   //     });
//   //   }

//   // }

//   takePicture = async () => {
//     if (this.camera) {
//       // this.setState({ capturingPhoto: true });
//       try {
//         const photo = await this.camera.capture();
//         console.log(photo);
//         // this.setState({ preview: photo, uiState: UiState.ReviewPhoto });
//       } catch (error) {
//         console.log(error);
//       } finally {
//         // this.setState({ capturingPhoto: false });
//         console.log('sbdja')
//       }
//     }
//   };

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar barStyle="light-content" translucent />

//         <Camera
//           captureTarget={Camera.constants.CaptureTarget.disk}
//           ref={cam => {
//             this.camera = cam;
//           }}
//           style={styles.container}
//           aspect={Camera.constants.Aspect.fill}
//           orientation="auto"
//         >
//           <View
//             style={
//               this.state.orientation === 'Portrait' ? (
//                 styles.buttonContainerPortrait
//               ) : (
//                 styles.buttonContainerLandscape
//               )
//             }
//           >
//             <TouchableOpacity
//               onPress={() => this.takePicture()}
//               style={
//                 this.state.orientation === 'Portrait' ? (
//                   styles.buttonPortrait
//                 ) : (
//                   styles.buttonLandscape
//                 )
//               }
//             >
//               <Icon name="camera" style={{ fontSize: 40, color: 'white' }} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => this.props.navigation.goBack()}
//               style={
//                 this.state.orientation === 'Portrait' ? (
//                   styles.buttonPortrait
//                 ) : (
//                   styles.buttonLandscape
//                 )
//               }
//             >
//               <Icon
//                 name="close-circle"
//                 style={{ fontSize: 40, color: 'white' }}
//               />
//             </TouchableOpacity>
//           </View>
//         </Camera>
//       </View>
//     );
//   }
// }

// export default TakePhotoBaris;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   buttonContainerPortrait: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.9)'
//   },
//   buttonContainerLandscape: {
//     position: 'absolute',
//     bottom: 0,
//     top: 0,
//     right: 0,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)'
//   },
//   buttonPortrait: {
//     backgroundColor: 'transparent',
//     padding: 5,
//     marginHorizontal: 20
//   },
//   buttonLandscape: {
//     backgroundColor: 'transparent',
//     padding: 5,
//     marginVertical: 20
//   }
// });
