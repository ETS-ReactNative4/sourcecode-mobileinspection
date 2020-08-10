import React from 'react';
import {
  BackHandler,
  NativeEventEmitter,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import MapView, { Marker, Polygon, ProviderPropType, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import Colors from '../../Constant/Colors'
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import ModalLoading from '../../Component/ModalLoading'
import ModalAlert from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import * as geolib from 'geolib';
import { AlertContent } from '../../Themes';
import { retrieveData } from '../../Database/Resources';

let LATITUDE = -2.1890660;
let LONGITUDE = 111.3609873;
let polyMap = false;

class MapsInspeksi extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.loadMap();
    this.state = {
      gpsAccuracy: 0,
      latitude: 0.0,
      longitude: 0.0,
      nativeGPS: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        satelliteCount: 0,
      },
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0.0075,
        longitudeDelta: 0.00721
      },
      poligons: [],
      fetchLocation: true,
      title: 'Sabar Ya..',
      message: 'Sedang mencari lokasi kamu nih.',
      icon: '',
      modalAlert: {
        showModal: false,
        title: "",
        message: "",
        icon: null
      },
      modalLoading: {
        showModal: true,
        title: "Sabar Ya..",
        message: "Sedang mencari lokasi kamu nih"
      },
      modalGps: {
        showModal: false,
        title: 'Gps tidak di temukan',
        message: 'Signal gps tidak di temukan, coba lagi!',
        icon: require('../../Images/ic-no-gps.png')
      },
      markerLatlong: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: Colors.tintColor
      },
      title: 'Pilih Blok',
      headerTintColor: '#fff',
      headerTitleStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
      },
      headerRight: (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { params.searchLocation() }}>
          <IconLoc style={{ marginLeft: 12 }} name={'location-arrow'} size={24} color={'white'} />
        </TouchableOpacity>
      )
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.props.navigation.setParams({ searchLocation: this.searchLocation });
  }

  nativeGps() {
    const eventEmitter = new NativeEventEmitter(NativeModules.Satellite);
    eventEmitter.addListener('getSatellite', (event) => {
      this.setState({
        nativeGPS: {
          longitude: event.longitude,
          latitude: event.latitude,
          accuracy: event.accuracy,
          satelliteCount: Math.floor(event.satelliteCount)
        }
      })
    });
    NativeModules.Satellite.getCoors();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  searchLocation = () => {
    if (this.state.longitude !== 0.0 || this.state.latitude !== 0.0) {
      this.setState({ modalLoading: { ...this.state.modalLoading, showModal: true } });
      this.map.animateToRegion(this.state.region, 1);
      this.detectFakeGPS()
    }
    else {
      this.setState({
        modalGps: {
          ...this.state.modalGps,
          showModal: true
        }
      })
    }
  };

  loadMap() {
    let user = TaskServices.getAllData('TR_LOGIN')[0];
    if (user.CURR_WERKS) {
      let est = TaskServices.findBy('TM_EST', 'WERKS', user.CURR_WERKS);
      if (est && est.length > 0 && est[0].LONGITUDE != 0 && est[0].LATITUDE != 0) {
        LATITUDE = est[0].LATITUDE;
        LONGITUDE = est[0].LONGITUDE;
      }
      let polygons = TaskServices.findBy('TR_POLYGON', 'WERKS', user.CURR_WERKS);
      // console.log('Poligons from DB : ', polygons)
      polygons = this.convertGeoJson(polygons);
      if (polygons && polygons.length > 0) {
        let mapData = {
          "data": {
            "polygons": polygons
          }
        }
        polyMap = mapData;
      }
      else {
        //belum download map
        this.setState({
          modalLoading: { ...this.state.modalLoading, showModal: false },
          modalAlert: { ...AlertContent.no_data_map }
        })
      }
    }
    else {
      //belum pilih lokasi
      this.setState({
        modalLoading: { ...this.state.modalLoading, showModal: false },
        modalAlert: { ...AlertContent.no_location }
      })
    }
  }

  convertGeoJson(raw) {
    let arrPoli = [];
    for (let x in raw) {
      let tempItem = raw[x];
      let tempArrCoords = [];
      for (let y in tempItem.coords) {
        tempArrCoords.push(tempItem.coords[y]);
      }
      tempItem = {
        ...tempItem,
        coords: tempArrCoords
      };
      arrPoli.push(tempItem);
    }
    return arrPoli;
  }

  getPolygons() {
    let poligons = [];
    if (!polyMap) {
      this.setState({
        modalLoading: { ...this.state.modalLoading, showModal: false },
        modalAlert: { ...AlertContent.no_data_map }
      })
      return poligons;
    }
    let data = polyMap.data.polygons;
    for (var i = 0; i < data.length; i++) {
      let coords = data[i];
      if (
        // geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude + 0.0001 }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude - 0.0001 }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude + 0.00001, longitude: this.state.longitude }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude - 0.00001, longitude: this.state.longitude }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude - 0.00001, longitude: this.state.longitude - 0.0001 }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude - 0.00001, longitude: this.state.longitude + 0.0001 }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude + 0.00001, longitude: this.state.longitude - 0.0001 }, coords.coords) ||
        // geolib.isPointInPolygon({ latitude: this.state.latitude + 0.00001, longitude: this.state.longitude + 0.0001 }, coords.coords) ||
        geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude }, coords.coords)
      ) {
        poligons.push(coords);
      }
      // poligons.push(coords);
    }
    return poligons;
  }

  getLocation() {
    if (this.state.latitude && this.state.longitude) {
      let poligons = this.getPolygons();
      if (poligons.length == 1) {
        this.setState({
          modalLoading: {
            ...this.state.modalLoading,
            showModal: false
          },
          poligons
        });
      } else if (poligons.length > 1) {

        const arrTemp = []
        arrTemp.push(poligons[0]);

        this.setState({
          modalLoading: {
            ...this.state.modalLoading,
            showModal: false
          },
          poligons: arrTemp
        });
      }
      else {
        this.setState({
          modalLoading: { ...this.state.modalLoading, showModal: false },
          modalAlert: { ...AlertContent.no_polygon }
        })
      }
    }
  }

  centerCoordinate(coordinates) {
    let x = coordinates.map(c => c.latitude)
    let y = coordinates.map(c => c.longitude)

    let minX = Math.min.apply(null, x)
    let maxX = Math.max.apply(null, x)

    let minY = Math.min.apply(null, y)
    let maxY = Math.max.apply(null, y)

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2
    }
  }

  onClickBlok(werkAfdBlockCode) {

    const polyCoords = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }

    const dataCallback = {
      werkAfdBlockCode,
      polyCoords
    }

    // console.log('dataCallback : ', dataCallback)

    this.props.navigation.state.params.changeBlok(dataCallback);
    this.props.navigation.goBack();
  }

  /* DETECT FAKE GPS */
  detectFakeGPS() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.mocked) {
          this.validateType(position.mocked)
        } else {
          this.getLocation();
        }
      },
      (error) => {
        this.setState({ modalLoading: { ...this.state.modalLoading, showModal: false } });
      }, // go here if error while fetch location
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    );
  }

  onMapReady() {
    this.nativeGps();
    this.setState({
      modalLoading: {
        ...this.state.modalLoading,
        showModal: false
      }
    })
  }

  validateType() {
    retrieveData('typeApp').then(data => {
      if (data != null) {
        if (data == 'PROD') {
          this.setState({
            modalLoading: { ...this.state.modalLoading, showModal: false },
            modalAlert: { ...AlertContent.mock_location }
          })
        } else {
          this.getLocation();
        }
      } else {
        this.getLocation();
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={true}
          barStyle="light-content"
        />

        <ModalLoading
          visible={this.state.modalLoading.showModal}
          title={this.state.modalLoading.title}
          message={this.state.modalLoading.message} />

        <ModalAlert
          icon={this.state.modalAlert.icon}
          visible={this.state.modalAlert.showModal}
          onPressCancel={() => this.setState({ modalAlert: { ...this.state.modalAlert, showModal: false } })}
          title={this.state.modalAlert.title}
          message={this.state.modalAlert.message} />

        <ModalAlert
          icon={this.state.modalGps.icon}
          visible={this.state.modalGps.showModal}
          onPressCancel={() => this.setState({ modalGps: { ...this.state.modalGps, showModal: false } })}
          title={this.state.modalGps.title}
          message={this.state.modalGps.message} />

        <MapView
          onPress={(event) => console.log('Map Click ', event.nativeEvent.coordinate)}
          ref={map => this.map = map}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={"satellite"}
          showsUserLocation={true}
          initialRegion={this.state.region}
          zoomEnabled={true}
          scrollEnabled={true}
          onUserLocationChange={event => {
            let lat = event.nativeEvent.coordinate.latitude;
            let lon = event.nativeEvent.coordinate.longitude;
            this.setState({
              gpsAccuracy: Math.ceil(event.nativeEvent.coordinate.accuracy),
              latitude: lat,
              longitude: lon,
              region: {
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.00721
              }
            });
          }}
          onMapReady={() => { this.onMapReady() }}
        >
          <Circle
            center={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
            fillColor="rgba(255, 255, 255, 0.3)"
            strokeColor="rgba(255, 255, 255, 1)"
            radius={this.state.gpsAccuracy}
          />
          {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
            <View key={index}>
              <Polygon
                coordinates={poly.coords}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeColor="rgba(255,255,255,1)"
                strokeWidth={3}
                tappable={true}
                onPress={() => this.onClickBlok(poly.werks_afd_block_code)}
              />
              <Marker
                ref={ref => poly.marker = ref}
                coordinate={this.centerCoordinate(poly.coords)}
                onPress={() => this.onClickBlok(poly.werks_afd_block_code)}
              >
                <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                  <View style={styles.marker}>
                    <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 25, fontWeight: '900' }}>{poly.blokname}</Text>
                  </View>
                </View>
              </Marker>
            </View>
          ))}

        </MapView>
        <View style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          alignItems: "flex-end",
          justifyContent: "flex-end"
        }}>
          <View style={{
            padding: 10,
            margin: 5,
            borderRadius: 5,
            backgroundColor: "rgba(0,0,0,0.3)"
          }}>
            <View style={{ alignSelf: "flex-end" }}>
              <Text style={{ color: "white" }}>
                Satellite : {this.state.nativeGPS.satelliteCount}
              </Text>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Text style={{ color: "white" }}>
                Accuracy : {this.state.gpsAccuracy} meter
                      </Text>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Text style={{ color: "white" }}>
                <Text>Latitude : </Text>
                <Text>{this.state.latitude.toFixed(6)}</Text>
              </Text>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <Text style={{ color: "white" }}>
                <Text>Longitude : </Text>
                <Text>{this.state.longitude.toFixed(6)}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

MapsInspeksi.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  marker: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 5
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default MapsInspeksi;
