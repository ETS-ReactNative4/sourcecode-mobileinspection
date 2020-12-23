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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalLoading from '../../Component/ModalLoading'
import ModalAlert from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import * as geolib from 'geolib';
import { AlertContent, Fonts } from '../../Themes';
import { retrieveData } from '../../Database/Resources';
import { Card } from 'native-base'
import { convertTimestampToDate } from '../../Lib/Utils';

let polyMap = false;

class RegisterTPH extends React.Component {
    constructor(props) {


        const location = props.navigation.getParam('location');

        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            gpsAccuracy: 0,
            latitude: 0.0,
            longitude: 0.0,
            nativeGPS: {
                latitude: 0.0,
                longitude: 0.0,
                accuracy: 0,
                satelliteCount: 0,
            },
            region: {
                latitude: 0.0,
                longitude: 0.0,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.0075
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
            markerLatlong: null,
            location: location,
            markers: [],
            tph: "-"
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.tintColor
            },
            title: 'Register TPH',
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

        this.searchLocation();

        this._setDataMarker();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.navigation.setParams({ searchLocation: this.searchLocation });
    }

    _setDataMarker = () => {
        const format = convertTimestampToDate(new Date(), "YYYY-MM-DD");

        let dataSorted = TaskServices.getAllData('TR_REGISTER_TPH').sorted('NO_TPH', true);
        let data = dataSorted.filtered(`INSERT_TIME CONTAINS[c] "${format}" AND BLOCK_CODE == "${this.state.location.block_code}"`);

        if (data.length > 0) {
            let arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    coordinates: {
                        latitude: parseFloat(data[i].LAT_TPH),
                        longitude: parseFloat(data[i].LON_TPH)
                    },
                    no_tph: data[i].NO_TPH
                });
                this.setState({ markers: arr })
            }
        } else {
            this.setState({ markers: [] })
        }

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

            console.log('Event : ', event)

            // const region = {
            //     longitude: event.longitude,
            //     latitude: event.latitude,
            //     latitudeDelta: 0.0075,
            //     longitudeDelta: 0.00721
            // }

            // this.setState({ region: region })
            // this.map.animateToRegion(region, 1);
            // this.setState({
            //     modalLoading: {
            //         ...this.state.modalLoading,
            //         showModal: false
            //     }
            // })
        });
        NativeModules.Satellite.getCoors();
    }

    searchLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)

            var initialRegion = {
                latitude: lat,
                longitude: long,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.0075,
            }

            this.setState({ region: initialRegion })
            this.map.animateToRegion(initialRegion, 1);
        },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: false, timeout: 20000 });

        this.setState({
            modalLoading: {
                ...this.state.modalLoading,
                showModal: false
            }
        })
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }


    onClickBlok(werkAfdBlockCode) {

        // const polyCoords = {
        //     latitude: this.state.latitude,
        //     longitude: this.state.longitude
        // }

        // const dataCallback = {
        //     werkAfdBlockCode,
        //     polyCoords
        // }

        // console.log('dataCallback : ', dataCallback)

        this.props.navigation.navigate('RegisterTPH')
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

    _scanTPH = (loc) => {
        this.props.navigation.navigate('ScanTPH', {
            location: {
                ...loc,
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude
            },
            _updateDataMarkers: this._updateDataMarkers
        });
    }

    _updateDataMarkers = data => {
        this.setState({
            tph: data
        })
        this._setDataMarker();
    }


    _goToListTPH() {
        this.props.navigation.navigate('ListTPH', {
            block_code: this.state.location.block_code
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={false}
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
                    initialRegion={this.state.region}
                    zoomEnabled={true}
                    showsUserLocation={false}
                    scrollEnabled={true}>

                    {this.state.markers.length > 0 && this.state.markers.map(marker => {
                        return (
                            <View style={{ height: 40, width: 40 }}>
                                <Marker
                                    coordinate={marker.coordinates}
                                    title={marker.no_tph} >
                                    <View style={styles.circle} />
                                </Marker>
                            </View>
                        )
                    })}

                    <Marker
                        coordinate={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude
                        }}
                        title="Lokasi Kamu" />
                </MapView>

                <View style={{ padding: 12, flex: 1 }}>
                    <Card style={{ width: '100%', height: 230, borderRadius: 10, flexDirection: 'row' }}>
                        <View style={{
                            paddingLeft: 20,
                            flex: 0.6,
                            justifyContent: 'center',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10
                        }}>
                            <Text style={{ fontFamily: Fonts.book, color: Colors.textSecondary, fontSize: 12 }}>
                                TPH
                            </Text>
                            <Text style={{ fontFamily: Fonts.bold, color: 'black', fontSize: 16 }}>
                                {this.state.tph}
                            </Text>

                            <Text style={{ fontFamily: Fonts.book, color: Colors.textSecondary, fontSize: 12 }}>
                                Location
                            </Text>
                            <Text style={{ fontFamily: Fonts.bold, color: 'black', fontSize: 16 }}>
                                {this.state.location.block_name + "/" + this.state.location.werks}
                            </Text>

                            <Text style={{ fontFamily: Fonts.book, color: Colors.textSecondary, fontSize: 12, marginTop: 6 }}>
                                Latitude
                            </Text>
                            <Text style={{ fontFamily: Fonts.bold, color: 'black', fontSize: 16 }}>
                                {this.state.region.latitude.toFixed(8)}
                            </Text>

                            <Text style={{ fontFamily: Fonts.book, color: Colors.textSecondary, fontSize: 12, marginTop: 6 }}>
                                Longitude
                            </Text>
                            <Text style={{ fontFamily: Fonts.bold, color: 'black', fontSize: 16 }}>
                                {this.state.region.longitude.toFixed(8)}
                            </Text>
                        </View>
                        <View style={{
                            flex: 0.4,
                            justifyContent: 'center',
                            alignItems: "center",
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10
                        }}>
                            <Card style={{ height: 120, width: 120, borderRadius: 20, backgroundColor: Colors.tintColorPrimary, elevation: 2, marginRight: 10 }}>
                                <TouchableOpacity onPress={() => this._scanTPH(this.state.location)} style={{ height: 120, width: 120, justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name={"qrcode-scan"} size={50} color={'white'} />
                                    <Text style={{ fontFamily: Fonts.demi, color: 'white', fontSize: 18, marginTop: 6 }}>
                                        SCAN </Text>
                                </TouchableOpacity>
                            </Card>
                        </View>
                    </Card>
                </View>


                <Card style={{ height: 54, borderRadius: 10, backgroundColor: Colors.tintColorPrimary, elevation: 2, position: 'absolute', bottom: 16, right: 12, left: 12 }}>
                    <TouchableOpacity onPress={() => this._goToListTPH()} style={{ width: '100%', height: 54, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Fonts.book, color: 'white', fontSize: 16 }}>LIHAT DAFTAR TPH</Text>
                    </TouchableOpacity>
                </Card>

            </View >
        );
    }
}

RegisterTPH.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        height: "40%",
        width: "100%"
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
    circle: {
        backgroundColor: Colors.tintColorPrimary,
        height: 16,
        width: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "white"
    }
});

export default RegisterTPH;
