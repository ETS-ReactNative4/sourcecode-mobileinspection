import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Platform,
    BackHandler,
<<<<<<< Updated upstream
    Dimensions,
=======
>>>>>>> Stashed changes
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
import moment from 'moment';

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

    componentDidMount() {
        this.setParameter()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

<<<<<<< Updated upstream
    componentWillUnmount(){
=======
    componentWillUnmount() {
>>>>>>> Stashed changes
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        if (this.state.hasPhoto) {
            this.deleteFoto()
        }
        this.props.navigation.goBack(null);
        return true;
    }

    deleteFoto() {
        RNFS.unlink(`${FILE_PREFIX}${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`)
            .then(() => {
                console.log(`FILE ${this.state.dataModel.IMAGE_NAME} DELETED`);
            });
        RNFS.unlink(this.state.path)
        this.setState({ path: null, hasPhoto: false });
    }

    setParameter() {
        let dataLogin = TaskService.getAllData('TR_LOGIN')[0];
        let imgCode = `FP${dataLogin.USER_AUTH_CODE}${this.state.timestamp}`;
        let imageName = imgCode + '.jpg';
        let image = {
            USER_AUTH_CODE: dataLogin.USER_AUTH_CODE,
            IMAGE_NAME: imageName,
            IMAGE_PATH_LOCAL: dirPhotoUser + '/' + imageName,
            IMAGE_URL: '',
            STATUS_IMAGE: 'SELFIE_V',
            STATUS_SYNC: 'N',
            INSERT_TIME: moment().format("YYYY-MM-DD HH:mm:ss")
        };
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
                    style={{ flex: 1, width: null, height: null, opacity: 0.8 }}
                    source={require("../../Images/icon/ic_overlay.png")}
                />
            </Camera>
        );
    }

    async insertDB() {
        RNFS.unlink(this.state.pathCache);
        let isImageContain = await RNFS.exists(`file://${dirPhotoUser}/${this.state.dataModel.IMAGE_NAME}`);
        if (isImageContain) {
            let model = this.state.dataModel;
            let fotoUserChecker = TaskService.findBy2("TR_IMAGE_PROFILE", "USER_AUTH_CODE", this.state.dataModel.USER_AUTH_CODE);
            if (fotoUserChecker !== undefined && fotoUserChecker.length > 0) {
                TaskService.updateByPrimaryKey('TR_IMAGE_PROFILE', {
                    USER_AUTH_CODE: this.state.dataModel.USER_AUTH_CODE,
                    IMAGE_NAME: model.IMAGE_NAME,
                    IMAGE_PATH_LOCAL: model.IMAGE_PATH_LOCAL,
                    IMAGE_URL: model.IMAGE_URL,
                    STATUS_IMAGE: model.STATUS_IMAGE,
                    STATUS_SYNC: "N",
                    INSERT_TIME: model.INSERT_TIME,
                });
            }
            else {
                TaskService.saveData('TR_IMAGE_PROFILE', model);
            }

            this.setState({
                showModalBack: true,
                title: 'Berhasil Disimpan',
                message: 'Yeaay! Data kamu berhasil disimpan',
                icon: require('../../Images/ic-save-berhasil.png'),
                photoDirectory: "file://" + dirPhotoUser + "/" + this.state.dataModel.IMAGE_NAME
            });
        } else {
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
                    onPressCancel={() => this.setState({ showModalBack: false }, () => {
                        this.props.navigation.state.params.setPhoto(this.state.photoDirectory);
                        this.props.navigation.pop()
                    })}
                    visible={this.state.showModalBack}
                    icon={this.state.icon}
                    title={this.state.title}
                    message={this.state.message} />
                <View style={{ flex: 1, backgroundColor: "red" }}>
                    {this.state.path ? this.renderImage() : this.renderCamera()}
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 15,
                            alignSelf: 'center'
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
