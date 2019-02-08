import React, { Component } from 'react';
import {
    Text, Keyboard, Alert, TextInput, TouchableOpacity, View, Image, StatusBar,
    KeyboardAvoidingView, BackHandler
} from 'react-native';
import {
    Container,
    Content,
    Card,
    CardItem,
    Title,
} from 'native-base';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/Ionicons';
import CardView from 'react-native-cardview';
import MapView, {PROVIDER_GOOGLE, ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';
import {convertTimestampToDate, getTodayDate, getUUID} from '../../Lib/Utils'
import TaskService from '../../Database/TaskServices';
// import KeyboardListener from 'react-native-keyboard-listener';
import Dialog from "react-native-dialog";
import { ProgressDialog } from 'react-native-simple-dialogs';
import Autocomplete from 'react-native-autocomplete-input';
import { utils } from 'redux-saga';
var uuid = require('react-native-uuid');
import Geojson from 'react-native-geojson';
import Entypo from 'react-native-vector-icons/Entypo';

const indonesia = require('../../Data/indonesia-province-simple.json')
const kaltim = require('../../Data/kalimantantimur.json')
// const kaltim = require('../../Data/skm.json')
const alcatraz = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [-6.2292229, 106.8253967],
          latitudeDelta:0.015,
          longitudeDelta:0.0121 //[-122.42305755615234, 37.82687023785448],
        }
      }
    ]
};

