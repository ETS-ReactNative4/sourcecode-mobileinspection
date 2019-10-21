import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker, Polygon, ProviderPropType } from 'react-native-maps';
import Colors from '../../Constant/Colors'
import { NavigationActions, StackActions } from 'react-navigation';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import ModalAlert from '../../Component/ModalLoading';
import ModalGps from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import R from 'ramda';
import { AlertContent } from '../../Themes'
import { retrieveData } from '../../Database/Resources';

let polyMap = false;// = require('../../Data/MegaKuningan.json');
let LATITUDE = -2.1890660;
let LONGITUDE = 111.3609873;
const { width, height } = Dimensions.get('window');
const alfabet = ['A', 'B', 'C', 'D', 'E', 'F'];

class MapsEbcc extends React.Component {

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        let statusScan = R.clone(params.statusScan)
        let reason = R.clone(params.reason)

        this.loadMap();
        this.state = {
            latitude: 0.0,
            longitude: 0.0,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.00721
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
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { params.searchLocation() }}>
                    <IconLoc style={{ marginLeft: 12 }} name={'location-arrow'} size={24} color={'white'} />
                </TouchableOpacity>
            )
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({ searchLocation: this.searchLocation })
        this.getLocation()
    }

    searchLocation = () => {
        this.detectFakeGPS()
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
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }

            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    validateType(type) {
        retrieveData('typeApp').then(data => {
            if (data != null) {
                if (data == 'PROD') {
                    this.setState(AlertContent.mock_location)
                } else {
                    this.getLocation();
                }
            } else {
                this.getLocation();
            }
        })
    }

    totalPolygons() {
        if (!polyMap) {
            this.setState(AlertContent.no_data_map);
            return 0;
        }
        return polyMap.data.polygons.length;
    }
    loadMap() {
        let user = TaskServices.getAllData('TR_LOGIN')[0];
        if (user.CURR_WERKS) {
            let est = TaskServices.findBy('TM_EST', 'WERKS', user.CURR_WERKS);
            if (est && est.length > 0 && est[0].LONGITUDE != 0 && est[0].LATITUDE != 0) {
                LATITUDE = est[0].LATITUDE;
                LONGITUDE = est[0].LONGITUDE;
            }
            let polygons = TaskServices.findBy('TR_POLYGON', 'WERKS', user.CURR_WERKS);
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
                this.setState(AlertContent.no_data_map);
            }
        }
        else {
            //belum pilih lokasi
            this.setState(AlertContent.no_location);
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

    getMapsAround(afdCode) {
        let pos = alfabet.indexOf(afdCode)
        let posBeforeAfdNow = pos - 1;
        let posAfterAfdNow = pos + 1;
    }

    getPolygons(position) {
        if (!polyMap) {
            this.setState(AlertContent.no_data_map);
            return;
        }
        let data = polyMap.data.polygons;
        let poligons = [];
        let index = 0;
        for (var i = 0; i < data.length; i++) {
            let coords = data[i];
            if (geolib.isPointInside(position, coords.coords)) {
                this.state.poligons.push(coords)
                poligons.push(coords)
                index = i;
                break;
            }
        }
        //ambil map jika posisi index kurang dari 4
        if (index < 2) {
            for (var j = 0; j < index; j++) {
                let coords = data[j];
                this.state.poligons.push(coords)
                poligons.push(coords)
            }
        }


        if (index > 0) {
            //ambil map setelah index
            let lebih = this.totalPolygons() - index
            if (lebih > 2) {
                for (var j = 1; j < 2; j++) {
                    let coords = data[index + j];
                    this.state.poligons.push(coords)
                    poligons.push(coords)
                }
                for (var j = 1; j < 2; j++) {
                    let coords = data[index - j];
                    this.state.poligons.push(coords)
                    poligons.push(coords)
                }
            } else if (lebih > 0 && lebih < 2) {
                for (var j = 0; j < lebih; j++) {
                    let coords = data[j];
                    this.state.poligons.push(coords)
                    poligons.push(coords)
                }
            }
        }
        return poligons;
    }

    getLocation() {
        if (this.state.latitude && this.state.longitude) {
            let poligons = this.getPolygons({
              latitude: this.state.latitude,
              longitude: this.state.longitude
            });
            if (poligons != undefined) {
                this.setState({ fetchLocation: false, poligons });
            } else {
                this.setState(AlertContent.no_data_map)
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

    navigateScreen(screenName, werkAfdBlockCode) {
        if (this.refRoleAuth(werkAfdBlockCode)) {
            const navigation = this.props.navigation;
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: screenName, params: {
                        werkAfdBlockCode: werkAfdBlockCode,
                        statusScan: this.state.statusScan,
                        reason: this.state.reason,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    }
                })]
            });
            navigation.dispatch(resetAction);
        }
        else {
            this.setState({
                showModal: true,
                title: "Bukan Wilayah Otorisasimu",
                message: "Kamu tidak bisa sampling EBCC di wilayah ini",
                icon: require('../../Images/ic-blm-input-lokasi.png')
            });
        }
    }

    refRoleAuth(BA_CODE) {
        let loginData = TaskServices.getAllData('TR_LOGIN')[0];
        let userRefCode = loginData.REFFERENCE_ROLE;
        let locationCode = loginData.LOCATION_CODE.split(',');

        let auth = false;
        switch (userRefCode) {
            case 'AFD_CODE':
                locationCode.map((data) => {
                    if (data === BA_CODE.slice(0, BA_CODE.length - 3)) {
                        auth = true;
                    }
                });
                return auth;
            case 'BA_CODE':
                console.log(BA_CODE, BA_CODE.slice(0, 4));
                locationCode.map((data) => {
                    if (data.includes(BA_CODE.slice(0, 4))) {
                        auth = true;
                    }
                });
                return auth;
            case 'COMP_CODE':
                locationCode.map((data) => {
                    if (data.slice(0, 2) === BA_CODE.slice(0, 2)) {
                        auth = true;
                    }
                });
                return auth;
            case 'REGION_CODE':
                let trEst = TaskServices.findBy2('TM_EST', 'WERKS', BA_CODE.slice(0, 4));
                if (trEst !== undefined) {
                    locationCode.map((data) => {
                        if (data === trEst.REGION_CODE) {
                            auth = true;
                        }
                    })
                }
                return auth;
            case 'NATIONAL':
                return true;
            default:
                auth = false
        }
        return auth
    }

    onMapReady() {
        //lakukan aoa yg mau dilakukan disini setelah map selesai
        this.setState({ fetchLocation: false });
    }

    setMyLocation = event => {
        const myLocation = event.nativeEvent.coordinate;
        let region = {
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
            latitudeDelta: 0.0075,
            longitudeDelta: 0.00721
        }
        if (myLocation.latitude && myLocation.longitude) {
            this.setState({ latitude: myLocation.latitude, longitude: myLocation.longitude, region })
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
                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    title={this.state.title}
                    message={this.state.message} />
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
                    ref={map => this.map = map}
                    provider={this.props.provider}
                    style={styles.map}
                    mapType={"satellite"}
                    showsUserLocation={true}
                    // showsMyLocationButton={true}
                    showsCompass={true}
                    showScale={true}
                    showsIndoors={true}
                    initialRegion={this.state.region}
                    followsUserLocation={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    onUserLocationChange={event => {
                        let lat = event.nativeEvent.coordinate.latitude;
                        let lon = event.nativeEvent.coordinate.longitude;
                        this.setState({
                            latitude: lat, longitude: lon, region: {
                                latitude: lat,
                                longitude: lon,
                                latitudeDelta: 0.0075,
                                longitudeDelta: 0.00721
                            }
                        }, ()=>{this.map.animateToRegion(this.state.region, 1)});
                    }}
                    onMapReady={() => this.onMapReady()}
                >
                    {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
                        <View key={index}>
                            <Polygon
                                coordinates={poly.coords}
                                fillColor="rgba(0, 200, 0, 0.5)"
                                strokeColor="rgba(0,0,0,0.5)"
                                strokeWidth={2}
                                tappable={true}
                                onPress={() => this.navigateScreen('ManualInputTPH', poly.werks_afd_block_code)}
                            />
                            <Marker
                                ref={ref => poly.marker = ref}
                                coordinate={this.centerCoordinate(poly.coords)}>
                                <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                                    <View style={styles.marker}>
                                        <Text style={{ color: '#000000', fontSize: 20 }}>{poly.blokname}</Text>
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
                        <View style={{
                            flexDirection: "row",
                            alignItems:"center"
                        }}>
                            <Text style={{color:"white"}}>
                                Latitude : {this.state.region.latitude}
                            </Text>
                        </View>
                        <View>
                            <Text style={{color:"white"}}>
                                Longitude : {this.state.region.longitude}
                            </Text>
                        </View>
                    </View>
                </View>
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
