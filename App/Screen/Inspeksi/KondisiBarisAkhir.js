import React, {Component} from 'react';
import {Text, BackHandler, Alert, TextInput, StyleSheet, TouchableOpacity, View, Switch, StatusBar,
    Button,} from 'react-native';
import {
	Container,
	Content,  
	Card,
	CardItem,
} from 'native-base';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, ProviderPropType, Marker, AnimatedRegion } from 'react-native-maps';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import TaskService from '../../Database/TaskServices';
import {getTodayDate, getCalculateTime, getUUID} from '../../Lib/Utils'
import { NavigationActions, StackActions  } from 'react-navigation';
import R from 'ramda';
import geolib from 'geolib';
import Geojson from 'react-native-geojson';
import { ProgressDialog } from 'react-native-simple-dialogs';
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import TaskServices from '../../Database/TaskServices';


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

class KondisiBarisAkhir extends Component{

    static navigationOptions = {
        headerStyle: {
          backgroundColor: Colors.tintColor
        },
        title: 'Buat Inspeksi',
        headerTintColor: '#fff',
        headerTitleStyle: {
          flex: 1,
          fontSize: 18,
          fontWeight: '400'
        },
      };

    constructor(props){
        super(props);

        let params = props.navigation.state.params;
        let fotoBaris = R.clone(params.fotoBaris);
        let fotoSelfie = R.clone(params.fotoSelfie);
        let inspeksiHeader = R.clone(params.inspeksiHeader);
        let kondisiBaris1 = R.clone(params.kondisiBaris1);
        let kondisiBaris2 = R.clone(params.kondisiBaris2);
        let dataUsual = R.clone(params.dataUsual);
        let statusBlok = R.clone(params.statusBlok);
        let from = R.clone(params.from);
        let intervalId = R.clone(params.intervalId);
        let dataInspeksi = R.clone(params.dataInspeksi);

        this.state = {
            intervalId,
            latitude:0.0,
            longitude:0.0,
            error:null,
            switchLanjut: true,
            fulFillMandatory: false,
            txtBaris:'',
            tumbButtonSlide:{
                width: 55,
                height:45,
                borderRadius: 20,
                borderWidth:1,
                borderColor:'#C8C8C8',
                backgroundColor: Colors.tintColor,
            },
            fotoBaris,
            fotoSelfie,
            inspeksiHeader,
            kondisiBaris1,
            kondisiBaris2,
            dataUsual,
            idBaris:0,
            menit:'',
            jarak: '',
            statusBlok,
            dataInspeksi,
            fetchLocation: false,
            from,
            distance: ''
        };
    }

    componentDidMount(){
        if(this.state.from === 'history'){         
            let time = this.state.inspeksiHeader.TIME;
            let distance = this.state.inspeksiHeader.DISTANCE;    
            this.setState({menit:time, distance: distance, jarak: distance});
        }else{
            let sda = this.totalWaktu();
            this.setState({menit:sda.toString()})
        }
        this.getLocation();
    }

    totalWaktu(){
        let now = new Date();
        let startTime = this.state.inspeksiHeader.START_INSPECTION;
        startTime = startTime.replace(' ', 'T');
        startTime = new Date(startTime);
        let time = getCalculateTime(startTime, now);
        return time;
    }

    totalJarak(coord){
        let distance = geolib.getDistance(coord, {
            latitude: parseFloat(this.state.inspeksiHeader.LAT_START_INSPECTION), 
            longitude: parseFloat(this.state.inspeksiHeader.LONG_START_INSPECTION)
        });
        return distance;
    }

    getLocation = () =>{
		navigator.geolocation.getCurrentPosition(
			(position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                // var initialRegion = new AnimatedRegion({
                //     latitude:lat,
                //     longitude:lon,
                //     latitudeDelta:0.015,
                //     longitudeDelta:0.0121
                // });
                // this.setState({initialPosition:initialRegion});
                // this.setState({initialMarker:initialRegion});
                let totalJarak = this.state.from == 'history' ? this.state.distance : this.totalJarak({latitude:lat, longitude:lon});
                this.setState({latitude:lat, longitude:lon, jarak: totalJarak.toString(), fetchLocation: false});

			},
			(error) => {
				// this.setState({ error: error.message, fetchingLocation: false })
				let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
				if (error && error.message == "No location provider available.") {
					message = "Mohon nyalakan GPS anda terlebih dahulu.";
				}
                // Alert.alert('Informasi', message);
                alert(message)
                this.setState({fetchLocation:false})
				// console.log(message);
			}, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, 
            //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position 
        );
    }

