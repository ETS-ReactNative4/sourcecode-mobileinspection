import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import {Card} from 'native-base';
import Colors from '../../Constant/Colors';
import Taskservice from '../../Database/TaskServices'
import { NavigationActions  } from 'react-navigation';
import TaskServices from '../../Database/TaskServices';
import moment from 'moment';

export default class HistoryEbcc extends Component {

  constructor(props){
    super(props);
    this.state = {      
      dataLogin: TaskServices.getAllData('TR_LOGIN'),
      data: []
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

  componentDidMount(){   
    this.renderAll();
  }
  
  renderAll =()=>{    
    var dataSorted = TaskServices.getAllData('TR_H_EBCC_VALIDATION');    
    dataSorted = dataSorted.sorted('INSERT_TIME', true);
    let data = []
    if(dataSorted !== undefined){
      dataSorted.map(item => {
        data.push(item)
      });
    }
    this.setState({ data })
  }

  getEstateName(werks){
    try {
        let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
        return data.EST_NAME;
    } catch (error) {
        return '';
    }    
  }
  getStatusBlok(werk_afd_blok_code){
    try {
        let data = TaskServices.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
        return data.MATURITY_STATUS;            
    } catch (error) {
        return ''
    }
  }

  renderList = (data, index) => {
    let status = '', colorStatus = '';
    if (data.STATUS_SYNC == 'N'){
      status = 'Data Belum Dikirim'
      colorStatus = 'red';
    }else{
      status = 'Data Sudah Terkirim'
      colorStatus = '#999'//Colors.brand
    }  
    let imgBaris = TaskServices.findByWithList('TR_IMAGE', ['TR_CODE', 'STATUS_IMAGE'], [data.EBCC_VALIDATION_CODE, 'JANJANG']);
    let estName = this.getEstateName(data.WERKS);
    let path = '';
    try {
      path = `file://${imgBaris[0].IMAGE_PATH_LOCAL}`;
    } catch (error) {
      path = '';
    }    
    let dataBlock = Taskservice.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', `${data.WERKS}${data.AFD_CODE}${data.BLOCK_CODE}`);
    let statusBlok = this.getStatusBlok(dataBlock.WERKS_AFD_BLOCK_CODE)    
    let ebccDate = data.INSERT_TIME == '' ? 'Insert Time kosong' : moment(data.INSERT_TIME).format('LLL');

    return(
      <TouchableOpacity 
        style={{ marginTop: 12 }} 
        onPress={()=> this.actionButtonClick(data)}
        key={index}>
          <Card style={[styles.cardContainer]}>
            <View style={styles.sectionCardView}>
              <View style={{ flexDirection: 'row', height: 100 }} >
                <Image style={{ alignItems: 'stretch', width: 100, borderRadius:10 }} source={{uri: path}}></Image>
              </View>
              <View style={styles.sectionDesc} >             
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{`${dataBlock.BLOCK_NAME}/${statusBlok}/${estName}`}</Text>
                <Text style={{ fontSize: 12, marginTop: 8 }}>{`TPH ${data.NO_TPH}`}</Text>
                <Text style={{ fontSize: 12, marginTop: 5 }}>{ebccDate}</Text>
                <Text style={{ fontSize: 12, color: colorStatus, marginTop: 15, fontStyle: 'italic' }}>{status}</Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
    );    
  }  

  getColor(param){
    switch(param){
      case 'A':
        return Colors.brand;
      case 'B':
        return '#feb236';
      case 'C':
        return '#ff7b25';
      case 'F':
        return 'red';
      case 'string':
        return '#C8C8C8'
      default:
        return '#C8C8C8';
    }
  }

  actionButtonClick(data) {  
    this.props.navigation.navigate('DetailEbcc', {data: data})    
  }

  _renderNoData() {
    return (
      <Image style={{justifyContent: 'center', alignSelf:'center', marginTop: 120, width:300, height: 220}}source={require('../../Images/img-no-data.png')} />
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
    if(this.state.data.length > 0){
      show = this._renderData()
    } else{
      show = this._renderNoData()
    }
    return (  
      <View style={{flex: 1}}>
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
    padding:7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
});