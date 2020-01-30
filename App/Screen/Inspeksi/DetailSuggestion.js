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

        if (routeName == 'genba') {
            this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'Genba',
                params: {
                    inspectionType: 'genba',
                    werksAfdBlock: dataDetail.WERKS + dataDetail.AFD_CODE + dataDetail.BLOCK_CODE,
                    blockName: dataDetail.BLOCK_NAME
                }
            }));
        } else if (routeName == 'inspeksi') {
            this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'MapsInspeksi',
                params: {
                    werksAfdBlock: dataDetail.WERKS + dataDetail.AFD_CODE + dataDetail.BLOCK_CODE,
                    blockName: dataDetail.BLOCK_NAME
                }
            }))
        }
    }
}


