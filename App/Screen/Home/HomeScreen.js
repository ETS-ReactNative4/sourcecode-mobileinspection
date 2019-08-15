"use strict";
import React from 'react';
import {
  ImageBackground, StatusBar, TouchableOpacity, TouchableNativeFeedback, View, ScrollView, Image, StyleSheet, Dimensions,
  ActivityIndicator
} from 'react-native';
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
import { changeFormatDate, getThumnail, dateDisplayMobile } from '../../Lib/Utils';
import FastImage from 'react-native-fast-image'
import SwiperSlider from 'react-native-swiper'
import {
  dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie,
  dirPhotoTemuan, dirPhotoKategori, dirPhotoEbccJanjang, dirPhotoEbccSelfie, dirMaps
} from '../../Lib/dirStorage';

import WeeklySummary from "../../Component/WeeklySummary";
import { clipString } from '../../Constant/Function';
import { Images } from '../../Themes';
import { getIconProgress, getStatusImage, getColor, changeIconFilter, changeBgFilter } from '../../Themes/Resources';
import IconHeader from '../../Component/IconHeader'
import { getCategoryName, getEstateName, getStatusBlok, getBlokName } from '../../Database/Resources';

import RNFS from 'react-native-fs'
let { width } = Dimensions.get('window')

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
    headerRight: <IconHeader padding={{ paddingRight: 12 }} onPress={() => navigation.navigate('Inbox')} icon={Images.ic_inbox} show={true} />,
    headerLeft: <IconHeader padding={{ paddingLeft: 12 }} onPress={() => navigation.navigate('Sync')} icon={Images.ic_sync} show={true} />,
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
      isVisibleSummary: false
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      // const SUMMARY = TaskServices.getAllData('TR_SUMMARY')[0];
      // if (SUMMARY != undefined) {
      //   if (SUMMARY.WEEKLY_STATUS == 'true') {
      //     this.setState({ isVisibleSummary: true })
      //   }
      // }
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
        if(this.extraFilter === undefined || this.extraFilter === null || this.extraFilter === ""){
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
              console.log("COMP_CODE:" + stDate, this.extraFilterTime.startTime, this.extraFilterTime.endTime);
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
              console.log("AFD_CODE:" + stDate, this.extraFilterTime.startTime, this.extraFilterTime.endTime);
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
        this.extraFilter = `AFD_CODE CONTAINS ""${stBa}${stAfd}${stUserAuth}${stStatus}`;
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
      uri = "file://" + item.IMAGE_PATH_LOCAL;
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
    let user = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME
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
            {image.length == 0 && <ImageBackground source={Images.img_no_picture} style={{ height: 300, width: '100%', flex: 1, flexDirection: 'column-reverse', resizeMode: 'stretch' }} >
              <TouchableOpacity onPress={() => { this.onClickItem(item.FINDING_CODE) }}>
                <View style={{ alignContent: 'center', paddingTop: 2, paddingLeft: 18, flexDirection: 'row', height: 35, backgroundColor: getColor(item.STATUS) }} >
                  <Image style={{ marginTop: 2, height: 28, width: 28 }} source={getIconProgress(status)}></Image>
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
                    onPress={() => {
                      let tempStatus = this.state.statusFindingDesc;
                      tempStatus[index] = true;
                      this.setState({
                        statusFindingDesc: tempStatus
                      })
                    }}
                    style={{
                      fontSize: 12,
                      color: "rgba(202,194,194, 1)"
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
                      color: "rgba(202,194,194, 1)"
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
                          color: "rgba(202,194,194, 1)"
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
                      color: "rgba(202,194,194, 1)"
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
            return <Text style={{ color: Colors.taggedUser, fontSize: 12 }}>{data}</Text>
          }
          else {
            return <Text style={{ fontSize: 12 }}>{data}</Text>
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
      let url = data.IMAGE_URL;
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
      }).catch((error) => {
        alert(error);
      });
    }
  }

  _renderNoData() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <Image style={{ width: 400, height: 300 }} source={changeBgFilter(this.state.isFilter)} />
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
    const TM_SERVICE = TaskServices.getAllData('TM_SERVICE')
    let show;
    if (this.state.data.length > 0) {
      show = this._renderData()
    } else {
      show = this._renderNoData()
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>

        <WeeklySummary visible={this.state.isVisibleSummary} onPressClose={() => this.setState({ isVisibleSummary: false })} />

        <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
        <View style={styles.sectionTimeline}>
          <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
          <View style={styles.rightSection}>
            {/* <Text style={styles.textFilter}>Filter</Text> */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
              <Image style={{ width: 22, height: 22, marginRight: 16, marginTop: 1 }} source={changeIconFilter(this.state.isFilter)} />
              {/* <Icons name="filter-list" size={24} style={{ marginRight: 15, marginTop: 4 }} /> */}
            </TouchableOpacity>
          </View>
        </View>
        {show}
      </View>
    )
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
