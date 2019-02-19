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
const { width, height } = Dimensions.get('window');
import Colors from '../../Constant/Colors'
const ASPECT_RATIO = width / height;
const LATITUDE = -2.1890660;
const LONGITUDE = 111.3609873;
const LATITUDE_DELTA = 0.0922;
const skm = require('../../Data/skm2.json');
import { NavigationActions, StackActions  } from 'react-navigation';
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconLoc from 'react-native-vector-icons/FontAwesome5';

class MapsInspeksi extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        latitude: 0.0,
        longitude: 0.0, 
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta:0.0015,
          longitudeDelta:0.00121
        } 
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
              latitudeDelta:0.0015,
              longitudeDelta:0.00121
            } 
            this.map.animateToCoordinate(region, 1);
            this.setState({latitude:lat, longitude:lon, fetchLocation: false, region});
        },
        (error) => {
            let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
            if (error && error.message == "No location provider available.") {
                message = "Mohon nyalakan GPS anda terlebih dahulu.";
            }
            alert('Informasi', message);
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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
            hidden={true}
            barStyle="light-content"
        />
        <MapView
          ref={ map =>  this.map = map }
          provider={this.props.provider}
          style={styles.map}
          showsUserLocation = {true}
          zoomEnabled = {true}
          showsMyLocationButton = {true}
          showsCompass = {true}
          showScale = {true}
          showsIndoors = {true}
          initialRegion={this.state.region}
          // initialRegion={{
          //   latitude: LATITUDE,
          //   longitude: LONGITUDE,
          //   latitudeDelta:0.0015,
          //   longitudeDelta:0.00121
          // }}
          >
          {skm.data.polygons.map((poly, index) => (
            <View key={index}>
              <Polygon
                coordinates={poly.coords}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeColor="rgba(0,0,0,0.5)"
                strokeWidth={2}
                tappable={true}
                // onPress={()=>this.navigateScreen('BuatInspeksi', poly.blokcode)}                
                onPress={()=>this.onClickBlok(poly.blokcode)}
              />
              <Marker
                ref={ref => poly.marker = ref}
                coordinate={this.centerCoordinate(poly.coords)}>
                <View style={{flexDirection: 'column',alignSelf: 'flex-start'}}>
                  <View style={styles.marker}>
                    <Text style={{color: '#000000', fontSize: 13}}>{poly.blokname}</Text>
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

        {<ProgressDialog
            visible={this.state.fetchLocation}
            activityIndicatorSize="large"
            message="Mencari Lokasi..."
        />}
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
