import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    NetInfo,
    ScrollView,
    Dimensions, AsyncStorage, NativeEventEmitter, NativeModules
} from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';

import MapView, {Marker, Polygon, PROVIDER_GOOGLE, ProviderPropType, Circle} from 'react-native-maps';
import Colors from '../../Constant/Colors'
import ModalLoading from '../../Component/ModalLoading'
import ModalAlert from '../../Component/ModalAlert';
import TaskServices from '../../Database/TaskServices';
import {AlertContent} from '../../Themes';
import { HeaderWithButton } from "../../Component/Header/HeaderWithButton";
import { getTitikRestan } from '../Sync/Download/Restan/TitikRestan';
import {numberSeperator} from "../../Constant/Functions/StringManipulator";
import {getSpecificSticker} from "../../Lib/Utils";

let polyMap = null;
let LATITUDE = -2.1890660;
let LONGITUDE = 111.3609873;
const screenWidth = Math.round(Dimensions.get('window').width);

export default class Restan extends React.Component {

    constructor(props) {
        super(props);

        let user = TaskServices.getAllData('TR_LOGIN')[0];

        this.state = {
            userData: user,
            internetExist: true,
            currentGPS:{
                latitude:0.0,
                longitude: 0.0,
                gpsAccuracy: 0
            },
            nativeGPS:{
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
            currentRestanIndex: 0,
            coordinateRestan: [],
            latestSyncTime: "",
            highlightBlock: [],
            inspectionType: props.navigation.getParam('inspectionType', 'normal'),
            // modalRestainDetail: false,
            restanData: {
                block_name: "",
                TPH: "",
                hari: "",
                janjang: "",
                brondolan: "",
                taksasi: ""
            },
            modalAlert: {
                showModal: false,
                title: "",
                message: "",
                icon: null,
                action: () => this.setState({ modalAlert: { ...this.state.modalAlert, showModal: false } })
            },
            modalLoading: {
                showModal: false,
                title: "Sabar Ya..",
                message: "Sedang mencari lokasi kamu nih"
            }
        };
    }

    componentDidMount() {
        this.loadMap();
        this.nativeGps();
    }

    nativeGps(){
        const eventEmitter = new NativeEventEmitter(NativeModules.Satellite);
        eventEmitter.addListener('getSatellite', (event) => {
            this.setState({
                nativeGPS:{
                    longitude: event.longitude,
                    latitude: event.latitude,
                    accuracy: event.accuracy,
                    satelliteCount: Math.floor(event.satelliteCount)
                }
            })
        });
        NativeModules.Satellite.getCoors();
    }

    getRestanSyncTime(){
        AsyncStorage.getItem('SYNCTIME-titikRestan')
            .then((restanSyncTime)=>{
                let data = JSON.parse(restanSyncTime);
                this.setState({
                    latestSyncTime: data.latestSyncTime !== null ? data.latestSyncTime.toString() : "Belum Sync"
                })
            })
    };

    onMapReady(){
        this.setState({
                modalLoading: {
                    ...this.state.modalLoading,
                    showModal: true
                }},()=>{
                    //set timeout untuk ngasih waktu cari signal gps
                    setTimeout(()=>{
                        this.fetchRestanCoordinate()
                            .then((response)=>{
                                this.searchLocation();
                                this.getRestanSyncTime();
                            })
                    }, 2000)
            }
        );
    }

    getSticker(){
        let image = getSpecificSticker("good");
        return image
    }

    async fetchRestanCoordinate(){
        let fetchStatus = false;

        await NetInfo.isConnected.fetch()
            .then(async (isConnected) => {
            if (isConnected) {
                await getTitikRestan()
                    .then(async (response) => {
                        fetchStatus = response.downloadStatus;
                        if(response.downloadCount === 0){
                            this.setState({
                                modalAlert: {
                                    ...this.state.modalAlert,
                                    showModal: true,
                                    title: "Tidak ada restan",
                                    message: `Yeaayy!! \nGak ada restan per hari ini..`,
                                    icon: this.getSticker(),
                                    action: ()=>{
                                        this.setState({
                                            modalAlert: { ...this.state.modalAlert, showModal: false }
                                        }, ()=>{this.props.navigation.pop()})
                                    }
                                }
                            })
                        }
                    })
            }
            else {
                fetchStatus = false;
                this.setState({
                    internetExist: false
                });
            }
        });

        return fetchStatus;
    }

    searchLocation(){
        this.getLocation()
            .then((response)=>{
                if(response){
                    this.getTitikRestan();
                }
            })
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
                    queryString = queryString + `OR afd_code='${userLocationCode[afdCounter].charAt(userLocationCode[afdCounter].length-1)}'`;
                }
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
                        ...this.state.modalAlert,
                        showModal: true,
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
                modalAlert: {
                    ...this.state.modalAlert,
                    ...AlertContent.no_data_map
                }
            });
            return null;
        }
        let data = polyMap.data.polygons;
        return data;
    }

    async getLocation() {
        let poligons = this.getPolygons();
        if (poligons !== null) {
            await this.setState({
                modalLoading: { ...this.state.modalLoading, showModal: false },
                poligons
            });
            return true;
        }
        else {
            await this.setState({
                modalLoading: { ...this.state.modalLoading, showModal: false },
                modalAlert: {
                    ...this.state.modalAlert,
                    ...AlertContent.no_polygon
                }
            });
            return false;
        }
    }

    getTitikRestan(){
        let titikRestan = TaskServices.getSortedData('TR_TITIK_RESTAN', 'SORT_SWIPE', false);
        if(titikRestan !== undefined && titikRestan.length > 0){
            let tempCoordinateRestan = [];
            let tempHighlightBlock = [];
            for (let counter = 0; counter < titikRestan.length; counter++){
                if(!tempHighlightBlock.includes(titikRestan[counter].BLOCK_NAME)){
                    tempHighlightBlock.push(titikRestan[counter].BLOCK_NAME);
                }
                let tempModelRestan = {
                    ...titikRestan[counter],
                    LATITUDE:parseFloat(titikRestan[counter].LATITUDE),
                    LONGITUDE:parseFloat(titikRestan[counter].LONGITUDE)
                };
                tempCoordinateRestan.push(tempModelRestan);
            }

            this.map.animateToRegion({
                latitude: tempCoordinateRestan[0].LATITUDE,
                longitude: tempCoordinateRestan[0].LONGITUDE,
                latitudeDelta: 0.00500,
                longitudeDelta: 0.00500
            }, 1);

            this.setState({
                highlightBlock: tempHighlightBlock,
                coordinateRestan: tempCoordinateRestan
            });
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

    styleColorChooser(TPH_RESTANT_DAY){
        switch (parseFloat(TPH_RESTANT_DAY)) {
            case 1:
                return "rgba(208,2,27,1)";
            case 2:
                return "rgba(242,101,34,1)";
            default:
                return "rgba(226,170,3,1)";
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}>
                <HeaderWithButton
                    title={"Peta Restan"}
                    iconLeft={require("../../Images/icon/ic_arrow_left.png")}
                    rightVectorIcon={true}
                    iconRight={"location-arrow"}
                    onPressLeft={()=>{this.props.navigation.pop()}}
                    onPressRight={()=>{
                        this.setState({
                            modalLoading: {
                                ...this.state.modalLoading,
                                showModal: true
                            }},()=>{
                                this.fetchRestanCoordinate()
                                    .then((response)=>{
                                        this.searchLocation()
                                    })
                            }
                        );
                    }}
                />

                <View style={{
                    padding: 10,
                    backgroundColor: 'rgba(221,226,218,1)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: Colors.text, fontSize: 12 }}>{`Data per tanggal : ${this.state.latestSyncTime}`}</Text>
                </View>

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
                    onPressCancel={this.state.modalAlert.action}
                    title={this.state.modalAlert.title}
                    message={this.state.modalAlert.message} />

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
                        this.setState({
                            currentGPS:{
                                latitude: event.nativeEvent.coordinate.latitude,
                                longitude: event.nativeEvent.coordinate.longitude,
                                gpsAccuracy: Math.floor(event.nativeEvent.coordinate.accuracy),
                            },
                            region: {
                                latitude: event.nativeEvent.coordinate.latitude,
                                longitude: event.nativeEvent.coordinate.longitude,
                                latitudeDelta: 0.0075,
                                longitudeDelta: 0.00721
                            }
                        });
                    }}
                    onMapReady={() => {this.onMapReady()}}
                >
                    <Circle
                        center= {{
                            latitude: this.state.currentGPS.latitude,
                            longitude: this.state.currentGPS.longitude
                        }}
                        fillColor="rgba(255, 255, 255, 0.3)"
                        strokeColor="rgba(255, 255, 255, 1)"
                        radius= {this.state.currentGPS.gpsAccuracy}
                    />

                    {this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
                        <View key={index}>
                            <Polygon
                                coordinates={poly.coords}
                                fillColor={this.state.highlightBlock.includes(poly.blokname) ? "rgba(0, 200, 0, 0.5)" : "rgba(0, 0, 0, 0)"}
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
                        this.state.coordinateRestan.map((coordinate, index)=>{
                            return(
                                <Marker
                                    style={{zIndex: this.state.currentRestanIndex === index ? 5 : 0}}
                                    key={index}
                                    onPress={()=>{
                                        this.setState({
                                            currentRestanIndex: index
                                        },()=>{
                                            if(index !== 0){
                                                this.restanScrollView.scrollTo({ x: (index*(screenWidth*0.8 + screenWidth*0.05)), animated: true });
                                            }
                                            else {
                                                this.restanScrollView.scrollTo({ x: screenWidth, animated: true });
                                            }
                                        })
                                    }}
                                    coordinate={{
                                        latitude: coordinate.LATITUDE,
                                        longitude: coordinate.LONGITUDE
                                    }}
                                    tracksViewChanges={false}
                                >
                                    {
                                        this.state.currentRestanIndex === index ?
                                            <View>
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: "row",
                                                        backgroundColor: Colors.colorWhite,
                                                        padding: 5,
                                                        borderRadius: 5
                                                    }}>
                                                    <IonicIcon style={{ paddingHorizontal: 5 }} name={'ios-information-circle'} size={25} color={this.styleColorChooser(coordinate.TPH_RESTANT_DAY)} />
                                                    <Text style={{fontSize: 20, paddingHorizontal:10, color: this.styleColorChooser(coordinate.TPH_RESTANT_DAY)}}>{`${coordinate.KG_TAKSASI} `}<Text style={{fontSize: 15, alignItems:"center"}}>kg</Text></Text>
                                                </View>
                                                <IonicIcon style={{marginTop: -17.5, alignSelf:"center"}} name={'md-arrow-dropdown'} size={40} color={Colors.colorWhite} />
                                            </View>
                                            :
                                            <View>
                                                <View
                                                    style={{
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,
                                                        borderRadius: 5,
                                                        alignItems:"center",
                                                        justifyContent:"center",
                                                        backgroundColor: this.styleColorChooser(coordinate.TPH_RESTANT_DAY)
                                                    }}
                                                >
                                                    <Text style={{fontSize: 11, color: Colors.colorWhite}}>{`${coordinate.KG_TAKSASI} `}<Text style={{fontSize: 9, alignItems:"center"}}>kg</Text></Text>
                                                </View>
                                                <IonicIcon style={{marginTop: -17.5, alignSelf:"center"}} name={'md-arrow-dropdown'} size={40} color={this.styleColorChooser(coordinate.TPH_RESTANT_DAY)} />
                                            </View>
                                    }
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
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                Satellite : {this.state.nativeGPS.satelliteCount}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                Accuracy : {this.state.nativeGPS.accuracy} meter
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                latitude : {this.state.nativeGPS.latitude}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                longitude : {this.state.nativeGPS.longitude}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                Accuracy : {this.state.currentGPS.gpsAccuracy} meter
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                Latitude : {this.state.currentGPS.latitude.toFixed(6)}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: "flex-end"
                        }}>
                            <Text style={{ color: "white" }}>
                                Longitude : {this.state.currentGPS.longitude.toFixed(6)}
                            </Text>
                        </View>
                    </View>
                    {
                        this.state.coordinateRestan.length > 0 &&
                        <View style={{
                            height: "18.5%"
                        }}>
                            <ScrollView
                                ref={(restanScrollView)=>{this.restanScrollView = restanScrollView}}
                                contentContainerStyle={{
                                    // paddingHorizontal: screenWidth*0.025,
                                    backgroundColor:"transparent"
                                }}
                                decelerationRate={0}
                                // snapToInterval={this.state.currentRestanIndex % 2 === 0 ? (screenWidth*0.8 + screenWidth*0.05) - (screenWidth*0.8 + screenWidth*0.05)*0.05 : screenWidth*0.8 + screenWidth*0.05} //your element width
                                snapToInterval={screenWidth*0.8 + screenWidth*0.05} //your element width
                                snapToAlignment={"center"}
                                horizontal={true}
                                onMomentumScrollEnd={event => {
                                    let index = this.scrollViewIndex(event.nativeEvent.contentOffset.x);
                                    if(index !== null){
                                        let selectedCoordinateRestan = this.state.coordinateRestan[index];
                                        let region = {
                                            latitude: selectedCoordinateRestan.LATITUDE,
                                            longitude: selectedCoordinateRestan.LONGITUDE,
                                            latitudeDelta: 0.00500,
                                            longitudeDelta: 0.00500
                                        };
                                        this.map.animateToRegion(region, 1);
                                        this.setState({
                                            currentRestanIndex: index
                                        })
                                    }
                                }}>
                                {
                                    this.state.coordinateRestan.map((coordinateRestanData, index)=>{
                                        return(
                                            <View
                                                key={index}
                                                style={{
                                                    flexDirection: "row",
                                                    backgroundColor: "white",
                                                    borderRadius: 5,
                                                    width: screenWidth * 0.8,
                                                    margin: screenWidth * 0.025,
                                                    justifyContent:'center'
                                                }}
                                            >
                                                <View style={{
                                                    flex: 1,
                                                    marginRight: 15,
                                                    paddingVertical: 5,
                                                    backgroundColor:this.styleColorChooser(coordinateRestanData.TPH_RESTANT_DAY),
                                                    borderTopLeftRadius: 5,
                                                    borderBottomLeftRadius: 5,
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}>
                                                    <Text style={{color: Colors.colorWhite}}>Restan</Text>
                                                    <Text style={{
                                                        fontSize: 30,
                                                        color: Colors.colorWhite
                                                    }}>
                                                        {coordinateRestanData.TPH_RESTANT_DAY}
                                                    </Text>
                                                    <Text style={{color: Colors.colorWhite}}>Hari</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 2,
                                                        justifyContent:'center'
                                                    }}>
                                                    <Text style={{fontSize: 20, fontWeight: 'bold', color: this.styleColorChooser(coordinateRestanData.TPH_RESTANT_DAY)}}>{`${numberSeperator(coordinateRestanData.KG_TAKSASI, ",")} kg`}</Text>
                                                    <Text style={{paddingVertical: 5}}>{`${coordinateRestanData.JML_JANJANG} Janjang / ${coordinateRestanData.JML_BRONDOLAN} kg Brondolan`}</Text>
                                                    <Text style={{fontWeight: 'bold'}}>{`${coordinateRestanData.BLOCK_NAME} / TPH ${coordinateRestanData.OPH}`}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    }
                </View>
                {/*{this.showRestanDetail()}*/}
            </View>
        );
    }

    //used to determine which index selected
    scrollViewIndex(xPosition){
        let index = xPosition/(screenWidth*0.8 + screenWidth*0.05);
        let lastIndex = (Math.ceil(index))+1 === this.state.coordinateRestan.length;
        if(Number.isInteger(index) || lastIndex){
            return Math.ceil(index);
        }
        return null;
    }
}

Restan.propTypes = {
    provider: ProviderPropType,
};
