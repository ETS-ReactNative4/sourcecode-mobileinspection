import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import TaskServices from '../../Database/TaskServices'
import Colors from '../../Constant/Colors'
import { getFormatDate, changeFormatDate } from '../../Lib/Utils'
import Moment from 'moment'

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
    var data = TaskServices.query('TR_FINDING', `INSERT_USER = '${user.USER_AUTH_CODE}'`);
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
    var images = TaskServices.query('TR_IMAGE', `TR_CODE='${id}' AND STATUS_IMAGE='SEBELUM'`);
    let test = [];
    images.map(item => {
      var img = {
        TR_CODE: item.TRANS_CODE,
        IMAGE_NAME: item.IMAGE_NAME,
        IMAGE_PATH: item.IMAGE_PATH_LOCAL,
        STATUS_IMAGE: item.STATUS_IMAGE,
      }
      test.push(img);
    })
    this.props.navigation.navigate('DetailFinding', { ID: id, images: test })
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
      showImage = <Image style={{ alignItems: 'stretch', width: 65, height: 65, borderRadius: 10 }} source={require('../../Images/background.png')} />
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
          <Text style={{ fontSize: 12, color: 'black' }}>Lokasi : <Text style={{ color: 'grey' }}>{lokasi}</Text></Text>
          <Text style={{ fontSize: 12, color: 'black' }}>Tanggal dibuat : <Text style={{ color: 'grey' }}>{changeFormatDate(INSERT_TIME, "YYYY-MM-DD hh-mm-ss")}</Text></Text>
          <Text style={{ fontSize: 12, color: 'black' }}>Kategori : <Text style={{ color: 'grey' }}>{this.getCategoryName(item.FINDING_CATEGORY)}</Text ></Text>
          <Text style={{ fontSize: 12, color: 'black' }}>Status : <Text style={{ color: this.getColor(item.STATUS) }}>{item.STATUS}</Text ></Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderNoData() {
    return (
      <Image style={{justifyContent: 'center', alignSelf:'center', marginTop: 120, width:300, height: 220}}source={require('../../Images/img-no-data.png')} />
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
    if(this.state.data.length > 0){
      show = this._renderData()
    }else{
      show = this._renderNoData()
    }
    return (
      <View style ={{flex:1}}>{show}</View>
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