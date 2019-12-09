import React, { Component } from 'react';
import { View, Text, Image, ScrollView, BackHandler } from 'react-native';
import { Colors, Images } from '../../Themes';
import TaskServices from '../../Database/TaskServices'
import dataSuggestion from '../../Data/suggestion';
import ItemTemuan from '../../Component/Suggestion/ItemTemuan';
import ItemDetailSuggesstionDummy from '../../Component/Suggestion/ItemDetailSuggesstionDummy';
import ButtonInspeksi from '../../Component/Suggestion/ButtonInspeksi';
import { getImageBaseOnFindingCode, downloadImageSuggestion } from '../Sync/Download/DownloadImage';
import { getTodayDate } from '../../Lib/Utils';
import dataSuggestionDummy from '../../Data/suggesstionDummy';
import { retrieveData, storeData } from '../../Database/Resources';

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
            isFav: false
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

    componentWillUnmount() {
        this.willFocus.remove();
        this.props.navigation.state.params._getDataLocal()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _initData() {

        var arrData = this.props.navigation.state.params.arrData
        var type = this.props.navigation.state.params.type

        if (arrData != null) {

            const login = TaskServices.getAllData('TR_LOGIN');
            const user_auth = login[0].USER_AUTH_CODE;

            var dataTemuan = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}" AND WERKS = "${arrData.WERKS}" AND BLOCK_CODE = "${arrData.BLOCK_CODE}"`);

            if (type) {
                this.setState({ isFav: true })
            }

            this.setState({ dataTemuan, locationCode: arrData.LOCATION_CODE })
        }
    }

    render() {

        const { dataTemuan, dataDetail } = this.state;

        return (

            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    style={{ backgroundColor: Colors.white }}>

                    {/* TITLE */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', color: Colors.black }}>RIWAYAT BLOK</Text>
                            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 6, color: Colors.grey }}>{this.state.locationCode}</Text>
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
                                    fontWeight: '500',
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

        // var data = {
        //     INSERT_TIME: getTodayDate('YYYYMMDD').toString(),
        //     LOCATION_CODE: dataDetail.LOCATION_CODE == null ? '' : dataDetail.LOCATION_CODE,
        //     IMAGE: dataDetail.IMAGE_NAME == null || dataDetail.IMAGE_NAME == '' ? '' : dataDetail.IMAGE_NAME,

        //     TYPE_INSPECTION: dataDetail.TYPE_INSPECTION == null ? '' : dataDetail.TYPE_INSPECTION,
        //     DATE_INSPECTION_ASLAP: dataDetail.DATE_INSPECTION_ASLAP == null ? '' : dataDetail.DATE_INSPECTION_ASLAP,
        //     DESC_INSPECTION_ASLAP: dataDetail.DESC_INSPECTION_ASLAP == null ? '' : dataDetail.DESC_INSPECTION_ASLAP,
        //     JUMLAH_BARIS_ASLAP: dataDetail.JUMLAH_BARIS_ASLAP == null ? '' : dataDetail.JUMLAH_BARIS_ASLAP,

        //     DATE_INSPECTION_KABUN: dataDetail.DATE_INSPECTION_KABUN == null ? '' : dataDetail.DATE_INSPECTION_KABUN,
        //     DESC_INSPECTION_KABUN: dataDetail.DESC_INSPECTION_KABUN == null ? '' : dataDetail.DESC_INSPECTION_KABUN,
        //     JUMLAH_BARIS_KABUN: dataDetail.JUMLAH_BARIS_KABUN == null ? '' : dataDetail.JUMLAH_BARIS_KABUN,

        //     DATE_INSPECTION_EM: dataDetail.DATE_INSPECTION_EM == null ? '' : dataDetail.DATE_INSPECTION_EM,
        //     DESC_INSPECTION_EM: dataDetail.DESC_INSPECTION_EM == null ? '' : dataDetail.DESC_INSPECTION_EM,
        //     JUMLAH_BARIS_EM: dataDetail.JUMLAH_BARIS_EM == null ? '' : dataDetail.JUMLAH_BARIS_EM,

        //     DATE_INSPECTION_SEM_GM: dataDetail.DATE_INSPECTION_SEM_GM == null ? '' : dataDetail.DATE_INSPECTION_SEM_GM,
        //     DESC_INSPECTION_SEM_GM: dataDetail.DESC_INSPECTION_SEM_GM == null ? '' : dataDetail.DESC_INSPECTION_SEM_GM,
        //     JUMLAH_BARIS_SEM_GM: dataDetail.JUMLAH_BARIS_SEM_GM == null ? '' : dataDetail.JUMLAH_BARIS_SEM_GM,

        //     TYPE_PANEN: dataDetail.TYPE_PANEN == null ? '' : dataDetail.TYPE_PANEN,
        //     DATE_PANEN: dataDetail.DATE_PANEN == null ? '' : dataDetail.DATE_PANEN,
        //     DESC_PANEN: dataDetail.DESC_PANEN == null ? '' : dataDetail.DESC_PANEN,
        //     TOTAL_JANJANG_PANEN: dataDetail.TOTAL_JANJANG_PANEN == null ? '' : dataDetail.TOTAL_JANJANG_PANEN.toString(),
        //     BJR_BULAN_LALU: dataDetail.BJR_BULAN_LALU == null ? '' : dataDetail.BJR_BULAN_LALU.toString(),
        //     TOTAL_RESTAN_TPH: dataDetail.TOTAL_RESTAN_TPH == null ? '' : dataDetail.TOTAL_RESTAN_TPH.toString(),

        //     TYPE_RAWAT: dataDetail.TYPE_RAWAT == null ? '' : dataDetail.TYPE_RAWAT,
        //     DATE_RAWAT: dataDetail.DATE_RAWAT == null ? '' : dataDetail.DATE_RAWAT,
        //     DESC_RAWAT: dataDetail.DESC_RAWAT == null ? '' : dataDetail.DESC_RAWAT,
        //     CPT_SPRAYING: dataDetail.CPT_SPRAYING == null ? '' : dataDetail.CPT_SPRAYING,
        //     SPOT_SPRAYING: dataDetail.SPOT_SPRAYING == null ? '' : dataDetail.SPOT_SPRAYING,
        //     LALANG_CTRL: dataDetail.LALANG_CTRL == null ? '' : dataDetail.LALANG_CTRL,

        //     ISFAVORITE: true,
        // }

        // await TaskServices.saveData('TM_SUGGESTION_INSPECTION', data);
    }

    // REDIRECT TO GENBA/INSPEKSI PAGE
    redirectNextScreen(routeName) {

        const { dataDetail } = this.state;

        if (routeName == 'genba') {
            this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'Genba',
                params: {
                    inspectionType: 'genba',
                    werksAfdBlock: dataDetail.WERKS + dataDetail.AFD_CODE + dataDetail.BLOCK_CODE,
                    blockName : dataDetail.BLOCK_NAME
                }
            }));
        } else if (routeName == 'inspeksi') {
            this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'MapsInspeksi',
                params: {
                    werksAfdBlock: dataDetail.WERKS + dataDetail.AFD_CODE + dataDetail.BLOCK_CODE,
                    blockName : dataDetail.BLOCK_NAME
                }
            }))
        }
    }
}


