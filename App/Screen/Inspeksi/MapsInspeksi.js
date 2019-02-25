import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import MapView, { Polygon, ProviderPropType, Marker } from 'react-native-maps';
import Colors from '../../Constant/Colors'
import { NavigationActions, StackActions  } from 'react-navigation';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import ModalAlert from '../../Component/ModalLoading'
import ModalGps from '../../Component/ModalAlert';

const skm = require('../../Data/4421.json');
const ASPECT_RATIO = width / height;
const LATITUDE = -2.1890660;
const LONGITUDE = 111.3609873;
const LATITUDE_DELTA = 0.0922;
const { width, height } = Dimensions.get('window');

class MapsInspeksi extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        latitude: 0.0,
        longitude: 0.0, 
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta:0.0075,
          longitudeDelta:0.00721
        },
        poligons: [],
        fetchLocation: true,
        showModal: false,
        title: 'Sabar Ya..',
        message: 'Sedang mencari lokasi kamu nih.'
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: Colors.tintColorPrimary
      },
      title: 'Pilih Blok',
      headerTintColor: '#fff',
      headerTitleStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
      },
      
    headerRight: (
          <TouchableOpacity style= {{marginRight: 20}} onPress={()=>{params.searchLocation()}}>
              <IconLoc style={{marginLeft: 12}} name={'location-arrow'} size={24} color={'white'} />
          </TouchableOpacity>
      )
    };
  }

  componentDidMount(){
    this.props.navigation.setParams({ searchLocation: this.searchLocation })
    this.getLocation()
  }

  searchLocation =() =>{
    this.setState({fetchLocation: true})
    setTimeout(() => {
      this.setState({fetchLocation: false});
    }, 5000);
    this.getLocation();
  }  

  getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);  
            region = {
              latitude: lat,
              longitude: lon,
              latitudeDelta:0.0075,
              longitudeDelta:0.00721
            } 
            this.map.animateToCoordinate(region, 1);
            this.setState({latitude:lat, longitude:lon, fetchLocation: false, region});
        },
        (error) => {
            let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
            if (error && error.message == "No location provider available.") {
                message = "Mohon nyalakan GPS anda terlebih dahulu.";
            }
            this.setState({ fetchLocation: false, showModal: true, title: 'Informasi', message: message, icon: require('../../Images/ic-no-gps.png') });
        }, // go here if error while fetch location
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    );
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

  randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onClickBlok(blockCode){
    this.props.navigation.navigate('BuatInspeksi', {block: blockCode});
  }

  navigateScreen(screenName, blockCode) {
    const navigation = this.props.navigation;
    const resetAction = StackActions.reset({
    index: 0,            
    actions: [NavigationActions.navigate({ routeName: screenName, params : { 
          block : blockCode
        } 
      })]
    });
    navigation.dispatch(resetAction);
  }

  onMapReady(){
    //lakukan aoa yg mau dilakukan disini setelah map selesai
    this.setState({fetchLocation: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor={Colors.tintColorPrimary}
        />

        <ModalAlert
          visible={this.state.fetchLocation}
          title={this.state.title}
          message={this.state.message} />

        <ModalGps
          icon={this.state.icon}
          visible={this.state.showModal}
          onPressCancel={() => this.setState({ showModal: false })}
          title={this.state.title}
          message={this.state.message} />

        <MapView
          ref={ map =>  this.map = map }
          provider={this.props.provider}
          style={styles.map}
          showsUserLocation = {true}
          showsMyLocationButton = {true}
          showsCompass = {true}
          showScale = {true}
          showsIndoors = {true}
          initialRegion={this.state.region}
          zoomEnabled={false}
          followsUserLocation={true}
          scrollEnabled={false}
          onMapReady={()=>this.onMapReady()}
          >
          {skm.data.polygons.map((poly, index) => (
            <View key={index}>
              <Polygon
                coordinates={poly.coords}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeColor="rgba(0,0,0,0.5)"
                strokeWidth={2}
                tappable={true}
                onPress={()=>this.navigateScreen('BuatInspeksi', poly.blokcode)}                
                // onPress={()=>this.onClickBlok(poly.blokcode)}
              />
              <Marker
                ref={ref => poly.marker = ref}
                coordinate={this.centerCoordinate(poly.coords)}>
                <View style={{flexDirection: 'column',alignSelf: 'flex-start'}}>
                  <View style={styles.marker}>
                    <Text style={{color: '#000000', fontSize: 20}}>{poly.blokname}</Text>
                  </View>
                </View>
              </Marker>
            </View>
          ))}
           
        <Marker
            coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            }}
            centerOffset={{ x: -42, y: -60 }}
            anchor={{ x: 0.84, y: 1 }}
        >
        </Marker>  
        
        </MapView>
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
    // backgroundColor: '#FF5A5F',
    padding: 5,
    // borderRadius: 3,
    // borderColor: '#D23F44',
    // borderWidth: 0.5
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
