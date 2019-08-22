import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import CustomHeader from '../../Component/CustomHeader'
import Colors from '../../Constant/Colors'
import InspectionTabNavigator from './InspectionTabNavigator'
import {connect} from 'react-redux';
import InspeksiAction from '../../Redux/InspeksiRedux';
import IconHeader from '../../Component/IconHeader'
import {Images} from '../../Themes'


class InspectionScreen extends Component {

  constructor(props) {
    super(props);
    // this.loadData = this.loadData.bind(this);
    this.state = {
      model: null,
    }
  }

  static router = InspectionTabNavigator.router;
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Inspeksi',
      headerTintColor: '#fff',
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
      headerRight: <IconHeader padding={{ paddingRight: 12 }} onPress={() => navigation.navigate('Inbox')} icon={Images.ic_inbox} show={true} />,
      headerLeft: <IconHeader padding={{ paddingLeft: 12 }} onPress={() => navigation.navigate('Sync')} icon={Images.ic_sync} show={true} />,
      header: props => <CustomHeader {...props} />
    };
  }

  inbox() {

  }

  componentDidMount() {

    // this.props.navigation.setParams({
    //   loadData: this.loadData,
    //   loadDataDetail: this.loadDataDetail,
    //   kirimInspeksi: this.kirimInspeksi,
    //   kirimInspeksiDetail: this.kirimInspeksiDetail,
    //   inbox: this.inbox
    // });
  }

  // loadData(){
  //   let dataHeader = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
  //   if(dataHeader !== null){
  //     for(var i=0; i<dataHeader.length; i++){
  //       this.kirimInspeksiHeader(dataHeader[i]);
  //     }
  //   }
  // }

  // kirimInspeksi(param) {
  //   this.props.postInspeksi({
  //     BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
  //     WERKS: param.WERKS,
  //     AFD_CODE: param.AFD_CODE,
  //     BLOCK_CODE: param.AFD_CODE,
  //     INSPECTION_DATE: param.INSPECTION_DATE,
  //     INSPECTION_RESULT: param.INSPECTION_RESULT,
  //     STATUS_SYNC: 'YES',
  //     SYNC_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss'),
  //     START_INSPECTION: param.START_INSPECTION,
  //     END_INSPECTION: param.END_INSPECTION,
  //     LAT_START_INSPECTION: param.LAT_START_INSPECTION,
  //     LONG_START_INSPECTION: param.LONG_START_INSPECTION,
  //     LAT_END_INSPECTION: param.LAT_END_INSPECTION,
  //     LONG_END_INSPECTION:param.LONG_END_INSPECTION
  //   });
  // }

  // loadDataDetail(param){
  //   let data = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', param);
  //   if(data !== null){
  //     for(var i=0; i<data.length; i++){
  //       this.kirimInspeksiDetail(data[i]);
  //     }
  //   }
  // }

  // kirimInspeksiDetail(param){
  //   this.props.postInspeksiDetail({
  //     BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
  //     BLOCK_INSPECTION_CODE_D: param.BLOCK_INSPECTION_CODE_D,
  //     CONTENT_CODE: param.CONTENT_CODE,
  //     AREAL: param.AREAL,
  //     VALUE: param.VALUE,
  //     STATUS_SYNC: 'YES',
  //     SYNC_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
  //   });
  // }

  render() {
    return (
      <View style={styles.container}>
        <InspectionTabNavigator navigation={this.props.navigation} />
      </View >
    )
  }
}

const mapStateToProps = state => {
  return {
    inspeksi: state.inspeksi
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postInspeksi: obj => dispatch(InspeksiAction.postInspeksi(obj)),
    postInspeksiDtl: obj => dispatch(InspeksiAction.postInspeksiDtl(obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InspectionScreen);

// export default InspectionScreen;



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
});