    changeColorSlide(){          
        // this.props.navigation.navigate('SelesaiInspeksi');    
        let total = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION).length;
        if(total >= 1){
            this.setState({fulFillMandatory:true})
            if(!this.state.switchLanjut){
                btn = {
                    width: 55,
                    height:45,
                    borderRadius: 20,
                    borderWidth:1,
                    borderColor:'#C8C8C8',
                    backgroundColor: Colors.tintColor,
                }
            }else{
                btn = {
                    width: 55,
                    height:45,
                    borderRadius: 20,
                    borderWidth:1,
                    borderColor:'#C8C8C8',
                    backgroundColor: Colors.brandSecondary,
                }
            }
            this.setState({tumbButtonSlide:btn})
        }else{
            this.setState({switchLanjut: true})
            Alert.alert('Maaf, harap lanjutkan 1 baris lagi ');
        }
        
    }

    onSlideRight = () => {
        this.validation()
    };

    validation(){
        if(this.state.txtBaris == '' && this.state.switchLanjut){
            alert('Masukan baris');
        }else if(this.state.txtBaris == this.state.dataUsual.BARIS && this.state.switchLanjut){
            alert('Baris tidak boleh sama dengan sebelumnya')
        }else{
            this.saveData();
        }
    }

    calculateBaris(){
        
        var piringan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'BLOCK_INSPECTION_CODE'], ['CC0007', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE]);
        var sarkul = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','BLOCK_INSPECTION_CODE'], ['CC0008', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE]);
        var tph = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','BLOCK_INSPECTION_CODE'], ['CC0009', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE]);
        var gawangan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','BLOCK_INSPECTION_CODE'], ['CC0010', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE]);
        var prunning = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','BLOCK_INSPECTION_CODE'], ['CC0011', this.state.inspeksiHeader.BLOCK_INSPECTION_CODE]);        
        
        var jmlNilaiPiringan = this.getTotalNilaiComponent(piringan);
        var jmlNilaiSarkul = this.getTotalNilaiComponent(sarkul);
        var jmlNilaiTph = this.getTotalNilaiComponent(tph);
        var jmlNilaiGwg = this.getTotalNilaiComponent(gawangan);
        var jmlNilaiPrun = this.getTotalNilaiComponent(prunning);

        var avg_piringan = jmlNilaiPiringan/1;
        var avg_sarkul = jmlNilaiSarkul/1;
        var avg_tph = jmlNilaiTph/1;
        var avg_gwg = jmlNilaiGwg/1;
        var avg_prun = jmlNilaiPrun/1;

        let bobotPiringan = 4;
        let bobotSarkul = 5;
        let bobotTph = 2;
        let bobotGwg = 1;
        let bobotPrun = 3;

        let nilai = 0;
        if(this.state.statusBlok === 'TM'){
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg) + (avg_tph*bobotTph) + (avg_prun*bobotPrun)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg + bobotPrun);
        }else if(this.state.statusBlok === 'TBM 3'){
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg) + (avg_tph*bobotTph)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg);
        }else{
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg)) / (bobotPiringan + bobotSarkul + bobotGwg);
        }
        var result =  this.getKonversiNilaiKeHuruf(nilai);

        return [nilai.toString(), result] //[0]score [1]value
    }

    calculate(){
        let barisPembagi = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION);

        var piringan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE', 'ID_INSPECTION'], ['CC0007', this.state.dataInspeksi.ID_INSPECTION]);
        var sarkul = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','ID_INSPECTION'], ['CC0008', this.state.dataInspeksi.ID_INSPECTION]);
        var tph = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','ID_INSPECTION'], ['CC0009', this.state.dataInspeksi.ID_INSPECTION]);
        var gawangan = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','ID_INSPECTION'], ['CC0010', this.state.dataInspeksi.ID_INSPECTION]);
        var prunning = TaskService.findByWithList('TR_BLOCK_INSPECTION_D', ['CONTENT_INSPECTION_CODE','ID_INSPECTION'], ['CC0011', this.state.dataInspeksi.ID_INSPECTION]);        
        
        var jmlNilaiPiringan = this.getTotalNilaiComponent(piringan);
        var jmlNilaiSarkul = this.getTotalNilaiComponent(sarkul);
        var jmlNilaiTph = this.getTotalNilaiComponent(tph);
        var jmlNilaiGwg = this.getTotalNilaiComponent(gawangan);
        var jmlNilaiPrun = this.getTotalNilaiComponent(prunning);

        var avg_piringan = jmlNilaiPiringan/barisPembagi.length;
        var avg_sarkul = jmlNilaiSarkul/barisPembagi.length;
        var avg_tph = jmlNilaiTph/barisPembagi.length;
        var avg_gwg = jmlNilaiGwg/barisPembagi.length;
        var avg_prun = jmlNilaiPrun/barisPembagi.length;

        let bobotPiringan = 4;
        let bobotSarkul = 5;
        let bobotTph = 2;
        let bobotGwg = 1;
        let bobotPrun = 3;

        let nilai = 0;
        if(this.state.statusBlok === 'TM'){
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg) + (avg_tph*bobotTph) + (avg_prun*bobotPrun)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg + bobotPrun);
        }else if(this.state.statusBlok === 'TBM 3'){
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg) + (avg_tph*bobotTph)) / (bobotPiringan + bobotSarkul + bobotTph + bobotGwg);
        }else{
            nilai = ((avg_piringan*bobotPiringan) + (avg_sarkul*bobotSarkul) + (avg_gwg*bobotGwg)) / (bobotPiringan + bobotSarkul + bobotGwg);
        }
        var result =  this.getKonversiNilaiKeHuruf(nilai);

        
        let param = [nilai.toString(), result]
        let dataInspeksi = TaskService.getAllData('TR_BARIS_INSPECTION')
        let indexData = R.findIndex(R.propEq('ID_INSPECTION', this.state.dataInspeksi.ID_INSPECTION))(dataInspeksi);
        TaskService.updateScoreInspeksi(param, indexData);

        // barisPembagi.map(item=>{TaskService.updateInspectionHScore(item.BLOCK_INSPECTION_CODE, param) })
        
        let val = this.calculateBaris()
        TaskService.updateInspectionHScore(this.state.inspeksiHeader.BLOCK_INSPECTION_CODE, val)

        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,            
			actions: [NavigationActions.navigate({ 
                routeName: 'SelesaiInspeksi', 
                params : { 
                    inspeksiHeader: this.state.inspeksiHeader, 
                    statusBlok: this.state.statusBlok,
                    dataInspeksi: dataInspeksi[indexData]
                } 
            })]
        });
        clearInterval(this.state.intervalId)
        navigation.dispatch(resetAction);

    }

    getKonversiNilaiKeHuruf(param){
        if(param > 2.5 && param <= 3){
            return 'A';
        }else if(param > 2 && param <= 2.5){
            return 'B';
        }else if(param > 1 && param <= 2){
            return 'C';
        }else if(param >= 0 && param <= 1){
            return 'F';
        }
    }

    getTotalNilaiComponent(allComponent){
        var val = 0;
        for(var i=0; i < allComponent.length; i++){
            if(i==0){
                val = this.getKonversiNilai(allComponent[i].VALUE);
            }else{
                val = val + this.getKonversiNilai(allComponent[i].VALUE);
            }
        }
        return val;
    }

    getKonversiNilai(param){
        if(param === 'REHAB'){
            return 0;
        }else if(param === 'KURANG'){
            return 1;
        }else if(param === 'SEDANG'){
            return 2;
        }else if(param === 'BAIK'){
            return 3;
        }else{
            return 0;
        }
    }

    saveData(){
        if(this.state.from !== 'history'){

            var modelInspeksiH = {
                BLOCK_INSPECTION_CODE: this.state.inspeksiHeader.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                WERKS: this.state.inspeksiHeader.WERKS,
                AFD_CODE: this.state.inspeksiHeader.AFD_CODE,
                BLOCK_CODE: this.state.inspeksiHeader.BLOCK_CODE,
                AREAL: this.state.inspeksiHeader.AREAL,
                INSPECTION_TYPE: "PANEN",
                STATUS_BLOCK: this.state.inspeksiHeader.STATUS_BLOCK,
                INSPECTION_DATE: this.state.inspeksiHeader.INSPECTION_DATE, //getTodayDate('DD MMM YYYY HH:mm:ss'), //12 oct 2018 01:01:01
                INSPECTION_SCORE: '',
                INSPECTION_RESULT: '',
                STATUS_SYNC:'N',
                SYNC_TIME:'',
                START_INSPECTION: this.state.inspeksiHeader.START_INSPECTION,//getTodayDate('DD MMM YYYY HH:mm:ss'),
                END_INSPECTION: getTodayDate('YYYY-MM-DD HH:mm:ss'),
                LAT_START_INSPECTION: this.state.inspeksiHeader.LAT_START_INSPECTION, //this.state.latitude.toString(),
                LONG_START_INSPECTION: this.state.inspeksiHeader.LONG_START_INSPECTION,//this.state.longitude.toString(),
                LAT_END_INSPECTION: this.state.latitude.toString(),
                LONG_END_INSPECTION: this.state.longitude.toString(),
                INSERT_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss'), 
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                TIME: this.state.menit,
                DISTANCE: this.state.jarak
            }       
            TaskService.saveData('TR_BLOCK_INSPECTION_H', modelInspeksiH);
    
            var image = {
                TR_CODE: this.state.fotoBaris.TR_CODE,
                IMAGE_CODE: this.state.fotoBaris.IMAGE_CODE,
                IMAGE_NAME: this.state.fotoBaris.IMAGE_NAME,
                IMAGE_PATH_LOCAL: this.state.fotoBaris.IMAGE_PATH_LOCAL,
                IMAGE_URL: '',
                STATUS_IMAGE: 'BARIS',
                STATUS_SYNC: 'N',
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                INSERT_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
            }
            TaskService.saveData('TR_IMAGE', image);
    
            var selfie = {
                TR_CODE: this.state.fotoSelfie.TR_CODE,
                IMAGE_CODE: this.state.fotoSelfie.IMAGE_CODE,
                IMAGE_NAME: this.state.fotoSelfie.IMAGE_NAME,
                IMAGE_PATH_LOCAL: this.state.fotoSelfie.IMAGE_PATH_LOCAL,
                IMAGE_URL: '',
                STATUS_IMAGE: 'SELFIE',
                STATUS_SYNC: 'N',
                INSERT_USER: this.state.dataUsual.USER_AUTH,
                INSERT_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
            }        
            TaskService.saveData('TR_IMAGE', selfie);
    
            if(this.state.kondisiBaris1 !== 'undefined'){
                for(var i=0; i<this.state.kondisiBaris1.length; i++){
                    var model = this.state.kondisiBaris1[i];
                    mdl = {
                        BLOCK_INSPECTION_CODE_D: model.BLOCK_INSPECTION_CODE_D,
                        BLOCK_INSPECTION_CODE: model.BLOCK_INSPECTION_CODE,
                        ID_INSPECTION: model.ID_INSPECTION,
                        CONTENT_INSPECTION_CODE: model.CONTENT_INSPECTION_CODE,
                        VALUE: model.VALUE,
                        AREAL: this.state.dataUsual.BARIS,
                        STATUS_SYNC: 'N',
                        INSERT_USER: this.state.dataUsual.USER_AUTH,
                        INSERT_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
                        
                    }
                    TaskService.saveData('TR_BLOCK_INSPECTION_D', mdl);     
                }
            }        
    
            if(this.state.kondisiBaris2 !== 'undefined'){
                for(var i=0; i<this.state.kondisiBaris2.length; i++){
                    var model = this.state.kondisiBaris2[i];
                    mdl = {
                        BLOCK_INSPECTION_CODE_D: model.BLOCK_INSPECTION_CODE_D,
                        BLOCK_INSPECTION_CODE: model.BLOCK_INSPECTION_CODE,
                        ID_INSPECTION: model.ID_INSPECTION,
                        CONTENT_INSPECTION_CODE: model.CONTENT_INSPECTION_CODE,
                        VALUE: model.VALUE,
                        AREAL: this.state.dataUsual.BARIS,
                        STATUS_SYNC: 'N',
                        INSERT_USER: this.state.dataUsual.USER_AUTH,
                        INSERT_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
                    }
                    TaskService.saveData('TR_BLOCK_INSPECTION_D', mdl);        
                }
            }

            TaskService.saveData('TR_BARIS_INSPECTION', this.state.dataInspeksi)
        }

        let blokInspectionCode = `I${this.state.dataUsual.USER_AUTH}${getTodayDate('YYMMDDHHmmss')}`
        var params = {
            USER_AUTH: this.state.dataUsual.USER_AUTH,
            BA: this.state.dataUsual.BA,
            AFD: this.state.dataUsual.AFD,
            BLOK: this.state.dataUsual.BLOK, 
            BARIS: this.state.txtBaris,
            BLOCK_INSPECTION_CODE: blokInspectionCode
        }

        if(this.state.fulFillMandatory){
            this.calculate();
        }else{  
        
            let param = this.calculateBaris()
            TaskService.updateInspectionHScore(this.state.dataUsual.BLOCK_INSPECTION_CODE, param)

            var modelInspeksi = {
                BLOCK_INSPECTION_CODE: blokInspectionCode,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                WERKS: this.state.inspeksiHeader.WERKS,
                AFD_CODE: this.state.inspeksiHeader.AFD_CODE,
                BLOCK_CODE: this.state.inspeksiHeader.BLOCK_CODE,
                AREAL: this.state.txtBaris,
                INSPECTION_TYPE: "PANEN",
                STATUS_BLOCK: this.state.inspeksiHeader.STATUS_BLOCK,
                INSPECTION_DATE: this.state.inspeksiHeader.INSPECTION_DATE,
                INSPECTION_SCORE:'',
                INSPECTION_RESULT:'',
                STATUS_SYNC:'N',
                SYNC_TIME:'',
                START_INSPECTION: getTodayDate('YYYY-MM-DD HH:mm:ss'),
                END_INSPECTION: '',
                LAT_START_INSPECTION: this.state.inspeksiHeader.LAT_START_INSPECTION,
                LONG_START_INSPECTION: this.state.inspeksiHeader.LONG_START_INSPECTION,
                LAT_END_INSPECTION: '',
                LONG_END_INSPECTION: '',
            }
            let model =  {
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                BLOCK_INSPECTION_CODE: blokInspectionCode,
                EST_NAME: this.state.dataInspeksi.EST_NAME,
                BLOCK_CODE: this.state.dataInspeksi.BLOCK_CODE,
                AFD_CODE: this.state.dataInspeksi.AFD_CODE,
                INSPECTION_DATE: this.state.dataInspeksi.INSPECTION_DATE,
                STATUS_SYNC: 'N',
                INSPECTION_RESULT: '',
                INSPECTION_SCORE: ''
            }
            this.navigateScreen('TakeFotoBaris', params, modelInspeksi, model);
        }
        
        
    }

    navigateScreen(screenName, params, inspeksiH, dataInspeksi) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,            
			actions: [NavigationActions.navigate({ routeName: screenName, params : { 
                dataUsual : params, 
                inspeksiHeader: inspeksiH, 
                from: 'kondisiBaris', 
                statusBlok:this.state.statusBlok,
                intervalId: this.state.intervalId,
                dataInspeksi: dataInspeksi,
             } 
            })]
        });
        navigation.dispatch(resetAction);
    }

    render(){
        return(
            <View style={styles.mainContainer}>
                {/*STEPPER*/}
                <View style={{flexDirection:'row', marginLeft:20, marginRight:20, marginTop:10}}>
                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber,{backgroundColor:Colors.brand}]}>
                            <Text style={styles.stepperNumberText}>1</Text>
                        </View>
                        <Text style={[Fonts.style.caption,{paddingLeft: 3,color:Colors.brand}]}>Pilih Lokasi</Text>
                        <View>
                            <Icon
                            name="chevron-right"
                            size={24}
                            color={Colors.brand}
                            style={styles.stepperNext}/>
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber,{backgroundColor:Colors.buttonDisabled}]}>
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption,{paddingLeft: 3,color:Colors.textSecondary}]}>Kondisi Baris</Text>
                        <View>
                            <Icon
                            name="chevron-right"
                            size={24}
                            color={Colors.buttonDisabled}
                            style={styles.stepperNext}/>
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber,{backgroundColor:Colors.buttonDisabled}]}>
                            <Text style={styles.stepperNumberText}>3</Text>
                        </View>
                        <Text style={[Fonts.style.caption,{paddingLeft: 3,color:Colors.textSecondary}]}>Summary</Text>
                    </View>
                </View>

                {/*MAPS*/}
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

                        <IconLoc
                            onPress={()=>{this.getLocation()}}
                            name="location-arrow"
                            size={24}
                            style={{ alignSelf: 'flex-end', marginBottom:210, marginRight: 10}}/>  

                        <View style={{height:250, marginLeft:20, marginRight:20}}>
                            <Card style={[styles.cardContainer]}>
                                <CardItem>
                                    <View style={{flex:1}}>
                                        <Text style={{color:'black'}}>Total Waktu dan Jarak:</Text>
                                        <Text style={{color:'black'}}>{this.state.menit} Menit dan {this.state.jarak} m</Text>
                                        <View style={{flexDirection:'row', marginTop:10}}>
                                            <Text style={{color:'grey'}}>Lanjut Baris Berikutnya ?</Text>
                                            <Switch
                                                onValueChange={(value) => {this.setState({switchLanjut:value}); this.changeColorSlide()}}
                                                style={{marginBottom: 10, position:'absolute', right:0}}
                                                value={this.state.switchLanjut} />
                                        </View>
                                        {!!this.state.switchLanjut &&
                                            <View style={{flexDirection:'row', marginTop:15}}>
                                                <Text style={{color:'grey', marginTop:15}}>ke Baris Berapa ?</Text>
                                                <TextInput
                                                    keyboardType={'numeric'}
                                                    underlineColorAndroid={'transparent'}
                                                    style={[styles.searchInput,{marginBottom:10, position:'absolute', right:0}]}
                                                    value={this.state.txtBaris}                                    
                                                    onChangeText={(baris) => { baris = baris.replace(/[^0-9]/g, ''); this.setState({ txtBaris: baris }) }}/>
                                            </View>
                                        }
                                        {/*SLIDER*/}
                                        <View style={{padding:10, alignItems:'center', marginTop:15}}>
                                            <RNSlidingButton
                                                style={styles.buttonSlide}
                                                height={45}
                                                onSlidingSuccess={this.onSlideRight}
                                                slideDirection={SlideDirection.RIGHT}>
                                                <View style={{flexDirection:'row'}}>
                                                    <TouchableOpacity style={[styles.bubble, this.state.tumbButtonSlide] } onPress={()=>{}}>
                                                        <Icon name={"chevron-right"}  size={20} color="white" />
                                                    </TouchableOpacity>
                                                    <Text numberOfLines={1} style={[styles.titleText,{alignItems:'center'}]}>
                                                        {this.state.switchLanjut ? 'Lanjut': 'Selesai'}
                                                    </Text>
                                                </View>
                                                </RNSlidingButton>
                                        </View>
                                    </View>
                                </CardItem>
                            </Card>
                        </View>
                    
                    </View>

                {/* {<ProgressDialog
                        visible={this.state.fetchLocation}
                        activityIndicatorSize="large"
                        message="Mencari Lokasi..."
                />} */}
                
            </View>
        )
    }
}

