import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import TaskServices from '../../Database/TaskServices'
import ItemHistoryFinding from '../../Component/ItemHistoryFinding';
import { getImageBaseOnFindingCode } from '../Sync/Download/DownloadImage';
import moment from 'moment';
import RNFS from 'react-native-fs';
import Colors from '../../Constant/Colors';

export default class HistoryFinding extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      data: [],
      idx: 0,
      page: 0,
      isLoading: false,
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.deleteDataFinding();
      this.setDataFinding();
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  componentWillMount() {
    this.deleteDataFinding();
    this.setDataFinding();
  }

  /** 
   * SET DATA HISTORY FINDING
   * ADD BY AMINJU 2019/12/18
   */
  setDataFinding() {
    let user = TaskServices.getAllData('TR_LOGIN')[0]
    var data = TaskServices.query('TR_FINDING', `(INSERT_USER = "${user.USER_AUTH_CODE}" OR ASSIGN_TO = '${user.USER_AUTH_CODE}')`);
    data = data.sorted('INSERT_TIME', true);
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
   * DELETE DATA FINDING MELEBIHI 7 HARI DAN STATUS SYCNC = 'Y'
   * ADD BY AMINJU 2019/12/18
   */
  deleteDataFinding() {
    var data = TaskServices.query('TR_FINDING', `PROGRESS = '100' AND STATUS_SYNC = "Y" AND syncImage = "Y"`);
    var now = moment(new Date());

    data.map(item => {

      let endTime = item.END_TIME.substring(0, 10);
      var diff = moment(new Date(endTime)).diff(now, 'day');

      if (diff < -7) {
        this.querySelectImagePath(item.FINDING_CODE);
      } else {
        console.log('Diff Range Hari : ', diff)
      }
    })
  }

  /** 
   * QUERY SELECT IMAGE FINDING YANG AKAN DI DELETE
   * ADD BY AMINJU 2019/12/18
   */
  querySelectImagePath(findingCode) {
    let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${findingCode}"`);

    if (dataImage != undefined) {
      dataImage.map(item => {
        this.deleteImageFileFinding(item.IMAGE_PATH_LOCAL, findingCode)
      })
    }
  }

  /** 
   * DELETE IMAGE FINDING MELEBIHI 7 HARI DAN STATUS SYNC = 'Y'
   * ADD BY AMINJU 2019/12/18
   */
  async deleteImageFileFinding(path, primaryKey) {
    RNFS.exists(path)
      .then((result) => {
        if (result) {
          RNFS.unlink(path)
            .then(() => {
              console.log(`${path} DELETED`);
              TaskServices.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', primaryKey);
            });
        } else {
          TaskServices.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', primaryKey)
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  /** 
   * EVENT CLICK ITEM
   * ADD BY AMINJU 2019/12/18
   */
  onPressItem(id) {
    var images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
    if (images !== undefined) {
      this.props.navigation.navigate('DetailFinding', { ID: id })
    } else {
      getImageBaseOnFindingCode(id);
      setTimeout(() => {
        this.props.navigation.navigate('DetailFinding', { ID: id })
      }, 3000);
    }
  }

  /** 
   * REWORK VIEW WITH COMPONENT
   * ADD BY AMINJU 2019/12/18
   */
  _renderItem = (item, idx) => {
    return <ItemHistoryFinding item={item} idx={idx} onPress={() => { this.onPressItem(item.FINDING_CODE) }} />
  }

  /** 
   * RENDER NO DATA
   * ADD BY AMINJU 2019/12/18
   */
  _renderNoData() {
    return (
      <Image style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 110, width: 350, height: 280 }} source={require('../../Images/img-no-data.png')} />
    )
  }

  /** 
   * RENDER DATA
   * ADD BY AMINJU 2019/12/18
   */
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
        <View style={{ paddingTop: 4, paddingRight: 16, paddingLeft: 16, paddingBottom: 16 }}>
          <View style={{ marginTop: 12 }}>
            {this.state.data.map((data, idx) => this._renderItem(data, idx))}
          </View>
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
      <View style={{ flex: 1 }}>{show}</View>
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
    backgroundColor: '#fff'
  }
});
