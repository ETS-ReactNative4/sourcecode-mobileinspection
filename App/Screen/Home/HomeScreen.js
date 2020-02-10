"use strict";
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground, NetInfo,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  RefreshControl
} from 'react-native';
import { Text, Thumbnail } from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo'
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import ServerName from '../../Constant/ServerName'
import Moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob'
import {
  changeFormatDate,
  dateDisplayMobile,
  isNotUserMill,
  syncDays,
  notifInbox,
  getTodayDate,
  getThumnail, getPhoto
} from '../../Lib/Utils';
import FastImage from 'react-native-fast-image'
import SwiperSlider from 'react-native-swiper'
import {
  dirDatabase,
  dirSummary,
  dirPhotoInspeksiBaris,
  dirPhotoInspeksiSelfie,
  dirPhotoTemuan,
  dirPhotoKategori,
  dirPhotoEbccJanjang,
  dirPhotoEbccSelfie,
  dirPhotoUser,
  dirMaps
} from '../../Lib/dirStorage';

import WeeklySummary from "../../Component/WeeklySummary";
import { clipString, numberSeperator } from '../../Constant/Functions/StringManipulator';
import { Images, Fonts } from '../../Themes';
import { changeBgFilter, changeIconFilter, getColor, getIconProgress, getStatusImage } from '../../Themes/Resources';
import { getBlokName, getCategoryName, getEstateName, getStatusBlok, retrieveData, removeData, storeData } from '../../Database/Resources';

import RNFS from 'react-native-fs'

import { getFCMToken, notificationDeeplinkSetup, displayNotificationSync, displayNotificationTemuan } from '../../Notification/NotificationListener';


let { width } = Dimensions.get('window')

import Header from '../../Component/Header'
import { fetchPut } from "../../Api/FetchingApi";
import { downloadProfileImage } from "../Sync/Download/Image/Profile";
import images from '../../Themes/Images';
import { getPoint } from '../Sync/Download/DownloadPoint';
import { set } from 'ramda';
import colors from '../../Themes/Colors';


const HEADER_MAX_HEIGHT = 260;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 48;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ItemMenuHome = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}>
      <View style={[props.styles, {
          alignItems: "center",
          justifyContent: "center"
      }]}>
        <View style={{ width: 48, height: 48, borderRadius: 25, padding: 10, backgroundColor: props.backgroundColor }}>
          <Image style={{ flex: 1, width: undefined, height: undefined }}
            resizeMode={"contain"}
            source={props.image} />
        </View>
        <Text style={{
          marginTop: 6,
          fontSize: 12,
          textAlign: "center",
          fontFamily: Fonts.book
        }}>{props.name}</Text>
      </View>
    </TouchableOpacity>
  )
}