export default KondisiBarisAkhir;

const styles = {
    mainContainer:{
        flex:1,
        backgroundColor:'white'
        // padding:20
    },
    containerStepper:{        
        flexDirection:'row',
        alignItems:'center',
        height:40,
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
    containerMap:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        marginTop:10
    },
    map: {
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0
    },
    cardContainer : {
        width:300,
        paddingTop:10,
        paddingBottom:5,
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    searchInput: {
        width:60,
        height: 40,
        padding: 10,
        marginRight: 5,
        marginLeft:5,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#989898',
        color: 	'#808080',
        textAlign:'center'
    },
    buttonSlide: {
        width: 200,
        borderRadius: 20,
        backgroundColor: '#DCDCDC',
    },
    bubble: {
        backgroundColor: Colors.tintColor,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    titleText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#A9A9A9',
        paddingHorizontal: 18,
        paddingVertical: 12,
        
    }
    // bubble: {
    //     backgroundColor: '#ff8080',
    //     paddingHorizontal: 18,
    //     paddingVertical: 12,
    //     borderRadius: 20,
    // },
    // buttonText: {
    //     fontSize:17,
    //     color:'#ffffff',
    //     textAlign:'center'
    // },
    // button: {
    //     width: 200,
    //     paddingHorizontal: 12,
    //     alignItems: 'center',
    //     marginHorizontal: 10,
    //     padding:10 ,
    // },
    // buttonContainer: {
    //     flexDirection: 'row',
    //     marginVertical: 20,
    //     backgroundColor: 'transparent',
    // },
}