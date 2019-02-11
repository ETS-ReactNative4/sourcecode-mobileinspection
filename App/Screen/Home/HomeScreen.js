import React from 'react';
import { ImageBackground, StatusBar, TouchableOpacity, View, ScrollView, Image, StyleSheet } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
import { connect } from 'react-redux'
import Icons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import CategoryAction from '../../Redux/CategoryRedux'
import ContactAction from '../../Redux/ContactRedux'
import RegionAction from '../../Redux/RegionRedux'
import Moment from 'moment';
import R, { isEmpty } from 'ramda';
var RNFS = require('react-native-fs');
import { changeFormatDate } from '../../Lib/Utils';
import Carousel from 'react-native-carousel-view'
import SwiperSlider from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import { dirPhotoInspeksiBaris, dirPhotoInspeksiSelfie, dirPhotoTemuan, dirPhotoKategori } from '../../Lib/dirStorage';
import { deleteFile } from 'realm';

var { height, width } = Dimensions.get('window')

class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.tintColor
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
      loadAll: true
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
    this._deleteFinding();
    this._deleteInspeksiHeader();

    RNFS.mkdir(dirPhotoInspeksiBaris);
    RNFS.mkdir(dirPhotoInspeksiSelfie);
    RNFS.mkdir(dirPhotoTemuan);
    RNFS.mkdir(dirPhotoKategori);
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

  _deleteFinding() {
    var data = TaskServices.query('TR_FINDING', 'PROGRESS = 100');
    var now = Moment(new Date())
    if (data !== undefined) {
      if (data !== undefined) {
        data.map(item => {
          if (item.DUE_DATE !== '') {
            let dueDate = item.DUE_DATE;
            if (dueDate.includes(' ')) {
              dueDate = dueDate.substring(0, dueDate.indexOf(' '))
            }
            var diff = Moment(new Date(dueDate)).diff(now, 'day');
            if (diff < -7) {
              this.deleteImage(item.FINDING_CODE)
              this.deleteData('TR_FINDING', 'FINDING_CODE', item.FINDING_CODE);
            }
          }
        });
      }
    }
  }

  _deleteInspeksiHeader() {
    var data = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
    var now = Moment(new Date());
    if (data != undefined) {
      data.map(item => {
        if (item.INSERT_TIME !== '') {
          let insertTime = item.INSERT_TIME;
          if (insertTime.includes(' ')) {
            insertTime = insertTime.substring(0, insertTime.indexOf(' '))
          }
          var diff = Moment(new Date(insertTime)).diff(now, 'day');
          if (diff < -7) {
            this.deleteImage(item.BLOCK_INSPECTION_CODE);
            this.deleteDetailInspeksi(item.BLOCK_INSPECTION_CODE)
            this.deleteData('TR_BLOCK_INSPECTION_H', 'BLOCK_INSPECTION_CODE', item.BLOCK_INSPECTION_CODE);
            this.deleteData('TR_BARIS_INSPECTION', 'ID_INSPECTION', item.ID_INSPECTION);
          }
        }
      });
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


  getColor(param) {
    switch (param) {
      case 'SELESAI':
        return 'rgba(35, 144, 35, 0.7)';
      case 'SEDANG DIPROSES':
        return 'rgba(254, 178, 54, 0.7)';
      case 'BARU':
        return 'rgba(255, 77, 77, 0.7)';
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
        <FastImage style={{ height: 200 }}
          source={{
            uri: "file://" + item.IMAGE_PATH_LOCAL,
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
          <Text style={{ marginLeft: 12, color: 'white', fontSize: 14 }}>{status}</Text>
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
      <View style={{ height: 200 }}>
        <ImageSlider
          images={images}
          customSlide={({ index, item, style, width }) => (
            <View key={index} style={[style, { backgroundColor: 'yellow' }]}>
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
    let sources = image == undefined ? require('../../Images/img-no-picture.png') : { uri: "file://" + image.IMAGE_PATH_LOCAL }

    let werkAfdBlockCode = this.getWerksAfdBlokCode(item.BLOCK_CODE)
    let lokasiBlok = `${this.getBlokName(item.BLOCK_CODE)}/${this.getStatusBlok(werkAfdBlockCode)}/${this.getEstateName(item.WERKS)}`
    let status = item.STATUS;
    return (
      <View key={index}>
        <Card >
          <CardItem>
            <Left>
              <Thumbnail style={{ borderColor: 'grey', borderWidth: 0.5, height: 48, width: 48 }} source={require('../../Images/ic-orang.png')} />
              <Body>
                <Text style={{ fontSize: 14 }}>{user}</Text>
                <Text style={{ fontSize: 12 }}>{dtInsertTime}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            {image == undefined && <ImageBackground source={require('../../Images/img-no-picture.png')} style={{ height: 210, width: null, flex: 1, flexDirection: 'column-reverse' }} >
              <View style={{ alignContent: 'center', paddingTop: 2, paddingLeft: 12, flexDirection: 'row', height: 42, backgroundColor: this.getColor(item.STATUS) }} >
                <Image style={{ marginTop: 2, height: 28, width: 28 }} source={require('../../Images/icon/ic_new_timeline.png')}></Image>
                <Text style={{ marginLeft: 12, color: 'white', fontSize: 14 }}>{item.STATUS}</Text>
              </View>
            </ImageBackground>}
            {image &&
              <View style={{
                flex: 1,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <SwiperSlider
                  autoplay={false}
                  width={width}
                  // width={this.state.swiperWidth} style={styles.wrapper}
                  height={200}
                  // renderPagination={this._renderPagination}
                  paginationStyle={{
                    bottom: -23, left: null, right: 10
                  }}
                  loop={false}>
                  {image.map(item => this.renderCarousel(item, status))}
                </SwiperSlider>
                {/* <Carousel
                      height={200}
                      hideIndicators={status == 'SELESAI' ? false : true}
                      indicatorOffset={10}
                      animate={false}
                      delay={1000}
                      indicatorSize={15}
                      indicatorColor="white">
                      {image.map(item =>this.renderCarousel(item, status))}
                  </Carousel> */}
              </View>}
          </CardItem>
          <CardItem>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { nav.navigate('DetailFinding', { ID: item.FINDING_CODE }) }}>
              <Body>
                <Text style={{ fontSize: 14 }}>Lokasi : {lokasiBlok}</Text>
                <Text style={{ marginTop: 6, fontSize: 14 }}>Kategori : {this.getCategoryName(item.FINDING_CATEGORY)}</Text>
                <Text style={{ marginTop: 6, fontSize: 14 }}>Ditugaskan kepada : {this.getContactName(item.ASSIGN_TO)}</Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ marginTop: 6, fontSize: 14 }}>Batas Waktu : </Text>
                  <Text style={{ marginTop: 6, color: this.getColor(batasWaktu), fontSize: 14 }}>{batasWaktu}</Text>
                </View>
              </Body>
            </TouchableOpacity>
          </CardItem>
        </Card>
      </View>
    );
  }

  _renderNoData() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <Image style={{ marginTop: 110, width: 250, height: 180 }} source={require('../../Images/img-belum-ada-data.png')} />
      </View>)
  }

  _renderData() {
    return (
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {this.state.data.map((item, index) => this._renderItem(item, index))}
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
      <Container style={{ padding: 16 }}>
        <Content>
          <StatusBar hidden={false} backgroundColor={Colors.tintColor} barStyle="light-content" />
          <View style={styles.sectionTimeline}>
            <Text style={styles.textTimeline}>Temuan di Wilayahmu</Text>
            <View style={styles.rightSection}>
              <Text style={styles.textFilter}>Filter</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter', { _changeFilterList: this._changeFilterList })} >
                <Icons name="filter-list" size={28} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
          {show}
        </Content>
      </Container >
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
    width: 250,
    fontSize: 14,
    color: 'black'
  },
  textFilter: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey'
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