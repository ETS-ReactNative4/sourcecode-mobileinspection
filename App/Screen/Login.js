

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar,
    ImageBackground, Alert, BackHandler
} from 'react-native';

import HandleBack from '../Component/Back'

// import {Container, Content, Header} from 'native-base'
// import Logo from '../Component/Logo';
import Form from '../Component/Form';
import { connect } from 'react-redux';
import AuthAction from '../Redux/AuthRedux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { NavigationActions, StackActions } from 'react-navigation';
import { isNil } from 'ramda';
import TaskServices from '../Database/TaskServices';
const IMEI = require('react-native-imei');
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob'
import { dirPhotoTemuan, dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie, dirPhotoKategori } from '../Lib/dirStorage';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            user_id: '',
            user_name: '',
            token: '',
            imei: '',
            exit: '',
        }
    }

    static navigationOptions = {
        header: null,
    }

    get_IMEI_Number() {
        var IMEI_2 = IMEI.getImei();
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
            STATUS: 'LOGIN'
        };
        TaskServices.saveData('TR_LOGIN', data);
    }

    componentDidMount() {
        const { navigation } = this.props;
        const itemId = navigation.getParam('exit');
        this.state.logOut = itemId
    }

    checkUser(USER_AUTH_CODE){

        let data = TaskServices.getAllData('TR_LOGIN')[0]
        if(data !== undefined && USER_AUTH_CODE !== data.USER_AUTH_CODE){
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

            RNFetchBlob.fs.unlink(`file://${dirPhotoTemuan}`)
            RNFetchBlob.fs.unlink(`file://${dirPhotoInspeksiBaris}`)
            RNFetchBlob.fs.unlink(`file://${dirPhotoInspeksiSelfie}`)
            RNFetchBlob.fs.unlink(`file://${dirPhotoKategori}`)
        }
    }

    componentWillReceiveProps(newProps) {
        if (!isNil(newProps.auth)) {
            this.setState({ fetching: newProps.auth.fetching });
        }
        if (!isNil(newProps.auth.user)) {
            this.checkUser(newProps.auth.user.USER_AUTH_CODE)
            this.insertUser(newProps.auth.user);
            this.navigateScreen('MainMenu');

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

    onLogin(username, password) {
        Keyboard.dismiss();
        var Imei = this.get_IMEI_Number();
        //let data = {
        //    username: username,
        //    password: password,
        //    imei: Imei
        //}
        // this.postLogin(data)
        this.props.authRequest({
            username: username,
            password: password,
            imei: Imei
        });
    }

    postLogin(param){
        fetch('http://149.129.245.230:3008/api/login', {
        method: 'POST',
        headers: { 
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json' ,
            // 'Authorization': `Bearer ${user.ACCESS_TOKEN}`
        },
        body:  JSON.stringify(param)
        })
        .then(function(response){ 
            return response.json();   
        })
        .then(function(data){ 
            alert(JSON.stringify(data))
            console.log(data)
        });
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
                        <StatusBar
                            hidden={true}
                            barStyle="light-content"
                        />


                        {/* <Logo/> */}

                        <Form
                            onBtnClick={data => { this.onLogin(data.strEmail, data.strPassword) }} />
                        <View style={styles.footerView}>
                            <Text style={styles.footerText}>{'\u00A9'} 2018 Copyrights PT Triputra Agro Persada</Text>
                        </View>
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

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authRequest: obj => dispatch(AuthAction.authRequest(obj))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

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
    }, footerView: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    footerText: {
        color: '#51a977',
        fontSize: 12,
    },
});

