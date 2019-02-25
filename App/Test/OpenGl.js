import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

const progressListener = (offlineRegion, status) => console.log(offlineRegion, status);
const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);

Mapbox.setAccessToken('pk.eyJ1IjoiYWtiYXJtYXVsYW40IiwiYSI6ImNqczJxNDVrNDA5MGQ0YXQ5YzJ6NGU1eWMifQ.vLUp5IZWVaaxaxq4EOGSHg');

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        latitude: 0.0,
        longitude: 0.0,
        center: null,
    }
  }

  componentDidMount(){
      this.getLocation()
  }

  getCenter(){
      return center = {
          latitude: this.state.latitude,
          longitude: this.state.longitude
      }
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);
            this.setState({latitude:lat, longitude:lon, fetchLocation: false});              
        },
        (error) => {
            let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
            if (error && error.message == "No location provider available.") {
                message = "Mohon nyalakan GPS anda terlebih dahulu.";
            }
            alert('Informasi', message);
            // console.log(message);
        }, // go here if error while fetch location
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    );
}

  renderAnnotations () {
    return (
      <Mapbox.PointAnnotation
        key='pointAnnotation'
        id='pointAnnotation'
        coordinate={[this.state.latitude, this.state.longitude]}>

        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <Mapbox.Callout title='Look! An annotation!' />
      </Mapbox.PointAnnotation>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.latitude !== 0.0 && this.state.longitude !== 0.0 &&
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}            
            zoomLevel={15}
            centerCoordinate={[this.state.latitude, this.state.longitude]}
            style={styles.container}            
            showUserLocation={true}
            >
            {this.renderAnnotations()}
        </Mapbox.MapView>}

        {/* <MapboxGL.offlineManager>

        </MapboxGL.offlineManager> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});