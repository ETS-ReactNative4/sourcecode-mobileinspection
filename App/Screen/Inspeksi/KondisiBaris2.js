import React, { Component } from 'react';
import { TouchableOpacity, ScrollView, Text, View, Switch, StatusBar, Image } from 'react-native';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import BtnStyles from './Component/ButtonStyle'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RNSlidingButton, SlideDirection } from 'rn-sliding-button';
import Entypo from 'react-native-vector-icons/Entypo'
import { NavigationActions, StackActions } from 'react-navigation';
import { getTodayDateFromGPS,getTodayDate } from '../../Lib/Utils'
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
                <TouchableOpacity onPress={() => {navigation.navigate('Step1Finding', {data: params.getData})}}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 16 }}>
                        <Entypo name='flashlight' size={24} color='white' />
                    </View>
                </TouchableOpacity>
            )
        }        
    };

    constructor(props) {
        super(props);

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
            btnPiringanRehab: BtnStyles.btnBiasa,
            btnPiringanKurang: BtnStyles.btnBiasa,
            btnPiringanSedang: BtnStyles.btnBiasa,
            btnPiringanBaik: BtnStyles.btnBiasa,

            //passar pikul
            sarKul: '',
            btnSarkulRehab: BtnStyles.btnBiasa,
            btnSarkulKurang: BtnStyles.btnBiasa,
            btnSarkulSedang: BtnStyles.btnBiasa,
            btnSarkulBaik: BtnStyles.btnBiasa,

            //TPH
            TPH: '',
            btnTPHRehab: BtnStyles.btnBiasa,
            btnTPHKurang: BtnStyles.btnBiasa,
            btnTPHSedang: BtnStyles.btnBiasa,
            btnTPHBaik: BtnStyles.btnBiasa,

            //GAWANGAN
            GWG: '',
            btnGWGRehab: BtnStyles.btnBiasa,
            btnGWGKurang: BtnStyles.btnBiasa,
            btnGWGSedang: BtnStyles.btnBiasa,
            btnGWGBaik: BtnStyles.btnBiasa,

            //PRUNNINGAN
            PRUN: '',
            btnPRUNRehab: BtnStyles.btnBiasa,
            btnPRUNKurang: BtnStyles.btnBiasa,
            btnPRUNSedang: BtnStyles.btnBiasa,
            btnPRUNBaik: BtnStyles.btnBiasa,

            //TITI PANEN
            TIPA: '',
            btnTIPARehab: BtnStyles.btnBiasa,
            btnTIPAKurang: BtnStyles.btnBiasa,
            btnTIPASedang: BtnStyles.btnBiasa,
            btnTIPABaik: BtnStyles.btnBiasa,

            //KASTRASI
            KASTRASI: '',
            btnKastrasiRehab: BtnStyles.btnBiasa,
            btnKastrasiKurang: BtnStyles.btnBiasa,
            btnKastrasiSedang: BtnStyles.btnBiasa,
            btnKastrasiBaik: BtnStyles.btnBiasa,

            //SANITASI
            SANITASI: '',
            btnSanitasiRehab: BtnStyles.btnBiasa,
            btnSanitasiKurang: BtnStyles.btnBiasa,
            btnSanitasiSedang: BtnStyles.btnBiasa,
            btnSanitasiBaik: BtnStyles.btnBiasa,

            //SISTEM PENABURAN
            PENABUR: '',
            btnPENABURRehab: BtnStyles.btnBiasa,
            btnPENABURKurang: BtnStyles.btnBiasa,
            btnPENABURSedang: BtnStyles.btnBiasa,
            btnPENABURBaik: BtnStyles.btnBiasa,

            //KONDISI PUPUK
            PUPUK: '',
            btnPUPUKRehab: BtnStyles.btnBiasa,
            btnPUPUKKurang: BtnStyles.btnBiasa,
            btnPUPUKSedang: BtnStyles.btnBiasa,
            btnPUPUKBaik: BtnStyles.btnBiasa,

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
            icon: ''

        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ getData: this.state.inspeksiHeader })
        this.hideAndShow();
    }

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
            this.setState({ btnPiringanRehab: BtnStyles.btnRehab, btnPiringanKurang: BtnStyles.btnBiasa, btnPiringanSedang: BtnStyles.btnBiasa, btnPiringanBaik: BtnStyles.btnBiasa, piringan: 'REHAB' });
        } else if (param == 'PIRINGAN' && value == 'KURANG') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa, btnPiringanKurang: BtnStyles.btnKurang, btnPiringanSedang: BtnStyles.btnBiasa, btnPiringanBaik: BtnStyles.btnBiasa, piringan: 'KURANG' });
        } else if (param == 'PIRINGAN' && value == 'SEDANG') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa, btnPiringanKurang: BtnStyles.btnBiasa, btnPiringanSedang: BtnStyles.btnSedang, btnPiringanBaik: BtnStyles.btnBiasa, piringan: 'SEDANG' });
        } else if (param == 'PIRINGAN' && value == 'BAIK') {
            this.setState({ btnPiringanRehab: BtnStyles.btnBiasa, btnPiringanKurang: BtnStyles.btnBiasa, btnPiringanSedang: BtnStyles.btnBiasa, btnPiringanBaik: BtnStyles.btnBaik, piringan: 'BAIK' });
        } else if (param == 'SARKUL' && value == 'REHAB') {
            this.setState({ btnSarkulRehab: BtnStyles.btnRehab, btnSarkulKurang: BtnStyles.btnBiasa, btnSarkulSedang: BtnStyles.btnBiasa, btnSarkulBaik: BtnStyles.btnBiasa, sarKul: 'REHAB' });
        } else if (param == 'SARKUL' && value == 'KURANG') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa, btnSarkulKurang: BtnStyles.btnKurang, btnSarkulSedang: BtnStyles.btnBiasa, btnSarkulBaik: BtnStyles.btnBiasa, sarKul: 'KURANG' });
        } else if (param == 'SARKUL' && value == 'SEDANG') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa, btnSarkulKurang: BtnStyles.btnBiasa, btnSarkulSedang: BtnStyles.btnSedang, btnSarkulBaik: BtnStyles.btnBiasa, sarKul: 'SEDANG' });
        } else if (param == 'SARKUL' && value == 'BAIK') {
            this.setState({ btnSarkulRehab: BtnStyles.btnBiasa, btnSarkulKurang: BtnStyles.btnBiasa, btnSarkulSedang: BtnStyles.btnBiasa, btnSarkulBaik: BtnStyles.btnBaik, sarKul: 'BAIK' });
        } else if (param == 'TPH' && value == 'REHAB') {
            this.setState({ btnTPHRehab: BtnStyles.btnRehab, btnTPHKurang: BtnStyles.btnBiasa, btnTPHSedang: BtnStyles.btnBiasa, btnTPHBaik: BtnStyles.btnBiasa, TPH: 'REHAB' });
        } else if (param == 'TPH' && value == 'KURANG') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa, btnTPHKurang: BtnStyles.btnKurang, btnTPHSedang: BtnStyles.btnBiasa, btnTPHBaik: BtnStyles.btnBiasa, TPH: 'KURANG' });
        } else if (param == 'TPH' && value == 'SEDANG') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa, btnTPHKurang: BtnStyles.btnBiasa, btnTPHSedang: BtnStyles.btnSedang, btnTPHBaik: BtnStyles.btnBiasa, TPH: 'SEDANG' });
        } else if (param == 'TPH' && value == 'BAIK') {
            this.setState({ btnTPHRehab: BtnStyles.btnBiasa, btnTPHKurang: BtnStyles.btnBiasa, btnTPHSedang: BtnStyles.btnBiasa, btnTPHBaik: BtnStyles.btnBaik, TPH: 'BAIK' });
        } else if (param == 'GWG' && value == 'REHAB') {
            this.setState({ btnGWGRehab: BtnStyles.btnRehab, btnGWGKurang: BtnStyles.btnBiasa, btnGWGSedang: BtnStyles.btnBiasa, btnGWGBaik: BtnStyles.btnBiasa, GWG: 'REHAB' });
        } else if (param == 'GWG' && value == 'KURANG') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa, btnGWGKurang: BtnStyles.btnKurang, btnGWGSedang: BtnStyles.btnBiasa, btnGWGBaik: BtnStyles.btnBiasa, GWG: 'KURANG' });
        } else if (param == 'GWG' && value == 'SEDANG') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa, btnGWGKurang: BtnStyles.btnBiasa, btnGWGSedang: BtnStyles.btnSedang, btnGWGBaik: BtnStyles.btnBiasa, GWG: 'SEDANG' });
        } else if (param == 'GWG' && value == 'BAIK') {
            this.setState({ btnGWGRehab: BtnStyles.btnBiasa, btnGWGKurang: BtnStyles.btnBiasa, btnGWGSedang: BtnStyles.btnBiasa, btnGWGBaik: BtnStyles.btnBaik, GWG: 'BAIK' });
        } else if (param == 'PRUN' && value == 'REHAB') {
            this.setState({ btnPRUNRehab: BtnStyles.btnRehab, btnPRUNKurang: BtnStyles.btnBiasa, btnPRUNSedang: BtnStyles.btnBiasa, btnPRUNBaik: BtnStyles.btnBiasa, PRUN: 'REHAB' });
        } else if (param == 'PRUN' && value == 'KURANG') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa, btnPRUNKurang: BtnStyles.btnKurang, btnPRUNSedang: BtnStyles.btnBiasa, btnPRUNBaik: BtnStyles.btnBiasa, PRUN: 'KURANG' });
        } else if (param == 'PRUN' && value == 'SEDANG') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa, btnPRUNKurang: BtnStyles.btnBiasa, btnPRUNSedang: BtnStyles.btnSedang, btnPRUNBaik: BtnStyles.btnBiasa, PRUN: 'SEDANG' });
        } else if (param == 'PRUN' && value == 'BAIK') {
            this.setState({ btnPRUNRehab: BtnStyles.btnBiasa, btnPRUNKurang: BtnStyles.btnBiasa, btnPRUNSedang: BtnStyles.btnBiasa, btnPRUNBaik: BtnStyles.btnBaik, PRUN: 'BAIK' });
        } else if (param == 'TIPA' && value == 'REHAB') {
            this.setState({ btnTIPARehab: BtnStyles.btnRehab, btnTIPAKurang: BtnStyles.btnBiasa, btnTIPASedang: BtnStyles.btnBiasa, btnTIPABaik: BtnStyles.btnBiasa, TIPA: 'REHAB' });
        } else if (param == 'TIPA' && value == 'KURANG') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa, btnTIPAKurang: BtnStyles.btnKurang, btnTIPASedang: BtnStyles.btnBiasa, btnTIPABaik: BtnStyles.btnBiasa, TIPA: 'KURANG' });
        } else if (param == 'TIPA' && value == 'SEDANG') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa, btnTIPAKurang: BtnStyles.btnBiasa, btnTIPASedang: BtnStyles.btnSedang, btnTIPABaik: BtnStyles.btnBiasa, TIPA: 'SEDANG' });
        } else if (param == 'TIPA' && value == 'BAIK') {
            this.setState({ btnTIPARehab: BtnStyles.btnBiasa, btnTIPAKurang: BtnStyles.btnBiasa, btnTIPASedang: BtnStyles.btnBiasa, btnTIPABaik: BtnStyles.btnBaik, TIPA: 'BAIK' });
        } else if (param == 'PENABUR' && value == 'REHAB') {
            this.setState({ btnPENABURRehab: BtnStyles.btnRehab, btnPENABURKurang: BtnStyles.btnBiasa, btnPENABURSedang: BtnStyles.btnBiasa, btnPENABURBaik: BtnStyles.btnBiasa, PENABUR: 'REHAB' });
        } else if (param == 'PENABUR' && value == 'KURANG') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa, btnPENABURKurang: BtnStyles.btnKurang, btnPENABURSedang: BtnStyles.btnBiasa, btnPENABURBaik: BtnStyles.btnBiasa, PENABUR: 'KURANG' });
        } else if (param == 'PENABUR' && value == 'SEDANG') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa, btnPENABURKurang: BtnStyles.btnBiasa, btnPENABURSedang: BtnStyles.btnSedang, btnPENABURBaik: BtnStyles.btnBiasa, PENABUR: 'SEDANG' });
        } else if (param == 'PENABUR' && value == 'BAIK') {
            this.setState({ btnPENABURRehab: BtnStyles.btnBiasa, btnPENABURKurang: BtnStyles.btnBiasa, btnPENABURSedang: BtnStyles.btnBiasa, btnPENABURBaik: BtnStyles.btnBaik, PENABUR: 'BAIK' });
        } else if (param == 'PUPUK' && value == 'REHAB') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnRehab, btnPUPUKKurang: BtnStyles.btnBiasa, btnPUPUKSedang: BtnStyles.btnBiasa, btnPUPUKBaik: BtnStyles.btnBiasa, PUPUK: 'REHAB' });
        } else if (param == 'PUPUK' && value == 'KURANG') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa, btnPUPUKKurang: BtnStyles.btnKurang, btnPUPUKSedang: BtnStyles.btnBiasa, btnPUPUKBaik: BtnStyles.btnBiasa, PUPUK: 'KURANG' });
        } else if (param == 'PUPUK' && value == 'SEDANG') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa, btnPUPUKKurang: BtnStyles.btnBiasa, btnPUPUKSedang: BtnStyles.btnSedang, btnPUPUKBaik: BtnStyles.btnBiasa, PUPUK: 'SEDANG' });
        } else if (param == 'PUPUK' && value == 'BAIK') {
            this.setState({ btnPUPUKRehab: BtnStyles.btnBiasa, btnPUPUKKurang: BtnStyles.btnBiasa, btnPUPUKSedang: BtnStyles.btnBiasa, btnPUPUKBaik: BtnStyles.btnBaik, PUPUK: 'BAIK' });
        }

        else if (param == 'KAS' && value == 'REHAB') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnRehab, btnKastrasiKurang: BtnStyles.btnBiasa, btnKastrasiSedang: BtnStyles.btnBiasa, btnKastrasiBaik: BtnStyles.btnBiasa, KASTRASI: 'REHAB' });
        } else if (param == 'KAS' && value == 'KURANG') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa, btnKastrasiKurang: BtnStyles.btnKurang, btnKastrasiSedang: BtnStyles.btnBiasa, btnKastrasiBaik: BtnStyles.btnBiasa, KASTRASI: 'KURANG' });
        } else if (param == 'KAS' && value == 'SEDANG') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa, btnKastrasiKurang: BtnStyles.btnBiasa, btnKastrasiSedang: BtnStyles.btnSedang, btnKastrasiBaik: BtnStyles.btnBiasa, KASTRASI: 'SEDANG' });
        } else if (param == 'KAS' && value == 'BAIK') {
            this.setState({ btnKastrasiRehab: BtnStyles.btnBiasa, btnKastrasiKurang: BtnStyles.btnBiasa, btnKastrasiSedang: BtnStyles.btnBiasa, btnKastrasiBaik: BtnStyles.btnBaik, KASTRASI: 'BAIK' });
        }

        else if (param == 'SANIT' && value == 'REHAB') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnRehab, btnSanitasiKurang: BtnStyles.btnBiasa, btnSanitasiSedang: BtnStyles.btnBiasa, btnSanitasiBaik: BtnStyles.btnBiasa, SANITASI: 'REHAB' });
        } else if (param == 'SANIT' && value == 'KURANG') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa, btnSanitasiKurang: BtnStyles.btnKurang, btnSanitasiSedang: BtnStyles.btnBiasa, btnSanitasiBaik: BtnStyles.btnBiasa, SANITASI: 'KURANG' });
        } else if (param == 'SANIT' && value == 'SEDANG') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa, btnSanitasiKurang: BtnStyles.btnBiasa, btnSanitasiSedang: BtnStyles.btnSedang, btnSanitasiBaik: BtnStyles.btnBiasa, SANITASI: 'SEDANG' });
        } else if (param == 'SANIT' && value == 'BAIK') {
            this.setState({ btnSanitasiRehab: BtnStyles.btnBiasa, btnSanitasiKurang: BtnStyles.btnBiasa, btnSanitasiSedang: BtnStyles.btnBiasa, btnSanitasiBaik: BtnStyles.btnBaik, SANITASI: 'BAIK' });
        }
    }


    onSlideRight = async () => {
        await this.validation()
    };

    async validation(){
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
            await this.insertDB();
        }
    }
	
    async insertDB() {
		var today = await getTodayDateFromGPS('YYYYMMDDHHmmss');
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
            dataInspeksi: this.state.dataInspeksi
        });
    }

    navigateScreen(screenName) {
        const navigation = this.props.navigation;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: screenName, params: { from: 'fags' } })]
        });
        navigation.dispatch(resetAction);
    }

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
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanKurang}
                                    onPress={() => this.changeColor('PIRINGAN', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanSedang}
                                    onPress={() => this.changeColor('PIRINGAN', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPiringanBaik}
                                    onPress={() => this.changeColor('PIRINGAN', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showSarkul &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Pasar Pikul</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnSarkulRehab}
                                    onPress={() => this.changeColor('SARKUL', 'REHAB')}>
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulKurang}
                                    onPress={() => this.changeColor('SARKUL', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulSedang}
                                    onPress={() => this.changeColor('SARKUL', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSarkulBaik}
                                    onPress={() => this.changeColor('SARKUL', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
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
                                        <Text style={styles.buttonText}>Rehab</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHKurang}
                                        onPress={() => this.changeColor('TPH', 'KURANG')}>
                                        <Text style={styles.buttonText}>Kurang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHSedang}
                                        onPress={() => this.changeColor('TPH', 'SEDANG')}>
                                        <Text style={styles.buttonText}>Sedang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTPHBaik}
                                        onPress={() => this.changeColor('TPH', 'BAIK')}>
                                        <Text style={styles.buttonText}>Baik</Text>
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
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGKurang}
                                    onPress={() => this.changeColor('GWG', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGSedang}
                                    onPress={() => this.changeColor('GWG', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnGWGBaik}
                                    onPress={() => this.changeColor('GWG', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showPrun &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Prunning</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnPRUNRehab}
                                    onPress={() => this.changeColor('PRUN', 'REHAB')}>
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNKurang}
                                    onPress={() => this.changeColor('PRUN', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNSedang}
                                    onPress={() => this.changeColor('PRUN', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnPRUNBaik}
                                    onPress={() => this.changeColor('PRUN', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
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
                                        <Text style={styles.buttonText}>Rehab</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPAKurang}
                                        onPress={() => this.changeColor('TIPA', 'KURANG')}>
                                        <Text style={styles.buttonText}>Kurang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPASedang}
                                        onPress={() => this.changeColor('TIPA', 'SEDANG')}>
                                        <Text style={styles.buttonText}>Sedang</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={this.state.btnTIPABaik}
                                        onPress={() => this.changeColor('TIPA', 'BAIK')}>
                                        <Text style={styles.buttonText}>Baik</Text>
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
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiKurang}
                                    onPress={() => this.changeColor('KAS', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiSedang}
                                    onPress={() => this.changeColor('KAS', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnKastrasiBaik}
                                    onPress={() => this.changeColor('KAS', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                    {this.state.showSanitasi &&
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ color: 'grey' }}>Sanitasi</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={this.state.btnSanitasiRehab}
                                    onPress={() => this.changeColor('SANIT', 'REHAB')}>
                                    <Text style={styles.buttonText}>Rehab</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiKurang}
                                    onPress={() => this.changeColor('SANIT', 'KURANG')}>
                                    <Text style={styles.buttonText}>Kurang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiSedang}
                                    onPress={() => this.changeColor('SANIT', 'SEDANG')}>
                                    <Text style={styles.buttonText}>Sedang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={this.state.btnSanitasiBaik}
                                    onPress={() => this.changeColor('SANIT', 'BAIK')}>
                                    <Text style={styles.buttonText}>Baik</Text>
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
                                <Text style={styles.buttonText}>Rehab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURKurang}
                                onPress={() => this.changeColor('PENABUR', 'KURANG')}>
                                <Text style={styles.buttonText}>Kurang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURSedang}
                                onPress={() => this.changeColor('PENABUR', 'SEDANG')}>
                                <Text style={styles.buttonText}>Sedang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPENABURBaik}
                                onPress={() => this.changeColor('PENABUR', 'BAIK')}>
                                <Text style={styles.buttonText}>Baik</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ color: 'grey' }}>Kondisi Pupuk</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={this.state.btnPUPUKRehab}
                                onPress={() => this.changeColor('PUPUK', 'REHAB')}>
                                <Text style={styles.buttonText}>Rehab</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKKurang}
                                onPress={() => this.changeColor('PUPUK', 'KURANG')}>
                                <Text style={styles.buttonText}>Kurang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKSedang}
                                onPress={() => this.changeColor('PUPUK', 'SEDANG')}>
                                <Text style={styles.buttonText}>Sedang</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={this.state.btnPUPUKBaik}
                                onPress={() => this.changeColor('PUPUK', 'BAIK')}>
                                <Text style={styles.buttonText}>Baik</Text>
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