class BuatInspeksiRedesign extends Component {

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor
        },
        title: 'Buat Inspeksi',
        headerTintColor: '#fff',
        headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400',
            marginHorizontal: 12
        }
    };  

    constructor(props) {
        super(props);        
        let dataLogin = TaskService.getAllData('TR_LOGIN');
        let blokInspeksiCode = `I${dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`
        this.state = {
            blokInspeksiCode,
            dataLogin,
            latitude: 0.0,
            longitude: 0.0,
            error: null,
            modelInspeksiH: null,
            modelTrack: null,
            date: '',
            blok: '',
            baris: '',
            keyboardOpen: false,
            fetchLocation: false,
            showBaris: true,
            query: '',
            person:[],
            werksAfdBlokCode: '',
            afdCode: '',
            werks: '',
            clickLOV: false,
            intervalId: 0,
            showBtn: true,
        };
    }

    findPerson(query){
        if (query === '') {
            return [];
        }
        const { person } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return person.filter(person => person.allShow.search(regex) >= 0);

        // var letters = /^[A-Za-z]+$/;
        // if(query.match(letters)){
        //     console.log('osan');
            // return person.filter(person => person.blokName.search(regex) >= 0);
        // }else{
        //     console.log('asdasdd');
            // return person.filter(person => person.blokCode.search(regex) >= 0);
        // }
        
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{this.setState({showBtn:false})});
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({showBtn:true})});
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
    // alert('Keyboard Shown');
    }

    _keyboardDidHide () {
    // alert('Keyboard Hidden');
    }

    componentDidMount() {
        this.props.navigation.setParams({ getData: this.state.inspeksiHeader })
        let data = TaskService.getAllData('TM_BLOCK');
        data.map(item=>{
            let statusBlok= this.getStatusBlok(item.WERKS_AFD_BLOCK_CODE);
            let estateName = this.getEstateName(item.WERKS);
            this.state.person.push({
                blokCode: item.BLOCK_CODE, 
                blokName: item.BLOCK_NAME, 
                afdCode: item.AFD_CODE,
                werks: item.WERKS,
                estateName: estateName, 
                werksAfdBlokCode: item.WERKS_AFD_BLOCK_CODE,
                statusBlok: statusBlok,
                compCode: item.COMP_CODE,
                allShow: `${item.BLOCK_NAME}/${statusBlok}/${estateName}`
            });
        })
        this.getLocation();
    }

    insertTrackLokasi(blokInsCode, lat, lon){
        try {
            var trInsCode = `T${this.state.dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`;
            var today = getTodayDate('YYYY-MM-DD HH:mm:ss');
            data = {
                TRACK_INSPECTION_CODE: trInsCode,
                BLOCK_INSPECTION_CODE: blokInsCode,
                DATE_TRACK: today,
                LAT_TRACK: lat.toString(),
                LONG_TRACK: lon.toString(),
                INSERT_USER: this.state.dataLogin[0].USER_AUTH_CODE,
                INSERT_TIME: today,
                STATUS_SYNC: 'N'
            }
            TaskService.saveData('TM_INSPECTION_TRACK', data)
        } catch (error) {
            alert('insert track lokasi buat inspeksi '+ error)
        }
    }

    hideAndShowBaris(param){
        if(param.length > 0){
            this.setState({showBaris: false, clickLOV: false});
        }else{
            this.setState({showBaris: true, clickLOV: false});
        }        
    }

    getLocation2(blokInsCode) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.insertTrackLokasi(blokInsCode, lat, lon)               
            },
            (error) => {
                // this.setState({ error: error.message, fetchingLocation: false })
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                // const timestamp = convertTimestampToDate(position.timestamp, 'DD/MM/YYYY HH:mm:ss')//moment(position.timestamp).format('DD/MM/YYYY HH:mm:ss');
                this.setState({latitude:lat, longitude:lon, fetchLocation: false});              
            },
            (error) => {
                // this.setState({ error: error.message, fetchingLocation: false })
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                this.setState({fetchLocation:false})
                alert('Informasi', message);
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    validation() {
        let statusBlok = this.getStatusBlok(this.state.werksAfdBlokCode);
        if(statusBlok === ''){
            alert('Anda tidak bisa Inspeksi di Blok ini, silahkan hubungi IT Site');
        } else if(this.state.werks === ''){
            alert('Anda tidak bisa Inspeksi di Blok ini, silahkan hubungi IT Site');
        } else if (this.state.blok === '') {
            alert('Blok Belum diisi !');
        } else if (this.state.baris === '') {
            alert('Baris Belum diisi !');
        } else if(!this.state.clickLOV){
            alert('Blok harus dipilih dari LOV');
        } else {
            this.insertDB(statusBlok);
        }    
    }

    getAfdeling(werk_afd_code){
        try {
            let data = TaskService.findBy2('TM_AFD', 'WERKS_AFD_CODE', werk_afd_code);
            return data.AFD_NAME.substring(data.AFD_NAME.indexOf(' ')+1);
        } catch (error) {
            return '';
        }
        
    }

    getStatusBlok(werk_afd_blok_code){
        try {
            let data = TaskService.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
            return data.MATURITY_STATUS;            
        } catch (error) {
            return ''
        }
    }

    insertDB(param) {

        let inspectionDate = getTodayDate('YYYY-MM-DD HH:mm:ss');
        let idInspection = `B${this.state.dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`
        
        let modelInspeksiH = {
            BLOCK_INSPECTION_CODE: this.state.blokInspeksiCode,
            ID_INSPECTION: idInspection,
            WERKS: this.state.werks,
            AFD_CODE: this.state.afdCode,
            BLOCK_CODE: this.state.blok,
            AREAL: this.state.baris,
            INSPECTION_TYPE: "PANEN",
            STATUS_BLOCK: param,
            INSPECTION_DATE: inspectionDate, //getTodayDate('DD MMM YYYY HH:mm:ss'), //12 oct 2018 01:01:01
            INSPECTION_SCORE: '',
            INSPECTION_RESULT: '',
            STATUS_SYNC: 'N',
            SYNC_TIME: '',
            START_INSPECTION: getTodayDate('YYYY-MM-DD HH:mm:ss'),//getTodayDate('DD MMM YYYY HH:mm:ss'),
            END_INSPECTION: '',
            LAT_START_INSPECTION: this.state.latitude.toString(),
            LONG_START_INSPECTION: this.state.longitude.toString(),
            LAT_END_INSPECTION: '',
            LONG_END_INSPECTION: '',
        }

        let params = {
            USER_AUTH: this.state.dataLogin[0].USER_AUTH_CODE,
            BA: this.state.werks,
            AFD: this.state.afdCode,
            BLOK: this.state.blok,
            BARIS: this.state.baris,
            ID_INSPECTION: idInspection,
            BLOCK_INSPECTION_CODE: this.state.blokInspeksiCode
        }

        let model =  {
            ID_INSPECTION: idInspection,
            BLOCK_INSPECTION_CODE: this.state.blokInspeksiCode,
            EST_NAME: this.getEstateName(this.state.werks),
            BLOCK_CODE: this.state.blok,
            AFD_CODE: this.state.afdCode,
            INSPECTION_DATE: inspectionDate,
            STATUS_SYNC: 'N',
            INSPECTION_RESULT: '',
            INSPECTION_SCORE: ''
        }        


        //for track
        let time = TaskService.getAllData('TM_TIME_TRACK')[0];
        let duration = 10000
        // if(time !== undefined){
        //     duration = parseFloat(time.DESC);
        // }
        let id = setInterval(()=> this.getLocation2(this.state.blokInspeksiCode), duration);

        this.props.navigation.navigate('TakeFotoBaris', {
            inspeksiHeader: modelInspeksiH,
            dataUsual: params,
            statusBlok: param,
            waktu: getTodayDate('YYYY-MM-DD  HH:mm:ss'),
            intervalId: id,
            dataInspeksi: model
        });
    }

    getEstateName(werks){
        try {
            let data = TaskService.findBy2('TM_EST', 'WERKS', werks);
            return data.EST_NAME;
        } catch (error) {
            return '';
        }
        
    }

    potong(param){
        let brs = param;
        if(brs.charAt(0) == '0'){
            brs = brs.substring(1);
            
        }
        this.setState({ baris: brs });
    }

    render() {        
        const { query } = this.state;
        const person = this.findPerson(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={styles.mainContainer}>

                <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.brand }]}>
                            <Text style={styles.stepperNumberText}>1</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.brand }]}>Pilih Lokasi</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.brand}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.buttonDisabled }]}>
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary }]}>Kondisi Baris</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.buttonDisabled}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.buttonDisabled }]}>
                            <Text style={styles.stepperNumberText}>3</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary }]}>Summary</Text>
                    </View>
                </View>

                {/*INPUT*/}
                <View style={{ height: 200, marginLeft: 20, marginRight: 20 }}>
                    <Card style={[styles.cardContainer]}>
                        <View style={{flex:1, margin:10}}>
                            <Text style={{ color: '#696969' }}>Blok</Text>
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                containerStyle={styles.autocompleteContainer}
                                data={person.length === 1 && comp(query, person[0].allShow) ? [] : person}
                                defaultValue={query}
                                onChangeText={text => {
                                    this.setState({ query: text }); 
                                    this.hideAndShowBaris(text)}
                                }
                                renderItem={({ blokCode, blokName, estateName, werksAfdBlokCode, statusBlok, allShow, werks, afdCode}) => (
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ 
                                            blok : blokCode, 
                                            query: allShow, 
                                            afdCode: afdCode,
                                            werks: werks,
                                            werksAfdBlokCode:werksAfdBlokCode, 
                                            clickLOV: true,
                                            showBaris: true }
                                        )}}>
                                        <View style={{padding:10}}>
                                            <Text style = {{fontSize: 15,margin: 2}}>{blokName}/{statusBlok}/{estateName}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        {this.state.showBaris && 
                        <View style={{ flex: 1, margin:10 }}>
                            <Text style={{ color: '#696969' }}>Baris</Text>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput]}
                                keyboardType={'numeric'}
                                maxLength={3}
                                value={this.state.baris}
                                onChangeText={(text) => { text = text.replace(/[^0-9]/g, ''); this.potong(text);  }} />
                        </View>}
                    </Card>
                </View>

                <Text style={styles.textLabel}>
                    Pastikan kamu telah berada dilokasi yang benar
                </Text>
                
                <View style={styles.containerMap}>
                    {!!this.state.latitude && !!this.state.longitude &&
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude:this.state.latitude,
                                longitude:this.state.longitude,
                                latitudeDelta:0.015,
                                longitudeDelta:0.0121
                            }}>
                            <Geojson geojson={alcatraz} />
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
                    }                 

                    {this.state.showBtn && <IconLoc
                        onPress={()=>{this.setState({fetchLocation: true}); this.getLocation()}}
                        name="location-arrow"
                        size={24}
                        style={{ alignSelf: 'flex-end', marginBottom:130, marginRight: 10}}/>} 

                    {this.state.showBtn && <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } onPress={()=>{this.validation()}}>
                            <Text style={styles.buttonText}>Mulai Inspeksi</Text>
                        </TouchableOpacity>                        
                    </View>}
                </View>

                {<ProgressDialog
                        visible={this.state.fetchLocation}
                        activityIndicatorSize="large"
                        message="Mencari Lokasi..."
                />}
            </View>
        )
    }
}

