import React from 'react';
import {StatusBar, StyleSheet, Text, Image, View} from 'react-native';

import MapView, {Marker, Polygon, PROVIDER_GOOGLE, ProviderPropType} from 'react-native-maps';
import Colors from '../../Constant/Colors'
import {NavigationActions, StackActions} from 'react-navigation';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import ModalLoading from '../../Component/ModalLoading'
import ModalAlert from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import {retrieveData} from '../../Database/Resources';
import {AlertContent} from '../../Themes';
import * as geolib from 'geolib';
import { HeaderWithButton } from "../../Component/Header/HeaderWithButton";

let polyMap = false;
let LATITUDE = -2.1890660;
let LONGITUDE = 111.3609873;

export default class Restan extends React.Component {

    constructor(props) {
        super(props);

        let user = TaskServices.getAllData('TR_LOGIN')[0];

        this.state = {
            userData: user,
            latitude: 0.0,
            longitude: 0.0,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: 0.0075,
                longitudeDelta: 0.00721
            },
            poligons: [],
            coordinateRestan: [
                {longitude: 112.3648889, latitude: -2.9640591},
                {longitude: 112.3748889, latitude: -2.9740591}
            ],
            inspectionType: props.navigation.getParam('inspectionType', 'normal'),
            modalAlert: {
                showModal: false,
                title: "",
                message: "",
                icon: null
            },
            modalLoading: {
                showModal: false,
                title: "Sabar Ya..",
                message: "Sedang mencari lokasi kamu nih"
            },
            modalGps: {
                showModal: false,
                title: 'Gps tidak di temukan',
                message: 'Signal gps tidak di temukan, coba lagi!',
                icon: require('../../Images/ic-no-gps.png')
            }
        };
    }

    static navigationOptions = () => ({
        header: null
    });

    // static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     return {
    //         headerStyle: {
    //             backgroundColor: Colors.tintColorPrimary
    //         },
    //         title: 'Pilih Blok',
    //         headerTintColor: '#fff',
    //         headerTitleStyle: {
    //             flex: 1,
    //             fontSize: 18,
    //             fontWeight: '400'
    //         },
    //
    //         headerRight: (
    //             <TouchableOpacity style={{ marginRight: 20 }} onPress={() => { params.searchLocation() }}>
    //                 <IconLoc style={{ marginLeft: 12 }} name={'location-arrow'} size={24} color={'white'} />
    //             </TouchableOpacity>
    //         )
    //     };
    // }

    componentDidMount() {
        this.loadMap();
    }

    /* DETECT FAKE GPS */
    detectFakeGPS() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.mocked) {
                    this.validateType()
                } else {
                    this.getLocation();
                }
            },
            (error) => {
                this.setState({ modalLoading: { ...this.state.modalLoading, showModal: false } });
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    onMapReady(){
        this.setState({
            modalLoading:{
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

    searchLocation(){
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
        if (user.USER_ROLE === "ASISTEN_LAPANGAN") {
            // let queryString = `afd_code='O' OR afd_code='P'`;
            let queryString = ``;
            let userLocationCode = user.LOCATION_CODE.split(",");
            for(let afdCounter = 0; afdCounter < userLocationCode.length; afdCounter++){
                if(afdCounter === 0){
                    queryString = queryString + `afd_code='${userLocationCode[afdCounter].charAt(userLocationCode[afdCounter].length-1)}'`;
                }
                else {
                    queryString = queryString + ` OR afd_code='${userLocationCode[afdCounter].charAt(userLocationCode[afdCounter].length-1)}'`;
                }
                console.log(queryString);
            }
            let polygons = TaskServices.query('TR_POLYGON', queryString);
            polygons = this.convertGeoJson(polygons);
            if (polygons && polygons.length > 0) {
                let mapData = {
                    "data": {
                        "polygons": polygons
                    }
                };
                polyMap = mapData;
            }
            else {
                //belum download map
                this.setState({
                    modalLoading: { ...this.state.modalLoading, showModal: false },
                    modalAlert: {
                        title: 'Tidak ada data',
                        message: "Kamu belum download data map",
                        icon: require('../../Images/ic-blm-input-lokasi.png')
                    }
                });
            }
        }
        else {
            //belum pilih lokasi
            this.setState({
                fetchLocation: false
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
            tempItem = { ...tempItem, coords: tempArrCoords };
            arrPoli.push(tempItem);
        }
        return arrPoli;
    }

    getPolygons() {
        if (!polyMap) {
            this.setState({
                modalLoading: { ...this.state.modalLoading, showModal: false },
                modalAlert: { ...AlertContent.no_data_map }
            });
            return null;
        }
        let data = polyMap.data.polygons;
        // let poligons = [];
        // for (var i = 0; i < data.length; i++) {
        //     let coords = data[i];
        //     if (
        //         geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude + 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude - 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude + 0.0025, longitude: this.state.longitude }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude - 0.0025, longitude: this.state.longitude }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude - 0.0025, longitude: this.state.longitude - 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude - 0.0025, longitude: this.state.longitude + 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude + 0.0025, longitude: this.state.longitude - 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude + 0.0025, longitude: this.state.longitude + 0.006 }, coords.coords) ||
        //         geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude }, coords.coords)
        //     ) {
        //         poligons.push(coords);
        //     }
        //     // poligons.push(coords);
        // }
        return data;
    }

    getLocation() {
        if (this.state.latitude && this.state.longitude) {
            let poligons = this.getPolygons();
            if (poligons.length > 0) {
                this.setState({
                    modalLoading: { ...this.state.modalLoading, showModal: false } },
                    () => {
                    this.setState({
                        poligons
                    });
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

    checkAutorisasi(werkAfdBlockCode) {
        let datLogin = TaskServices.getAllData('TR_LOGIN')[0]
        let refCode = datLogin.REFFERENCE_ROLE;
        if (refCode == 'AFD_CODE') {
            let dataBlok = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlockCode)
            if (dataBlok !== undefined) {
                let blockInAfd = TaskServices.getBlockInAFD()
                if (blockInAfd.includes(dataBlok.BLOCK_NAME)) {
                    return true
                }
            }
            return false
        }
        return true
    }

    navigateScreen(screenName, werkAfdBlockCode) {
        var werksAfdBlock = this.props.navigation.state.params.werksAfdBlock;

        if (werksAfdBlock != undefined) {
            if (werksAfdBlock == werkAfdBlockCode) {
                this._checkValidate(screenName, werkAfdBlockCode);
            } else {
                let dataBlok = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlockCode)
                var blockName = dataBlok.BLOCK_NAME

                this.setState({
                    modalAlert: {
                        showModal: true,
                        title: 'Blok tidak match',
                        message: "Kamu tidak berada di Blok " + blockName,
                        icon: require('../../Images/ic-blm-input-lokasi.png')
                    }
                });
            }
        } else {
            this._checkValidate(screenName, werkAfdBlockCode);
        }
    }

    _checkValidate(screenName, werkAfdBlockCode) {
        if (this.checkAutorisasi(werkAfdBlockCode)) {
            const navigation = this.props.navigation;
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: screenName, params: {
                        werkAfdBlockCode: werkAfdBlockCode,
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        inspectionType: this.state.inspectionType === 'genba' ? 'genba' : 'normal'
                    }
                })]
            });
            navigation.dispatch(resetAction);
        } else {
            this.setState({
                modalLoading: { ...this.state.modalLoading, showModal: false },
                modalAlert: {
                    title: 'Tidak ada data',
                    message: "Kamu belum download data map",
                    icon: require('../../Images/ic-blm-input-lokasi.png')
                }
            });
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}>
                <HeaderWithButton
                    title={"Titik Restan"}
                    iconLeft={require("../../Images/icon/ic_arrow_left.png")}
                    iconRight={require("../../Images/icon/ic_arrow_left.png")}
                    onPressLeft={()=>{this.props.navigation.pop()}}
                    onPressRight={()=>{this.getLocation()}}
                />

                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
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
                    ref={map => this.map = map}
                    style={{
                        flex: 1
                    }}
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
                    onMapReady={() => {this.onMapReady()}}
                >
                    {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
                        <View key={index}>
                            <Polygon
                                coordinates={poly.coords}
                                // fillColor="rgba(0, 200, 0, 0.5)"
                                strokeColor="rgba(255,255,255,1)"
                                strokeWidth={2}
                            />
                            <Marker
                                ref={ref => poly.marker = ref}
                                coordinate={this.centerCoordinate(poly.coords)}>
                                <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 11, fontWeight: '900' }}>{poly.blokname}</Text>
                            </Marker>
                        </View>
                    ))}

                    {
                        this.state.coordinateRestan.map((coordinate)=>{
                            return(
                                <Marker
                                    title={"Titik Api TAP"}
                                    description={`hello world uhskjfhskejf ekjfhskejfhskjefsee kjefhksjehfskjehf sefhskejfh`}
                                    coordinate={{
                                        latitude: coordinate.latitude,
                                        longitude: coordinate.longitude
                                    }}>
                                    <Image
                                        style={{width: 20, height: 20}}
                                        source={require('../../Images/icon/ic_restan.png')}
                                    />
                                </Marker>
                            )
                        })
                    }
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
                            alignItems: "center"
                        }}>
                            <Text style={{ color: "white" }}>
                                Latitude : {this.state.latitude}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ color: "white" }}>
                                Longitude : {this.state.longitude}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

Restan.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1
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
