import React, { Component } from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Card } from 'native-base';
import Colors from '../../Constant/Colors';
import Taskservice from '../../Database/TaskServices'
import TaskServices from '../../Database/TaskServices'
import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { dateDisplayMobile } from '../../Lib/Utils'
import TemplateNoData from '../../Component/TemplateNoData';
import { Images } from '../../Themes';

export default class HistoryInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataLogin: TaskServices.getAllData('TR_LOGIN'),
      data: [],
      page: 0,
      isLoading: false,
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
    this.setState({
      data: [],
      page: 0,
      dataSet: tempArray
    }, function () {
      // call the function to pull initial 12 records
      this._addRecords(0);
    });
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
      colorStatus = Colors.colorGreen
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
        style={{ marginTop: 3 }}
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

  renderData() {
    return (
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (this._isCloseToBottom(nativeEvent)) {
            console.log("Reached end of page");
            this._onScrollHandler();
          }
        }}
        style={styles.container}>
        <View style={{ paddingBottom: 16 }}>
          {this.state.data.map((data, idx) => this.renderList(data, idx))}
        </View>
        {this.state.isLoading && <ActivityIndicator size={20} style={{ marginBottom: 16 }} color={Colors.tintColorPrimary} />}
      </ScrollView >

    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor={Colors.tintColorPrimary}
        />
        {this.state.data.length > 0 ? this.renderData() : <TemplateNoData img={Images.img_no_data} />}
      </View>
    )
  }

  _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  _onScrollHandler = () => {
    this.setState({ isLoading: true })
    setTimeout(() => {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this._addRecords(this.state.page);
      });
    }, 2000);
  }

  _addRecords = (page) => {
    const newRecords = []
    for (let i = page * 10, il = i + 10; i < il && i <
      this.state.dataSet.length; i++) {
      newRecords.push(this.state.dataSet[i]);
    }
    this.setState({
      data: [...this.state.data, ...newRecords],
      isLoading: false,
    });
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
