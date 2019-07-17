import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Platform,
    BackHandler,
    BackAndroid,
    Dimensions,
    StatusBar
} from 'react-native';
import Colors from '../../Constant/Colors';
import imgTakePhoto from '../../Images/icon/ic_take_photo.png';
import imgNextPhoto from '../../Images/icon/ic_next_photo.png';
import { RNCamera as Camera } from 'react-native-camera';
import { getTodayDate } from '../../Lib/Utils'
import ImageResizer from 'react-native-image-resizer';
import { dirPhotoUser } from '../../Lib/dirStorage'
import TaskService from '../../Database/TaskServices'
import ModalAlertBack from '../../Component/ModalAlert';

let RNFS = require('react-native-fs');
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

export default class FotoUser extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColorPrimary
        },
        title: 'Foto Profile',
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
    };

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            hasPhoto: false,
            path: null,
            pathImg: null,
            dataModel: null,
            pathCache: '',
            timestamp: getTodayDate('YYMMDDkkmmss'),
            title: 'Title',
            message: 'Message',
            showModalBack: false,
            icon: ''
        };
    }

    componentDidMount(){
        this.setParameter()
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

    componentWillUnmount(){
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        if(this.state.hasPhoto){
            this.deleteFoto()
        }
        this.props.navigation.goBack(null);
        return true;
    }

    deleteFoto(){
        RNFS.unlink(`${FILE_PREFIX}${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`)
            .then(() => {
                console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
            });
        RNFS.unlink(this.state.path)
        this.setState({ path: null, hasPhoto: false });
    }

    setParameter() {
        let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
        let imgCode = `VP${dataLogin.USER_AUTH_CODE}${this.state.timestamp}`;
        let imageName = imgCode + '.jpg';
        let image = {
            TR_CODE: this.state.ebccValCode,
            IMAGE_CODE: imgCode,
            IMAGE_NAME: imageName,
            IMAGE_PATH_LOCAL: dirPhotoUser + '/' + imageName,
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
                this.setState({ path: data.uri, pathImg: dirPhotoUser, hasPhoto: true });
                RNFS.copyFile(data.uri, `${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`);
                this.resize(`${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`)
            }

        } catch (err) {
            console.log('err: ', err);
        }
    };

    resize(data) {
        ImageResizer.createResizedImage(data, 640, 480, 'JPEG', 80, 0, dirPhotoUser).then((response) => {
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
            RNFS.copyFile(response.path, `${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`);
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
                style={{
                    flex: 1
                }}
                flashMode={Camera.Constants.FlashMode.auto}
                type={'front'}
                mirrorImage={false}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
            >
                <Image
                    ImageResizeMode={"stretch"}
                    style={{flex: 1, width: null, height: null, opacity: 0.8}}
                    source={require("../../Images/icon/ic_overlay.png")}
                />
            </Camera>
        );
    }

    async insertDB() {
        RNFS.unlink(this.state.pathCache);
        let isImageContain = await RNFS.exists(`file://${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`);
        if(isImageContain){
            //insert TR_IMAGE
            TaskService.saveData('TR_IMAGE', this.state.dataModel);
            this.setState({
                showModalBack: true,
                title: 'Berhasil Disimpan',
                message: 'Yeaay! Data kamu berhasil disimpan',
                icon: require('../../Images/ic-save-berhasil.png'),
                photoDirectory: "file://"+dirPhotoUser+"/"+this.state.dataModel.IMAGE_NAME
        });
        }else{
            alert('Ada kesalahan, Ulangi ambil foto!')
        }
    }

    renderImage() {
        return (
                <Image
                    source={{ uri: this.state.path }}
                    style={{
                        flex: 1
                    }}
                />
        );
    }

    renderIcon = () => {
        let imgSource = this.state.hasPhoto ? imgNextPhoto : imgTakePhoto;
        return (
            <Image
                style={{
                    height: 64,
                    width: 64
                }}
                source={imgSource}
            />
        );
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
                />
                <ModalAlertBack
                    onPressCancel={() => this.setState({showModalBack: false}, ()=>{
                        this.props.navigation.state.params.setPhoto(this.state.photoDirectory);
                        this.props.navigation.pop()
                    })}
                    visible={this.state.showModalBack}
                    icon={this.state.icon}
                    title={this.state.title}
                    message={this.state.message} />
                <View style={{ flex: 1 ,backgroundColor:"red" }}>
                    {this.state.path ? this.renderImage() : this.renderCamera()}
                </View>
                <View style={{backgroundColor: 'white'}}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 15,
                            alignSelf:'center'
                        }}
                        onPress={this.takePicture.bind(this)}>
                        {this.renderIcon()}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        alignContent: 'flex-end',
        height: 64,
        width: 64,
        resizeMode: 'stretch',
        alignItems: 'center',
    }
});
