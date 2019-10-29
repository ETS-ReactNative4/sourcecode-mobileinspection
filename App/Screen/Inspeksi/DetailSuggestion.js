import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Colors, Images } from '../../Themes';
import TaskServices from '../../Database/TaskServices'
import dataSuggestion from '../../Data/suggestion';
import ItemTemuan from '../../Component/Suggestion/ItemTemuan';
import ItemDetailSuggestion from '../../Component/Suggestion/ItemDetailSuggestion';
import ButtonInspeksi from '../../Component/Suggestion/ButtonInspeksi';
import { getImageBaseOnFindingCode } from '../Sync/Download/DownloadImage';

export default class DetailSuggestion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTemuan: [],
            dataDetail: []
        }
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
        this.willFocus.remove()
    }

    _initData() {
        var id = this.props.navigation.state.params.id
        const login = TaskServices.getAllData('TR_LOGIN');
        const user_auth = login[0].USER_AUTH_CODE;

        var dataTemuan = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${user_auth}"`);

        const detail = dataSuggestion.listSuggestion[0];

        console.log('Data Detail Base On Index : ', detail)

        this.setState({ dataTemuan, dataDetail: detail.data })
    }


    render() {

        const { dataTemuan } = this.state;

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 16 }}
                style={{ flex: 1, backgroundColor: Colors.white }}>

                {/* TITLE */}
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '500', color: Colors.black }}>RIWAYAT BLOK</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 6, color: Colors.grey }}>{dataSuggestion.listSuggestion[0].title}</Text>
                        <View style={{ width: 50, height: 5, backgroundColor: Colors.colorPrimary, marginTop: 10 }} />
                    </View>
                </View>

                {/* CONTENT */}
                <View
                    showsVerticalScrollIndicator={false}
                    style={[{ padding: 16 }, { paddingBottom: 10 }]}>

                    {this.state.dataDetail.length > 0 &&
                        this.state.dataDetail.map((item, index) => this.renderItemDetailSuggestion(item, index))}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, marginLeft: 3 }}>
                        <Image
                            source={Images.ic_ambil_foto_gagal}
                            style={{
                                width: 25,
                                height: 25,
                                borderWidth: 2,
                                borderColor: Colors.grey,
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

                <ButtonInspeksi onPressNow={() => console.log('Sekarang')} onPressLater={() => console.log('Nanti')} />

            </ScrollView >
        )
    }

    /* RENDER ITEM DETAIL SUGGESTION */
    renderItemDetailSuggestion(item, index) {
        return <ItemDetailSuggestion item={item} index={index} />
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
}

