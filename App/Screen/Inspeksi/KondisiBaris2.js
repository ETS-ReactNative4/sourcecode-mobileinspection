import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, Text, View, Switch, StatusBar, Image, AsyncStorage, BackAndroid } from 'react-native';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import BtnStyles from './Component/ButtonStyle'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RNSlidingButton, SlideDirection } from 'rn-sliding-button';
import Entypo from 'react-native-vector-icons/Entypo'
import { NavigationActions, StackActions } from 'react-navigation';
import { getTodayDate } from '../../Lib/Utils';
import R from 'ramda';
import ModalAlert from '../../Component/ModalAlert'

class KondisiBaris2 extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.tintColorPrimary
            },
            title: 'Kondisi Baris',
            headerTintColor: '#fff',
            headerTitleStyle: {
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            },
            headerRight: (
                <TouchableOpacity onPress={() => { navigation.navigate('Step1Finding', { 
                    data: params.getData,
                    dataInspeksi: params.getDataInspeksi,
                    updateTRBaris: params.updateTRBaris
                })}}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 16 }}>
                        <Entypo name='flashlight' size={24} color='white' />
                    </View>
                </TouchableOpacity>
            )
        }        
    };

    constructor(props) {
        super(props);

        
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        let params = props.navigation.state.params;
        let fotoBaris = R.clone(params.fotoBaris);
        let inspeksiHeader = R.clone(params.inspeksiHeader);
        let kondisiBaris1 = R.clone(params.kondisiBaris1);
        let dataUsual = R.clone(params.dataUsual);
        let statusBlok = R.clone(params.statusBlok);
        let intervalId = R.clone(params.intervalId);
        let dataInspeksi = R.clone(params.dataInspeksi);

        this.state = {

            intervalId,

            //piringan  
            piringan: '',
            btnPiringanRehab: BtnStyles.btnBiasa2,
            btnPiringanKurang: BtnStyles.btnBiasa2,
            btnPiringanSedang: BtnStyles.btnBiasa2,
            btnPiringanBaik: BtnStyles.btnBiasa2,

            txtPiringanRehab: styles.buttonText2,
            txtPiringanKurang: styles.buttonText2,
            txtPiringanSedang: styles.buttonText2,
            txtPiringanBaik: styles.buttonText2,

            //passar pikul
            sarKul: '',
            btnSarkulRehab: BtnStyles.btnBiasa2,
            btnSarkulKurang: BtnStyles.btnBiasa2,
            btnSarkulSedang: BtnStyles.btnBiasa2,
            btnSarkulBaik: BtnStyles.btnBiasa2,
            
            txtSarkulRehab: styles.buttonText2,
            txtSarkulKurang: styles.buttonText2,
            txtSarkulSedang: styles.buttonText2,
            txtSarkulBaik: styles.buttonText2,

            //TPH
            TPH: '',
            btnTPHRehab: BtnStyles.btnBiasa2,
            btnTPHKurang: BtnStyles.btnBiasa2,
            btnTPHSedang: BtnStyles.btnBiasa2,
            btnTPHBaik: BtnStyles.btnBiasa2,
            
            txtTphRehab: styles.buttonText2,
            txtTphKurang: styles.buttonText2,
            txtTphSedang: styles.buttonText2,
            txtTphBaik: styles.buttonText2,

            //GAWANGAN
            GWG: '',
            btnGWGRehab: BtnStyles.btnBiasa2,
            btnGWGKurang: BtnStyles.btnBiasa2,
            btnGWGSedang: BtnStyles.btnBiasa2,
            btnGWGBaik: BtnStyles.btnBiasa2,

            txtGwgRehab: styles.buttonText2,
            txtGwgKurang: styles.buttonText2,
            txtGwgSedang: styles.buttonText2,
            txtGwgBaik: styles.buttonText2,

            //PRUNNINGAN
            PRUN: '',
            btnPRUNRehab: BtnStyles.btnBiasa2,
            btnPRUNKurang: BtnStyles.btnBiasa2,
            btnPRUNSedang: BtnStyles.btnBiasa2,
            btnPRUNBaik: BtnStyles.btnBiasa2,
            
            txtPrunRehab: styles.buttonText2,
            txtPrunKurang: styles.buttonText2,
            txtPrunSedang: styles.buttonText2,
            txtPrunBaik: styles.buttonText2,

            //TITI PANEN
            TIPA: '',
            btnTIPARehab: BtnStyles.btnBiasa2,
            btnTIPAKurang: BtnStyles.btnBiasa2,
            btnTIPASedang: BtnStyles.btnBiasa2,
            btnTIPABaik: BtnStyles.btnBiasa2,
            
            txtTipaRehab: styles.buttonText2,
            txtTipaKurang: styles.buttonText2,
            txtTipaSedang: styles.buttonText2,
            txtTipaBaik: styles.buttonText2,

            //KASTRASI
            KASTRASI: '',
            btnKastrasiRehab: BtnStyles.btnBiasa2,
            btnKastrasiKurang: BtnStyles.btnBiasa2,
            btnKastrasiSedang: BtnStyles.btnBiasa2,
            btnKastrasiBaik: BtnStyles.btnBiasa2,
            
            txtKastrasiRehab: styles.buttonText2,
            txtKastrasiKurang: styles.buttonText2,
            txtKastrasiSedang: styles.buttonText2,
            txtKastrasiBaik: styles.buttonText2,

            //SANITASI
            SANITASI: '',
            btnSanitasiRehab: BtnStyles.btnBiasa2,
            btnSanitasiKurang: BtnStyles.btnBiasa2,
            btnSanitasiSedang: BtnStyles.btnBiasa2,
            btnSanitasiBaik: BtnStyles.btnBiasa2,
            
            txtSanitasiRehab: styles.buttonText2,
            txtSanitasiKurang: styles.buttonText2,
            txtSanitasiSedang: styles.buttonText2,
            txtSanitasiBaik: styles.buttonText2,

            //SISTEM PENABURAN
            PENABUR: '',
            btnPENABURRehab: BtnStyles.btnBiasa2,
            btnPENABURKurang: BtnStyles.btnBiasa2,
            btnPENABURSedang: BtnStyles.btnBiasa2,
            btnPENABURBaik: BtnStyles.btnBiasa2,
            
            txtPenaburRehab: styles.buttonText2,
            txtPenaburKurang: styles.buttonText2,
            txtPenaburSedang: styles.buttonText2,
            txtPenaburBaik: styles.buttonText2,

            //KONDISI PUPUK
            PUPUK: '',
            btnPUPUKRehab: BtnStyles.btnBiasa2,
            btnPUPUKKurang: BtnStyles.btnBiasa2,
            btnPUPUKSedang: BtnStyles.btnBiasa2,
            btnPUPUKBaik: BtnStyles.btnBiasa2,

            txtPupukRehab: styles.buttonText2,
            txtPupukKurang: styles.buttonText2,
            txtPupukSedang: styles.buttonText2,
            txtPupukBaik: styles.buttonText2,

            switchTPH: false,
            switchTIPA: false,

            fotoBaris,
            inspeksiHeader,
            kondisiBaris1,
            dataUsual,
            statusBlok,
            dataInspeksi,

            showPiringan: false,
            showSarkul: false,
            showTph: false,
            showGwg: false,
            showPrun: false,
            showTipa: false,
            showKastrasi: false,
            showSanitasi: false,

            //Add Modal Alert by Aminju 
            title: 'Title',
            message: 'Message',
            showModal: false,
            showModal2: false,
            icon: '',
            inspectionType: props.navigation.getParam('inspectionType', 'normal')

        }
    }

    componentDidMount() {
        this._loadInput();
        this.props.navigation.setParams({ getData: this.state.inspeksiHeader, getDataInspeksi: this.state.dataInspeksi, updateTRBaris: this.updateTRBaris })
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonClick)
        this.hideAndShow();
    }
    componentWillUnmount() {
        this._saveInput();
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.goBack(null)
        // this.setState({
        //     showModal2: true, title: 'Data Hilang',
        //     message: 'Inspeksi mu belum tersimpan loh. Yakin mau dilanjutin?',
        //     icon: require('../../Images/ic-not-save.png')
        // });
        return true;
    }
    updateTRBaris = data => {
        let model =  {
            ID_INSPECTION: data.ID_INSPECTION,
            BLOCK_INSPECTION_CODE: data.BLOCK_INSPECTION_CODE,
            EST_NAME: data.EST_NAME,
            WERKS: data.WERKS,
            BLOCK_CODE: data.BLOCK_CODE,
            AFD_CODE: data.AFD_CODE,
            WERKS_AFD_BLOCK_CODE: data.WERKS_AFD_BLOCK_CODE,
            INSPECTION_DATE: data.INSPECTION_DATE,
            STATUS_SYNC: data.STATUS_SYNC,
            INSPECTION_RESULT: data.INSPECTION_RESULT,
            INSPECTION_SCORE: data.INSPECTION_SCORE,
            FULFILL_BARIS: data.FULFILL_BARIS,
            TR_FINDING_CODES: data.TR_FINDING_CODES
        }    
        this.setState({dataInspeksi: model})   
    }

	_loadInput = async () => {
		try {
			const value = await AsyncStorage.getItem('savedInput');
			if (value !== null) {
				let oldInput = JSON.parse(value);
				if(this.state.dataUsual.BA==oldInput.header.BA&&this.state.dataUsual.AFD==oldInput.header.AFD
					&&this.state.dataUsual.BLOK==oldInput.header.BLOK&&this.state.dataUsual.BARIS==oldInput.header.BARIS){
					for(key in oldInput.detail){
						this.changeColor(key.toUpperCase(),oldInput.detail[key].toUpperCase());
					}
				}
				else{
					this._resetInput();
				}
			}
		} catch (error) {
		}
	};
	_resetInput = async () => {
		try {
			const value = await AsyncStorage.removeItem('savedInput');
		} catch (error) {
		}
	};
	_saveInput = async () => {
		try {
			let currInput = {
				header:JSON.parse(JSON.stringify(this.state.dataUsual)),
				detail:{
					piringan:this.state.piringan,
					sarKul:this.state.sarKul,
					TPH:this.state.TPH,
					GWG:this.state.GWG,
					PRUN:this.state.PRUN,
					TIPA:this.state.TIPA,
					PENABUR:this.state.PENABUR,
					PUPUK:this.state.PUPUK,
					KASTRASI:this.state.KASTRASI,
					SANITASI:this.state.SANITASI
				}
			};
			let jsonString = JSON.stringify(currInput);
			await AsyncStorage.setItem('savedInput', jsonString);
		} catch (error) {
			// Error saving data
		}
	};

    kodisiPemupukanIsOn() {
        const data = this.state.kondisiBaris1;
        let indexPkkTdkPupuk = R.findIndex(R.propEq('CONTENT_INSPECTION_CODE', 'CC0006'))(data);
        let mdl = data[indexPkkTdkPupuk];
        if (mdl.VALUE == '0') {
            return false;
        } else {
            return true;
        }
    }

    hideAndShow() {
        if (this.state.statusBlok == 'TM') {
            this.setState({
                showPiringan: true,
                showSarkul: true,
                showTph: true,
                showGwg: true,
                showPrun: true,
                showTipa: true,
                showKastrasi: false,
                showSanitasi: false,
                switchTPH: true,
            });
        } else if (this.state.statusBlok == 'TBM 1') {
            this.setState({
                showPiringan: true,
                showSarkul: true,
                showTph: false,
                showGwg: true,
                showPrun: false,
                showTipa: false,
                showKastrasi: false,
                showSanitasi: false,
            });
        } else if (this.state.statusBlok == 'TBM 2') {
            this.setState({
                showPiringan: true,
                showSarkul: true,
                showTph: false,
                showGwg: true,
                showPrun: false,
                showTipa: false,
                showKastrasi: false,
                showSanitasi: false,
            });
        } else if (this.state.statusBlok == 'TBM 3') {
            this.setState({
                showPiringan: true,
                showSarkul: true,
                showTph: true,
                showGwg: true,
                showPrun: false,
                showTipa: true,
                showKastrasi: true,
                showSanitasi: true,
                switchTPH: true
            });
        }
    }

    changeColor(param, value) {
        if (param == 'PIRINGAN' && value == 'REHAB') {
            this.setState({ btnPiringanRehab: BtnStyles.btnRehab, btnPiringanKurang: BtnStyles.btnBiasa2, btnPiringanSedang: BtnStyles.btnBiasa2, btnPiringanBaik: BtnStyles.btnBiasa2, piringan: 'REHAB' });
            this.setState({ txtPiringanRehab: styles.buttonText, txtPiringanKurang: styles.buttonText2, txtPiringanSedang: styles.buttonText2, txtPiringanBaik: styles.buttonText2 });
        } else if (param == 'PIRINGAN' && value == 'KURANG') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa2, btnPiringanKurang: BtnStyles.btnKurang, btnPiringanSedang: BtnStyles.btnBiasa2, btnPiringanBaik: BtnStyles.btnBiasa2, piringan: 'KURANG' });
            this.setState({ txtPiringanRehab: styles.buttonText2, txtPiringanKurang: styles.buttonText, txtPiringanSedang: styles.buttonText2, txtPiringanBaik: styles.buttonText2 });
        } else if (param == 'PIRINGAN' && value == 'SEDANG') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa2, btnPiringanKurang: BtnStyles.btnBiasa2, btnPiringanSedang: BtnStyles.btnSedang, btnPiringanBaik: BtnStyles.btnBiasa2, piringan: 'SEDANG' });
            this.setState({ txtPiringanRehab: styles.buttonText2, txtPiringanKurang: styles.buttonText2, txtPiringanSedang: styles.buttonText, txtPiringanBaik: styles.buttonText2 });
        } else if (param == 'PIRINGAN' && value == 'BAIK') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa2, btnPiringanKurang: BtnStyles.btnBiasa2, btnPiringanSedang: BtnStyles.btnBiasa2, btnPiringanBaik: BtnStyles.btnBaik, piringan: 'BAIK' });
            this.setState({ txtPiringanRehab: styles.buttonText2, txtPiringanKurang: styles.buttonText2, txtPiringanSedang: styles.buttonText2, txtPiringanBaik: styles.buttonText });
        } else if (param == 'SARKUL' && value == 'REHAB') {
            this.setState({ btnSarkulRehab: BtnStyles.btnRehab, btnSarkulKurang: BtnStyles.btnBiasa2, btnSarkulSedang: BtnStyles.btnBiasa2, btnSarkulBaik: BtnStyles.btnBiasa2, sarKul: 'REHAB' });
            this.setState({ txtSarkulRehab: styles.buttonText, txtSarkulKurang: styles.buttonText2, txtSarkulSedang: styles.buttonText2, txtSarkulBaik: styles.buttonText2 });
        } else if (param == 'PIRINGAN' && value == 'KURANG') {
        } else if (param == 'SARKUL' && value == 'KURANG') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa2, btnSarkulKurang: BtnStyles.btnKurang, btnSarkulSedang: BtnStyles.btnBiasa2, btnSarkulBaik: BtnStyles.btnBiasa2, sarKul: 'KURANG' });
            this.setState({ txtSarkulRehab: styles.buttonText2, txtSarkulKurang: styles.buttonText, txtSarkulSedang: styles.buttonText2, txtSarkulBaik: styles.buttonText2 });
        } else if (param == 'SARKUL' && value == 'SEDANG') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa2, btnSarkulKurang: BtnStyles.btnBiasa2, btnSarkulSedang: BtnStyles.btnSedang, btnSarkulBaik: BtnStyles.btnBiasa2, sarKul: 'SEDANG' });
            this.setState({ txtSarkulRehab: styles.buttonText2, txtSarkulKurang: styles.buttonText2, txtSarkulSedang: styles.buttonText, txtSarkulBaik: styles.buttonText2 });
        } else if (param == 'SARKUL' && value == 'BAIK') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa2, btnSarkulKurang: BtnStyles.btnBiasa2, btnSarkulSedang: BtnStyles.btnBiasa2, btnSarkulBaik: BtnStyles.btnBaik, sarKul: 'BAIK' });
            this.setState({ txtSarkulRehab: styles.buttonText2, txtSarkulKurang: styles.buttonText2, txtSarkulSedang: styles.buttonText2, txtSarkulBaik: styles.buttonText });
        } else if (param == 'TPH' && value == 'REHAB') {
            this.setState({ btnTPHRehab: BtnStyles.btnRehab, btnTPHKurang: BtnStyles.btnBiasa2, btnTPHSedang: BtnStyles.btnBiasa2, btnTPHBaik: BtnStyles.btnBiasa2, TPH: 'REHAB' });
            this.setState({ txtTphRehab: styles.buttonText, txtTphKurang: styles.buttonText, txtTphSedang: styles.buttonText2, txtTphBaik: styles.buttonText2 });
        } else if (param == 'TPH' && value == 'KURANG') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa2, btnTPHKurang: BtnStyles.btnKurang, btnTPHSedang: BtnStyles.btnBiasa2, btnTPHBaik: BtnStyles.btnBiasa2, TPH: 'KURANG' });
            this.setState({ txtTphRehab: styles.buttonText2, txtTphKurang: styles.buttonText, txtTphSedang: styles.buttonText2, txtTphBaik: styles.buttonText2 });
        } else if (param == 'TPH' && value == 'SEDANG') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa2, btnTPHKurang: BtnStyles.btnBiasa2, btnTPHSedang: BtnStyles.btnSedang, btnTPHBaik: BtnStyles.btnBiasa2, TPH: 'SEDANG' });
            this.setState({ txtTphRehab: styles.buttonText2, txtTphKurang: styles.buttonText2, txtTphSedang: styles.buttonText, txtTphBaik: styles.buttonText2 });
        } else if (param == 'TPH' && value == 'BAIK') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa2, btnTPHKurang: BtnStyles.btnBiasa2, btnTPHSedang: BtnStyles.btnBiasa2, btnTPHBaik: BtnStyles.btnBaik, TPH: 'BAIK' });
            this.setState({ txtTphRehab: styles.buttonText2, txtTphKurang: styles.buttonText2, txtTphSedang: styles.buttonText2, txtTphBaik: styles.buttonText });
        } else if (param == 'GWG' && value == 'REHAB') {
            this.setState({ btnGWGRehab: BtnStyles.btnRehab, btnGWGKurang: BtnStyles.btnBiasa2, btnGWGSedang: BtnStyles.btnBiasa2, btnGWGBaik: BtnStyles.btnBiasa2, GWG: 'REHAB' });
            this.setState({ txtGwgRehab: styles.buttonText, txtGwgKurang: styles.buttonText2, txtGwgSedang: styles.buttonText2, txtGwgBaik: styles.buttonText2 });
        } else if (param == 'GWG' && value == 'KURANG') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa2, btnGWGKurang: BtnStyles.btnKurang, btnGWGSedang: BtnStyles.btnBiasa2, btnGWGBaik: BtnStyles.btnBiasa2, GWG: 'KURANG' });
            this.setState({ txtGwgRehab: styles.buttonText2, txtGwgKurang: styles.buttonText, txtGwgSedang: styles.buttonText2, txtGwgBaik: styles.buttonText2 });
        } else if (param == 'GWG' && value == 'SEDANG') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa2, btnGWGKurang: BtnStyles.btnBiasa2, btnGWGSedang: BtnStyles.btnSedang, btnGWGBaik: BtnStyles.btnBiasa2, GWG: 'SEDANG' });
            this.setState({ txtGwgRehab: styles.buttonText2, txtGwgKurang: styles.buttonText2, txtGwgSedang: styles.buttonText, txtGwgBaik: styles.buttonText2 });
        } else if (param == 'GWG' && value == 'BAIK') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa2, btnGWGKurang: BtnStyles.btnBiasa2, btnGWGSedang: BtnStyles.btnBiasa2, btnGWGBaik: BtnStyles.btnBaik, GWG: 'BAIK' });
            this.setState({ txtGwgRehab: styles.buttonText2, txtGwgKurang: styles.buttonText2, txtGwgSedang: styles.buttonText2, txtGwgBaik: styles.buttonText });
        } else if (param == 'PRUN' && value == 'REHAB') {
            this.setState({ btnPRUNRehab: BtnStyles.btnRehab, btnPRUNKurang: BtnStyles.btnBiasa2, btnPRUNSedang: BtnStyles.btnBiasa2, btnPRUNBaik: BtnStyles.btnBiasa2, PRUN: 'REHAB' });
            this.setState({ txtPrunRehab: styles.buttonText, txtPrunKurang: styles.buttonText2, txtPrunSedang: styles.buttonText2, txtPrunBaik: styles.buttonText2 });
        } else if (param == 'PRUN' && value == 'KURANG') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa2, btnPRUNKurang: BtnStyles.btnKurang, btnPRUNSedang: BtnStyles.btnBiasa2, btnPRUNBaik: BtnStyles.btnBiasa2, PRUN: 'KURANG' });
            this.setState({ txtPrunRehab: styles.buttonText2, txtPrunKurang: styles.buttonText, txtPrunSedang: styles.buttonText2, txtPrunBaik: styles.buttonText2 });
        } else if (param == 'PRUN' && value == 'SEDANG') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa2, btnPRUNKurang: BtnStyles.btnBiasa2, btnPRUNSedang: BtnStyles.btnSedang, btnPRUNBaik: BtnStyles.btnBiasa2, PRUN: 'SEDANG' });
            this.setState({ txtPrunRehab: styles.buttonText2, txtPrunKurang: styles.buttonText2, txtPrunSedang: styles.buttonText, txtPrunBaik: styles.buttonText2 });
        } else if (param == 'PRUN' && value == 'BAIK') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa2, btnPRUNKurang: BtnStyles.btnBiasa2, btnPRUNSedang: BtnStyles.btnBiasa2, btnPRUNBaik: BtnStyles.btnBaik, PRUN: 'BAIK' });
            this.setState({ txtPrunRehab: styles.buttonText2, txtPrunKurang: styles.buttonText2, txtPrunSedang: styles.buttonText2, txtPrunBaik: styles.buttonText });
        } else if (param == 'TIPA' && value == 'REHAB') {
            this.setState({ btnTIPARehab: BtnStyles.btnRehab, btnTIPAKurang: BtnStyles.btnBiasa2, btnTIPASedang: BtnStyles.btnBiasa2, btnTIPABaik: BtnStyles.btnBiasa2, TIPA: 'REHAB' });
            this.setState({ txtTipaRehab: styles.buttonText, txtTipaKurang: styles.buttonText2, txtTipaSedang: styles.buttonText2, txtTipaBaik: styles.buttonText2 });
        } else if (param == 'TIPA' && value == 'KURANG') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa2, btnTIPAKurang: BtnStyles.btnKurang, btnTIPASedang: BtnStyles.btnBiasa2, btnTIPABaik: BtnStyles.btnBiasa2, TIPA: 'KURANG' });
            this.setState({ txtTipaRehab: styles.buttonText2, txtTipaKurang: styles.buttonText, txtTipaSedang: styles.buttonText2, txtTipaBaik: styles.buttonText2 });
        } else if (param == 'TIPA' && value == 'SEDANG') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa2, btnTIPAKurang: BtnStyles.btnBiasa2, btnTIPASedang: BtnStyles.btnSedang, btnTIPABaik: BtnStyles.btnBiasa2, TIPA: 'SEDANG' });
            this.setState({ txtTipaRehab: styles.buttonText2, txtTipaKurang: styles.buttonText2, txtTipaSedang: styles.buttonText, txtTipaBaik: styles.buttonText2 });
        } else if (param == 'TIPA' && value == 'BAIK') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa2, btnTIPAKurang: BtnStyles.btnBiasa2, btnTIPASedang: BtnStyles.btnBiasa2, btnTIPABaik: BtnStyles.btnBaik, TIPA: 'BAIK' });
            this.setState({ txtTipaRehab: styles.buttonText2, txtTipaKurang: styles.buttonText2, txtTipaSedang: styles.buttonText2, txtTipaBaik: styles.buttonText });
        } else if (param == 'PENABUR' && value == 'REHAB') {
            this.setState({ btnPENABURRehab: BtnStyles.btnRehab, btnPENABURKurang: BtnStyles.btnBiasa2, btnPENABURSedang: BtnStyles.btnBiasa2, btnPENABURBaik: BtnStyles.btnBiasa2, PENABUR: 'REHAB' });
            this.setState({ txtPenaburRehab: styles.buttonText, txtPenaburKurang: styles.buttonText2, txtPenaburSedang: styles.buttonText2, txtPenaburBaik: styles.buttonText2 });
        } else if (param == 'PENABUR' && value == 'KURANG') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa2, btnPENABURKurang: BtnStyles.btnKurang, btnPENABURSedang: BtnStyles.btnBiasa2, btnPENABURBaik: BtnStyles.btnBiasa2, PENABUR: 'KURANG' });
            this.setState({ txtPenaburRehab: styles.buttonText2, txtPenaburKurang: styles.buttonText, txtPenaburSedang: styles.buttonText2, txtPenaburBaik: styles.buttonText2 });
        } else if (param == 'PENABUR' && value == 'SEDANG') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa2, btnPENABURKurang: BtnStyles.btnBiasa2, btnPENABURSedang: BtnStyles.btnSedang, btnPENABURBaik: BtnStyles.btnBiasa2, PENABUR: 'SEDANG' });
            this.setState({ txtPenaburRehab: styles.buttonText2, txtPenaburKurang: styles.buttonText2, txtPenaburSedang: styles.buttonText, txtPenaburBaik: styles.buttonText2 });
        } else if (param == 'PENABUR' && value == 'BAIK') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa2, btnPENABURKurang: BtnStyles.btnBiasa2, btnPENABURSedang: BtnStyles.btnBiasa2, btnPENABURBaik: BtnStyles.btnBaik, PENABUR: 'BAIK' });
            this.setState({ txtPenaburRehab: styles.buttonText2, txtPenaburKurang: styles.buttonText2, txtPenaburSedang: styles.buttonText2, txtPenaburBaik: styles.buttonText });
        } else if (param == 'PUPUK' && value == 'REHAB') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnRehab, btnPUPUKKurang: BtnStyles.btnBiasa2, btnPUPUKSedang: BtnStyles.btnBiasa2, btnPUPUKBaik: BtnStyles.btnBiasa2, PUPUK: 'REHAB' });
            this.setState({ txtPupukRehab: styles.buttonText, txtPupukKurang: styles.buttonText2, txtPupuksed: styles.buttonText2, txtPupukBaik: styles.buttonText2 });
        } else if (param == 'PUPUK' && value == 'KURANG') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa2, btnPUPUKKurang: BtnStyles.btnKurang, btnPUPUKSedang: BtnStyles.btnBiasa2, btnPUPUKBaik: BtnStyles.btnBiasa2, PUPUK: 'KURANG' });
            this.setState({ txtPupukRehab: styles.buttonText2, txtPupukKurang: styles.buttonText, txtPupuksed: styles.buttonText2, txtPupukBaik: styles.buttonText2 });
        } else if (param == 'PUPUK' && value == 'SEDANG') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa2, btnPUPUKKurang: BtnStyles.btnBiasa2, btnPUPUKSedang: BtnStyles.btnSedang, btnPUPUKBaik: BtnStyles.btnBiasa2, PUPUK: 'SEDANG' });
            this.setState({ txtPupukRehab: styles.buttonText2, txtPupukKurang: styles.buttonText2, txtPupuksed: styles.buttonText, txtPupukBaik: styles.buttonText2 });
        } else if (param == 'PUPUK' && value == 'BAIK') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa2, btnPUPUKKurang: BtnStyles.btnBiasa2, btnPUPUKSedang: BtnStyles.btnBiasa2, btnPUPUKBaik: BtnStyles.btnBaik, PUPUK: 'BAIK' });
            this.setState({ txtPupukRehab: styles.buttonText2, txtPupukKurang: styles.buttonText2, txtPupuksed: styles.buttonText2, txtPupukBaik: styles.buttonText });
        }

        else if (param == 'KAS' && value == 'REHAB') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnRehab, btnKastrasiKurang: BtnStyles.btnBiasa2, btnKastrasiSedang: BtnStyles.btnBiasa2, btnKastrasiBaik: BtnStyles.btnBiasa2, KASTRASI: 'REHAB' });
            this.setState({ txtKastrasiRehab: styles.buttonText, txtKastrasiKurang: styles.buttonText2, txtKastrasiSedang: styles.buttonText2, txtKastrasiBaik: styles.buttonText2 });
        } else if (param == 'KAS' && value == 'KURANG') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa2, btnKastrasiKurang: BtnStyles.btnKurang, btnKastrasiSedang: BtnStyles.btnBiasa2, btnKastrasiBaik: BtnStyles.btnBiasa2, KASTRASI: 'KURANG' });
            this.setState({ txtKastrasiRehab: styles.buttonText2, txtKastrasiKurang: styles.buttonText, txtKastrasiSedang: styles.buttonText2, txtKastrasiBaik: styles.buttonText2 });
        } else if (param == 'KAS' && value == 'SEDANG') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa2, btnKastrasiKurang: BtnStyles.btnBiasa2, btnKastrasiSedang: BtnStyles.btnSedang, btnKastrasiBaik: BtnStyles.btnBiasa2, KASTRASI: 'SEDANG' });
            this.setState({ txtKastrasiRehab: styles.buttonText2, txtKastrasiKurang: styles.buttonText2, txtKastrasiSedang: styles.buttonText, txtKastrasiBaik: styles.buttonText2 });
        } else if (param == 'KAS' && value == 'BAIK') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa2, btnKastrasiKurang: BtnStyles.btnBiasa2, btnKastrasiSedang: BtnStyles.btnBiasa2, btnKastrasiBaik: BtnStyles.btnBaik, KASTRASI: 'BAIK' });
            this.setState({ txtKastrasiRehab: styles.buttonText2, txtKastrasiKurang: styles.buttonText2, txtKastrasiSedang: styles.buttonText2, txtKastrasiBaik: styles.buttonText });
        }

        else if (param == 'SANIT' && value == 'REHAB') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnRehab, btnSanitasiKurang: BtnStyles.btnBiasa2, btnSanitasiSedang: BtnStyles.btnBiasa2, btnSanitasiBaik: BtnStyles.btnBiasa2, SANITASI: 'REHAB' });
            this.setState({ txtSanitasiRehab: styles.buttonText, txtSanitasiKurang: styles.buttonText2, txtSanitasiSedang: styles.buttonText2, txtSanitasiBaik: styles.buttonText2 });
        } else if (param == 'SANIT' && value == 'KURANG') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa2, btnSanitasiKurang: BtnStyles.btnKurang, btnSanitasiSedang: BtnStyles.btnBiasa2, btnSanitasiBaik: BtnStyles.btnBiasa2, SANITASI: 'KURANG' });
            this.setState({ txtSanitasiRehab: styles.buttonText2, txtSanitasiKurang: styles.buttonText, txtSanitasiSedang: styles.buttonText2, txtSanitasiBaik: styles.buttonText2 });
        } else if (param == 'SANIT' && value == 'SEDANG') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa2, btnSanitasiKurang: BtnStyles.btnBiasa2, btnSanitasiSedang: BtnStyles.btnSedang, btnSanitasiBaik: BtnStyles.btnBiasa2, SANITASI: 'SEDANG' });
            this.setState({ txtSanitasiRehab: styles.buttonText2, txtSanitasiKurang: styles.buttonText2, txtSanitasiSedang: styles.buttonText, txtSanitasiBaik: styles.buttonText2 });
        } else if (param == 'SANIT' && value == 'BAIK') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa2, btnSanitasiKurang: BtnStyles.btnBiasa2, btnSanitasiSedang: BtnStyles.btnBiasa2, btnSanitasiBaik: BtnStyles.btnBaik, SANITASI: 'BAIK' });
            this.setState({ txtSanitasiRehab: styles.buttonText2, txtSanitasiKurang: styles.buttonText2, txtSanitasiSedang: styles.buttonText2, txtSanitasiBaik: styles.buttonText });
        }
    }


    onSlideRight = () => {
        this.validation()
    };

    validation(){
        //TM dan TBM3 TPH mandatory
        //TM Prunning mandatory
        //titi panen jika switch on wajib dipilih
        //TBM3 kastrasi dan sanitasi mandatory
        //
        let title = 'Inputan Tidak Lengkap'
        if (this.state.piringan == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh Piringan belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.sarKul == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh Pasar Pikul belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if ((this.state.statusBlok == 'TM' || this.state.statusBlok == 'TBM 3') && this.state.TPH == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh TPH belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.TPH == '' && this.state.switchTPH == true) {
            this.setState({
                showModal: true, title: title, message: 'Eh TPH belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.GWG == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh Gawangan belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.PRUN == '' && this.state.statusBlok == 'TM') {
            this.setState({
                showModal: true, title: title, message: 'Eh Prunning belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.TIPA == '' && this.state.switchTIPA == true) {
            this.setState({
                showModal: true, title: title, message: 'Eh Titi Panen belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.KASTRASI == '' && this.state.statusBlok == 'TBM 3') {
            this.setState({
                showModal: true, title: title, message: 'Eh Kastrasi belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.state.SANITASI == '' && this.state.statusBlok == 'TBM 3') {
            this.setState({
                showModal: true, title: title, message: 'Eh Sanitasi belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.kodisiPemupukanIsOn() && this.state.PENABUR == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh Sistem Penaburan belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else if (this.kodisiPemupukanIsOn() && this.state.PUPUK == '') {
            this.setState({
                showModal: true, title: title, message: 'Eh Kondisi Pupuk belum diisi loh. Itu wajib diisi yak',
                icon: require('../../Images/ic-inputan-tidak-lengkap.png')
            });
        } else {
            this.insertDB();
        }
    }
	
    insertDB() {
		var today = getTodayDate('YYYYMMDDHHmmss');
        var listBaris2 = [];
        if (this.state.showPiringan) {
            var data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}7`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0007',
                VALUE: this.state.piringan,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        if (this.state.showSarkul) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}8`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0008',
                VALUE: this.state.sarKul,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data)
        }

        if (this.state.showTph && this.state.switchTPH) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}9`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0009',
                VALUE: this.state.TPH,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data)
        }

        if (this.state.showGwg) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}10`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0010',
                VALUE: this.state.GWG,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        if (this.state.showPrun) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}11`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0011',
                VALUE: this.state.PRUN,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        if (this.state.showTipa && this.state.switchTIPA) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}12`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0012',
                VALUE: this.state.TIPA,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        if(this.state.PENABUR !== '' ){
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}13`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0013',
                VALUE: this.state.PENABUR,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }        

        if(this.state.PUPUK !== '' ){
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}14`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0014',
                VALUE: this.state.PUPUK,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }        

        if (this.state.showKastrasi) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}15`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0015',
                VALUE: this.state.KASTRASI,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        if (this.state.showSanitasi) {
            data = {
                BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}16`,
                BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                CONTENT_INSPECTION_CODE: 'CC0016',
                VALUE: this.state.SANITASI,
                AREAL: this.state.dataUsual.BARIS,
                STATUS_SYNC: 'N'
            }
            listBaris2.push(data);
        }

        this.props.navigation.navigate('TakeFotoSelfie', {
            fotoBaris: this.state.fotoBaris,
            inspeksiHeader: this.state.inspeksiHeader,
            kondisiBaris1: this.state.kondisiBaris1,
            kondisiBaris2: listBaris2,
            dataUsual: this.state.dataUsual,
            statusBlok: this.state.statusBlok,
            intervalId: this.state.intervalId,
            dataInspeksi: this.state.dataInspeksi,
            inspectionType  : this.state.inspectionType === 'genba' ? 'genba' : 'normal'
        });
    }

    // navigateScreen(screenName) {
    //     const navigation = this.props.navigation;
    //     const resetAction = StackActions.reset({
    //         index: 0,
    //         actions: [NavigationActions.navigate({ routeName: screenName, params: { from: 'fags' } })]
    //     });
    //     navigation.dispatch(resetAction);
    // }

    // cancelOrder(){
    //     const navigation = this.props.navigation;
    //     let routeName = 'MainMenu';
    //     this.setState({showModal: false})
    //     Promise.all([navigation.dispatch(NavigationActions.navigate({ routeName : routeName}))]).
    //     then(() => navigation.navigate('Inspection')).then(() => navigation.navigate('DaftarInspeksi'));
    // }

    render() {

        return (
            <ScrollView style={styles.mainContainer}>
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

                {/* <ModalAlertConfirmation
                    icon={this.state.icon}
                    visible={this.state.showModal2}
                    onPressCancel={() => this.setState({ showModal: false })}
                    onPressSubmit={() => { this.setState({ showModal: false }); this.props.navigation.goBack(null) }}
                    title={this.state.title}
                    message={this.state.message}
                /> */}

                {/*STEPPER*/}
                <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
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
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.brand }]}>
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.brand }]}>Kondisi Baris</Text>
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
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary }]}>Summary</Text>
                    </View>
                </View>

                {/*LABEL*/}
                <View style={styles.containerLabel}>
                    <View style={{ flex: 2 }}>
                        <Image source={require('../../Images/icon/ic_finish_walking.png')} style={styles.icon} />
                    </View>
                    <View style={{ flex: 7 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Diujung Baris</Text>
                        <Text style={{ fontSize: 12, color: 'grey' }}>Ini untuk kamu input nilai baris.</Text>
                    </View>
                </View>

                {/*border*/}
                <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />


                {/*INPUT*/}
                <View style={{ backgroundColor: 'white', padding: 20 }}>
                    <Text>Perawatan</Text>
                    <View style={{ height: 1, backgroundColor: '#989898', marginBottom: 5, marginTop: 5 }} />

                    {this.state.showPiringan &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Piringan</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnPiringanRehab}
                                    onPress={() => this.changeColor('PIRINGAN', 'REHAB')}>
                                    <Text style={this.state.txtPiringanRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanKurang}
                                    onPress={() => this.changeColor('PIRINGAN', 'KURANG')}>
                                    <Text style={this.state.txtPiringanKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanSedang}
                                    onPress={() => this.changeColor('PIRINGAN', 'SEDANG')}>
                                    <Text style={this.state.txtPiringanSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanBaik}
                                    onPress={() => this.changeColor('PIRINGAN', 'BAIK')}>
                                    <Text style={this.state.txtPiringanBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showSarkul &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Pasar Pikul</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnSarkulRehab}
                                    onPress={() => this.changeColor('SARKUL', 'REHAB')}>
                                    <Text style={this.state.txtSarkulRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulKurang}
                                    onPress={() => this.changeColor('SARKUL', 'KURANG')}>
                                    <Text style={this.state.txtSarkulKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulSedang}
                                    onPress={() => this.changeColor('SARKUL', 'SEDANG')}>
                                    <Text style={this.state.txtSarkulSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulBaik}
                                    onPress={() => this.changeColor('SARKUL', 'BAIK')}>
                                    <Text style={this.state.txtSarkulBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {/* <SwitchSelector options={options} initial={0} borderWidth={2} borderColor={Colors.brand} onPress={value => console.log(`Call onPress with value: ${value}`)} /> */}

                    {this.state.showTph &&
                        <View style={{ marginTop: 15 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: 'grey' }}>TPH</Text>

                                <Switch
                                    thumbTintColor={this.state.switchTPH ? Colors.brand : 'red'}
                                    onTintColor={'#5bc236'}
                                    tintColor={'#ff8080'}
                                    onValueChange={(value) => this.setState({ switchTPH: value })}
                                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginBottom: 10, position: 'absolute', right: 0 }}
                                    value={this.state.switchTPH} />

                                {/* <Switch
                                    onValueChange={(value) => this.setState({ switchTPH: value })}
                                    value={this.state.switchTPH}
                                    thumbTintColor={this.state.switchTPH ? BtnStyles.btnBiasa : 'red'}
                                    onTintColor={this.state.switchTPH ? '#128c7e' : '#ff8080'}
                                    tintColor={this.state.switchTPH ? '#25d366' : "#ff8080"}
                                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginBottom: 10, position: 'absolute', right: 0 }} /> */}
                            </View>

                            {this.state.switchTPH &&
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity style={this.state.btnTPHRehab}
                                        onPress={() => this.changeColor('TPH', 'REHAB')}>
                                        <Text style={this.state.txtTphRehab}>Rehab</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHKurang}
                                        onPress={() => this.changeColor('TPH', 'KURANG')}>
                                        <Text style={this.state.txtTphKurang}>Kurang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHSedang}
                                        onPress={() => this.changeColor('TPH', 'SEDANG')}>
                                        <Text style={this.state.txtTphSedang}>Sedang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHBaik}
                                        onPress={() => this.changeColor('TPH', 'BAIK')}>
                                        <Text style={this.state.txtTphBaik}>Baik</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>}

                    {this.state.showGwg &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Gawangan</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnGWGRehab}
                                    onPress={() => this.changeColor('GWG', 'REHAB')}>
                                    <Text style={this.state.txtGwgRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGKurang}
                                    onPress={() => this.changeColor('GWG', 'KURANG')}>
                                    <Text style={this.state.txtGwgKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGSedang}
                                    onPress={() => this.changeColor('GWG', 'SEDANG')}>
                                    <Text style={this.state.txtGwgSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGBaik}
                                    onPress={() => this.changeColor('GWG', 'BAIK')}>
                                    <Text style={this.state.txtGwgBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showPrun &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Prunning</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnPRUNRehab}
                                    onPress={() => this.changeColor('PRUN', 'REHAB')}>
                                    <Text style={this.state.txtPrunRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNKurang}
                                    onPress={() => this.changeColor('PRUN', 'KURANG')}>
                                    <Text style={this.state.txtPrunKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNSedang}
                                    onPress={() => this.changeColor('PRUN', 'SEDANG')}>
                                    <Text style={this.state.txtPrunSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNBaik}
                                    onPress={() => this.changeColor('PRUN', 'BAIK')}>
                                    <Text style={this.state.txtPrunBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showTipa &&
                        <View style={{ marginTop: 15 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: 'grey' }}>Titi Panen</Text>
                                <Switch
                                    thumbTintColor={this.state.switchTIPA ? Colors.brand : 'red'}
                                    onTintColor={'#5bc236'}
                                    tintColor={'#ff8080'}
                                    onValueChange={(value) => this.setState({ switchTIPA: value })}
                                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginBottom: 10, position: 'absolute', right: 0 }}
                                    value={this.state.switchTIPA} />
                            </View>

                            {this.state.switchTIPA &&
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <TouchableOpacity style={this.state.btnTIPARehab}
                                        onPress={() => this.changeColor('TIPA', 'REHAB')}>
                                        <Text style={this.state.txtTipaRehab}>Rehab</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPAKurang}
                                        onPress={() => this.changeColor('TIPA', 'KURANG')}>
                                        <Text style={this.state.txtTipaKurang}>Kurang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPASedang}
                                        onPress={() => this.changeColor('TIPA', 'SEDANG')}>
                                        <Text style={this.state.txtTipaSedang}>Sedang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPABaik}
                                        onPress={() => this.changeColor('TIPA', 'BAIK')}>
                                        <Text style={this.state.txtTipaBaik}>Baik</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>}


                    {this.state.showKastrasi &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Kastrasi</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnKastrasiRehab}
                                    onPress={() => this.changeColor('KAS', 'REHAB')}>
                                    <Text style={this.state.txtKastrasiRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiKurang}
                                    onPress={() => this.changeColor('KAS', 'KURANG')}>
                                    <Text style={this.state.txtKastrasiKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiSedang}
                                    onPress={() => this.changeColor('KAS', 'SEDANG')}>
                                    <Text style={this.state.txtKastrasiSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiBaik}
                                    onPress={() => this.changeColor('KAS', 'BAIK')}>
                                    <Text style={this.state.txtKastrasiBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showSanitasi &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Sanitasi</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnSanitasiRehab}
                                    onPress={() => this.changeColor('SANIT', 'REHAB')}>
                                    <Text style={this.state.txtSanitasiRehab}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiKurang}
                                    onPress={() => this.changeColor('SANIT', 'KURANG')}>
                                    <Text style={this.state.txtSanitasiKurang}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiSedang}
                                    onPress={() => this.changeColor('SANIT', 'SEDANG')}>
                                    <Text style={this.state.txtSanitasiSedang}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiBaik}
                                    onPress={() => this.changeColor('SANIT', 'BAIK')}>
                                    <Text style={this.state.txtSanitasiBaik}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                </View>


                {/*border*/}
                <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

                <View style={{ backgroundColor: 'white', padding: 20 }}>
                    <Text>Pemupukan</Text>
                    <View style={{ height: 1, backgroundColor: '#989898', marginBottom: 5, marginTop: 5 }} />

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ color: 'grey' }}>Sistem Penaburan</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={this.state.btnPENABURRehab}
                                onPress={() => this.changeColor('PENABUR', 'REHAB')}>
                                <Text style={this.state.txtPenaburRehab}>Rehab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURKurang}
                                onPress={() => this.changeColor('PENABUR', 'KURANG')}>
                                <Text style={this.state.txtPenaburKurang}>Kurang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURSedang}
                                onPress={() => this.changeColor('PENABUR', 'SEDANG')}>
                                <Text style={this.state.txtPenaburSedang}>Sedang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURBaik}
                                onPress={() => this.changeColor('PENABUR', 'BAIK')}>
                                <Text style={this.state.txtPenaburBaik}>Baik</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ color: 'grey' }}>Kondisi Pupuk</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={this.state.btnPUPUKRehab}
                                onPress={() => this.changeColor('PUPUK', 'REHAB')}>
                                <Text style={this.state.txtPupukRehab}>Rehab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKKurang}
                                onPress={() => this.changeColor('PUPUK', 'KURANG')}>
                                <Text style={this.state.txtPupukKurang}>Kurang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKSedang}
                                onPress={() => this.changeColor('PUPUK', 'SEDANG')}>
                                <Text style={this.state.txtPupukSedang}>Sedang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKBaik}
                                onPress={() => this.changeColor('PUPUK', 'BAIK')}>
                                <Text style={this.state.txtPupukBaik}>Baik</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*SLIDER*/}

                <View style={{ padding: 10, alignItems: 'center', marginTop: 30 }}>
                    <RNSlidingButton
                        style={styles.buttonSlide}
                        height={45}
                        onSlidingSuccess={this.onSlideRight}
                        slideDirection={SlideDirection.RIGHT}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={[styles.bubble, styles.tumbButtonSlide]} onPress={() => { }}>
                                <Icon name={"chevron-right"} size={20} color="white" />
                            </TouchableOpacity>
                            <Text numberOfLines={1} style={[styles.titleText, { alignItems: 'center' }]}>
                                Selesai Baris Ini
                            </Text>
                        </View>
                    </RNSlidingButton>
                </View>


                {/*CIRCLE*/}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
					{/*Gani*/}
					<TouchableOpacity onPress={() => { this.props.navigation.goBack() }} 
						style={[styles.buttonSubmit, { backgroundColor: Colors.tintColor }]}>
						<Image style={styles.imageSubmit} source={require('../../Images/icon/ic_kembali.png')} />
					</TouchableOpacity>
                    {/*<TouchableOpacity style={styles.cicle2} onPress={() => { this.props.navigation.goBack() }}>*/}
                        {/* <Icon name={"chevron-left"}  size={10} color="white" /> */}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.cicle, { marginLeft: 10 }]} onPress={() => { }}>*/}
                        {/* <Icon name={"chevron-right"}  size={10} color="white" /> */}
                    {/*</TouchableOpacity>*/}
					{/*End Gani*/}
                </View>

            </ScrollView>
        )
    }
}

