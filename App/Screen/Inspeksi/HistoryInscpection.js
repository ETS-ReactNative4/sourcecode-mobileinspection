import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import CardView from 'react-native-cardview';
import { Card, CardItem } from 'native-base';
import Colors from '../../Constant/Colors';
import Taskservice from '../../Database/TaskServices'
import { NavigationActions, StackActions } from 'react-navigation';
import TaskServices from '../../Database/TaskServices';
import moment from 'moment'
var RNFS = require('react-native-fs');
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
import { dateDisplayMobile } from '../../Lib/Utils'

export default class HistoryInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataLogin: TaskServices.getAllData('TR_LOGIN'),
      data: []
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.renderAll()
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  componentWillMount() {
    this.renderAll()
  }

  renderAll = () => {
    var dataSorted = TaskServices.getAllData('TR_BARIS_INSPECTION');
    let data = dataSorted.sorted('INSPECTION_DATE', true);
    let tempArray = []
    if (data.length > 0) {
      data.map((data, index) => {
        if (data.INSPECTION_RESULT !== "" && data.INSPECTION_RESULT.length !== 0) {
          tempArray.push(data);
        }
        else {
          let currentTime = moment().format('YYYY-MM-DD');
          let inspectionDate = moment(data.INSPECTION_DATE, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
          if (typeof data.INSPECTION_RESULT !== undefined) {
            if (data.INSPECTION_RESULT !== "" || moment(currentTime).isSameOrBefore(inspectionDate, 'day')) {
              tempArray.push(data);
            }
          }
          else {
            if (moment(currentTime).isSameOrBefore(inspectionDate, 'day')) {
              tempArray.push(data)
            }
            else {
              TaskServices.deleteRecordByPK('TR_BARIS_INSPECTION', 'ID_INSPECTION', data.ID_INSPECTION);
            }
          }
        }
      });
    }
    this.setState({ data: tempArray })
  }

  getEstateName(werks) {
    try {
      let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
      return data.EST_NAME;
    } catch (error) {
      return '';
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

  renderList = (data, index) => {
    let status = '', colorStatus = '';
    if (data.INSPECTION_RESULT === "") {
      status = 'Inspeksi Belum Selesai'
      colorStatus = '#C8C8C8';
    }
    else if (data.STATUS_SYNC == 'N') {
      status = 'Data Belum Dikirim'
      colorStatus = 'red';
    } else {
      status = 'Data Sudah Terkirim'
      colorStatus = Colors.brand
    }
    let color = this.getColor(data.INSPECTION_RESULT);
    let imgBaris = Taskservice.findByWithList('TR_IMAGE', ['TR_CODE', 'STATUS_IMAGE'], [data.BLOCK_INSPECTION_CODE, 'BARIS']);
    let path = '';
    try {
      path = `file://${imgBaris[0].IMAGE_PATH_LOCAL}`;
    } catch (error) {
      path = '';
    }

    let dataBlock = Taskservice.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', data.WERKS_AFD_BLOCK_CODE);

    return (
      <TouchableOpacity
        style={{ marginTop: 12 }}
        onPress={() => {
          this.actionButtonClick(data)
        }}
        key={index}>
        <Card style={[styles.cardContainer]}>
          <View style={styles.sectionCardView}>
            <View style={{ flexDirection: 'row', height: 100 }} >
              <Image style={{ alignItems: 'stretch', width: 100, borderRadius: 10 }} source={{ uri: path }}></Image>
            </View>
            <View style={styles.sectionDesc} >
              <Text style={{ fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>{dataBlock.BLOCK_NAME}/{this.getStatusBlok(data.WERKS_AFD_BLOCK_CODE)}/{data.EST_NAME}</Text>
              <Text style={{ fontSize: 12, marginTop: 5, color: 'grey' }}>{dateDisplayMobile(data.INSPECTION_DATE)}</Text>
              <Text style={{ fontSize: 12, marginTop: 20, color: colorStatus, fontStyle: 'italic' }}>{status}</Text>
            </View>
            <View style={{ flexDirection: 'row', height: 100 }}>
              <Text style={[styles.textValue, { marginTop: 20 }]}>{data.INSPECTION_RESULT}</Text>
              <View style={{ alignItems: 'stretch', width: 8, backgroundColor: color, borderRadius: 10 }} />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  getColor(param) {
    switch (param) {
      case 'A':
        return Colors.brand;
      case 'B':
        return '#feb236';
      case 'C':
        return '#ff7b25';
      case 'F':
        return 'red';
      default:
        return '#C8C8C8';
    }
  }

  actionButtonClick(data) {
    if (data.INSPECTION_RESULT === '') {

      let dataBaris = Taskservice.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', data.ID_INSPECTION);
      if (dataBaris !== undefined) {
        if (dataBaris > 1) {
          dataBaris = dataBaris[dataBaris.length - 1]
        } else {
          dataBaris = dataBaris[0]
        }

        let modelInspeksiH = {
          BLOCK_INSPECTION_CODE: dataBaris.BLOCK_INSPECTION_CODE,
          ID_INSPECTION: dataBaris.ID_INSPECTION,
          WERKS: dataBaris.WERKS,
          AFD_CODE: dataBaris.AFD_CODE,
          BLOCK_CODE: dataBaris.BLOCK_CODE,
          AREAL: '',
          INSPECTION_TYPE: "PANEN",
          STATUS_BLOCK: dataBaris.STATUS_BLOCK,
          INSPECTION_DATE: data.INSPECTION_DATE,
          INSPECTION_SCORE: '',
          INSPECTION_RESULT: '',
          STATUS_SYNC: 'N',
          SYNC_TIME: '',
          START_INSPECTION: '',
          END_INSPECTION: '',
          LAT_START_INSPECTION: dataBaris.LAT_START_INSPECTION,
          LONG_START_INSPECTION: dataBaris.LONG_START_INSPECTION,
          LAT_END_INSPECTION: '',
          LONG_END_INSPECTION: '',
          INSERT_TIME: '',
          INSERT_USER: '',
          TIME: dataBaris.TIME,
          DISTANCE: dataBaris.DISTANCE
        }

        var dataUsual = {
          USER_AUTH: this.state.dataLogin[0].USER_AUTH_CODE,
          BA: dataBaris.WERKS,
          AFD: dataBaris.AFD_CODE,
          BLOK: dataBaris.BLOCK_CODE,
          BARIS: dataBaris.AREAL,
          ID_INSPECTION: dataBaris.ID_INSPECTION,
          BLOCK_INSPECTION_CODE: dataBaris.BLOCK_INSPECTION_CODE

        }

        this.props.navigation.dispatch(NavigationActions.navigate({
          routeName: 'KondisiBarisAkhir', params: {
            inspeksiHeader: modelInspeksiH,
            statusBlok: dataBaris.STATUS_BLOCK,
            dataInspeksi: data,
            dataUsual: dataUsual,
            inspectionType: dataBaris.inspectionType === 'genba' ? 'genba' : 'normal',
            from: 'history'
          }
        }));
      } else {
        alert(`data TR_BLOCK_INSPECTION_H untuk ID_INSPECTION = ${data.ID_INSPECTION} tidak ada`)
      }

    } else {
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'DetailHistoryInspeksi', params: { data: data } }));
    }

  }

  _renderNoData() {
    return (
      <Image style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 120, width: 300, height: 220 }} source={require('../../Images/img-no-data.png')} />
    )
  }

  _renderData() {
    return (
      <ScrollView style={styles.container}>
        <View>
          {this.state.data.map((data, idx) => this.renderList(data, idx))}
        </View>
      </ScrollView >
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
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor={Colors.tintColorPrimary}
        />
        {show}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  sectionCardView: {
    alignItems: 'stretch',
    height: 100,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textValue: {
    fontSize: 28,
    fontWeight: '500',
    paddingRight: 24
  },
  sectionDesc: {
    flexDirection: 'column',
    height: 100,
  },
  cardContainer: {
    flex: 1,
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
});