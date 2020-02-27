import React, { Component } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Card } from 'native-base';
import Colors from '../../Constant/Colors';
import TaskServices from '../../Database/TaskServices'
import { dateDisplayMobile } from '../../Lib/Utils'
import { getEstateName, getStatusBlok } from '../../Database/Resources';
import moment from "moment";
import RNFS from 'react-native-fs';
import { Fonts } from '../../Themes';

export default class HistoryEbcc extends Component {

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
      this.renderAll();
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  componentWillMount() {
    this.renderAll();
  }

  renderAll() {
    this.deleteDataEbcc();
    this.setDataEbcc();
  }

  /** 
   * SET DATA EBCC
   * ADD BY AMINJU 2019/12/17
   */
  setDataEbcc() {
    var dataSorted = TaskServices.getAllData('TR_H_EBCC_VALIDATION');
    dataSorted = dataSorted.sorted('INSERT_TIME', true);
    let data = []
    if (dataSorted !== undefined) {
      dataSorted.map(item => {
        data.push(item)
      });
    }
    this.setState({
      data: [],
      page: 0,
      dataSet: data
    }, function () {
      // call the function to pull initial 12 records
      this._addRecords(0);
    });
  }

  /** 
   * DELETE DATA EBCC MELEBIHI 7 HARI DAN STATUS SYNC = 'Y'
   * ADD BY AMINJU 2019/12/17
   */
  deleteDataEbcc() {
    var data = TaskServices.query('TR_H_EBCC_VALIDATION', `STATUS_SYNC = "Y" AND syncImage = "Y" AND syncDetail = "Y"`);
    var now = moment(new Date())
    data.map(item => {
      let insertTime = item.INSERT_TIME.substring(0, 10);
      var diff = moment(new Date(insertTime)).diff(now, 'day');

      if (diff < -7) {
        this.querySelectImagePath(item.EBCC_VALIDATION_CODE);
      } else {
        console.log('Diff Range Hari : ', diff)
      }
    })
  }

  /** 
   * QUERY SELECT IMAGE EBCC YANG AKAN DI DELETE
   * ADD BY AMINJU 2019/12/18
   */
  querySelectImagePath(trCode) {
    let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${trCode}"`);
    if (dataImage != undefined) {
      dataImage.map(item => {
        this.deleteImageFileEbcc(item.IMAGE_PATH_LOCAL, trCode)
      })
    }
  }

  /** 
   * DELETE IMAGE EBCC MELEBIHI 7 HARI DAN STATUS SYCNC = 'Y'
   * ADD BY AMINJU 2019/12/18
   */
  async deleteImageFileEbcc(path, primaryKey) {
    RNFS.exists(path)
      .then((result) => {
        if (result) {
          RNFS.unlink(path)
            .then(() => {
              console.log(`${path} DELETED`);
              TaskServices.deleteRecordByPK('TR_H_EBCC_VALIDATION', 'EBCC_VALIDATION_CODE', primaryKey);
            });
        } else {
          TaskServices.deleteRecordByPK('TR_H_EBCC_VALIDATION', 'EBCC_VALIDATION_CODE', primaryKey)
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  /** RENDER DATA EBCC */
  renderList = (data, index) => {
    let status = '', colorStatus = '';
    if (data.STATUS_SYNC === 'N' || data.syncImage === 'N' || data.syncDetail === 'N') {
      status = 'Data Belum Dikirim';
      colorStatus = 'red';
    } else {
      status = 'Data Sudah Terkirim';
      colorStatus = Colors.brand;//'#999'
    }
    let imgBaris = TaskServices.findByWithList('TR_IMAGE', ['TR_CODE', 'STATUS_IMAGE'], [data.EBCC_VALIDATION_CODE, 'JANJANG']);
    let estName = getEstateName(data.WERKS);
    let path = '';
    try {
      path = `file://${imgBaris[0].IMAGE_PATH_LOCAL}`;
    } catch (error) {
      path = '';
    }
    let dataBlock = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', `${data.WERKS}${data.AFD_CODE}${data.BLOCK_CODE}`);
    let statusBlok = ''
    let blockName = ''
    if (dataBlock != undefined) {
      statusBlok = getStatusBlok(dataBlock.WERKS_AFD_BLOCK_CODE) + '/'
    }

    if (dataBlock != undefined) {
      blockName = dataBlock.BLOCK_NAME + '/'
    } else {
      blockName = data.BLOCK_CODE + '/'
    }

    let ebccDate = data.INSERT_TIME == '' ? 'Insert Time kosong' : dateDisplayMobile(data.INSERT_TIME);

    return (
      <TouchableOpacity
        style={{ marginTop: 3 }}
        onPress={() => this.actionButtonClick(data)}
        key={index}>
        <Card style={[styles.cardContainer]}>
          <View style={styles.sectionCardView}>
            <View style={{ flexDirection: 'row', height: 100 }} >
              <Image style={{ alignItems: 'stretch', width: 100, borderRadius: 10 }} source={{ uri: path }}></Image>
            </View>
            <View style={styles.sectionDesc} >
              <Text style={{ fontSize: 14, fontWeight: 'bold', fontFamily: Fonts.demi }}>{`${blockName}${statusBlok}${estName}`}</Text>
              <Text style={{ fontSize: 12, marginTop: 8, fontFamily: Fonts.book }}>{`TPH ${data.NO_TPH}`}</Text>
              <Text style={{ fontSize: 12, marginTop: 5, fontFamily: Fonts.book }}>{ebccDate}</Text>
              <Text style={{ fontSize: 12, color: colorStatus, marginTop: 15, fontFamily: Fonts.bookItalic }}>{status}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  actionButtonClick(data) {
    this.props.navigation.navigate('DetailEbcc', { data: data })
  }

  _renderNoData() {
    return (
      <Image style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 120, width: 300, height: 220 }} source={require('../../Images/img-no-data.png')} />
    )
  }

  _renderData() {
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
    // justifyContent: 'space-between'
  },
  textValue: {
    fontSize: 28,
    fontWeight: '500',
    paddingRight: 24
  },
  sectionDesc: {
    flexDirection: 'column',
    height: 100,
    paddingRight: 10,
    paddingBottom: 5,
    marginRight: 20,
    marginLeft: 20
  },
  cardContainer: {
    flex: 1,
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
});