export default KondisiBaris2;

const styles = {

    mainContainer: {
        backgroundColor: 'white',
        flex: 1
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

    containerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    txtLabel: {
        flex: 3,
        color: 'grey',
        fontSize: 15,

    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    cicle: {
        borderWidth: 3,
        borderColor: '#A0A0A0',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#A9A9A9',
        borderRadius: 100,
    },
    cicle2: {
        borderWidth: 3,
        borderColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#E8E8E8',
        borderRadius: 100,
    },
    button: {
        width: 100,
        backgroundColor: '#DCDCDC',
        borderRadius: 25,
        margin: 5,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonSubmit: {
        width: 150,
        borderRadius: 25,
        margin: 5,
        padding: 10,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    imageSubmit: {
		flex: 1,
		width: 100,
        alignSelf: 'center',
		resizeMode: 'contain'
    },
    buttonText: {
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center'
    },
    buttonText2: {
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center'
    },
    buttonSlide: {
        width: 250,
        borderRadius: 20,
        backgroundColor: '#DCDCDC',
    },
    tumbButtonSlide: {
        width: 55,
        height: 45,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C8C8C8',
        backgroundColor: Colors.tintColor,
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

    },
    icon: {
        alignContent: 'flex-end',
        height: 64,
        width: 64,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
}