export default BuatInspeksiRedesign;

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
        // padding:20
    },
    containerStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    stepperNumber: {
        height: 24,
        width: 24,
        backgroundColor: Colors.buttonDisabled,
        borderRadius: 12,
        justifyContent: 'center'
    },
    stepperNumberText: [Fonts.style.caption, { textAlign: 'center', color: Colors.textDark }],
    stepperNext: { alignSelf: 'flex-end', paddingRight: 4 },
    cardContainer: {
        flex: 1,
        padding:10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    searchInput: {
        height: 40,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        color: '#808080',
    },
    autocompleteContainer: {
        flex: 1,
        // left: 0,
        // position: 'absolute',
        // right: 0,
        // top: 20,
        // zIndex: 1
    },
    textLabel:
        [Fonts.style.caption, { color: Colors.brand, textAlign: 'center', fontSize: 16, marginTop: 10, marginRight: 20, marginLeft: 20 }]
    ,
    containerMap: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    bubble: {
        backgroundColor: '#ff8080',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 17,
        color: '#ffffff',
        textAlign: 'center'
    },
    button: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    // titleText: {
    //     fontSize: 18,
    //     fontWeight: '500',
    //     marginBottom: 10,
    //     marginTop: 10,
    //     textAlign: 'center'
    //   },
    //   directorText: {
    //     color: 'grey',
    //     fontSize: 12,
    //     marginBottom: 10,
    //     textAlign: 'center'
    //   },
    // container: {
    //     position:'absolute',
    //     top:0,
    //     left:0,
    //     right:0,
    //     bottom:0,
    //     justifyContent:'flex-end',
    //     alignItems:'center'
    //   },
    //   map: {
    //     position:'absolute',
    //     top:0,
    //     left:0,
    //     right:0,
    //     bottom:0
    //   },
}