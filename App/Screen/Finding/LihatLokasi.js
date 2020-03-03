import React from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MapView, {Marker, Polygon, PROVIDER_GOOGLE, ProviderPropType} from 'react-native-maps';
import Colors from '../../Constant/Colors'
import ModalAlert from '../../Component/ModalLoading'
import ModalGps from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import * as geolib from 'geolib';
import {retrieveData, storeData} from '../../Database/Resources';
import {AlertContent} from "../../Themes";
import IconLoc from "react-native-vector-icons/FontAwesome5";

let LATITUDE = -2.1890660;
let LONGITUDE = 111.3609873;
let polyMap = false;

class LihatLokasi extends React.Component {

    constructor(props) {
        super(props);

        const data = this.props.navigation.getParam('findingData');

        this.state = {
            findingData: data,
            currentLatitude: LATITUDE,
            currentLongitude: LONGITUDE,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: 0.0050,
                longitudeDelta: 0.00500
            },
            poligons: [],
            fetchLocation: true,
            showModal: false,
            title: 'Sabar Ya..',
            message: 'Sedang mencari lokasi kamu nih.',
            icon: '',
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.tintColor
            },
            title: 'Lokasi Temuan',
            headerTintColor: '#fff',
            headerTitleStyle: {
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            }
        };
    }

    loadMap() {
        let user = TaskServices.getAllData('TR_LOGIN')[0];
        if (this.state.findingData.WERKS) {
            // let est = TaskServices.findBy('TM_EST', 'WERKS', user.CURR_WERKS);
            let est = TaskServices.findBy('TM_EST', 'WERKS', this.state.findingData.WERKS);
            if (est && est.length > 0 && est[0].LONGITUDE != 0 && est[0].LATITUDE != 0) {
                LATITUDE = est[0].LATITUDE;
                LONGITUDE = est[0].LONGITUDE;
            }
            // let polygons = TaskServices.findBy('TR_POLYGON', 'WERKS', user.CURR_WERKS);
            let polygons = TaskServices.findBy('TR_POLYGON', 'WERKS', this.state.findingData.WERKS);
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
                    fetchLocation: false,
                    showModal: true,
                    title: 'Tidak ada data',
                    message: "Kamu belum download data map",
                    icon: require('../../Images/ic-blm-input-lokasi.png')
                });
            }
        }
        else {
            //belum pilih lokasi
            this.setState({
                fetchLocation: false,
                showModal: true,
                title: 'Tidak ada lokasi',
                message: "Kamu belum pilih lokasi kamu",
                icon: require('../../Images/ic-blm-input-lokasi.png')
            });
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
                modalLoading: {...this.state.modalLoading, showModal: false},
                modalAlert: {...AlertContent.no_data_map}
            })
            return poligons;
        }
        let data = polyMap.data.polygons;
        for (var i = 0; i < data.length; i++) {
            let coords = data[i];
            if(
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING, longitude: this.state.findingData.LONG_FINDING+0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING, longitude: this.state.findingData.LONG_FINDING-0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING+0.0025, longitude: this.state.findingData.LONG_FINDING }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING-0.0025, longitude: this.state.findingData.LONG_FINDING }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING-0.0025, longitude: this.state.findingData.LONG_FINDING-0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING-0.0025, longitude: this.state.findingData.LONG_FINDING+0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING+0.0025, longitude: this.state.findingData.LONG_FINDING-0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING+0.0025, longitude: this.state.findingData.LONG_FINDING+0.006 }, coords.coords) ||
                geolib.isPointInPolygon({ latitude: this.state.findingData.LAT_FINDING, longitude: this.state.findingData.LONG_FINDING }, coords.coords)
            ){
                poligons.push(coords);
            }
            // poligons.push(coords);
        }
        return poligons;
    }

    getLocation(){
        if (this.state.currentLatitude && this.state.currentLongitude) {
            let poligons = this.getPolygons();
            if(poligons.length > 0){
                this.setState({
                    modalLoading: {
                        ...this.state.modalLoading
                        , showModal: false
                    },
                    poligons
                },()=> {
                    this.map.animateToRegion({
                        latitude: parseFloat(this.state.findingData.LAT_FINDING),
                        longitude: parseFloat(this.state.findingData.LONG_FINDING),
                        latitudeDelta: 0.0050,
                        longitudeDelta: 0.0050
                    }, 1);
                });
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

    onMapReady() {
        this.map.animateToRegion({
            latitude: parseFloat(this.state.findingData.LAT_FINDING),
            longitude: parseFloat(this.state.findingData.LONG_FINDING),
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050
        }, 1);
        this.setState({ fetchLocation: false })
        this.loadMap();
        this.getLocation()
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
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
                            currentLatitude: lat,
                            currentLongitude: lon,
                            region: {
                                latitude: lat,
                                longitude: lon,
                                latitudeDelta: 0.0075,
                                longitudeDelta: 0.00721
                            }
                        });
                    }}
                    onMapReady={() => this.onMapReady()}
                >
                    {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
                        <View key={index}>
                            <Polygon
                                coordinates={poly.coords}
                                fillColor="rgba(0, 200, 0, 0.5)"
                                strokeColor="rgba(255,255,255,1)"
                                strokeWidth={3}
                                tappable={true}
                            />
                            <Marker
                                ref={ref => poly.marker = ref}
                                coordinate={this.centerCoordinate(poly.coords)}
                            >
                                <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                                    <View style={styles.marker}>
                                        <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 25, fontWeight:'900'}}>{poly.blokname}</Text>
                                    </View>
                                </View>
                            </Marker>
                        </View>
                    ))}

                    <Marker
                        coordinate={{
                            latitude: parseFloat(this.state.findingData.LAT_FINDING),
                            longitude: parseFloat(this.state.findingData.LONG_FINDING),
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

LihatLokasi.propTypes = {
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

export default LihatLokasi;
