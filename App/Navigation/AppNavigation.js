import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation'
import SplashScreen from '../Screen/SplashScreen'
import Login from '../Screen/Login'
import MainMenu from '../Screen/Home/MainTabNavigator'

//finding
import FindingFormNavigator from '../Screen/Finding/FindingFormNavigator'
import FormStep1 from '../Screen/Finding/FormStep1'
import FormStep2 from '../Screen/Finding/FormStep2'
import DetailFindingScreen from '../Screen/Finding/DetailFindingScreenRedesign'
import BuktiKerja from '../Screen/Finding/BuktiKerja'
import TakeFotoBukti from '../Screen/Finding/TakeFoto'
import PilihKontak from '../Screen/Finding/PilihKontak'
import PilihKategori from '../Screen/Finding/PilihKategori'
import PilihBlok from '../Screen/Finding/PilihBlok'
import MapsFinding from '../Screen/Finding/MapsFinding'
// import FormInspectionNavigator from '../Screen/Inspeksi/Navigation/FormInspectionNavigator';

//inspeksi
import DetailHistoryInspeksi from '../Screen/Inspeksi/HistoryInspeksiDetail'
import BuatInspeksi from '../Screen/Inspeksi/BuatInspeksi'
import TakeFotoBaris from '../Screen/Inspeksi/TakePhotoBaris'
import KondisiBaris1 from '../Screen/Inspeksi/KondisiBaris1'
import KondisiBaris2 from '../Screen/Inspeksi/KondisiBaris2'
import TakeFotoSelfie from '../Screen/Inspeksi/TakePhotoSelfie'
import KondisiBarisAkhir from '../Screen/Inspeksi/KondisiBarisAkhir'
import SelesaiInspeksi from '../Screen/Inspeksi/SelesaiInspeksi'
import DetailBaris from '../Screen/Inspeksi/DetailBaris'
import Step1Finding from '../Screen/Inspeksi/Step1Finding'
import Step2Finding from '../Screen/Inspeksi/Step2Finding'
import TakeFotoFinding from '../Screen/Inspeksi/TakeFotoFinding'
import MapsInspeksi from '../Screen/Inspeksi/MapsInspeksi'

//ebcc
import EbccQrCode from '../Screen/Ebcc/EbccQrCode'
import FotoJanjang from '../Screen/Ebcc/FotoJanjangEbcc'
import FotoSelfieEbcc from '../Screen/Ebcc/FotoSelfieEbcc'
import KriteriaBuah from '../Screen/Ebcc/KriteriaBuah'
import ReasonManualTPH from '../Screen/Ebcc/ReasonManualTPH'
import ManualInputTPH from '../Screen/Ebcc/ManualInputTPH'
import DetailEbcc from '../Screen/Ebcc/DetailEbcc'
import MapsEbcc from '../Screen/Ebcc/MapsEbcc'
import EbccNavigator from '../Screen/Ebcc/EbccNavigator'

import SyncScreen from '../Screen/SyncTest';
import InboxScreen from '../Screen/Inbox';
import FilterScreen from '../Screen/FilterScreen';
import BisnisAreaScreen from '../Screen/BisnisArea';
import AfdelingScreen from '../Screen/Afdeling';
import CalendarsScreen from '../Screen/Calendar';
import PemberiTugas from '../Screen/PemberiTugas';
// import OpenGl from '../Screen/OpenGl';

import PilihPeta from '../Screen/Maps/PilihPeta'

import Colors from '../Constant/Colors'


const main = createStackNavigator({
    MainMenu: { screen: MainMenu, navigationOptions: { header: null } },
    SplashScreen: { screen: SplashScreen },
    Login: { screen: Login },

    FindingFormNavigator: {
        screen: FindingFormNavigator,
        navigationOptions: {
            header: null
            // headerStyle: {
            //     backgroundColor: Colors.tintColor
            // },
            // title: 'Buat Laporan Penemuan',
            // headerTintColor: '#fff',
            // headerTitleStyle: {
            //     flex: 1,
            //     fontSize: 18,
            //     fontWeight: '400'
            // },
        }
    },

    //finding
    Step1Finding: { screen: Step1Finding },
    Step2Finding: { screen: Step2Finding },
    TakeFotoFinding: { screen: TakeFotoFinding },

    DetailFinding: { screen: DetailFindingScreen },
    BuktiKerja: { screen: BuktiKerja },
    TakeFotoBukti: { screen: TakeFotoBukti },
    PilihKontak: { screen: PilihKontak },
    PilihKategori: { screen: PilihKategori },
    PilihBlok: { screen: PilihBlok },
    // FormInspection: {
    //     screen: FormInspectionNavigator,
    //     navigationOptions: {
    //         header: null
    //     },
    // },

    Sync: { screen: SyncScreen },
    Inbox: { screen: InboxScreen },
    Filter: { screen: FilterScreen },
    BisnisArea: { screen: BisnisAreaScreen },
    Afdeling: { screen: AfdelingScreen },
    Calendar: { screen: CalendarsScreen },
    PemberiTugas: { screen: PemberiTugas },
    MapsFinding: { screen: MapsFinding },

    //inspeksi
    BuatInspeksi: { screen: BuatInspeksi },
    DetailHistoryInspeksi: { screen: DetailHistoryInspeksi },
    TakeFotoBaris: { screen: TakeFotoBaris },
    KondisiBaris1: { screen: KondisiBaris1 },
    KondisiBaris2: { screen: KondisiBaris2 },
    TakeFotoSelfie: { screen: TakeFotoSelfie },
    KondisiBarisAkhir: { screen: KondisiBarisAkhir },
    SelesaiInspeksi: { screen: SelesaiInspeksi },
    DetailBaris: { screen: DetailBaris },
    MapsInspeksi: { screen: MapsInspeksi },

    //ebccValidation
    EbccQrCode: { screen: EbccQrCode }, 
    FotoJanjang: { screen: FotoJanjang }, 
    FotoSelfieEbcc: { screen: FotoSelfieEbcc }, 
    KriteriaBuah: { screen: KriteriaBuah }, 
    ReasonManualTPH: { screen: ReasonManualTPH }, 
    ManualInputTPH: { screen: ManualInputTPH }, 
    DetailEbcc: { screen: DetailEbcc }, 
    MapsEbcc: { screen: MapsEbcc }, 
    // EbccNavigator: { screen: ({ navigation }) => <EbccNavigator screenProps={{ rootNavigation: navigation }} />, navigationOptions: {
    //     header: null
    // }},

    // test: { screen: test },
    // TestUpload: {screen:TestUpload}
    // OpenGl: { screen: OpenGl }, 
    
    PilihPeta: { screen: PilihPeta }, 

}, {
        headerMode: 'screen',
        initialRouteName: 'SplashScreen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Colors.tintColorPrimary
            },
        },
        transitionConfig: () => ({ screenInterpolator: () => null }),
    });

export default main;