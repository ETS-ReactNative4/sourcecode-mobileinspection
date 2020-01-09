'use strict';
import React, { Component } from 'react';
import {
    BackHandler,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet
} from 'react-native';

import HandleBack from '../Component/Back'
import Form from '../Component/Form';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from '../Database/TaskServices';
import RNFetchBlob from 'rn-fetch-blob'
import {
    dirDatabase, dirMaps,
    dirPhotoEbccJanjang,
    dirPhotoEbccSelfie,
    dirPhotoInspeksiBaris,
    dirPhotoInspeksiSelfie,
    dirPhotoKategori,
    dirPhotoTemuan, dirPhotoUser, dirSummary
} from '../Lib/dirStorage';
import ModalAlert from '../Component/ModalAlert'
import ServerName from '../Constant/ServerName'
import IMEI from 'react-native-device-info'
import { AlertContent } from '../Themes';
import { storeData, removeData } from '../Database/Resources';
import moment from 'moment'
import { getCurrentUser } from '../Database/DatabaseServices';

import {fetchPostWithUrl} from '../Api/FetchingApi';
import RNFS from 'react-native-fs';

class Login extends Component {

    constructor(props) {
        super(props);
        this.serverNameIndex = 1;
        this.state = {
            fetching: false,
            user_id: '',
            user_name: '',
            token: '',
            exit: '',
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: '',
            logOut: props.navigation.getParam('exit'),
        }
    }

    static navigationOptions = {
        header: null,
    };

