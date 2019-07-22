"use strict";
import React from 'react';
import { ImageBackground, StatusBar, TouchableOpacity, TouchableNativeFeedback, View, ScrollView, Image, StyleSheet, Dimensions,
		ActivityIndicator } from 'react-native';
import { Thumbnail, Text } from 'native-base';
import { connect } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import CategoryAction from '../../Redux/CategoryRedux'
import ContactAction from '../../Redux/ContactRedux'
import RegionAction from '../../Redux/RegionRedux'
import CustomHeader from '../../Component/CustomHeader'
import ServerName from '../../Constant/ServerName'
import Moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob'
import { changeFormatDate, getThumnail } from '../../Lib/Utils';
import FastImage from 'react-native-fast-image'
import SwiperSlider from 'react-native-swiper'
import { dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie,
  dirPhotoTemuan, dirPhotoKategori, dirPhotoEbccJanjang, dirPhotoEbccSelfie, dirMaps } from '../../Lib/dirStorage';

import HomeScreenComment from "./HomeScreenComment";

import {clipString} from '../../Constant/Function';

var RNFS = require('react-native-fs');
var { width } = Dimensions.get('window')

class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.tintColorPrimary
    },
    headerTitleStyle: {
      textAlign: "center",
      flex: 1,
      fontSize: 18,
      fontWeight: '400',
      marginHorizontal: 12
    },
    title: 'Beranda',
    headerTintColor: '#fff',
    headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 12 }}>
            <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_inbox.png')} />
          </View>
        </TouchableOpacity>
    ),
    headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Sync')}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 12 }}>
            <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_sync.png')} />
          </View>
        </TouchableOpacity>
    ),
    header: props => <CustomHeader {...props} />
  });

  constructor(props) {
    super(props);

    this.extraFilter = "";
    this.extraFilterTime = {
      startTime: null,
      endTime: null,
      filter: false
    }
    this.state = {
      data: [],
      thumnailImage: '',
      loadAll: true,

      //Add Modal Alert by Aminju
      title: 'Title',
      message: 'Message',
      showModal: false,
      icon: '',
      isFilter: false,
      page: 0,
      isLoading: false,
    }
  }

  willFocus = this.props.navigation.addListener(
      'willFocus',
      () => {
        if (this.state.loadAll) {
			//this._initData()
			this.setState({
			  data: [],
			  page: 0,
			  dataSet: this._filterHome()
			}, function () {
			  // call the function to pull initial 12 records
			  this.addRecords(0);
			});
        }
      }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  componentDidMount() {
    RNFS.copyFile(TaskServices.getPath(), 'file:///storage/emulated/0/MobileInspection/data.realm');
    RNFS.mkdir(dirPhotoInspeksiBaris);
    RNFS.mkdir(dirPhotoInspeksiSelfie);
    RNFS.mkdir(dirPhotoTemuan);
    RNFS.mkdir(dirPhotoKategori);
    RNFS.mkdir(dirPhotoEbccJanjang);
    RNFS.mkdir(dirPhotoEbccSelfie);
    RNFS.mkdir(dirMaps);
  }

  _changeFilterList = data => {
    if (data != undefined) {
      this.setState({ loadAll: false });
      this._initFilterData(data);
    }
  }

  /*_initData() {
    this.setState({ data: this._filterHome() });
  }*/
  //Aminju
  addRecords = (page) => {
    // assuming this.state.dataPosts hold all the records
    console.log('Page : ', page)
    const newRecords = []
    for (var i = page * 5, il = i + 5; i < il && i <
      this.state.dataSet.length; i++) {
      newRecords.push(this.state.dataSet[i]);
    }
    this.setState({
      data: [...this.state.data, ...newRecords],
      isLoading: false
    });
  }

  _filterHome() {
    const login = TaskServices.getAllData('TR_LOGIN');
    const ref_role = login[0].REFFERENCE_ROLE;
    let loc_code = login[0].LOCATION_CODE;

    var finding = TaskServices.getAllData('TR_FINDING');
    var findingSorted = finding.sorted('INSERT_TIME', true);
    var findingFilter;
    if(this.extraFilter!==""){
      this.extraFilter = " AND "+this.extraFilter;
    }

    if (ref_role == 'REGION_CODE') {
      var estate = TaskServices.getAllData('TM_EST');
      var estateFilter = estate.filtered(`REGION_CODE = "${loc_code}"`);

      if (estateFilter.length > 0) {
        let wersArr = [];
        estateFilter.map(item => {
          const werksEst = item.WERKS
          wersArr.push(werksEst);
        });

        var query = 'WERKS == ';
        for (var i = 0; i < wersArr.length; i++) {
          query += `"${wersArr[i]}"`;
          if (i + 1 < wersArr.length) {
            query += ` OR WERKS == `
          }
        }
        findingFilter = findingSorted.filtered(`${query} ${this.extraFilter}`);
      } else {
        if(this.extraFilter!==""){
          this.extraFilter = this.extraFilter.replace(" AND ","");
          findingFilter = finding.sorted('INSERT_TIME', true).filtered(this.extraFilter);
        }
        else{
          findingFilter = finding.sorted('INSERT_TIME', true);
        }
      }
    } else if (ref_role == 'COMP_CODE') {
      if(loc_code.includes(',')){
        let arr = []
        let extraFilter = this.extraFilter
        loc_code = loc_code.split(',')
        loc_code.map(item =>{
          let das = findingSorted.filtered(`WERKS CONTAINS[c] "${item}" ${extraFilter}`);
          if(das.length > 0){
            das.map(item2 => {
              let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
              if(!this.extraFilterTime.filter){
                arr.push(item2)
              }
              else if(stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter){
                arr.push(item2)
              }
            })
          }
        })
        findingFilter = arr
      }else{
        findingFilter = findingSorted.filtered(`WERKS CONTAINS[c] "${loc_code}" ${this.extraFilter}`);
      }
    } else if (ref_role == 'BA_CODE') {
      if(loc_code.includes(',')){
        let arr = []
        let extraFilter = this.extraFilter
        loc_code = loc_code.split(',')
        loc_code.map(item =>{
          let das = findingSorted.filtered(`WERKS = "${item}" ${extraFilter}`);
          if(das.length > 0){
            das.map(item2 => {
              let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
              if(!this.extraFilterTime.filter){
                arr.push(item2)
              }
              else if(stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter){
                arr.push(item2)
              }
            })
          }
        })
        findingFilter = arr
      }else{
        findingFilter = findingSorted.filtered(`WERKS = "${loc_code}" ${this.extraFilter}`);
      }
    } else if (ref_role == 'AFD_CODE') {
      if(loc_code.includes(',')){
        let arr = []
        let extraFilter = this.extraFilter
        loc_code = loc_code.split(',')
        loc_code.map(item =>{
          const werks = item.substring(0, 4);
          const afd_code = item.substring(4, 5);
          let das = findingSorted.filtered(`WERKS = "${werks}" AND AFD_CODE = "${afd_code}" ${extraFilter}`);
          if(das.length > 0){
            das.map(item2 => {
              let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
              if(!this.extraFilterTime.filter){
                arr.push(item2)
              }
              else if(stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter){
                // console.log("curDate:"+stDate+"||start:"+this.extraFilterTime.startTime+"||end:"+this.extraFilterTime.endTime);
                arr.push(item2)
              }
            })
          }
        })
        findingFilter = arr
      }else{
        const werks = loc_code.substring(0, 4);
        const afd_code = loc_code.substring(4, 5);
        findingFilter = findingSorted.filtered(`WERKS = "${werks}" AND AFD_CODE = "${afd_code}" ${this.extraFilter}`);
      }

    } else {
      if(this.extraFilter!==""){
        this.extraFilter = this.extraFilter.replace(" AND ","");
        findingFilter = finding.sorted('INSERT_TIME', true).filtered(this.extraFilter);
      }
      else{
        findingFilter = finding.sorted('INSERT_TIME', true);
      }
    }
    this.extraFilter = "";

    let statusFindingDesc = [];
    let statusFindingComment = [];
    findingFilter.map((data, index)=>{
      statusFindingDesc.push(false);
      statusFindingComment.push(false);
    });
    this.setState({
      statusFindingDesc: statusFindingDesc,
      statusFindingComment: statusFindingComment
    });
    return findingFilter;
  }

  _initFilterData(dataFilter) {
    dataFilter.map(item => {
      let ba = item.ba;
      let afd = item.afd;
      let userAuth = item.userAuth;
      let status = item.status;
      let stBatasWaktu = item.stBatasWaktu;
      let endBatasWaktu = item.endBatasWaktu.substring(0, 8) + '235959';
      let valBatasWaktu = item.valBatasWaktu;
      let valAssignto = item.valAssignto;

      let varBa = ' AND WERKS = ' + `"${ba}"`
      let varAfd = ' AND AFD_CODE = ' + `"${afd}"`
      let varUserAuth = ' AND INSERT_USER = ' + `"${userAuth}"`
      let varStatus = ' AND STATUS = ' + `"${status}"`
      let varInsertTime = ' AND INSERT_TIME >= ' + `"${stBatasWaktu}"` + ' AND INSERT_TIME <= ' + `"${endBatasWaktu}"`

      let stBa;
      if (ba == 'Pilih Lokasi') {
        stBa = ' AND WERKS CONTAINS ' + `"${""}"`
      } else {
        stBa = varBa
      }

      let stAfd;
      if (afd == 'Pilih Afdeling') {
        stAfd = ' AND AFD_CODE CONTAINS ' + `"${""}"`
      } else {
        stAfd = varAfd
      }

      let stUserAuth;
      if (valAssignto == 'Pilih Pemberi Tugas') {
        stUserAuth = ' AND INSERT_USER CONTAINS ' + `"${""}"`
      } else {
        stUserAuth = varUserAuth
      }

      let stStatus;
      if (status == 'Pilih Status') {
        stStatus = ' AND STATUS CONTAINS ' + `"${""}"`
      } else {
        stStatus = varStatus
      }

      let stInsertTime;
      if (valBatasWaktu == 'Pilih Batas Waktu') {
        stInsertTime = ' AND STATUS CONTAINS ' + `"${""}"`
        this.extraFilterTime={
          startTime: null,
          endTime: null,
          filter: false
        }
      } else {
        stInsertTime = varInsertTime
        this.extraFilterTime={
          startTime: stBatasWaktu,
          endTime: endBatasWaktu,
          filter: true
        }
      }

      let data;
      if (ba == 'Pilih Lokasi' && afd == 'Pilih Afdeling' &&
          valAssignto == 'Pilih Pemberi Tugas' && status == 'Pilih Status' && valBatasWaktu == 'Pilih Batas Waktu') {
        data = this._filterHome();
        //this.setState({ data, isFilter: false });
        this.setState({
          data: [],
          page: 0,
          dataSet: data,
          isFilter: true
        }, function () {
          // call the function to pull initial 12 records
          this.addRecords(0);
        });
      } else {
        //bingung
        this.extraFilter = `AFD_CODE CONTAINS ""${stBa}${stAfd}${stUserAuth}${stStatus}`;
        data = this._filterHome();//.filtered(`AFD_CODE CONTAINS ""${stBa}${stAfd}${stUserAuth}${stStatus}${stInsertTime}`);
        if (data.length == 0) {
          this.setState({ data, isFilter: true, showModal: true, title: 'Tidak Ada Data', message: 'Wah ga ada data berdasarkan filter ini.', icon: require('../../Images/ic-no-data.png') });
        } else {
          //this.setState({ data, isFilter: true });
          this.setState({
            data: [],
            page: 0,
            dataSet: data,
            isFilter: true
          }, function () {
            // call the function to pull initial 12 records
            this.addRecords(0);
          });
        }
      }
    })
  }

  _getStatus() {
    if (this.state.data.PROGRESS == 100) {
      return "After"
    } else if (this.state.data.PROGRESS == 0) {
      return "Before"
    }
  }


  getColor(param) {
    switch (param) {
      case 'SELESAI':
        return 'rgba(35, 144, 35, 0.9)';
      case 'SEDANG DIPROSES':
        return 'rgba(254, 178, 54, 0.9)';
      case 'BARU':
        return 'rgba(255, 77, 77, 0.9)';
      case 'Batas waktu belum ditentukan':
        return 'red';
      default:
        return '#ff7b25';
    }
  }

  alertItemName = (item) => {
    alert(item.STATUS)
  }

  getCategoryName = (categoryCode) => {
    try {
      let data = TaskServices.findBy2('TR_CATEGORY', 'CATEGORY_CODE', categoryCode);
      return data.CATEGORY_NAME;
    } catch (error) {
      return ''
    }
  }

  getContactName = (userAuth) => {
    try {
      let data = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', userAuth);
      return data.FULLNAME;
    } catch (error) {
      return ''
    }
  }

  getEstateName(werks) {
    try {
      let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
      return data.EST_NAME;
    } catch (error) {
      return '';
    }
  }

  getBlokName(werkAfdBlokCode) {
    try {
      let data = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlokCode);
      return data.BLOCK_NAME;
    } catch (error) {
      return ''
    }
  }

  getStatusBlok(werk_afd_blok_code) {
    try {
      let data = TaskServices.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
      return data.MATURITY_STATUS;
    } catch (error) {
      return ''
    }
  }

  getStatusImage(status) {
    if (status == 'SEBELUM') {
      return "Before"
    } else if ('SESUDAH') {
      return "After"
    }
  }

  renderCarousel = (item, status, i) => {
    let uri;
    if (item.IMAGE_PATH_LOCAL != undefined) {
      uri = "file://" + item.IMAGE_PATH_LOCAL;
    } else {
      uri = require('../../Images/img-no-picture.png')
    }
    let sources;
    if (status == 'BARU') {
      sources = require('../../Images/icon/ic_new_timeline.png')
    } else if (status == 'SELESAI') {
      sources = require('../../Images/icon/ic_done_timeline.png')
    } else {
      sources = require('../../Images/icon/ic_inprogress_timeline.png')
    }
    return (
        <View style={{ flex: 1 }}>
          {status == 'SELESAI' &&
          <View style={{
            backgroundColor: 'rgba(91, 90, 90, 0.7)', width: 70,
            padding: 3, position: 'absolute', top: 0, right: 10, zIndex: 1, alignItems: 'center',
            margin: 10, borderRadius: 25,
          }}>
            <Text style={{ fontSize: 10, marginBottom: 5, color: 'white' }}>{this.getStatusImage(item.STATUS_IMAGE)}</Text>
          </View>}

          <FastImage style={{ height: 300 }}
                     source={{
                       uri: uri,
                       priority: FastImage.priority.normal,
                     }} />

          <TouchableNativeFeedback onPress={() => { this.onClickItem(i.FINDING_CODE) }}>
            <View style={{
              flexDirection: 'row',
              backgroundColor: this.getColor(status),
              width: '100%', height: 35,
              position: 'absolute', bottom: 0,
              paddingLeft: 18
            }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image style={{ marginTop: 3, height: 28, width: 28 }} source={sources}></Image>
                <Text style={{ width: 200, marginLeft: 12, color: 'white', fontSize: 14, alignSelf: 'center', marginTop: 1 }}>{status}</Text>
              </View>
              <View style={{ position: 'absolute', right: 0, marginRight: 12, marginTop: 3 }}>
                <Entypo name={'chevron-right'} color={'white'} size={25} />
              </View>
            </View>
          </TouchableNativeFeedback>
        </View >
    )
  }

  renderImage = (images, status) => {
    let sources;
    if (status == 'BARU') {
      sources = require('../../Images/icon/ic_new_timeline.png')
    } else if (status == 'SELESAI') {
      sources = require('../../Images/icon/ic_done_timeline.png')
    } else {
      sources = require('../../Images/icon/ic_inprogress_timeline.png')
    }
    return (
        <View style={{ height: 300 }}>
          <ImageSlider
              images={images}
              customSlide={({ index, item, style, width }) => (
                  <View key={index} style={[style, width, { backgroundColor: 'yellow' }]}>
                    <View style={{
                      backgroundColor: 'rgba(91, 90, 90, 0.7)', width: 70,
                      padding: 3, position: 'absolute', top: 0, right: 10, zIndex: 1, alignItems: 'center',
                      margin: 10, borderRadius: 25,
                    }}>
                      <Text style={{ fontSize: 10, marginBottom: 5, color: 'white' }}>{this.getStatusImage(item.STATUS_IMAGE)}</Text>
                    </View>
                    <FastImage style={{ alignItems: 'center', width: '100%', height: '100%' }}
                               source={{
                                 uri: 'file://' + item.IMAGE_PATH_LOCAL,
                                 priority: FastImage.priority.normal,
                               }} />
                    <View style={{
                      flexDirection: 'row',
                      backgroundColor: this.getColor(status),
                      width: '100%', height: 35,
                      position: 'absolute', bottom: 0
                    }}>
                      <Image style={{ marginTop: 2, height: 28, width: 28 }} source={sources}></Image>
                      <Text style={{ marginLeft: 10, color: 'white', fontSize: 14, marginTop: 8 }}>{status}</Text>
                    </View>
                  </View>
              )}
          />
        </View>
    )
  }

  _renderItem = (item, index) => {
    const INSERT_USER = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', item.INSERT_USER);
    let user = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME
    Moment.locale();
    let dtInsertTime = Moment(changeFormatDate(item.INSERT_TIME.toString(), "YYYY-MM-DD hh-mm-ss")).format('DD MMM YYYY hh:mm A');
    let batasWaktu = item.DUE_DATE == '' ? 'Batas waktu belum ditentukan' : Moment(item.DUE_DATE).format('DD MMM YYYY');

    const dataImage = TaskServices.findBy('TR_IMAGE', 'TR_CODE', item.FINDING_CODE);
    const image = dataImage.sorted('INSERT_TIME', true);

    let werkAfdBlockCode = `${item.WERKS}${item.AFD_CODE}${item.BLOCK_CODE}`;
    let lokasiBlok = `${this.getBlokName(werkAfdBlockCode)}/${this.getStatusBlok(werkAfdBlockCode)}/${this.getEstateName(item.WERKS)}`
    let status = item.STATUS;
    let sources;
    if (status == 'BARU') {
      sources = require('../../Images/icon/ic_new_timeline.png')
    } else if (status == 'SELESAI') {
      sources = require('../../Images/icon/ic_done_timeline.png')
    } else {
      sources = require('../../Images/icon/ic_inprogress_timeline.png')
    }

    //Get Finding Comment
    let getComment = TaskServices.findBy("TR_FINDING_COMMENT", "FINDING_CODE", item.FINDING_CODE).sorted('INSERT_TIME', true);
    let commentCount = getComment.length;
    let latestComment = null;
    if(commentCount > 0){
      latestComment = getComment[0];
    }

    let show = false;

    return (
        <View key={index}>
          <View >
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Thumbnail style={{ borderColor: 'grey', borderWidth: 0.5, height: 36, width: 36, marginRight: 10, marginLeft: 10 }} source={getThumnail()} />
              <View>
                <Text style={{ fontSize: 14 }}>{user}</Text>
                <Text style={{ fontSize: 12, color: 'grey' }}>{dtInsertTime}</Text>
              </View>
            </View>
            <View style={{ marginTop: 12 }} cardBody>
              {image.length == 0 && <ImageBackground source={require('../../Images/img-no-picture.png')} style={{ height: 300, width: '100%', flex: 1, flexDirection: 'column-reverse', resizeMode: 'stretch' }} >
                <TouchableOpacity onPress={() => { this.onClickItem(item.FINDING_CODE) }}>
                  <View style={{ alignContent: 'center', paddingTop: 2, paddingLeft: 18, flexDirection: 'row', height: 35, backgroundColor: this.getColor(item.STATUS) }} >
                    <Image style={{ marginTop: 2, height: 28, width: 28 }} source={sources}></Image>
                    <Text style={{ marginLeft: 12, color: 'white', fontSize: 14, marginTop: 5 }}>{item.STATUS}</Text>
                    <View style={{ position: 'absolute', right: 0, marginRight: 12, marginTop: 3 }}>
                      <Entypo name={'chevron-right'} color={'white'} size={25} />
                    </View>
                  </View>
                </TouchableOpacity>
              </ImageBackground>}
              {image != 0 && <View style={{
                flex: 1,
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <SwiperSlider
                    autoplay={false}
                    width={width}
                    height={300}
                    showsButtons={false}
                    activeDotColor={'white'}
                    paginationStyle={{
                      bottom: 8,
                      color: 'white'
                    }}
                    loop={false}>
                  {image.map(i => this.renderCarousel(i, status, item))}
                </SwiperSlider>
              </View>}
            </View>
            <View style={{
              marginTop: 12,
              marginHorizontal: 16
            }}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {lokasiBlok} - {this.getCategoryName(item.FINDING_CATEGORY)}
                </Text>
              </View>
              {/*<TouchableOpacity onPress={() => { this.onClickItem(item.FINDING_CODE) }}>*/}
              {/*  <View style={{ flex: 2, marginLeft: 16 }}>*/}

              {/*    <View style={styles.column}>*/}
              {/*      <Text style={styles.label}>Lokasi </Text>*/}
              {/*      <Text style={styles.item}>: {lokasiBlok} </Text>*/}
              {/*    </View>*/}

              {/*    <View style={styles.column}>*/}
              {/*      <Text style={styles.label}>Kategori </Text>*/}
              {/*      <Text style={styles.item}>: {this.getCategoryName(item.FINDING_CATEGORY)} </Text>*/}
              {/*    </View>*/}

              {/*    <View style={styles.column}>*/}
              {/*      <Text style={styles.label}>Ditugaskan Kepada </Text>*/}
              {/*      <Text style={styles.item}>: {this.getContactName(item.ASSIGN_TO)}</Text>*/}
              {/*    </View>*/}

              {/*    <View style={styles.column}>*/}
              {/*      <Text style={styles.label}>Batas Waktu </Text>*/}
              {/*      <Text style={{ width: '60%', color: this.getColor(batasWaktu), fontSize: 14 }}>: {batasWaktu} </Text>*/}
              {/*    </View>*/}
              {/*  </View>*/}
              {/*</TouchableOpacity>*/}
              <View style={{
                flexDirection: 'row',
                flexWrap: "wrap"
              }}>
                <Text>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {user}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12
                    }}
                  >
                    {
                      this.state.statusFindingDesc[index] ? item.FINDING_DESC : clipString(item.FINDING_DESC, 150)
                    }
                  </Text>
                  {
                    item.FINDING_DESC.length > 150 && !this.state.statusFindingDesc[index] &&
                    <Text
                        onPress={()=>{
                          let tempStatus = this.state.statusFindingDesc;
                          tempStatus[index] = true;
                          this.setState({
                            statusFindingDesc: tempStatus
                          })
                        }}
                        style={{
                          fontSize: 12,
                          color:"rgba(202,194,194, 1)"
                        }}
                    >
                      {" "}Selengkapnya
                    </Text>
                  }
                </Text>
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    alignSelf:"flex-end"*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <Text style={{*/}
                {/*    fontSize: 12,*/}
                {/*    color:"rgba(202,194,194, 1)"*/}
                {/*  }}>Read more</Text>*/}
                {/*</TouchableOpacity>*/}
              </View>
              {
                commentCount > 0 ?
                <View style={{marginVertical: 5}}>
                  <TouchableOpacity onPress={()=>{
                    this.props.navigation.navigate("HomeScreenComment", {findingCode: item.FINDING_CODE})
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color:"rgba(202,194,194, 1)"
                    }}>
                      Lihat {commentCount} Komentar
                    </Text>
                  </TouchableOpacity>
                  <Text style={{
                    marginTop: 10
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}>
                      {latestComment.USERNAME}{" "}
                    </Text>
                    <Text
                        style={{
                          fontSize: 12
                        }}
                        onPress={()=>{
                          this.props.navigation.navigate("HomeScreenComment", {findingCode: item.FINDING_CODE})
                        }}
                    >
                      {
                        this.state.statusFindingComment[index] ? latestComment.MESSAGE : clipString(latestComment.MESSAGE, 150)
                      }
                    </Text>
                    {
                      latestComment.MESSAGE.length > 150 && !this.state.statusFindingComment[index] &&
                      <Text
                          onPress={()=>{
                            let tempStatus = this.state.statusFindingComment;
                            tempStatus[index] = true;
                            this.setState({
                              statusFindingComment: tempStatus
                            })
                          }}
                          style={{
                            fontSize: 12,
                            color:"rgba(202,194,194, 1)"
                          }}
                      >
                        {" "}Selengkapnya
                      </Text>
                    }
                  </Text>
                </View>
                    :
                <View style={{
                  marginVertical: 10
                }}>
                  <TouchableOpacity onPress={()=>{
                    this.props.navigation.navigate("HomeScreenComment", {findingCode: item.FINDING_CODE})
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color:"rgba(202,194,194, 1)"
                    }}>
                      Tambah Komentar
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
            <View style={{ marginTop: 10, backgroundColor: '#E5E5E5', height: 0.5 }} />
          </View>
        </View>
    );
  }

  onClickItem(id) {
    var images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
    if (images !== undefined) {
      this.props.navigation.navigate('DetailFinding', { ID: id })
    } else {
      this.getImageBaseOnFindingCode(id)
      setTimeout(() => {
        this.props.navigation.navigate('DetailFinding', { ID: id })
      }, 3000);
    }
  }

  getImageBaseOnFindingCode(findingCode) {
    const user = TaskServices.getAllData('TR_LOGIN')[0];
    // const url = "http://149.129.245.230:3012/images/" + findingCode; //prod
    const url = `${ServerName[user.SERVER_NAME_INDEX].image}images/${findingCode}`;
    // const url = "http://149.129.250.199:3012/images/" + findingCode;
	let serv = TaskServices.getAllData("TM_SERVICE")
				.filtered('API_NAME="IMAGES-GET-BY-ID" AND MOBILE_VERSION="'+ServerName.verAPK+'"');
	if(serv.length>0){
		serv = serv[0];
		fetch(serv.API_URL+""+findingCode, {
		  method: serv.METHOD,
		  headers: {
			'Cache-Control': 'no-cache',
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${user.ACCESS_TOKEN}`,
		  }
		})
			.then((response) => response.json())
			.then((responseJson) => {
			  if (responseJson.status) {
				if (responseJson.data.length > 0) {
				  for (var i = 0; i < responseJson.data.length; i++) {
					let dataImage = responseJson.data[i];
					TaskServices.saveData('TR_IMAGE', dataImage);
					this._downloadImageFinding(dataImage)
				  }
				} else {
				  alert(`Image ${findingCode} kosong`);
				}
			  } else { alert(`gagal download image untuk ${findingCode}`) }
			}).catch((error) => {
		  console.error(error);
		  // alert(error);
		});
	}
  }

  async _downloadImageFinding(data) {
    let isExist = await RNFS.exists(`${dirPhotoTemuan}/${data.IMAGE_NAME}`)
    if (!isExist) {
      var url = data.IMAGE_URL;
      const { config, fs } = RNFetchBlob
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${dirPhotoTemuan}/${data.IMAGE_NAME}`,
          description: 'Image'
        }
      }
      config(options).fetch('GET', url).then((res) => {
        // alert("Success Downloaded " + res);
      }).catch((error)=>{
        alert(error);
      });
    }
  }

  _renderNoData() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <Image style={{ width: 400, height: 300 }} source={this._changeBgFilter(this.state.isFilter)} />
        </View>)
  }

  _renderData() {
    return (
        <View>
          <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 48 }}>
				{this.state.data.map((item, index) => this._renderItem(item, index))}
				{/* Aminju */}
				<View style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
				  <TouchableOpacity
					activeOpacity={0.9}
					style={{
					  height: 48,
					  width: 200,
					  backgroundColor: Colors.tintColorPrimary,
					  justifyContent: 'center',
					  alignItems: 'center',
					  borderRadius: 10
					}} onPress={this.onScrollHandler}>
					{this.state.isLoading ? <ActivityIndicator color={'white'} /> : <Text style={{ textAlign: 'center', fontSize: 14, color: 'white' }}>Lebih Banyak</Text>}
				  </TouchableOpacity>
				</View>
            </View>
          </ScrollView>
        </View>
    )
  }

  //Aminju
  onScrollHandler = () => {
    this.setState({ isLoading: true })

    setTimeout(() => {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.addRecords(this.state.page);
      });
    }, 2000);
  }
  
  render() {
    let show;
    if (this.state.data.length > 0) {
      show = this._renderData()
    } else {
      show = this._renderNoData()
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

          {/* <ModalAlert
          icon={this.state.icon}
          visible={this.state.showModal}
          onPressCancel={() => this.setState({ showModal: false })}
          title={this.state.title}
          message={this.state.message} /> */}

          <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
          <View style={styles.sectionTimeline}>
            <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
            <View style={styles.rightSection}>
              {/* <Text style={styles.textFilter}>Filter</Text> */}
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
                <Image style={{ width: 22, height: 22, marginRight: 16, marginTop: 1 }} source={this._changeIconFilter(this.state.isFilter)} />
                {/* <Icons name="filter-list" size={24} style={{ marginRight: 15, marginTop: 4 }} /> */}
              </TouchableOpacity>
            </View>
          </View>
          {show}
        </View>
    )
  }

  _changeIconFilter(isFilter) {
    if (isFilter) {
      return require('../../Images/ic-filter-on.png')
    } else {
      return require('../../Images/ic-filter-off.png')
    }
  }

  _changeBgFilter(isFilter) {
    if (isFilter) {
      return require('../../Images/img-no-filter.png')
    } else {
      return require('../../Images/img-belum-ada-data.png')
    }
  }
}

const styles = StyleSheet.create({
  sectionTimeline: {
    height: 48,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rightSection: {
    flexDirection: 'row'
  },
  containerHorizontal: {
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  textTimeline: {
    marginLeft: 12,
    width: 300,
    fontSize: 14
  },
  textFilter: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey'
  },
  label: {
    width: '40%',
    fontSize: 12
  },
  item: {
    width: '60%',
    color: "#999",
    fontSize: 12
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 3
  }
});

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


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);