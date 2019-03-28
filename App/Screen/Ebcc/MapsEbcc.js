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
import R from 'ramda';

const skm = require('../../Data/4421.json');
const LATITUDE = -2.1890660;
const LONGITUDE = 111.3609873;
const { width, height } = Dimensions.get('window');
const alfabet = ['A','B','C','D','E','F'];

class MapsEbcc extends React.Component {

  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let statusScan = R.clone(params.statusScan)
    let reason = R.clone(params.reason)

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
        statusScan,
        reason,
        title: 'Sabar Ya..',
        message: 'Sedang mencari lokasi kamu nih.',        
        icon: ''
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

  totalPolygons(){
    return skm.data.polygons.length;
  }

  getMapsAround(afdCode){
    let pos = alfabet.indexOf(afdCode)
    let posBeforeAfdNow = pos-1;
    let posAfterAfdNow = pos+1;
  }

  getPolygons(position){
    let data = skm.data.polygons;
    let poligons = [];
    let index = 0;
    for(var i=0; i<data.length; i++){
        let coords = data[i];
        if(geolib.isPointInside(position, coords.coords)){
            this.state.poligons.push(coords)
            poligons.push(coords)
            index = i;
            break;
        }
    } 
    //ambil map jika posisi index kurang dari 4
    if(index < 4){
      for(var j=0; j<index; j++){
        let coords = data[j];
        this.state.poligons.push(coords)
        poligons.push(coords)
      }
    } 

    
    if(index > 0){
      //ambil map setelah index
      let lebih = this.totalPolygons()-index
      if(lebih > 4){
        for(var j=1; j<4; j++){
          let coords = data[index+j];
          this.state.poligons.push(coords)
          poligons.push(coords)
        }
        for(var j=1; j<4; j++){
          let coords = data[index-j];
          this.state.poligons.push(coords)
          poligons.push(coords)
        }
      }else if(lebih > 0 && lebih < 4){
        for(var j=0; j<lebih; j++){
          let coords = data[j];
          this.state.poligons.push(coords)
          poligons.push(coords)
        }
      }
    }    
    return poligons;
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
            position = {
              latitude: lat, longitude: lon
            }
            let poligons = this.getPolygons(position);
            this.map.animateToCoordinate(region, 1);
            this.setState({latitude:lat, longitude:lon, fetchLocation: false, region, poligons});
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

  onClickBlok(werkAfdBlockCode){
    if(this.isOnBlok(werkAfdBlockCode)){
      this.navigateScreen('ManualInputTPH', poly.werks_afd_block_code)
    }else{
      alert('km ga boleh salah pilih blok')
    }
    // this.props.navigation.navigate('BuatInspeksi', {werkAfdBlockCode: werkAfdBlockCode, latitude: this.state.latitude, longitude: this.state.longitude});
  }

  isOnBlok(werkAfdBlockCode){
    let data = skm.data.polygons;
    let position = {
      latitude: this.state.latitude, longitude: this.state.longitude
    }
    for(var i=0; i<data.length; i++){
        let coords = data[i];
        if(geolib.isPointInside(position, coords.coords)){
            if(werkAfdBlockCode == coords.werks_afd_block_code){
              return true
            }
        }
    } 
    return false;
  }
  
  navigateScreen(screenName, werkAfdBlockCode) {
    const navigation = this.props.navigation;
    const resetAction = StackActions.reset({
    index: 0,            
      actions: [NavigationActions.navigate({ routeName: screenName, params : { 
          werkAfdBlockCode : werkAfdBlockCode,
          statusScan: this.state.statusScan,
          reason: this.state.reason,
          latitude: this.state.latitude,
          longitude: this.state.longitude
        } 
      })]
    });
    navigation.dispatch(resetAction);
  }

  onMapReady(){
    //lakukan aoa yg mau dilakukan disini setelah map selesai
    this.setState({fetchLocation: false});
  }

  setMyLocation = event => {
    const myLocation = event.nativeEvent.coordinate;
    let region = {
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      latitudeDelta:0.0075,
      longitudeDelta:0.00721
    } 
    if (myLocation.latitude && myLocation.longitude) {
      // this.map.animateToCoordinate(region, 1)
      this.setState({latitude: myLocation.latitude,longitude: myLocation.longitude, region})
      this.map.animateToRegion({
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta
      });
    }
  };

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
          followsUserLocation={false}
          scrollEnabled={false}
          zoomEnabled={true}
          onMapReady={()=>this.onMapReady()}
          // onUserLocationChange={this.setMyLocation}
          >
          {/* {skm.data.polygons.map((poly, index) => ( */}
           {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
            <View key={index}>
              <Polygon
                coordinates={poly.coords}
                fillColor="rgba(0, 200, 0, 0.5)"
                strokeColor="rgba(0,0,0,0.5)"
                strokeWidth={2}
                tappable={true}
                onPress={()=>this.navigateScreen('ManualInputTPH', poly.werks_afd_block_code)}                
                // onPress={()=>this.onClickBlok(poly.werks_afd_block_code)}
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

MapsEbcc.propTypes = {
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

export default MapsEbcc;
