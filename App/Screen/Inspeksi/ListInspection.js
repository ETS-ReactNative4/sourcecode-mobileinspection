import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ActionButton from 'react-native-action-button';
import Colors from '../../Constant/Colors'
import TaskServices from '../../Database/TaskServices'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import InspeksiAction from '../../Redux/InspeksiRedux';
import { getTodayDateFromGPS,getTodayDate } from '../../Lib/Utils';
import Icon2 from 'react-native-vector-icons/MaterialIcons'

import { ProgressDialog } from 'react-native-simple-dialogs';
import { Container, Content } from 'native-base';

class ListInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false
    }
  }

  async loadData() {
    let dataHeader = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
    if (dataHeader !== null) {
      for (var i = 0; i < dataHeader.length; i++) {
        await this.kirimInspeksiHeader(dataHeader[i]);
      }
    }
  }

  async loadDataDetail(param) {
    let data = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', param);
    if (data !== null) {
      for (var i = 0; i < data.length; i++) {
        await this.kirimInspeksiDetail(data[i]);
      }
    }
  }

  async kirimInspeksiHeader(param) {
    this.props.postInspeksi({
      BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
      WERKS: param.WERKS,
      AFD_CODE: param.AFD_CODE,
      BLOCK_CODE: param.AFD_CODE,
      INSPECTION_DATE: param.INSPECTION_DATE,
      INSPECTION_RESULT: param.INSPECTION_RESULT,
      STATUS_SYNC: 'YES',
      SYNC_TIME: await getTodayDateFromGPS('YYYY-MM-DD HH:mm:ss'),
      START_INSPECTION: param.START_INSPECTION,
      END_INSPECTION: param.END_INSPECTION,
      LAT_START_INSPECTION: param.LAT_START_INSPECTION,
      LONG_START_INSPECTION: param.LONG_START_INSPECTION,
      LAT_END_INSPECTION: param.LAT_END_INSPECTION,
      LONG_END_INSPECTION: param.LONG_END_INSPECTION
    });
  }

  async kirimInspeksiDetail(param) {
    this.props.postInspeksiDetail({
      BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
      BLOCK_INSPECTION_CODE_D: param.BLOCK_INSPECTION_CODE_D,
      CONTENT_CODE: param.CONTENT_CODE,
      AREAL: param.AREAL,
      VALUE: param.VALUE,
      STATUS_SYNC: 'YES',
      SYNC_TIME: await getTodayDateFromGPS('YYYY-MM-DD HH:mm:ss')
    });
  }

  actionButtonClick() {
    // this.props.navigation.navigate('FormInspection');
    // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BuatInspeksi' }));    
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MapsInspeksi' }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width:300, height: 300 }} source={require('../../Images/icon/ic-no-inspeksi.png')} />

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { this.actionButtonClick() }}
          icon={<Icon2 color='white' name='add' size={25} />}>
        </ActionButton>
      </View>
    )
  }
}

export default ListInspection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16
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
  }
});
