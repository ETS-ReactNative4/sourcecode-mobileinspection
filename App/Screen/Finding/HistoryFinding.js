import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import TaskServices from '../../Database/TaskServices'
import Colors from '../../Constant/Colors'
import { changeFormatDate } from '../../Lib/Utils'
import Moment from 'moment'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import { dirPhotoTemuan } from '../../Lib/dirStorage';

export default class HistoryFinding extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      data: [],
      idx: 0
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this._initData()
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  componentWillMount() {
    this._initData()
  }

  _initData() {
    let user = TaskServices.getAllData('TR_LOGIN')[0]  
    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND (INSERT_USER = "${user.USER_AUTH_CODE}" OR ASSIGN_TO = '${user.USER_AUTH_CODE}')`);
    data = data.sorted('INSERT_TIME', true);
    this.setState({ data })
  }

  getCategoryName = (categoryCode) => {
    try {
      let data = TaskServices.findBy2('TR_CATEGORY', 'CATEGORY_CODE', categoryCode);
      return data.CATEGORY_NAME;
    } catch (error) {
      return ''
    }
  }

  getColor(param) {
    switch (param) {
      case 'SELESAI':
        return Colors.brand;
      case 'SEDANG DIPROSES':
        return '#feb236';
      case 'BARU':
        return 'red';
      default:
        return '#ff7b25';
    }
  }

  onClickItem(id) {
    var images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
    if(images !== undefined){
      this.props.navigation.navigate('DetailFinding', { ID: id })
    }else{
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
        alert(error);
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
        alert(error);
      });
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

  _renderItem = (item, idx) => {
    const image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE);
    let INSERT_TIME = "" + item.INSERT_TIME;
    Moment.locale();
    let showImage;
    if (image == undefined) {
      showImage = <Image style={{ alignItems: 'stretch', width: 65, height: 65, borderRadius: 10 }} source={require('../../Images/ic-default-thumbnail.png')} />
    } else {
      showImage = <Image style={{ alignItems: 'stretch', width: 65, height: 65, borderRadius: 10 }} source={{ uri: "file://" + image.IMAGE_PATH_LOCAL }} />
    }
    let werkAfdBlokCode = `${item.WERKS}${item.AFD_CODE}${item.BLOCK_CODE}`;
    let lokasi = `${this.getBlokName(item.BLOCK_CODE)}/${this.getStatusBlok(werkAfdBlokCode)}/${this.getEstateName(item.WERKS)}`
    return (
      <TouchableOpacity
        style={styles.sectionCardView}
        onPress={() => { this.onClickItem(item.FINDING_CODE) }}
        key={idx}
      >
        {showImage}
        <View style={styles.sectionDesc} >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, color: 'black', width: 50 }}>Lokasi </Text>
            <Text style={{ fontSize: 12, color: 'grey' }}>:  {lokasi}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, color: 'black', width: 50 }}>Dibuat </Text>
            <Text style={{ fontSize: 12, color: 'grey' }}>:  {changeFormatDate(INSERT_TIME, "YYYY-MM-DD hh-mm-ss")}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, color: 'black', width: 50 }}>Kategori </Text>
            <Text style={{ fontSize: 12, color: 'grey' }}>:  {this.getCategoryName(item.FINDING_CATEGORY)}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, color: 'black', width: 50 }}>Status </Text>
            <Text style={{ fontSize: 12, color: this.getColor(item.STATUS) }}>:  {item.STATUS}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderNoData() {
    return (
      <Image style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 110, width: 350, height: 280 }} source={require('../../Images/img-no-data.png')} />
    )
  }

  _renderData() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ paddingTop: 4, paddingRight: 16, paddingLeft: 16, paddingBottom: 16 }}>
          <View style={{ marginTop: 12 }}>
            {this.state.data.map((data, idx) => this._renderItem(data, idx))}
          </View>
        </View>
      </ScrollView >
    )
  }

  render() {
    const nav = this.props.navigation;
    let show;
    if (this.state.data.length > 0) {
      show = this._renderData()
    } else {
      show = this._renderNoData()
    }
    return (
      <View style={{ flex: 1 }}>{show}</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  sectionCardView: {
    alignItems: 'stretch',
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textValue: {
    fontSize: 28,
    fontWeight: '500',
    paddingRight: 24
  },
  sectionDesc: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
    paddingTop: 7,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  }
});