    insertLink(routeName, param) {
        fetch(ServerName[this.serverNameIndex].service, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${param.ACCESS_TOKEN}`
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status) {
                    let index = 0;
                    for (let i in data.data) {
                        let newService = {
                            SERVICE_ID: parseInt(i),
                            MOBILE_VERSION: data.data[i].MOBILE_VERSION,
                            API_NAME: data.data[i].API_NAME,
                            KETERANGAN: data.data[i].KETERANGAN,
                            METHOD: data.data[i].METHOD,
                            API_URL: data.data[i].API_URL
                        }
                        TaskServices.saveData('TM_SERVICE', newService);
                        index++;
                    }
                    this.insertUser(param);
                    this._resetMobileSync(routeName, param.ACCESS_TOKEN);
                    // this.checkUser(param);
                }
                else {
                    this.setState(AlertContent.versionName_salah)
                }
            });
    }

    insertUser(user) {
        var data = {
            NIK: user.NIK,
            ACCESS_TOKEN: user.ACCESS_TOKEN,
            JOB_CODE: user.JOB_CODE,
            LOCATION_CODE: user.LOCATION_CODE,
            REFFERENCE_ROLE: user.REFFERENCE_ROLE,
            USERNAME: user.USERNAME,
            USER_AUTH_CODE: user.USER_AUTH_CODE,
            USER_ROLE: user.USER_ROLE,
            SERVER_NAME_INDEX: this.serverNameIndex,
            STATUS: 'LOGIN'
        };
        var new_date = moment().add(15, 'days');
        const date = { tanggal: new_date };

        /* SET EXPIRED TOKEN DATE */
        storeData('expiredToken', date);

        TaskServices.saveData('TR_LOGIN', data);
    }

    componentDidMount() {
        removeData('typeApp')
    }

    async clearData() {
        await this.clearRealm();
        await this.deleteFolders()
    }

    async clearRealm(){
        await TaskServices.deleteAllData('TR_LOGIN');
        await TaskServices.deleteAllData('TR_BLOCK_INSPECTION_H');
        await TaskServices.deleteAllData('TR_BLOCK_INSPECTION_D');
        await TaskServices.deleteAllData('TR_BARIS_INSPECTION');
        await TaskServices.deleteAllData('TR_IMAGE');
        await TaskServices.deleteAllData('TM_REGION');
        await TaskServices.deleteAllData('TM_COMP');
        await TaskServices.deleteAllData('TM_EST');
        await TaskServices.deleteAllData('TM_AFD');
        await TaskServices.deleteAllData('TM_BLOCK');
        await TaskServices.deleteAllData('TR_CATEGORY');
        await TaskServices.deleteAllData('TR_CONTACT');
        await TaskServices.deleteAllData('TR_FINDING');
        await TaskServices.deleteAllData('TM_KRITERIA');
        await TaskServices.deleteAllData('TM_LAND_USE');
        await TaskServices.deleteAllData('TM_CONTENT');
        await TaskServices.deleteAllData('TM_CONTENT_LABEL');
        await TaskServices.deleteAllData('TM_INSPECTION_TRACK');
        await TaskServices.deleteAllData('TM_TIME_TRACK');
        await TaskServices.deleteAllData('TR_H_EBCC_VALIDATION');
        await TaskServices.deleteAllData('TR_D_EBCC_VALIDATION');
        await TaskServices.deleteAllData('TR_SYNC_LOG');
        await TaskServices.deleteAllData('TR_NOTIFICATION');
        await TaskServices.deleteAllData('TR_GENBA_SELECTED');
        await TaskServices.deleteAllData('TR_GENBA_INSPECTION');
    }

    async deleteFolders(){
        let dirs = RNFetchBlob.fs.dirs;
        await RNFetchBlob.fs.exists(dirs.SDCardDir + "/" + "MobileInspection")
            .then((exist) => {
                if(exist){
                    RNFetchBlob.fs.unlink(dirs.SDCardDir + "/" + "MobileInspection");
                }
            });

        await RNFS.exists(dirDatabase)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirDatabase);
                }
            });
        await RNFS.exists(dirSummary)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirSummary);
                }
            });
        await RNFS.exists(dirPhotoInspeksiBaris)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoInspeksiBaris);
                }
            });
        await RNFS.exists(dirPhotoInspeksiSelfie)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoInspeksiSelfie);
                }
            });
        await RNFS.exists(dirPhotoTemuan)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoTemuan);
                }
            });
        await RNFS.exists(dirPhotoKategori)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoKategori);
                }
            });
        await RNFS.exists(dirPhotoEbccJanjang)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoEbccJanjang);
                }
            });
        await RNFS.exists(dirPhotoEbccSelfie)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoEbccSelfie);
                }
            });
        await RNFS.exists(dirPhotoUser)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirPhotoUser);
                }
            });
        await RNFS.exists(dirMaps)
            .then((exist)=>{
                if(exist){
                    RNFS.unlink(dirMaps);
                }
            });
    }

    navigateScreen(screenName) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: screenName })],
        });
        navigation.dispatch(resetAction);
    }

    onLogin(username, password, choosenServer) {
        Keyboard.dismiss();
        this.postLogin(username, password, choosenServer, IMEI.getUniqueID);
    }

    postLogin(username, password, choosenServer, imei) {
        let header = {
            'Cache-Control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        let request = {
            username,
            password,
            imei
        };

        this.serverNameIndex = choosenServer;
        fetchPostWithUrl(ServerName[this.serverNameIndex].data + 'auth/login', request, header)
            .then((response)=>{
                console.log("TE",response);
                if(response.status){
                    let routeName = response.data.USER_ROLE !== "FFB_GRADING_MILL" ? 'MainMenu' : 'MainMenuMil';
                    if (getCurrentUser() !== undefined) {
                        if (response.data.USER_AUTH_CODE === getCurrentUser().USER_AUTH_CODE) {
                            this._resetMobileSync(routeName, getCurrentUser().ACCESS_TOKEN);
                        } else {
                            this.clearData()
                                .then(()=>{
                                    this.insertLink(routeName, response.data);
                                });
                        }
                    }
                    else {
                        this.clearData()
                            .then(()=>{
                                this.insertLink(routeName, response.data);
                            });
                    }
                }
                else if(response.status === false) {
                    this.setState({...AlertContent.email_pass_salah})
                }
                else {
                    this.setState({...AlertContent.server_no_response})
                }
            });
    }

    _resetMobileSync(routeName, token) {
        let serviceReset = TaskServices.getAllData('TM_SERVICE')
            .filtered('API_NAME="AUTH-SYNC-RESET" AND MOBILE_VERSION="' + ServerName.verAPK + '"');

        if (serviceReset.length > 0) {
            serviceReset = serviceReset[0];
            fetch(serviceReset.API_URL, {
                method: serviceReset.METHOD,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "RESET_SYNC": 1 })
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log('Response Reset Mobile Sync : ', data);
                    if (data.status == true) {
                        TaskServices.updateLogin('LOGIN');
                        this.navigateScreen(routeName);
                    } else {
                        console.log(data.message);
                    }
                })
                .catch((err) => {
                    console.log("error AUTH-SYNC-RESET", err.message);
                });
        }
    }

    //Add By Aminju 20/01/2019 15:45
    onBack = () => {
        if (this.state.logOut) {
            BackHandler.exitApp();
            return true;
        }
        return false;
    };

    render() {
        return (
            //Add By Aminju 20/01/2019 15:45 (Handle Back Method)
            <HandleBack onBack={this.onBack}>

                <ImageBackground source={require('../Images/background_login.png')} style={styles.container}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior="padding" >

                        <ModalAlert
                            icon={this.state.icon}
                            visible={this.state.showModal}
                            onPressCancel={() => this.setState({ showModal: false })}
                            title={this.state.title}
                            message={this.state.message} />

                        <StatusBar
                            hidden={true}
                            barStyle="light-content" />

                        <Form
                            onBtnClick={data => { this.onLogin(data.strEmail, data.strPassword, data.selectedServer) }} />

                        <ProgressDialog
                            visible={this.state.fetching}
                            activityIndicatorSize="large"
                            message="Loading..."
                        />
                    </KeyboardAvoidingView>
                </ImageBackground>
            </HandleBack>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupTextCont: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16
    },
    signupButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
    },

    footerView: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'column',
        //marginBottom : 30
    },

    footerText: {
        color: '#51a977',
        fontSize: 12,
        textAlign: 'center'
    },
});

