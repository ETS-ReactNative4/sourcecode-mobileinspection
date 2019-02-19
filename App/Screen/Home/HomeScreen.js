"use strict";
import React from 'react';
import { ImageBackground, StatusBar, TouchableOpacity, View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
import { connect } from 'react-redux'
import Icons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import CategoryAction from '../../Redux/CategoryRedux'
import ContactAction from '../../Redux/ContactRedux'
import RegionAction from '../../Redux/RegionRedux'
import Moment from 'moment';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob'
import { changeFormatDate, getThumnail } from '../../Lib/Utils';
import FastImage from 'react-native-fast-image'
import SwiperSlider from 'react-native-swiper'
import { dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie, dirPhotoTemuan, dirPhotoKategori } from '../../Lib/dirStorage';

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
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      thumnailImage: '',
      loadAll: true,

      //Add Modal Alert by Aminju 
      title: 'Title',
      message: 'Message',
      showModal: false,
      icon: ''
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      if (this.state.loadAll) {
        this._initData()
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

    this._deleteFinding();
  }

  _changeFilterList = data => {
    if (data != undefined) {
      this.setState({ loadAll: false });
      this._initFilterData(data);
    }
  }

  _initData() {
    this.setState({ data: this._filterHome() });
  }

  _deleteFinding() {
    var data = TaskServices.query('TR_FINDING', 'PROGRESS = 100');
    console.log('Data Finding : ' + data.length);
    var now = Moment(new Date())
    if (data.length > 0) {
      data.map(item => {
        console.log('Due Date : ' + item.DUE_DATE)
        if (item.DUE_DATE != '') {
          let dueDate = item.DUE_DATE;
          if (dueDate.includes(' ')) {
            dueDate = dueDate.substring(0, dueDate.indexOf(' '))
          }
          var diff = Moment(new Date(dueDate)).diff(now, 'day');
          if (diff < -7) {
            const dataDelete = TaskServices.findBy2('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
            console.log('Data Delete : ' + dataDelete)
            // this.deleteImage(item.FINDING_CODE)
            // this.deleteData('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
          }
        }
      });
    }
  }

  _filterHome() {
    const login = TaskServices.getAllData('TR_LOGIN');
    const user_auth = login[0].USER_AUTH_CODE;
    const ref_role = login[0].REFFERENCE_ROLE;
    const loc_code = login[0].LOCATION_CODE;

    var finding = TaskServices.getAllData('TR_FINDING');
    var findingSorted = finding.sorted('INSERT_TIME', true);
    var findingFilter;

    if (ref_role == 'REGION_CODE') {
      var estate = TaskServices.getAllData('TM_EST');
      var estateFilter = estate.filtered(`REGION_CODE = "${loc_code}"`);

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
      findingFilter = findingSorted.filtered(`${query} AND ASSIGN_TO != "${user_auth}"`);

    } else if (ref_role == 'COMP_CODE') {
      findingFilter = findingSorted.filtered(`WERKS CONTAINS[c] "${loc_code}" AND ASSIGN_TO != "${user_auth}"`);
    } else if (ref_role == 'WERKS') {
      findingFilter = findingSorted.filtered(`WERKS = "${loc_code}" AND ASSIGN_TO != "${user_auth}"`);
    } else if (ref_role == 'AFD_CODE') {
      const werks = loc_code.substring(0, 4);
      const afd_code = loc_code.substring(4, 5);

      findingFilter = findingSorted.filtered(`WERKS = "${werks}" AND AFD_CODE = "${afd_code}" AND ASSIGN_TO != "${user_auth}"`);
    } else {
      findingFilter = finding.sorted('INSERT_TIME', true);
    }
    return findingFilter;
  }

  _initFilterData(dataFilter) {
    dataFilter.map(item => {
      let ba = item.ba;
      let userAuth = item.userAuth;
      let status = item.status;
      let stBatasWaktu = item.stBatasWaktu;
      let endBatasWaktu = item.endBatasWaktu.substring(0, 8) + '235959';
      let valBatasWaktu = item.valBatasWaktu;
      let valAssignto = item.valAssignto;

      let varBa = ' AND WERKS = ' + `"${ba}"`
      let varUserAuth = ' AND INSERT_USER = ' + `"${userAuth}"`
      let varStatus = ' AND STATUS = ' + `"${status}"`
      let varInsertTime = ' AND INSERT_TIME >= ' + `"${stBatasWaktu}"` + ' AND INSERT_TIME <= ' + `"${endBatasWaktu}"`

      let stBa;
      if (ba == 'Pilih Lokasi') {
        stBa = ' AND WERKS CONTAINS ' + `"${""}"`
      } else {
        stBa = varBa
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
      } else {
        stInsertTime = varInsertTime
      }

      let data;
      if (ba == 'Pilih Lokasi' && valAssignto == 'Pilih Pemberi Tugas' && status == 'Pilih Status' && valBatasWaktu == 'Pilih Batas Waktu') {
        data = this._filterHome();
      } else {
        data = this._filterHome().filtered(`AFD_CODE CONTAINS ""${stBa}${stUserAuth}${stStatus}${stInsertTime}`);
        if (data.length == 0) {
          this.setState({ showModal: true, title: 'Tidak Ada Data', message: 'Wah ga ada data berdasarkan filter ini.', icon: require('../../Images/ic-no-data.png') });
        }
      }
      this.setState({ data });
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

  getBlokName(blockCode) {
    try {
      let data = TaskServices.findBy2('TM_BLOCK', 'BLOCK_CODE', blockCode);
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

  getWerksAfdBlokCode(blockCode) {
    try {
      let data = TaskServices.findBy2('TM_BLOCK', 'BLOCK_CODE', blockCode);
      return data.WERKS_AFD_BLOCK_CODE;
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

  renderCarousel = (item, status) => {
    console.log('Item Path : ' + JSON.stringify(item));
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

        <View style={{
          flexDirection: 'row',
          backgroundColor: this.getColor(status),
          width: '100%', height: 35,
          position: 'absolute', bottom: 0,
          paddingLeft: 18
        }}>
          <Image style={{ marginTop: 2, height: 28, width: 28 }} source={sources}></Image>
          <Text style={{ marginLeft: 12, color: 'white', fontSize: 14, marginTop: 6 }}>{status}</Text>
        </View>
      </View>
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

    const nav = this.props.navigation
    const INSERT_USER = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', item.INSERT_USER);
    let user = INSERT_USER == undefined ? 'User belum terdaftar. Hubungi Admin.' : INSERT_USER.FULLNAME
    Moment.locale();
    let dtInsertTime = Moment(changeFormatDate("" + item.INSERT_TIME, "YYYY-MM-DD hh-mm-ss")).format('LLL');
    let batasWaktu = item.DUE_DATE == '' ? 'Batas waktu belum ditentukan' : Moment(item.DUE_DATE).format('LL');

    const image = TaskServices.findBy('TR_IMAGE', 'TR_CODE', item.FINDING_CODE);
    console.log('Image : ' + JSON.stringify(image));


    let werkAfdBlockCode = this.getWerksAfdBlokCode(item.BLOCK_CODE)
    let lokasiBlok = `${this.getBlokName(item.BLOCK_CODE)}/${this.getStatusBlok(werkAfdBlockCode)}/${this.getEstateName(item.WERKS)}`
    let status = item.STATUS;
    let sources;
    if (status == 'BARU') {
      sources = require('../../Images/icon/ic_new_timeline.png')
    } else if (status == 'SELESAI') {
      sources = require('../../Images/icon/ic_done_timeline.png')
    } else {
      sources = require('../../Images/icon/ic_inprogress_timeline.png')
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
            {image.length == 0 && <ImageBackground source={require('../../Images/img-no-picture.png')} style={{ height: 300, width: '100%', flex: 1, flexDirection: 'column-reverse', resizeMode: 'stretch' }} >
              <View style={{ alignContent: 'center', paddingTop: 2, paddingLeft: 12, flexDirection: 'row', height: 35, backgroundColor: this.getColor(item.STATUS) }} >
                <Image style={{ marginTop: 2, height: 28, width: 28 }} source={sources}></Image>
                <Text style={{ marginLeft: 12, color: 'white', fontSize: 14, marginTop: 5 }}>{item.STATUS}</Text>
              </View>
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
                activeDotColor={'white'}
                paginationStyle={{
                  bottom: 8,
                  color: 'white'
                }}
                loop={false}>
                {image.map(item => this.renderCarousel(item, status))}
              </SwiperSlider>
            </View>}
          </View>
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.onClickItem(item.FINDING_CODE) }}>
              <View style={{ flex: 2, marginLeft: 16 }}>

                <View style={styles.column}>
                  <Text style={styles.label}>Lokasi </Text>
                  <Text style={styles.item}>: {lokasiBlok} </Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Kategori </Text>
                  <Text style={styles.item}>: {this.getCategoryName(item.FINDING_CATEGORY)} </Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Ditugaskan Kepada </Text>
                  <Text style={styles.item}>: {this.getContactName(item.ASSIGN_TO)}</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.label}>Batas Waktu </Text>
                  <Text style={{ width: '60%', color: this.getColor(batasWaktu), fontSize: 14 }}>: {batasWaktu} </Text>
                </View>
              </View>
            </TouchableOpacity>
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
    const url = "http://149.129.245.230:3012/images/" + findingCode;
    fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.ACCESS_TOKEN}`,
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status) {
          // alert(JSON.stringify(responseJson.data[0].IMAGE_NAME))
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
      });
    }
  }

  _renderNoData() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <Image style={{ width: 400, height: 300 }} source={require('../../Images/img-belum-ada-data.png')} />
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
          </View>
        </ScrollView>
      </View>
    )
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
        <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
        <View style={styles.sectionTimeline}>
          <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
          <View style={styles.rightSection}>
            {/* <Text style={styles.textFilter}>Filter</Text> */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
              <Icons name="filter-list" size={24} style={{ marginRight: 15, marginTop: 4 }} />
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