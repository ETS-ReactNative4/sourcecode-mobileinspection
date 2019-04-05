'use strict';
import React, { Component } from 'react'
import { AppState, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import R, { isEmpty } from 'ramda'
import {
  Container,
  Content
} from 'native-base'
import moment from 'moment'
import Colors from '../../Constant/Colors'
import Dash from 'react-native-dash'
import TaskServices from '../../Database/TaskServices'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/AntDesign'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import { dirPhotoTemuan } from '../../Lib/dirStorage';
import { NavigationActions, StackActions } from 'react-navigation';
// import layer from '../../Data/skm.json'

import MapView from 'react-native-maps';
import Geojson from 'react-native-geojson';

const alcatraz = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [-122.42305755615234, 37.82687023785448],
      }
    }
  ]
};

export default class PilihPeta extends Component {

  static navigationOptions = {
    headerStyle: {
        backgroundColor: Colors.tintColorPrimary
    },
    title: 'Peta Lokasi',
    headerTintColor: '#fff',
    headerTitleStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      arrMaps: [],
      regions: [],
      estateName: ''
    }

  }

  componentDidMount(){
      this.initData()
  }

  initData() {     
      let regions = TaskServices.getRegionName() 
      // let estateName = TaskServices.getEstateName()
      // this.setState({estateName})
      // for(var i=0; i<4; i++){
      //     this.state.arrMaps.push(i)
      // }
  }

  getEstateName(werks) {
    try {
        let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
        return data.EST_NAME;
    } catch (error) {
        return '';
    }
  }

  actionButtonClick() {
  }

  getColor(param) {
    switch (param) {
      case 'SELESAI':
        return 'rgba(35, 144, 35, 0.7)';
      case 'SEDANG DIPROSES':
        return 'rgba(254, 178, 54, 0.7)';
      case 'BARU':
        return 'rgba(255, 77, 77, 0.7)';
      default:
        return '#ff7b25';
    }
  }

  onClickItem(id) {
    var images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
    if (images !== undefined) {
      this.props.navigation.navigate('DetailFinding', { ID: id })
    }else{
      this.getImageBaseOnFindingCode(id)
      setTimeout(() => {
        this.props.navigation.navigate('DetailFinding', { ID: id })
      }, 3000);
    }    
  }

  renderMapsByRegion(regionCode, index){
    let data = TaskServices.findBy2('TM_REGION', 'REGION_CODE', regionCode);
    console.log(data)
    let comp = TaskServices.findBy('TM_COMP', 'REGION_CODE', regionCode);
    let est = [];
    if(comp !== undefined){
      comp.map(item =>{
        let arr = TaskServices.findBy2('TM_EST', 'COMP_CODE', item.COMP_CODE);
        est.push({WERKS: arr.WERKS, EST_NAME: arr.EST_NAME})
      })      
    }  
    return(
      <View style = {{marginTop: 15}} key = {index}>
        <Text style={{ fontSize: 14,  paddingHorizontal: 16 }}>
            {data !== undefined ? data.REGION_NAME : ''}
        </Text>
        <View style={{ marginTop: 16}}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {est.map((item, index) => this._renderItem(item, index))}
            </ScrollView >
          </View>
      </View>
    )
  }

  _renderItem = (item, index) => {
    // const nav = this.props.navigation;
    // const image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE)
    // var label = { backgroundColor: item.PROGRESS == '0' ? 'rgba(255, 0, 0, 0.7)' : 'rgba(254, 178, 54, 0.7)' };
    let showImage;
    // if (image == undefined) {
      showImage = <Image style={{ alignItems: 'stretch', height: 100, width: 150, borderRadius: 10 }} source={require('../../Images/forest.jpg')} />
    // } else {
    //   showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={{ uri: "file://" + image.IMAGE_PATH_LOCAL }} />
    // }
    return (
      < TouchableOpacity
        // onPress={() => { this.onClickItem(item.FINDING_CODE) }}
        style={{flex:1}}
        key={index}
      >
        <View style={{ height: 100, width: 150, marginLeft: 10 }}>
          {showImage}
          {/* <View style={[styles.labelBackground, {backgroundColor: 'rgba(254, 178, 54, 0.7)'}]}>
            <Icon name={'map-marker-alt'} color={'white'} size={12}
              style={{ marginRight: 5, marginTop: 1 }} />
            <Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{showBlockDetail}</Text>
          </View> */}

          <View style={[styles.bgBelumDownload, {backgroundColor: 'rgba(169,169,169,0.8)'}]}>
            <Icon2 name={'clouddownload'} color={'white'} size={20}
              style={{ justifyContent:'center', alignItems: 'center'}} />
            <Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{item.EST_NAME}</Text>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  render() {
    let data = TaskServices.getRegionCode()
    return (
      <Container style={{ flex: 1 }}>
        <Content style={styles.container} >
           <View style={[styles.containerLabel, {marginTop:15, marginBottom: 15}]}>
            <View style={{ flex: 2 }}>
                <Image source={require('../../Images/icon/ic_my_location.png')} style={[styles.icon, {marginLeft: 10}]} />
            </View>
            <View style={{ flex: 7 }}>
                <Text style={{ fontSize: 18, fontWeight: '400' }}>{this.state.estateName}</Text>
                <Text style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>Lokasimu saat ini</Text>
            </View>
          </View>
                    
          <View style={{ height: 1, backgroundColor: '#989898', marginBottom: 5, marginTop: 5 }} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Peta
          </Text>

          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          {/* <View style={{ marginTop: 16}}>
            <Text style={{ fontSize: 12,  paddingHorizontal: 16 }}>
              {TaskServices.getRegionName()}
            </Text>
            <ScrollView style = {{marginTop: 5}} contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.arrMaps.map((item, index) => this._renderItem(item, index))}
            </ScrollView >
          </View> */}
          {data !== null && data.map((item, index) => this.renderMapsByRegion(item, index))}

        </Content>
      </Container >

    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
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
    width: 150, padding: 5, position: 'absolute', bottom: 0,
    justifyContent: 'center', flex: 1, flexDirection: 'row'
  }, 
  bgBelumDownload: {
    flex: 1, position: 'absolute', top: 0,
    width: 150, height:100, padding: 5,
    borderRadius: 10,
    justifyContent: 'center',alignItems:'center'
  },
  
  containerLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  icon: {
    alignContent: 'flex-end',
    height: 45,
    width: 45,
    resizeMode: 'stretch',
    alignItems: 'center'
  },
});
