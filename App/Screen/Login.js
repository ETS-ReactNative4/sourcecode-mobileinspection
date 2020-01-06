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
    dirPhotoEbccJanjang,
    dirPhotoEbccSelfie,
    dirPhotoInspeksiBaris,
    dirPhotoInspeksiSelfie,
    dirPhotoKategori,
    dirPhotoTemuan
} from '../Lib/dirStorage';
import ModalAlert from '../Component/ModalAlert'
import ServerName from '../Constant/ServerName'
import IMEI from 'react-native-device-info'
import { AlertContent } from '../Themes';
import { storeData, removeData } from '../Database/Resources';
import moment from 'moment'
import { getCurrentUser } from '../Database/DatabaseServices';

import {fetchPostWithUrl} from '../Api/FetchingApi';

class Login extends Component {

    constructor(props) {
        super(props);
        this.serverNameIndex = 1;
        this.state = {
            fetching: false,
            user_id: '',
            user_name: '',
            token: '',
            imei: '',
            exit: '',
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: ''
        }
    }

    static navigationOptions = {
        header: null,
    }

    get_IMEI_Number() {
        var IMEI_2 = IMEI.getUniqueID;
        this.setState({ imei: IMEI_2 });
        return IMEI_2;
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
        const date = { tanggal: new_date }

        /* SET EXPIRED TOKEN DATE */
        storeData('expiredToken', date);

        TaskServices.saveData('TR_LOGIN', data);
    }

