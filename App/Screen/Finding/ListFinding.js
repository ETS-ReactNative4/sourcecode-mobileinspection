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
      refreshing: false
    }

  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this._initData()
    }
  )

  static navigationOptions = {
    headerStyle: {
      backgroundColor: Colors.tintColor
    },
    headerTitleStyle: {
      textAlign: "center",
      flex: 1,
      fontSize: 18,
      fontWeight: '400',
      marginHorizontal: 12
    },
    title: 'Temuan',
    headerTintColor: '#fff',
    headerRight: (
      <TouchableOpacity onPress={() => alert('Underconstruc')}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 12 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_inbox.png')} />
        </View>
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity onPress={() => alert('This is a button!')}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 12 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_sync.png')} />
        </View>
      </TouchableOpacity>
    )
  };

  _initData() {
    var data = TaskServices.query('TR_FINDING', 'PROGRESS < 100')
    var dataLewat = []
    var data7Hari = []
    var dataMore7Hari = []
    var dataNoDate = []

    var now = moment(new Date())

    data.map((item, i) => {
      if (isEmpty(item.DUE_DATE)) {
        dataNoDate.push(item)
      } else {
        var diff = moment(new Date(item.DUE_DATE)).diff(now, 'day');
        if (diff < 0) {
          dataLewat.push(item)
        } else if (diff < 7) {
          data7Hari.push(item)
        } else {
          dataMore7Hari.push(item)
        }
      }
    })

    this.setState({ dataLewat, data7Hari, dataMore7Hari, dataNoDate })
  }

  actionButtonClick() {
    this.props.navigation.navigate('FindingFormNavigator')
  }

  _renderItem = item => {
    const nav = this.props.navigation;
    const image = TaskServices.findBy2('TR_IMAGE_FINDING', 'TR_CODE', item.FINDING_CODE)
    var label = { backgroundColor: item.PROGRESS == '0' ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 255, 0, 0.7)' };
    return (
      < TouchableOpacity
        onPress={() => { nav.navigate('DetailFinding', { ID: item.FINDING_CODE }) }
        }
      >
        <View style={{ height: 120, width: 120, marginLeft: 16 }}>
          <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={{ uri: "file://" + image.IMAGE_PATH }} />

          <View style={[styles.labelBackground, label]}>
            <Icon name={'map-marker-alt'} color={'white'} size={14}
              style={{ marginRight: 5, marginTop: 1 }} />
            <Text style={{ fontSize: 12, color: 'white' }}>{item.BLOCK_CODE}</Text>
          </View>
        </View>
      </TouchableOpacity >
    )
  }


  componentWillMount() {

  }

  componentWillUnmount() {
    this.willFocus.remove()
  }

  render() {
    return (
      <Container style={{ flex: 1 }}>
        {/* <MapView
          region={{
            latitude: -2.20774997752764,
            longitude: 105.382951073678996,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09
          }} style={{ flex: 1 }}>
          <Geojson geojson={layer} />
        </MapView> */}

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
              {this.state.dataNoDate.map(this._renderItem)}
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

        </Content>

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { this.actionButtonClick() }}>
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
  }, devider: {
    marginBottom: 16, marginTop: 16, backgroundColor: '#ccc', height: 8
  }, labelBackground: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 120, padding: 5, position: 'absolute', bottom: 0,
    justifyContent: 'center', flex: 1, flexDirection: 'row'
  }
});
