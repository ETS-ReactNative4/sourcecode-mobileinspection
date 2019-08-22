'use strict';
import React, {Component} from 'react'
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {isEmpty} from 'ramda'
import moment from 'moment'
import ActionButton from 'react-native-action-button'
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import {dirPhotoTemuan} from '../../Lib/dirStorage';
import ServerName from '../../Constant/ServerName'
import {getColor} from '../../Themes/Resources';
import {getBlokName, getEstateName} from '../../Database/Resources';
import FeatureDaftarTemuan from '../../Component/FeatureDaftarTemuan'
import TemplateNoData from '../../Component/TemplateNoData';
import {Images} from '../../Themes';

export default class ListFinding extends Component {

  constructor(props) {

    super(props);
    this.state = {
      dataFinding: [],
      dataLewat: [],
      data7Hari: [],
      dataMore7Hari: [],
      dataNoDate: [],
      dataSelesai: [],
      refreshing: false
    }

  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this._initData()
    }
  )

  componentWillMount() {
  }

  componentWillUnmount() {
    this.willFocus.remove()
  }

  _initData() {

    const login = TaskServices.getAllData('TR_LOGIN');
    const user_auth = login[0].USER_AUTH_CODE;

    const dataFinding = TaskServices.getAllData('TR_FINDING');

    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}"`);

    var dataLewat = []
    var data7Hari = []
    var dataMore7Hari = []
    var dataNoDate = []

    var now = moment(new Date())

    data.map(item => {
      if (isEmpty(item.DUE_DATE)) {
        dataNoDate.push(item)
      } else {
        let dueDate = item.DUE_DATE;
        if (dueDate.includes(' ')) {
          dueDate = dueDate.substring(0, dueDate.indexOf(' '))
        }
        var diff = moment(new Date(dueDate)).diff(now, 'day');
        if (diff < 0) {
          dataLewat.push(item)
        } else if (diff < 7) {
          data7Hari.push(item)
        } else {
          dataMore7Hari.push(item)
        }
      }
    })

    var dataSelesai = TaskServices.query('TR_FINDING', `PROGRESS = 100 AND ASSIGN_TO = "${user_auth}"`);

    this.setState({ dataFinding, dataLewat, data7Hari, dataMore7Hari, dataNoDate, dataSelesai })
  }

  actionButtonClick() {
    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.props.navigation.navigate('Step1')
    } else {
      this.props.navigation.navigate('Sync')
    }
  }

  getImageBaseOnFindingCode(findingCode) {
    const user = TaskServices.getAllData('TR_LOGIN')[0];
    const url = "http://149.129.245.230:3012/images/" + findingCode;
    let serv = TaskServices.getAllData("TM_SERVICE")
      .filtered('API_NAME="IMAGES-GET-BY-ID" AND MOBILE_VERSION="' + ServerName.verAPK + '"')[0];
    fetch(serv.API_URL + "" + findingCode, {
      method: serv.METHOD,
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
          if (responseJson.data.length > 0) {
            for (var i = 0; i < responseJson.data.length; i++) {
              let dataImage = responseJson.data[i];
              TaskServices.saveData('TR_IMAGE', dataImage);
              this._downloadImageFinding(dataImage)
            }
          } else {
            // alert(`Image ${findingCode} kosong`);
            console.log(`Image ${findingCode} kosong`);
          }
        } else {
          // alert(`gagal download image untuk ${findingCode}`)
          console.log(`Image ${findingCode} kosong`);
        }


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
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  onClickItem = (id) => {
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

  renderItem = (item, index) => {
    const image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE)
    var label = getColor(item.STATUS);
    let showImage;
    if (image == undefined) {
      showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={require('../../Images/ic-default-thumbnail.png')} />
    } else {
      showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={{ uri: "file://" + image.IMAGE_PATH_LOCAL }} />
    }
    let showBlockDetail = `${getEstateName(item.WERKS)}-${getBlokName(item.BLOCK_CODE)}`
    return (
      < TouchableOpacity
        onPress={() => this.onClickItem(item.FINDING_CODE)}
        key={index}
      >
        <View style={{ height: 120, width: 120, marginLeft: 16 }}>
          {showImage}
          <View style={[styles.labelBackground, { backgroundColor: label }]}>
            <Icon name={'map-marker-alt'} color={'white'} size={12}
              style={{ marginRight: 5, marginTop: 1 }} />
            <Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{showBlockDetail}</Text>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  renderData = () => {
    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}>
        {/* Add by Aminju 05/08/2019 */}
        {/* Temuan belum ada batas waktu */}
        {this.state.dataNoDate.length > 0 &&
          <FeatureDaftarTemuan title={'Belum Ada Batas Waktu'} >
            {this.state.dataNoDate.map((item, index) => this.renderItem(item, index))}
          </FeatureDaftarTemuan>}

        {/* Temuan sudah lewat batas waktu */}
        {this.state.dataLewat.length > 0 &&
          <FeatureDaftarTemuan title={'Lewat batas waktu'} >
            {this.state.dataLewat.map((item, index) => this.renderItem(item, index))}
          </FeatureDaftarTemuan>}

        {/* Temuan dengan batas waktu dalam jangka 7 hari */}
        {this.state.data7Hari.length > 0 && <FeatureDaftarTemuan title={'Batas waktu dalam 7 hari'} >
          {this.state.data7Hari.map((item, index) => this.renderItem(item, index))}
        </FeatureDaftarTemuan>}

        {/* Temuan dengan batas waktu lebihh dari 7 hari */}
        {this.state.dataMore7Hari.length > 0 && <FeatureDaftarTemuan title={' Batas waktu >7 hari'} >
          {this.state.dataMore7Hari.map((item, index) => this.renderItem(item, index))}
        </FeatureDaftarTemuan>}

        {/* Temuan selesai */}
        {this.state.dataSelesai.length > 0 && <FeatureDaftarTemuan title={'Selesai'} divider={true}>
          {this.state.dataSelesai.map((item, index) => this.renderItem(item, index))}
        </FeatureDaftarTemuan>}
      </ScrollView>
    )
  }

  render() {
    {/* Add by Aminju 05/08/2019 */ }
    return (
      <View style={styles.container} >

        {this.state.dataFinding.length > 0 ? this.renderData() : <TemplateNoData img={Images.img_no_data_finding} />}

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { this.actionButtonClick() }}
          icon={<Icon2 color='white' name='add' size={25} />}>
        </ActionButton>
      </View >
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  ActionButtonStyle: {
    color: Colors.tintColor,
    backgroundColor: Colors.tintColor
  },
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  devider: {
    marginBottom: 16, marginTop: 16, backgroundColor: '#ccc', height: 8
  },
  labelBackground: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 120, padding: 5, position: 'absolute', bottom: 0,
    justifyContent: 'center', flex: 1, flexDirection: 'row'
  }
});