    insertLink(param) {
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
                    TaskServices.deleteAllData('TM_SERVICE');
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
                    this.checkUser(param);
                }
                else {
                    this.setState(AlertContent.versionName_salah)
                }
            });
    }

    componentDidMount() {
        const { navigation } = this.props;
        //data dari morescreen logout
        const logoutStatus = navigation.getParam('exit');
        this.state.logOut = logoutStatus;

        removeData('typeApp')
    }

    checkUser(param) {
        if (TaskServices.getTotalData('TR_LOGIN') > 0) {
            let data = TaskServices.getAllData('TR_LOGIN')[0];
            if (param.USER_AUTH_CODE !== data.USER_AUTH_CODE) {
                this.resetMobileSync(param, data.ACCESS_TOKEN)
            } else {
                TaskServices.deleteAllData('TR_LOGIN');
                this.insertUser(param);

                if (data.USER_ROLE != "FFB_GRADING_MILL") {
                    this.navigateScreen('MainMenu')
                } else {
                    this.navigateScreen('MainMenuMil')
                }
            }
        } else {
            this.resetMobileSync(param, param.ACCESS_TOKEN)
        }
    }

    resetMobileSync(param, token) {
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
                    this.deleteAllTableAndFolder(param)
                })
                .catch((err) => {
                    console.log("error AUTH-SYNC-RESET", err.message);
                });
        }
    }

    deleteAllTableAndFolder(param) {
        TaskServices.deleteAllData('TR_LOGIN');
        TaskServices.deleteAllData('TR_BLOCK_INSPECTION_H');
        TaskServices.deleteAllData('TR_BLOCK_INSPECTION_D');
        TaskServices.deleteAllData('TR_BARIS_INSPECTION');
        TaskServices.deleteAllData('TR_IMAGE');
        TaskServices.deleteAllData('TM_REGION');
        TaskServices.deleteAllData('TM_COMP');
        TaskServices.deleteAllData('TM_EST');
        TaskServices.deleteAllData('TM_AFD');
        TaskServices.deleteAllData('TM_BLOCK');
        TaskServices.deleteAllData('TR_CATEGORY');
        TaskServices.deleteAllData('TR_CONTACT');
        TaskServices.deleteAllData('TR_FINDING');
        TaskServices.deleteAllData('TM_KRITERIA');
        TaskServices.deleteAllData('TM_LAND_USE');
        TaskServices.deleteAllData('TM_CONTENT');
        TaskServices.deleteAllData('TM_CONTENT_LABEL');
        TaskServices.deleteAllData('TM_INSPECTION_TRACK');
        TaskServices.deleteAllData('TM_TIME_TRACK');
        TaskServices.deleteAllData('TR_H_EBCC_VALIDATION');
        TaskServices.deleteAllData('TR_D_EBCC_VALIDATION');
        TaskServices.deleteAllData('TR_SYNC_LOG');
        TaskServices.deleteAllData('TR_NOTIFICATION');
        TaskServices.deleteAllData('TR_GENBA_SELECTED');
        TaskServices.deleteAllData('TR_GENBA_INSPECTION');

        RNFetchBlob.fs.unlink(`file://${dirPhotoTemuan}`)
        RNFetchBlob.fs.unlink(`file://${dirPhotoInspeksiBaris}`)
        RNFetchBlob.fs.unlink(`file://${dirPhotoInspeksiSelfie}`)
        RNFetchBlob.fs.unlink(`file://${dirPhotoKategori}`)
        RNFetchBlob.fs.unlink(`file://${dirPhotoEbccJanjang}`)
        RNFetchBlob.fs.unlink(`file://${dirPhotoEbccSelfie}`)


        this.insertUser(param);
        if (param.USER_ROLE != "FFB_GRADING_MILL") {
            this.navigateScreen('MainMenu')
        } else {
            this.navigateScreen('MainMenuMil')
        }
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
        var imei = this.get_IMEI_Number();


        this.postLogin(username, password, choosenServer, imei);
    }

    // postLogin(username, password, choosenServer, imei) {
    //     this.serverNameIndex = choosenServer;
    //     fetch(ServerName[this.serverNameIndex].data + 'auth/login', {
    //         method: 'POST',
    //         headers: {
    //             'Cache-Control': 'no-cache',
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ username, password, imei })
    //     })
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then(async (response) => {
    //             this.setState({ fetching: false });
    //             console.log('Response Data Login : ', response)
    //             if (response.status == true) {
    //                 if (getCurrentUser() !== undefined) {
    //                     if (response.data.USER_AUTH_CODE == getCurrentUser().USER_AUTH_CODE) {
    //                         if (response.data.USER_ROLE != "FFB_GRADING_MILL") {
    //                             this._resetMobileSync('MainMenu', getCurrentUser().ACCESS_TOKEN);
    //                         } else {
    //                             this._resetMobileSync('MainMenuMil', getCurrentUser().ACCESS_TOKEN);
    //                         }
    //                     } else {
    //                         this.deleteConfig();
    //                         this.insertLink(response.data);
    //                     }
    //                 } else {
    //                     this.deleteConfig();
    //                     this.insertLink(response.data);
    //                 }
    //             } else {
    //                 if (response.data.message === 'Request Timeout') {
    //                     this.setState(AlertContent.proses_lambat)
    //                 } else {
    //                     this.setState(AlertContent.email_pass_salah)
    //                 }
    //             }
    //         });
    // }

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
                if(response){
                    if (getCurrentUser() !== undefined) {
                        if (response.data.USER_AUTH_CODE == getCurrentUser().USER_AUTH_CODE) {
                            if (response.data.USER_ROLE != "FFB_GRADING_MILL") {
                                this._resetMobileSync('MainMenu', getCurrentUser().ACCESS_TOKEN);
                            } else {
                                this._resetMobileSync('MainMenuMil', getCurrentUser().ACCESS_TOKEN);
                            }
                        } else {
                            this.deleteConfig();
                            this.insertLink(response.data);
                        }
                    }
                    else {
                        this.deleteConfig();
                        this.insertLink(response.data);
                    }
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

    deleteConfig() {
        TaskServices.deleteAllData('TR_CONFIG');
    }

    //Add By Aminju 20/01/2019 15:45
    state = {
        logOut: false,
    };

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

