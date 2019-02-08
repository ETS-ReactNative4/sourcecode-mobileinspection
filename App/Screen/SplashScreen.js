
import React, { Component } from 'react';
import { ImageBackground, StatusBar, Text, AppRegistry } from 'react-native';
import { Container } from 'native-base'
import { NavigationActions, StackActions } from 'react-navigation';
import { getPermission } from '../Lib/Utils'
import { connect } from 'react-redux';
import TaskServices from '../Database/TaskServices'
import CategoryAction from '../Redux/CategoryRedux'
import ContactAction from '../Redux/ContactRedux'
import RegionAction from '../Redux/RegionRedux'
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob'
import R, { isEmpty, isNil } from 'ramda'
import { dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie, dirPhotoTemuan, dirPhotoKategori } from '../Lib/dirStorage';
import {convertTimestampToDate, getTodayDate, getUUID} from '../Lib/Utils'
import moment from 'moment'


const user = TaskServices.getAllData('TR_LOGIN');

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            json: '',
            value: true
        }
    }

    static navigationOptions = {
        header: null
    }

    navigateScreen(screenName) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: screenName })],
        });
        navigation.dispatch(resetAction);
    }

    checkUser(){
        let data = TaskServices.getAllData('TR_LOGIN')
        if(data !== undefined && data.length > 0){
            if(data[0].STATUS == 'LOGIN'){
                this.navigateScreen('MainMenu');
            }else{
                this.navigateScreen('Login');  
            }
        }else{
            this.navigateScreen('Login');
        }
    }

    makeFolder(){
        //buat Folder DiExtrnal
        RNFS.mkdir('file:///storage/emulated/0/MobileInspection');
        //buat folder internal    
        RNFS.mkdir(dirPhotoInspeksiBaris);
        RNFS.mkdir(dirPhotoInspeksiSelfie);
        RNFS.mkdir(dirPhotoTemuan);
        RNFS.mkdir(dirPhotoKategori);
    }

    async componentDidMount() {   
        
        var isAllGrandted = await getPermission();
        if (isAllGrandted === true) {
            this.makeFolder()
            setTimeout(() => {
                this.checkUser();
            }, 2000);
        } else {
            Alert.alert('Seluruh Permission harus di hidupkan')
        }
    }   

    render() {
        return (
            <Container>
                <StatusBar
                    hidden={true}
                    barStyle="light-content"
                />
                <ImageBackground source={require('../Images/splash.png')} style={{ flex: 1 }} />

            </Container>

        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        categoryRequest: () => dispatch(CategoryAction.categoryRequest()),
        contactRequest: () => dispatch(ContactAction.contactRequest()),
        regionRequest: () => dispatch(RegionAction.regionRequest())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
