import React, { Component } from 'react';
import { View, Text, Image, ScrollView, BackHandler } from 'react-native';
import { Colors, Images, Fonts } from '../../Themes';
import TaskServices from '../../Database/TaskServices'
import ItemTemuan from '../../Component/Suggestion/ItemTemuan';
import ItemDetailSuggesstionDummy from '../../Component/Suggestion/ItemDetailSuggesstionDummy';
import ButtonInspeksi from '../../Component/Suggestion/ButtonInspeksi';
import { getImageBaseOnFindingCode, downloadImageSuggestion } from '../Sync/Download/DownloadImage';
import { getTodayDate } from '../../Lib/Utils';
import { retrieveData, storeData } from '../../Database/Resources';
import * as geolib from 'geolib';

import ModalAlert from '../../Component/ModalAlert';

// NAVIGATION
import { NavigationActions } from 'react-navigation';


export default class DetailSuggestion extends Component {


    arrData = this.props.navigation.state.params.arrData

    constructor(props) {
        super(props);
        this.state = {
            dataTemuan: [],
            dataDetail: this.arrData,
            locationCode: '',
            isFav: false,
            latitude: 0.0,
            longitude: 0.0,
            modalAlert: {
                showModal: false,
                title: "",
                message: "",
                icon: null
            },
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.colorPrimary
        },
        headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
        title: 'Info Blok',
        headerTintColor: '#fff'
    };

    willFocus = this.props.navigation.addListener(
        'willFocus',
        () => {
            this._initData();
        }
    )

    componentDidMount() {
        this.getCurrentPosition();
    }

    getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.setState({ latitude: lat, longitude: lon, fetchLocation: false });
            },
            (error) => {
                // this.setState({ error: error.message, fetchingLocation: false })
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                this.setState({ fetchLocation: false })
                // alert('Informasi', message);
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    componentWillUnmount() {
        this.willFocus.remove();
        this.props.navigation.state.params._getDataLocal();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _initData() {

        var arrData = this.props.navigation.state.params.arrData
        var type = this.props.navigation.state.params.type
        var isGenba = this.props.navigation.state.params.isGenba

        if (arrData != null) {

            const login = TaskServices.getAllData('TR_LOGIN');
            const user_auth = login[0].USER_AUTH_CODE;

            var dataTemuan = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}" AND WERKS = "${arrData.WERKS}" AND BLOCK_CODE = "${arrData.BLOCK_CODE}"`);

            if (type) {
                this.setState({ isFav: true })
            }

            this.setState({ dataTemuan, locationCode: arrData.LOCATION_CODE, isGenba })
        }
    }

    render() {

        const { dataTemuan, dataDetail } = this.state;

        return (

            <View style={{ flex: 1 }}>

                <ModalAlert
                    icon={this.state.modalAlert.icon}
                    visible={this.state.modalAlert.showModal}
                    onPressCancel={() => this.setState({ modalAlert: { ...this.state.modalAlert, showModal: false } })}
                    title={this.state.modalAlert.title}
                    message={this.state.modalAlert.message} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    style={{ backgroundColor: Colors.white }}>

                    {/* TITLE */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: Fonts.bold, color: Colors.black }}>RIWAYAT BLOK</Text>
                            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 6, Family: Fonts.book, color: Colors.grey }}>{this.state.locationCode}</Text>
                            <View style={{ width: 50, height: 5, backgroundColor: Colors.colorPrimary, marginTop: 10 }} />
                        </View>
                    </View>

                    {/* CONTENT */}
                    <View
                        showsVerticalScrollIndicator={false}
                        style={[{ padding: 16 }, { paddingBottom: 10 }]}>

                        {this.renderItemDetailSuggestion(dataDetail)}

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                            <Image
                                source={Images.ic_suggestion_temuan}
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderWidth: 1,
                                    borderColor: Colors.colorPrimary,
                                    borderRadius: 36,
                                    marginRight: 8
                                }} />

                            <Text
                                style={{
                                    color: Colors.black,
                                    fontFamily: Fonts.demi,
                                    textAlign: 'center'
                                }}> Temuan yang Harus Diselesaikan</Text>
                        </View>
                    </View>

                    {/* TEMUAN YANG HARUS DISELESAIKAN */}
                    <ScrollView
                        contentContainerStyle={{ paddingRight: 6, paddingLeft: 16 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {dataTemuan.length > 0 &&
                            dataTemuan.map((item, index) => this.renderItemTemuan(item, index))}

                    </ScrollView >

                </ScrollView >

                {/* BUTTON FOOTER */}
                <ButtonInspeksi
                    isGenba={this.state.isGenba}
                    isFav={this.state.isFav}
                    onPressInspeksi={() => this.redirectNextScreen('inspeksi')}
                    onPressGenba={() => this.redirectNextScreen('genba')}
                    onPressFavorite={() => this.onPressSaveFavorite()}
                />
            </View>
        )
    }

    /* RENDER ITEM DETAIL SUGGESTION */
    renderItemDetailSuggestion(data) {
        return data.DATA_ARRAY.map(item => {
            return <ItemDetailSuggesstionDummy
                BARIS={item.BARIS}
                DATA={item.DATA}
                DESC={item.DESC}
                TYPE={item.TYPE}
                DATE={item.DATE} />
        })
    }

    /* RENDER ITEM TEMUAN */
    renderItemTemuan = (item, index) => {
        return <ItemTemuan item={item} index={index} onPress={() => this.onClickItem(item.FINDING_CODE)} />
    }

    onClickItem = (id) => {
        var images = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', id);
        if (images !== undefined) {
            this.props.navigation.navigate('DetailFinding', { ID: id })
        } else {
            getImageBaseOnFindingCode(id)
            setTimeout(() => {
                this.props.navigation.navigate('DetailFinding', { ID: id })
            }, 3000);
        }
    }

    onPressSaveFavorite = async () => {

        this.setState({
            isFav: true
        })

        const { dataDetail } = this.state;

        await downloadImageSuggestion(dataDetail);

        await storeData('SUGGESTION_DATE', getTodayDate('YYYYMMDD'));

        retrieveData('SUGGESTION').then((result) => {
            if (result != null) {
                let temp;
                if (result.length == 0) {
                    result.push(dataDetail)

                    storeData('SUGGESTION', result);
                } else {
                    const found = result.some(el => el.LOCATION_CODE === dataDetail.LOCATION_CODE);

                    if (!found) {
                        temp = [...result, dataDetail];
                    } else {
                        temp = result
                    }

                    storeData('SUGGESTION', temp);
                }
            }
        })
    }

    // REDIRECT TO GENBA/INSPEKSI PAGE
    redirectNextScreen(routeName) {
        const { dataDetail } = this.state;
        const werksAfdBlock = dataDetail.WERKS + dataDetail.AFD_CODE + dataDetail.BLOCK_CODE;
        const polygon = TaskServices.findBy2('TR_POLYGON', 'werks_afd_block_code', werksAfdBlock);
        if (polygon !== undefined) {
            if (geolib.isPointInPolygon({ latitude: this.state.latitude, longitude: this.state.longitude }, polygon.coords)) {
                if (routeName == 'genba') {
                    this.props.navigation.dispatch(NavigationActions.navigate({
                        routeName: 'Genba',
                        params: {
                            inspectionType: 'genba',
                            werksAfdBlock: werksAfdBlock,
                            blockName: dataDetail.BLOCK_NAME
                        }
                    }));
                } else if (routeName == 'inspeksi') {
                    this.props.navigation.dispatch(NavigationActions.navigate({
                        routeName: 'BuatInspeksi',
                        params: {
                            werkAfdBlockCode: werksAfdBlock,
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            inspectionType: 'normal'
                        }
                    }))
                }
            } else {
                this.setState({
                    modalAlert: {
                        showModal: true,
                        title: 'Blok tidak match',
                        message: "Kamu tidak berada di Blok " + dataDetail.BLOCK_NAME,
                        icon: require('../../Images/ic-blm-input-lokasi.png')
                    }
                });
            }
        } else {
            this.setState({
                modalAlert: {
                    showModal: true,
                    title: 'Download Peta',
                    message: "Kamu belum download Peta untuk blok ini",
                    icon: require('../../Images/ic-blm-input-lokasi.png')
                }
            });
        }
    }
}


