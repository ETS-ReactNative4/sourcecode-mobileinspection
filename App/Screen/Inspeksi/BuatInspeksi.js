import React, { Component } from 'react';
import {
    Text, Keyboard, Dimensions, TextInput, TouchableOpacity, View, BackHandler, StatusBar
} from 'react-native';
import { Card } from 'native-base';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import MapView, { PROVIDER_GOOGLE, ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';
import { getTodayDate } from '../../Lib/Utils'
import TaskService from '../../Database/TaskServices';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Autocomplete from 'react-native-autocomplete-input';
import Geojson from 'react-native-geojson';
import R from 'ramda'
import { NavigationActions, StackActions  } from 'react-navigation';
import ModalAlert from '../../Component/ModalAlert';
import ModalAlertConfirmation from "../../Component/ModalAlertConfirmation";

class BuatInspeksiRedesign extends Component {

    // static navigationOptions = {
    //     headerStyle: {
    //         backgroundColor: Colors.tintColorPrimary
    //     },
    //     title: 'Buat Inspeksi',
    //     headerTintColor: '#fff',
    //     headerTitleStyle: {
    //         textAlign: "left",
    //         flex: 1,
    //         fontSize: 18,
    //         fontWeight: '400',
    //         marginHorizontal: 12
    //     }
    // };

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerStyle: {
            backgroundColor: Colors.tintColorPrimary
          },
          title: 'Buat Inspeksi',
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400',
            marginHorizontal: 12
        },
        // headerRight: (
        //       <TouchableOpacity style= {{marginRight: 20}} onPress={()=>{params.searchLocation()}}>
        //           <IconLoc style={{marginLeft: 12}} name={'location-arrow'} size={24} color={'white'} />
        //       </TouchableOpacity>
        //   )
        };
    }

    constructor(props) {
        super(props);
        let dataLogin = TaskService.getAllData('TR_LOGIN');

        let params = props.navigation.state.params;
        let werkAfdBlockCode = R.clone(params.werkAfdBlockCode);
        let latitude = R.clone(params.latitude);
        let longitude = R.clone(params.longitude);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state = {
            blokInspeksiCode: `I${dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`,
            dataLogin,
            latitude,
            longitude,
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
            werkAfdBlockCode,
            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            showModal2: false,
            showModalAlert: false,
            icon: '',
            inspectionType: props.navigation.getParam('inspectionType', 'normal')
        };
		// this.initBlokInspeksiCode(dataLogin[0].USER_AUTH_CODE);
    }

    // initBlokInspeksiCode(authCode){
	// 	let today = getTodayDate('YYMMDDHHmmss');
    //     let blokInspeksiCode = `I${authCode}${today}`;
	// 	this.setState({
	// 		blokInspeksiCode : blokInspeksiCode
	// 	})
	// }

    // findPerson(query){
    //     if (query === '') {
    //         return [];
    //     }
    //     const { person } = this.state;
    //     const regex = new RegExp(`${query.trim()}`, 'i');
    //     return person.filter(person => person.allShow.search(regex) >= 0);
    //
    // }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{this.setState({showBtn:false})});
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this.setState({showBtn:true})});
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
        this.props.navigation.setParams({ searchLocation: this.searchLocation })
        this.loadDataBlock(this.state.werkAfdBlockCode)
        this.getLocation();

    }

    selesai=()=>{
        const navigation = this.props.navigation;
        let routeName = 'MainMenu';
        Promise.all([
            navigation.dispatch(
                StackActions.reset({
                    index:0,
                    actions:[NavigationActions.navigate({ routeName : routeName})]
                })
            )]).then(() => navigation.navigate('Inspection')).then(() => navigation.navigate('DaftarInspeksi'))
    }

    handleBackButtonClick() {
        this.setState({
            showModalAlert: true, title: 'Data Hilang',
            message: 'Inspeksi mu belum tersimpan loh. Yakin mau dilanjutin?',
            icon: require('../../Images/ic-not-save.png')
        });
        return true;
    }

    searchLocation =() =>{
        this.setState({fetchLocation: true})
        this.getLocation();
    }

    loadData(){
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
        });
    }

    loadDataBlock(werkAfdBlockCode){
        let data = TaskService.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlockCode);
        if(data !== undefined){
            let statusBlok= this.getStatusBlok(data.WERKS_AFD_BLOCK_CODE);
            let estateName = this.getEstateName(data.WERKS);
            this.setState({
                blok: data.BLOCK_CODE,
                blockCode: data.BLOCK_CODE,
                blockName: data.BLOCK_NAME,
                afdCode: data.AFD_CODE,
                werks: data.WERKS,
                werksAfdBlokCode: data.WERKS_AFD_BLOCK_CODE,
                estateName: data.estateName,
                statusBlok: data.statusBlok,
                compCode: data.COMP_CODE,
                allShow: `${data.BLOCK_NAME}/${statusBlok}/${estateName}`
            })
        }else{
            // alert('Kamu tidak bisa inspeksi');
            // this.selesai();
            this.setState({ showModal2: true, title: 'Salah Blok', message: 'Kamu ga bisa buat inspeksi di blok ini', icon: require('../../Images/ic-blm-input-lokasi.png') });
        }
    }

    // hideAndShowBaris(param){
    //     if(param.length > 0){
    //         this.setState({showBaris: false, clickLOV: false});
    //     }else{
    //         this.setState({showBaris: true, clickLOV: false});
    //     }
    // }
    //
    // getLocation2(blokInsCode) {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             var lat = parseFloat(position.coords.latitude);
    //             var lon = parseFloat(position.coords.longitude);
    //             this.insertTrackLokasi(blokInsCode, lat, lon)
    //         },
    //         (error) => {
    //             // this.setState({ error: error.message, fetchingLocation: false })
    //             let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
    //             if (error && error.message == "No location provider available.") {
    //                 message = "Mohon nyalakan GPS anda terlebih dahulu.";
    //             }
    //             if(this.state.latitude !== null && this.state.longitude !== null){
    //                 this.insertTrackLokasi(blokInsCode, this.state.latitude, this.state.longitude)
    //             }
    //             // console.log(message);
    //         }, // go here if error while fetch location
    //         { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
    //     );
    // }

    insertTrackLokasi(blokInsCode, lat, lon){
        try {
			var today = getTodayDate('YYMMDDkkmmss');
            var trInsCode = `T${this.state.dataLogin[0].USER_AUTH_CODE}${today}`;
            // var today = getTodayDate('YYYY-MM-DD HH:mm:ss');
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
                this.setState({ fetchLocation: false })
                // alert('Informasi', message);
                this.setState({ showModal: true, title: 'Informasi', message: message, icon: require('../../Images/ic-no-gps.png') });
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
        // this.loadData()
    }

    async validation() {
        let statusBlok = this.getStatusBlok(this.state.werksAfdBlokCode);
        var message = 'Kamu harus pilih lokasi dan isi baris dulu yaa :D'
        if(statusBlok === ''){
            this.setState({ showModal: true, title: 'Pilih Lokasi', message: message, icon: require('../../Images/ic-blm-input-lokasi.png') });
        } else if (this.state.werks === '') {
            this.setState({ showModal: true, title: 'Pilih Lokasi', message: message, icon: require('../../Images/ic-blm-input-lokasi.png') });
        } else if (this.state.blok === '') {
            this.setState({ showModal: true, title: 'Pilih Lokasi', message: message, icon: require('../../Images/ic-blm-input-lokasi.png') });
        } else if (this.state.baris === '') {
            this.setState({ showModal: true, title: 'Pilih Lokasi', message: message, icon: require('../../Images/ic-blm-input-lokasi.png') });
        } else if(this.checkSameBaris()){
            this.setState({ showModal: true, title: 'Baris sama', message: 'Opps, baris tidak boleh sama dengan sebelumnya ya', icon: require('../../Images/ic-blm-input-lokasi.png') });
        } else if(this.checkJarakBaris()){
            this.setState({ showModal: true, title: 'Baris terlalu dekat', message: 'Opps, minimum jarak barisnya lebih dari 5 dari baris terakhir ya !', icon: require('../../Images/ic-blm-input-lokasi.png') });
        }
        // else if(this.state.latitude === 0.0 && this.state.longitude === 0.0){
        //     this.setState({ showModal: true, title: 'Lokasi', message: 'Titik lokasi kamu belum ada, coba refresh lokasi lagi yaa', icon: require('../../Images/ic-no-gps.png') });
        // }
        // else if(!this.state.clickLOV){
        //     alert('Blok harus dipilih dari LOV');
        //     this.setState({ showModal: true, title: 'Pilih Lokasi', message: message, icon: require('../../Images/ic-blm-input-lokasi.png') });
        // }
        else {
            await this.insertDB(statusBlok);
        }
    }

    checkSameBaris(){
        let today = getTodayDate('YYMMDD');
        let idInspection = `B${this.state.dataLogin[0].USER_AUTH_CODE}${today}${this.state.werkAfdBlockCode}`
        let data = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection)
        if(data !== undefined){
            let header = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection)
            if(header !== undefined){
                for(var i=0; i<header.length; i++){
                    if(this.state.baris == header[i].AREAL){
                        return true
                    }
                }
            }
        }
        return false
    }

    checkJarakBaris(){
        let today = getTodayDate('YYMMDD');
        let idInspection = `B${this.state.dataLogin[0].USER_AUTH_CODE}${today}${this.state.werkAfdBlockCode}`
        let data = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection)
        //cek baris inspection udh ada ato blom
        if(data !== undefined){
            let header = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection)
            //cek di TR_BLOCK_INSPECTION_H udh ad apa belum
            if(header !== undefined && header.length > 0){
                let rangeMin = parseInt(this.state.baris) <= 5 ? 1 : parseInt(this.state.baris)-4;
                let rangeMax = parseInt(this.state.baris)+4;
                let validation = header.some((val)=>{
                    return (val.AREAL <= rangeMax && val.AREAL >= rangeMin)
                });
                return validation;
            }
        }
        return false
    }

    // getAfdeling(werk_afd_code){
    //     try {
    //         let data = TaskService.findBy2('TM_AFD', 'WERKS_AFD_CODE', werk_afd_code);
    //         return data.AFD_NAME.substring(data.AFD_NAME.indexOf(' ')+1);
    //     } catch (error) {
    //         return '';
    //     }
    //
    // }

    getStatusBlok(werk_afd_blok_code){
        try {
            let data = TaskService.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
            return data.MATURITY_STATUS;
        } catch (error) {
            return ''
        }
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

    insertDB(param) {

        let inspectionDate = getTodayDate('YYYY-MM-DD HH:mm:ss');
        // let idInspection = `B${this.state.dataLogin[0].USER_AUTH_CODE}${getTodayDate('YYMMDDHHmmss')}`
		let today = getTodayDate('YYMMDD');
        let idInspection = `B${this.state.dataLogin[0].USER_AUTH_CODE}${today}${this.state.werkAfdBlockCode}`

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
            WERKS: this.state.werks,
            BLOCK_CODE: this.state.blok,
            AFD_CODE: this.state.afdCode,
            WERKS_AFD_BLOCK_CODE: this.state.werkAfdBlockCode,
            INSPECTION_DATE: inspectionDate,
            STATUS_SYNC: 'N',
            INSPECTION_RESULT: '',
            INSPECTION_SCORE: '',
            FULFILL_BARIS: 'N',
            TR_FINDING_CODES:[]
        }


        //for track
        let time = TaskService.getAllData('TM_TIME_TRACK')[0];
        let duration = 10000
        if(time !== undefined){
             duration = parseFloat(time.DESC);
        }
        let id = 0;//setInterval(()=> this.getLocation2(this.state.blokInspeksiCode), duration);

        this.props.navigation.navigate('TakeFotoBaris', {
            inspeksiHeader: modelInspeksiH,
            dataUsual: params,
            statusBlok: param,
            waktu: getTodayDate('YYYY-MM-DD  HH:mm:ss'),
            intervalId: id,
            dataInspeksi: model,
            inspectionType  : this.state.inspectionType === 'genba' ? 'genba' : 'normal'
        });
    }

    // checkSameBlock(idInspection){
    //     let data = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection)
    //     if(data !== undefined){
    //         let dataHeader = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection)
    //         dataHeader = dataHeader.sorted('AREAL')
    //     }
    // }

    // navigateScreen(screenName, modelInspeksiH, params, statusBlok, intervalId, dataInspeksi) {
    //     const navigation = this.props.navigation;
    //     const resetAction = StackActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: screenName, params : {
    //         inspeksiHeader: modelInspeksiH,
    //         dataUsual: params,
    //         statusBlok: statusBlok,
    //         waktu: getTodayDate('YYYY-MM-DD  HH:mm:ss'),
    //         intervalId: intervalId,
    //         dataInspeksi: dataInspeksi
    //         }
    //       })]
    //     });
    //     navigation.dispatch(resetAction);
    // }

    render() {
        // const { query } = this.state;
        // const person = this.findPerson(query);
        // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
                />
                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    title={this.state.title}
                    message={this.state.message} />

                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal2}
                    onPressCancel={() => {this.setState({ showModal2: false }); this.selesai()}}
                    title={this.state.title}
                    message={this.state.message} />

                <ModalAlertConfirmation
                    icon={this.state.icon}
                    visible={this.state.showModalAlert}
                    onPressCancel={() => this.setState({ showModalAlert: false })}
                    onPressSubmit={() => { this.setState({ showModalAlert: false }); this.selesai() }}
                    title={this.state.title}
                    message={this.state.message}
                />

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
                            {/* <Autocomplete
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
                            /> */}
                            <TextInput
                                editable={false}
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput]}
                                value={this.state.allShow}
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
                    {/* {this.state.latitude !== 0.0 && this.state.longitude !== 0.0&&
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
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
                        style={{ alignSelf: 'flex-end', marginBottom:130, marginRight: 10}}/>}  */}

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
        flex:1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    bubble: {
        // backgroundColor: '#ff8080',
        backgroundColor: Colors.brand,
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
