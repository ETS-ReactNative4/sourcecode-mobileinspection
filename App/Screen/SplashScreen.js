
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
        // let dsd = TaskServices.getAllData('TR_IMAGE');
        // alert(JSON.stringify(dsd))
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

    _deleteFinding() {
        var data = TaskServices.query('TR_FINDING', 'PROGRESS = 100');
        var now = moment(new Date());
        if(data !== undefined){
          for(var i=0; i<data.length; i++){
              let dueDate = data[i].DUE_DATE;
              if(dueDate.includes(' ')){
                dueDate = dueDate.substring(0, dueDate.indexOf(' '))
              }
              var diff = moment(new Date(dueDate)).diff(now, 'day');
              if (diff < -7) {
                  this.deleteImage(data[i].FINDING_CODE)
                  this.deleteData('TR_FINDING', 'FINDING_CODE', data[i].FINDING_CODE);
              }
          }
        }
    }  
    
    _deleteInspeksiHeader() {
        var data = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
        var now = moment(new Date());
        if(data != undefined){
            for(var i=0; i>data.length; i++){
            if(data[i].INSERT_TIME !== ''){
                let insertTime = data[i].INSERT_TIME;
                if(insertTime.includes(' ')){
                insertTime = insertTime.substring(0, insertTime.indexOf(' '))
                }
                var diff = moment(new Date(insertTime)).diff(now, 'day');
                if (diff < -7) {            
                    this.deleteImage(data[i].BLOCK_INSPECTION_CODE);
                    this.deleteDetailInspeksi(data[i].BLOCK_INSPECTION_CODE)         
                    this.deleteData('TR_BLOCK_INSPECTION_H', 'BLOCK_INSPECTION_CODE', data[i].BLOCK_INSPECTION_CODE);
                    this.deleteData('TR_BARIS_INSPECTION', 'ID_INSPECTION', data[i].ID_INSPECTION); 
                }
            }
            }
        }    
    }

    deleteImage(trCode) {
        let dataImage = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', trCode);
        if (dataImage !== undefined) {
          this.deleteImageFile(`file://${dataImage.IMAGE_PATH_LOCAL}`);
          this.deleteData('TR_IMAGE', 'IMAGE_CODE', dataImage.IMAGE_CODE);
        }
    }
    
    deleteDetailInspeksi(blokInsCode) {
    let data = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', blokInsCode);
    if (data !== undefined) {
        data.map(item => {
        this.deleteData('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE_D', item.BLOCK_INSPECTION_CODE_D);
        });
    }
    }

    deleteData(table, whereClause, value) {
    let allData = TaskServices.getAllData(table);
    if (allData !== undefined && allData.length > 0) {
        let indexData = R.findIndex(R.propEq(whereClause, value))(allData);
        if (indexData >= 0) {
        TaskServices.deleteRecord(table, indexData);
        }
    }
    }
    
    deleteImageFile(filepath) {
    RNFS.exists(filepath)
        .then((result) => {
        if (result) {
            return RNFS.unlink(filepath)
            .then(() => {
                console.log('FILE DELETED');
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
        })
        .catch((err) => {
        console.log(err.message);
        });
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