class HomeScreen extends React.Component {

  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);

    let currentUser = TaskServices.getAllData('TR_LOGIN');

    this.extraFilter = "";
    this.extraFilterTime = {
      startTime: null,
      endTime: null,
      filter: false
    };

    this.state = {
      isSync: false,
      currentUser: currentUser[0],
      data: [],
      thumnailImage: '',
      userPhoto: null,
      loadAll: true,

      //Add Modal Alert by Aminju
      title: 'Title',
      message: 'Message',
      showModal: false,
      icon: '',
      isFilter: false,
      page: 0,
      isLoading: false,
      isVisibleSummary: false,
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      point: 0
    }
  }

  showWeeklySummary = async (forceShow) => {

    await retrieveData('FindingSummary').then((result) => {
      if (result != null) {
        this.setState({ dataFindingSummary: result })
      }
    });

    await retrieveData('EbccSummary').then((result) => {
      if (result != null) {
        this.setState({ dataEbccSummary: result })
      }
    });

    await retrieveData('InspectionSummary').then((result) => {
      if (result != null) {
        this.setState({ dataInspectionSummary: result })
      }
    });

    if (!forceShow) {
      await retrieveData('FirstShow').then((result) => {
        if (result != null) {
          this.setState({ isVisibleSummary: false });
        } else {
          retrieveData('FindingSummary').then((result) => {
            if (result != null) {
              this.setState({ isVisibleSummary: true });
            }
          })
        }
      })
    }
    else {
      if (this.state.isSync) {
        this.setState({ isVisibleSummary: true });
      } else {
        this.props.navigation.navigate('Sync')
      }
    }
  }

  componentWillUnmount() {
    this.willFocus.remove();
  }


  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
        this.syncChecker();
      this.getProfileImage();
      this._createDataSuggestion();
      this._deleteDataSuggestion();
      this.showWeeklySummary(false);

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

      this.setState({
        /* SET JUMLAH HARI BELUM SYNC */
        divDays: syncDays(),

        /* SET JUMLAH NOTIF  */
        notifCount: notifInbox()
      })
    }
  )

  /** CREATE DATA SUGGESTION */
  _createDataSuggestion() {
    retrieveData('SUGGESTION').then((result) => {
      if (result == null) {
        storeData('SUGGESTION', [])
      }
    });
  }

  /** DELETE DATA SUGGESTION */
  _deleteDataSuggestion() {
    retrieveData('SUGGESTION_DATE').then((result) => {
      if (result != null) {
        let today = getTodayDate('YYYYYMMDD')
        if (today > result) {
          console.log('Delete Data Suggestion Berhasil')
          removeData('SUGGESTION');
        }
      }
    });
  }

  syncChecker() {
    let getBlock = TaskServices.getAllData('TM_BLOCK');
    let syncStatus = getBlock.length > 0;
    this.setState({ isSync: syncStatus });
  }

  async componentDidMount() {
    /** NOTIFICATION LOCAL */
    await this.putFCMConfig();
    displayNotificationSync();
    displayNotificationTemuan();
    notificationDeeplinkSetup(this.props);

    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.fs.mkdir(dirs.SDCardDir + "/" + "MobileInspection");

    RNFS.mkdir(dirDatabase);
    RNFS.mkdir(dirSummary);
    RNFS.mkdir(dirPhotoInspeksiBaris);
    RNFS.mkdir(dirPhotoInspeksiSelfie);
    RNFS.mkdir(dirPhotoTemuan);
    RNFS.mkdir(dirPhotoKategori);
    RNFS.mkdir(dirPhotoEbccJanjang);
    RNFS.mkdir(dirPhotoEbccSelfie);
    RNFS.mkdir(dirPhotoUser);
    RNFS.mkdir(dirMaps);

    RNFS.copyFile(TaskServices.getPath(), `${dirDatabase}/${'data.realm'}`);
  }

  async putFCMConfig() {
    let fcmTokenRequest = {
      FIREBASE_TOKEN: ""
    };

    if (this.state.currentUser.USER_ROLE === "ASISTEN_LAPANGAN") {
      await getFCMToken()
        .then((fcmToken) => {
          if (fcmToken !== null) {
            fcmTokenRequest = {
              FIREBASE_TOKEN: fcmToken
            }
          }
        });
    }

    //kalo user role bukan aslap, timpa fcm token ke kosong (harus di pake kalo gak user bukan aslap tetep dapet notif)
    await fetchPut("FIREBASE-TOKEN", fcmTokenRequest, null);
  };

  _changeFilterList = data => {
    if (data != undefined) {
      this.setState({ loadAll: false });
      this._initFilterData(data);
    }
  }

  //Aminju
  addRecords = (page) => {
    // assuming this.state.dataPosts hold all the records
    const newRecords = []
    for (let i = page * 5, il = i + 5; i < il && i <
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

    let finding = TaskServices.getAllData('TR_FINDING');
    let findingSorted = finding.sorted('INSERT_TIME', true);
    let findingFilter;
    if (this.extraFilter !== "") {
      this.extraFilter = " AND " + this.extraFilter;
    }

    if (ref_role == 'REGION_CODE') {
      let estate = TaskServices.getAllData('TM_EST');
      let estateFilter = estate.filtered(`REGION_CODE = "${loc_code}"`);

      if (estateFilter.length > 0) {
        let werksArr = [];
        estateFilter.map(item => {
          const werksEst = item.WERKS;
          werksArr.push(werksEst);
        });

        let query = 'WERKS == ';
        for (let i = 0; i < werksArr.length; i++) {
          query += `"${werksArr[i]}"`;
          if (i + 1 < werksArr.length) {
            query += ` OR WERKS == `
          }
        }

        let finalData = [];

        // let tempFindingFilter = findingSorted.filtered(`${query} ${this.extraFilter}`);
        let tempFindingFilter = "";
        if (this.extraFilter === undefined || this.extraFilter === null || this.extraFilter === "") {
          tempFindingFilter = findingSorted.filtered(query);
        }
        else {
          tempFindingFilter = findingSorted.filtered(this.extraFilter.replace(" AND ", ""));
        }
        tempFindingFilter.map((data) => {
          let stDate = Moment(data.INSERT_TIME).format('YYYYMMDDHHmmss');
          if (!this.extraFilterTime.filter) {
            finalData.push(data)
          }
          else if (stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter) {
            finalData.push(data)
          }
        });
        findingFilter = finalData;
      } else {
        if (this.extraFilter !== "") {
          this.extraFilter = this.extraFilter.replace(" AND ", "");
          findingFilter = finding.sorted('INSERT_TIME', true).filtered(this.extraFilter);
        }
        else {
          findingFilter = finding.sorted('INSERT_TIME', true);
        }
      }
    } else if (ref_role == 'COMP_CODE') {
      let arr = [];
      let extraFilter = this.extraFilter;
      loc_code = loc_code.split(',')
      loc_code.map(item => {
        let das = findingSorted.filtered(`WERKS CONTAINS[c] "${item}" ${extraFilter}`);
        if (das.length > 0) {
          das.map(item2 => {
            let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
            if (!this.extraFilterTime.filter) {
              arr.push(item2)
            }
            else if (stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter) {
              arr.push(item2)
            }
          })
        }
      });
      findingFilter = arr
    } else if (ref_role == 'BA_CODE') {
      let arr = [];
      let extraFilter = this.extraFilter;
      loc_code = loc_code.split(',');
      loc_code.map(item => {
        let das = findingSorted.filtered(`WERKS = "${item}" ${extraFilter}`);
        if (das.length > 0) {
          das.map(item2 => {
            let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
            if (!this.extraFilterTime.filter) {
              arr.push(item2)
            }
            else if (stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter) {
              arr.push(item2)
            }
          })
        }
      });
      findingFilter = arr
    } else if (ref_role == 'AFD_CODE') {
      let arr = [];
      let extraFilter = this.extraFilter;
      loc_code = loc_code.split(',');
      loc_code.map(item => {
        const werks = item.substring(0, 4);
        const afd_code = item.substring(4, 5);
        let das = findingSorted.filtered(`WERKS = "${werks}" AND AFD_CODE = "${afd_code}" ${extraFilter}`);
        if (das.length > 0) {
          das.map(item2 => {
            let stDate = Moment(item2.INSERT_TIME).format('YYYYMMDDHHmmss');
            if (!this.extraFilterTime.filter) {
              arr.push(item2)
            }
            else if (stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter) {
              arr.push(item2)
            }
          })
        }
      });
      findingFilter = arr
    } else {
      if (this.extraFilter !== "") {
        this.extraFilter = this.extraFilter.replace(" AND ", "");
        findingFilter = finding.sorted('INSERT_TIME', true).filtered(this.extraFilter);
        let finalData = [];

        findingFilter.map((data) => {
          let stDate = Moment(data.INSERT_TIME).format('YYYYMMDDHHmmss');
          if (!this.extraFilterTime.filter) {
            finalData.push(data)
          }
          else if (stDate >= this.extraFilterTime.startTime && stDate <= this.extraFilterTime.endTime && this.extraFilterTime.filter) {
            finalData.push(data)
          }
        });
        findingFilter = finalData;
      }
      else {
        findingFilter = finding.sorted('INSERT_TIME', true);
      }
    }
    this.extraFilter = "";

    let statusFindingDesc = [];
    let showTrimComment = [];
    findingFilter.map((data, index) => {
      statusFindingDesc.push(false);
      showTrimComment.push(false);
    });
    this.setState({
      statusFindingDesc: statusFindingDesc,
      showTrimComment: showTrimComment
    });
    return findingFilter;
  }

  _initFilterData(dataFilter) {
    dataFilter.map(item => {
      let ba = item.ba;
      let afd = item.afd;
      let userAuth = item.userAuth;
      let status = item.status;
      let jenis = item.jenis;

      let stBatasWaktu = item.stBatasWaktu;
      let endBatasWaktu = item.endBatasWaktu.substring(0, 8) + '235959';
      let valBatasWaktu = item.valBatasWaktu;
      let valAssignto = item.valAssignto;

      let varBa = ' AND WERKS = ' + `"${ba}"`
      let varAfd = ' AND AFD_CODE = ' + `"${afd}"`
      let varUserAuth = ' AND INSERT_USER = ' + `"${userAuth}"`
      let varStatus = ' AND STATUS = ' + `"${status}"`
      let varJenis = ' AND FINDING_CATEGORY CONTAINS[c] ' + `"${jenis}"`

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

      let stJenis;
      if (jenis == 'Pilih Jenis Temuan') {
        stJenis = ' AND FINDING_CATEGORY CONTAINS ' + `"${""}"`
      } else {
        stJenis = varJenis
      }

      if (valBatasWaktu == 'Pilih Batas Waktu') {
        this.extraFilterTime = {
          startTime: null,
          endTime: null,
          filter: false
        }
      } else {
        this.extraFilterTime = {
          startTime: stBatasWaktu,
          endTime: endBatasWaktu,
          filter: true
        }
      }

      let data;
      if (ba == 'Pilih Lokasi' &&
        afd == 'Pilih Afdeling' &&
        valAssignto == 'Pilih Pemberi Tugas' &&
        status == 'Pilih Status' &&
        valBatasWaktu == 'Pilih Batas Waktu' &&
        jenis == 'Pilih Jenis Temuan') {
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
        this.extraFilter = `AFD_CODE CONTAINS ""${stBa}${stAfd}${stUserAuth}${stStatus}${stJenis}`;
        data = this._filterHome();//.filtered(`AFD_CODE CONTAINS ""${stBa}${stAfd}${stUserAuth}${stStatus}${stInsertTime}`);
        if (data.length == 0) {
          this.setState({ data, isFilter: true, showModal: true, title: 'Tidak Ada Data', message: 'Wah ga ada data berdasarkan filter ini.', icon: Images.ic_no_data });
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

  renderCarousel = (item, status, i) => {
    let uri;
    if (item.IMAGE_PATH_LOCAL != undefined) {
      uri = `file://${dirPhotoTemuan}/${item.IMAGE_NAME}`;
    } else {
      uri = Images.img_no_picture
    }

    return (
      <View style={{ flex: 1 }}>
        {status == 'SELESAI' &&
          <View style={{
            backgroundColor: 'rgba(91, 90, 90, 0.7)', width: 70,
            padding: 3, position: 'absolute', top: 0, right: 10, zIndex: 1, alignItems: 'center',
            margin: 10, borderRadius: 25,
          }}>
            <Text style={{ fontSize: 10, marginBottom: 5, color: 'white' }}>{getStatusImage(item.STATUS_IMAGE)}</Text>
          </View>}

        {/*<Image*/}
        {/*    style={{width: 50, height: 50}}*/}
        {/*    source={{uri: item.IMAGE_URL}}*/}
        {/*/>*/}
        <FastImage style={{ height: 300 }}
          source={{
            uri: uri,
            priority: FastImage.priority.normal,
          }} />

        <TouchableNativeFeedback onPress={() => { this.onClickItem(i.FINDING_CODE) }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: getColor(status),
            width: '100%', height: 35,
            position: 'absolute', bottom: 0,
            paddingLeft: 18
          }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Image style={{ marginTop: 3, height: 28, width: 28 }} source={getIconProgress(status)}></Image>
              <Text style={{
                width: 200, marginLeft: 12, color: 'white', fontSize: 14, alignSelf: 'center', marginTop: 1,
                fontFamily: Fonts.book
              }}>{status}</Text>
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
                <Text style={{ fontSize: 10, marginBottom: 5, color: 'white' }}>{getStatusImage(item.STATUS_IMAGE)}</Text>
              </View>
              <FastImage style={{ alignItems: 'center', width: '100%', height: '100%' }}
                source={{
                  uri: 'file://' + item.IMAGE_PATH_LOCAL,
                  priority: FastImage.priority.normal,
                }} />
              <View style={{
                flexDirection: 'row',
                backgroundColor: getColor(status),
                width: '100%', height: 35,
                position: 'absolute', bottom: 0
              }}>
                <Image style={{ marginTop: 2, height: 28, width: 28 }} source={getIconProgress(status)}></Image>
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
    let user = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME;
    Moment.locale();
    let dtInsertTime = dateDisplayMobile(changeFormatDate(item.INSERT_TIME.toString(), "YYYY-MM-DD hh-mm-ss"))

    const dataImage = TaskServices.findBy('TR_IMAGE', 'TR_CODE', item.FINDING_CODE);
    const image = dataImage.sorted('INSERT_TIME', true);

    let werkAfdBlockCode = `${item.WERKS}${item.AFD_CODE}${item.BLOCK_CODE}`;
    let lokasiBlok = `${getBlokName(werkAfdBlockCode)}/${getStatusBlok(werkAfdBlockCode)}/${getEstateName(item.WERKS)}`
    let status = item.STATUS;

    //Get Finding Comment
    let getComment = TaskServices.findBy("TR_FINDING_COMMENT", "FINDING_CODE", item.FINDING_CODE).sorted('INSERT_TIME', true);
    let commentCount = getComment.length;
    let latestComment = null;
    let commentMessage = "";
    if (commentCount > 0) {
      latestComment = getComment[0];
      commentMessage = this.processText(this.state.showTrimComment[index] ? getComment[0].MESSAGE : clipString(getComment[0].MESSAGE, 150), getComment[0].TAGS);
    }

    let filePath = TaskServices.getImagePath(INSERT_USER === undefined ? null : INSERT_USER.USER_AUTH_CODE);

    return (
      <View key={index}>
        <View >
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Thumbnail style={{ borderColor: 'grey', borderWidth: 0.5, height: 36, width: 36, marginRight: 10, marginLeft: 10 }} source={filePath} />
            <View>
              <Text style={{ fontSize: 14, fontFamily: Fonts.book }}>{user}</Text>
              <Text style={{ fontSize: 12, color: 'grey', fontFamily: Fonts.book }}>{dtInsertTime}</Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }} cardBody>
            {image.length == 0 && <ImageBackground source={Images.img_no_picture} style={{ height: 300, width: '100%', flex: 1, flexDirection: 'column-reverse', resizeMode: 'stretch' }} >
              <TouchableOpacity onPress={() => { this.onClickItem(item.FINDING_CODE) }}>
                <View style={{ alignContent: 'center', paddingTop: 2, paddingLeft: 18, flexDirection: 'row', height: 35, backgroundColor: getColor(item.STATUS) }} >
                  <Image style={{ marginTop: 2, height: 28, width: 28 }} source={getIconProgress(status)}></Image>
                  <Text style={{ marginLeft: 12, color: 'white', fontSize: 14, marginTop: 5, fontFamily: Fonts.book }}>{item.STATUS}</Text>
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
                fontFamily: Fonts.bold
              }}>
                {lokasiBlok} - {getCategoryName(item.FINDING_CATEGORY)}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              flexWrap: "wrap"
            }}>
              <Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: Fonts.bold
                }}>
                  {user}{" "}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Fonts.book
                  }}
                >
                  {
                    this.state.statusFindingDesc[index] ? item.FINDING_DESC : clipString(item.FINDING_DESC, 150)
                  }
                </Text>
                {
                  item.FINDING_DESC.length > 150 && !this.state.statusFindingDesc[index] &&
                  <Text
                    onPress={() => {
                      let tempStatus = this.state.statusFindingDesc;
                      tempStatus[index] = true;
                      this.setState({
                        statusFindingDesc: tempStatus
                      })
                    }}
                    style={{
                      fontSize: 12,
                      color: "rgba(202,194,194, 1)",
                      fontFamily: Fonts.book
                    }}
                  >
                    {" "}Selengkapnya
                    </Text>
                }
              </Text>
            </View>
            {
              commentCount > 0 ?
                <View style={{ marginVertical: 5 }}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("HomeScreenComment", { findingCode: item.FINDING_CODE })
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: "rgba(202,194,194, 1)",
                      fontFamily: Fonts.book
                    }}>
                      Lihat {commentCount} Komentar
                    </Text>
                  </TouchableOpacity>
                  <Text style={{
                    marginTop: 10,
                    fontFamily: Fonts.book
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      fontFamily: Fonts.book
                    }}>
                      {latestComment.USERNAME}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: Fonts.book
                      }}
                      onPress={() => {
                        this.props.navigation.navigate("HomeScreenComment", { findingCode: item.FINDING_CODE })
                      }}
                    >
                      {commentMessage}
                    </Text>
                    {
                      latestComment.MESSAGE.length > 150 && !this.state.showTrimComment[index] &&
                      <Text
                        onPress={() => {
                          let tempStatus = this.state.showTrimComment;
                          tempStatus[index] = true;
                          this.setState({
                            showTrimComment: tempStatus
                          })
                        }}
                        style={{
                          fontSize: 12,
                          color: "rgba(202,194,194, 1)",
                          fontFamily: Fonts.book
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
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("HomeScreenComment", { findingCode: item.FINDING_CODE })
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: "rgba(202,194,194, 1)",
                      fontFamily: Fonts.book
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

  processText(commentValue, listTaggedUser) {
    if (listTaggedUser.length > 0 || commentValue !== "") {
      let tempComment = [commentValue];
      listTaggedUser.map((userTagged) => {
        tempComment.map((comment, index) => {
          if (comment.includes("@" + userTagged.FULLNAME)) {
            let tempSplit = comment.split("@" + userTagged.FULLNAME);
            tempSplit.splice(1, 0, "@" + userTagged.FULLNAME);
            if (tempComment.length === 1) {
              tempComment = tempSplit;
            }
            else {
              tempComment.splice(index, 1, ...tempSplit);
            }
          }
        });
      });
      let finalText = <Text>{
        tempComment.map((data) => {
          if (data.charAt(0) === "@") {
            return <Text style={{
              color: Colors.taggedUser, fontSize: 12,
              fontFamily: Fonts.book
            }}>{data}</Text>
          }
          else {
            return <Text style={{
              fontSize: 12,
              fontFamily: Fonts.book
            }}>{data}</Text>
          }
        })
      }</Text>

      return finalText
    }
    else {
      return commentValue;
    }
  }

  onClickItem(id) {
    let images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
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
      .filtered('API_NAME="IMAGES-GET-BY-ID" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
    if (serv.length > 0) {
      serv = serv[0];
      fetch(serv.API_URL + "" + findingCode, {
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
              for (let i = 0; i < responseJson.data.length; i++) {
                let dataImage = responseJson.data[i];
                TaskServices.saveData('TR_IMAGE', dataImage);
                this._downloadImageFinding(dataImage)
              }
            } else {
              console.log('Image ' + findingCode + ' kosong')
              // alert(`Image ${findingCode} kosong`);
            }
          } else {
            console.log(`gagal download image untuk ${findingCode}`)
            // alert()
          }
        }).catch((error) => {
          console.error(error);
          // alert(error);
        });
    }
  }

  async _downloadImageFinding(data) {
    let isExist = await RNFS.exists(`${dirPhotoTemuan}/${data.IMAGE_NAME}`)
    if (!isExist) {
      let url = data.IMAGE_URL;
      const { config, fs } = RNFetchBlob
      let options = {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${dirPhotoTemuan}/${data.IMAGE_NAME}`,
          description: 'Image'
        }
      }
      config(options).fetch('GET', url).then((res) => {
        RNFetchBlob.android.actionViewIntent(res.path(), '/')
        // alert("Success Downloaded " + res);
      }).catch((error) => {
        console.log("error Downloaded " + error);
        // alert(error);
      });
    }
  }

  _renderNoData() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          notif={this.state.notifCount}
          divDays={this.state.divDays}
          onPressLeft={() => this.props.navigation.navigate('Sync')}
          onPressRight={() => this.props.navigation.navigate('Inbox')}
          title={'Beranda'}
          isNotUserMill={isNotUserMill()} />
        <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
        {this.renderMenuHeader()}
        <View style={styles.sectionTimeline}>
          <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
              <Image style={{ width: 22, height: 22, marginRight: 16, marginTop: 1 }} source={changeIconFilter(this.state.isFilter)} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <Image style={{ width: 400, height: 300 }} source={changeBgFilter(this.state.isFilter)} />
        </View>
      </View>
    )
  }

  _renderData() {
    return (
      <View style={{ marginBottom: 0, marginTop: this.state.divDays > 0 ? 336 : 320 }}>
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
            {this.state.isLoading ? <ActivityIndicator color={'white'} /> : <Text style={{ textAlign: 'center', fontSize: 14, color: 'white', fontFamily: Fonts.medium }}>Lebih Banyak</Text>}
          </TouchableOpacity>
        </View>
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

  async getProfileImage() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        downloadProfileImage(this.state.currentUser.USER_AUTH_CODE)
          .then(() => {
            let getPath = TaskServices.findBy2("TR_IMAGE_PROFILE", "USER_AUTH_CODE", this.state.currentUser.USER_AUTH_CODE);
            let pathPhoto = getPhoto(typeof getPath === 'undefined' ? null : getPath.IMAGE_PATH_LOCAL);
            this.setState({
              userPhoto: pathPhoto
            })
          });
      }
    });

    /* DOWNLOAD ESTATE */
    await getPoint().then((data) => {
      console.log('Data Callback Point : ', data)
      this.setState({ point: data.data })
    })
  }


  renderMenuHeader() {
    let dataUser = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', this.state.currentUser.USER_AUTH_CODE);
    if (dataUser !== undefined) {
      return (
        <View style={{
          backgroundColor: 'rgba(247,247,247,1)',
          paddingBottom: 10
        }}>
          <View style={{
            flexDirection: 'row',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* <Image source={require('../../Images/icon/ic_walking.png')} style={styles.icon} /> */}
            <TouchableOpacity onPress={() => {
              if (this.state.currentUser.USERNAME !== "") {
                this.props.navigation.navigate('FotoUser', {
                  setPhoto: (photoPath) => {
                    this.setState({ userPhoto: photoPath })
                    this.forceUpdate();
                  }
                });

              }
              else {
                this.setState({
                  showConfirm: false,
                  showModal: true,
                  title: 'Data kosong!',
                  message: 'Data tidak di temukan, Tolong sync terlebih dahulu sebulum merubah foto!',
                  icon: require('../../Images/ic-no-internet.png')
                })
              }
            }}>
              <Thumbnail
                style={{ borderColor: '#AAAAAA', height: 72, width: 72, marginLeft: 5, borderWidth: 2, borderRadius: 100 }}
                source={this.state.userPhoto === null ? getThumnail() : { uri: this.state.userPhoto + '?' + new Date() }} />
              <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <Image source={Images.ic_add_image} style={{ height: 24, width: 24 }} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12, justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontFamily: Fonts.bold }}>{`Hai, ${dataUser.FULLNAME}`}</Text>
              <View>
                <View style={{ flexDirection: "row", backgroundColor: "white", borderRadius: 15, alignSelf: 'baseline', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Image style={{ width: 15, height: 15 }} source={require('../../Images/icon/HomeScreen/icon_points_black.png')} />
                  <Text style={{ fontSize: 12, paddingHorizontal: 10 }}>{`${numberSeperator(this.state.point, ",")} points`}</Text>
                  <Image style={{ width: 15, height: 15 }} source={require('../../Images/icon/HomeScreen/icon_right.png')} />
                </View>
              </View>
            </View>
          </View>
          {this.renderMenu()}
        </View>
      )
    }
    else {
      //ui belum sync
      return (
        <View>
          {this.renderMenu()}
        </View>
      )
    }
  }

  renderMenu() {
      if(this.state.currentUser.USER_ROLE.includes("ASISTEN")){
          return (
              <View style={{ backgroundColor: "white", flexDirection: "row", justifyContent: 'space-between', padding: 15 }}>
                  <ItemMenuHome
                      onPress={() => {
                          if (this.state.isSync) {
                              this.props.navigation.navigate("PetaPanen")
                          } else {
                              this.props.navigation.navigate('Sync')
                          }
                      }}
                      name={"Peta\nPanen"}
                      image={require('../../Images/icon/HomeScreen/icon_panen.png')}
                      backgroundColor={"rgba(53,184,113,1)"} />

                    <ItemMenuHome
                      onPress={() => {
                        if (this.state.isSync) {
                          this.props.navigation.navigate("Restan")
                        } else {
                          this.props.navigation.navigate('Sync')
                        }
                      }}
                      name={"Peta\nRestan"}
                      image={require('../../Images/icon/HomeScreen/icon_titik_restan.png')}
                      backgroundColor={"rgba(217,52,72,1)"} />

                    <ItemMenuHome
                      onPress={() => this.showWeeklySummary(true)}
                      name={"Dashboard\nMingguan"}
                      image={require('../../Images/icon/HomeScreen/icon_dashboard_kebun.png')}
                      backgroundColor={"rgba(255,194,50,1)"} />

                    <ItemMenuHome
                      onPress={() => { this.props.navigation.navigate('Leaderboard') }}
                      name={"Peringkat\nAsisten"}
                      image={require('../../Images/icon/HomeScreen/icon_rank.png')}
                      backgroundColor={"rgba(52,162,188,1)"} />

                    <ItemMenuHome
                      onPress={() => { this.props.navigation.navigate('MoreScreen') }}
                      name={"Menu\nLainnya"}
                      image={require('../../Images/icon/HomeScreen/icon_lainnya.png')}
                      backgroundColor={"#ACACAC"}/>
              </View>
          )}

      return(
          <View style={{ backgroundColor: "white", flexDirection: "row", padding: 15 }}>
              <ItemMenuHome
                  onPress={() => this.showWeeklySummary(true)}
                  name={"Dashboard\nMingguan"}
                  image={require('../../Images/icon/HomeScreen/icon_dashboard_kebun.png')}
                  backgroundColor={"rgba(255,194,50,1)"} />

              <ItemMenuHome
                  styles={{paddingLeft: 10}}
                  onPress={() => { this.props.navigation.navigate('MoreScreen') }}
                  name={"Menu\nLainnya"}
                  image={require('../../Images/icon/HomeScreen/icon_lainnya.png')}
                  backgroundColor={"#ACACAC"}/>
          </View>
      )


  }

  render(){
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
    );
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    if (this.state.data.length == 0) {
      return this._renderNoData()
    } else {
      return (
        <View style={styles.fill}>

          <WeeklySummary
            dataInspeksi={this.state.dataInspectionSummary}
            dataEbcc={this.state.dataEbccSummary}
            dataTemuan={this.state.dataFindingSummary}
            visible={this.state.isVisibleSummary}
            onPressClose={() => {
              this.setState({ isVisibleSummary: false })
              storeData('FirstShow', true)
            }} />

          <Animated.ScrollView
            style={styles.fill}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true },
            )}
            // iOS offset for RefreshControl
            contentInset={{
              top: HEADER_MAX_HEIGHT,
            }}
            contentOffset={{
              y: -HEADER_MAX_HEIGHT,
            }}
          >
            {this._renderData()}
          </Animated.ScrollView>
          <Animated.View

            style={[
              styles.header,
              {
                transform: [{ translateY: headerTranslate }],
                marginTop: this.state.divDays > 0 ? 75 : 54
              },
            ]}
          >

            {this.renderMenuHeader()}

            <View style={styles.sectionTimeline}>
              <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
              <View style={styles.rightSection}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
                  <Image style={{ width: 22, height: 22, marginRight: 16, marginTop: 1 }} source={changeIconFilter(this.state.isFilter)} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
            <Header
              notif={this.state.notifCount}
              divDays={this.state.divDays}
              onPressLeft={() => this.props.navigation.navigate('Sync')}
              onPressRight={() => this.props.navigation.navigate('Inbox')}
              title={'Beranda'}
              isNotUserMill={isNotUserMill()} />
            <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
          </Animated.View>

        </View>
      );
    }


  }
}

const styles = StyleSheet.create({
  sectionTimeline: {
    height: 54,
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
    fontSize: 14,
    fontFamily: Fonts.demi
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
  },

  fill: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
    borderColor: 'grey',
    borderBottomWidth: 0.5
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



export default HomeScreen;
