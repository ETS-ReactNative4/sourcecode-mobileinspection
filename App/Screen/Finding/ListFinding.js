'use strict';
import React, { Component } from 'react'
import { AppState, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import R, { isEmpty } from 'ramda'
import {
  Container,
  Content
} from 'native-base'
import moment from 'moment'
import ActionButton from 'react-native-action-button'
import Colors from '../../Constant/Colors'
import Dash from 'react-native-dash'
import TaskServices from '../../Database/TaskServices'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
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

export default class ListFinding extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataLewat: [],
      data7Hari: [],
      dataMore7Hari: [],
      dataNoDate: [],
      dataSelesai:[],
      refreshing: false
    }

  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this._initData()
    }
  )

  componentWillMount() {
  }

  componentWillUnmount() {
    this.willFocus.remove()
  }

  _initData() {

    const login = TaskServices.getAllData('TR_LOGIN');
    const user_auth = login[0].USER_AUTH_CODE;

    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}"`);

    var dataLewat = []
    var data7Hari = []
    var dataMore7Hari = []
    var dataNoDate = []

    var now = moment(new Date())

    data.map(item => {
      if (isEmpty(item.DUE_DATE)) {
        dataNoDate.push(item)
      } else {
        let dueDate = item.DUE_DATE;
        if (dueDate.includes(' ')) {
          dueDate = dueDate.substring(0, dueDate.indexOf(' '))
        }
        var diff = moment(new Date(dueDate)).diff(now, 'day');
        if (diff < 0) {
          dataLewat.push(item)
        } else if (diff < 7) {
          data7Hari.push(item)
        } else {
          dataMore7Hari.push(item)
        }
      }
    })

    var dataSelesai = TaskServices.query('TR_FINDING', `PROGRESS = 100 AND ASSIGN_TO = "${user_auth}"`);

    this.setState({ dataLewat, data7Hari, dataMore7Hari, dataNoDate, dataSelesai })
  }

  actionButtonClick() {
    this.props.navigation.navigate('FindingFormNavigator')
    // this.props.navigation.navigate('FormStep1')
    // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BuatInspeksi'}));
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
            // alert(`Image ${findingCode} kosong`);
            console.log(`Image ${findingCode} kosong`);
          }
        } else {
          // alert(`gagal download image untuk ${findingCode}`)
          console.log(`Image ${findingCode} kosong`);
        }


      }).catch((error) => {
        console.error(error);
        // alert(error);
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
        // alert(error);
        console.log(error);
      });
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

  _renderItem = (item, index) => {
    const nav = this.props.navigation;
    const image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE)
    var label = { backgroundColor: item.PROGRESS == '0' ? 'rgba(255, 0, 0, 0.7)' : 'rgba(254, 178, 54, 0.7)' };
    let showImage;
    if (image == undefined) {
      showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={require('../../Images/ic-default-thumbnail.png')} />
    } else {
      showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={{ uri: "file://" + image.IMAGE_PATH_LOCAL }} />
    }
    let showBlockDetail = `${this.getEstateName(item.WERKS)}-${this.getBlokName(item.BLOCK_CODE)}`
    return (
      < TouchableOpacity
        onPress={() => { this.onClickItem(item.FINDING_CODE) }}
        key={index}
      >
        <View style={{ height: 120, width: 120, marginLeft: 16 }}>
          {showImage}
          <View style={[styles.labelBackground, label]}>
            <Icon name={'map-marker-alt'} color={'white'} size={12}
              style={{ marginRight: 5, marginTop: 1 }} />
            <Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{showBlockDetail}</Text>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Content style={styles.container} >
          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Belum Ada Batas Waktu
          </Text>

          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          <View style={{ marginTop: 16, height: 120 }}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.dataNoDate.map((item, index) => this._renderItem(item, index))}
            </ScrollView >
          </View>

          <View style={styles.devider} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Lewat batas waktu
          </Text>
          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          <View style={{ marginTop: 16, height: 120 }}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.dataLewat.map(this._renderItem)}
            </ScrollView >
          </View>

          <View style={styles.devider} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Batas waktu dalam 7 hari
          </Text>
          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          <View style={{ marginTop: 16, height: 120 }}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.data7Hari.map(this._renderItem)}
            </ScrollView >
          </View>

          <View style={styles.devider} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Batas waktu >7 hari
          </Text>

          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          <View style={{ marginTop: 16, height: 120, marginBottom: 32 }}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.dataMore7Hari.map(this._renderItem)}
            </ScrollView >
          </View>

          {/* list done */}
          <View style={styles.devider} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16 }}>
            Selesai
          </Text>

          <Dash
            dashColor={'#ccc'}
            dashThickness={1}
            dashGap={5}
            style={{
              height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
            }} />

          <View style={{ marginTop: 16, height: 120, marginBottom: 32 }}>
            <ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
              {this.state.dataSelesai.map(this._renderItem)}
            </ScrollView >
          </View>

        </Content>

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { this.actionButtonClick() }}
          icon={<Icon2 color='white' name='add' size={25} />}>
        </ActionButton>
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
    width: 120, padding: 5, position: 'absolute', bottom: 0,
    justifyContent: 'center', flex: 1, flexDirection: 'row'
  }
});
