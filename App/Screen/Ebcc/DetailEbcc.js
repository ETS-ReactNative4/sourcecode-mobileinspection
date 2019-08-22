import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, Text, TextInput, View} from 'react-native';
import Colors from '../../Constant/Colors'
import R from 'ramda';
import TaskServices from '../../Database/TaskServices'

class DetailEbcc extends Component {

    static navigationOptions = {
        headerStyle: {
          backgroundColor: Colors.tintColorPrimary
        },
        title: 'Kriteria Buah',
        headerTintColor: '#fff',
        headerTitleStyle: {
          flex: 1,
          fontSize: 18,
          fontWeight: '400'
        },
    };

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        let data = R.clone(params.data);

        this.state = {
            arrHasilPanen: [],
            valueHasilPanen:[],
            arrKondisiBuah:[],
            valueKondisiBuah:[],
            arrPenaltyTph:[],
            valuePenaltyTph:[],
            arrJjg:[],
            valueJjg:[],
            totalJanjang: data.TOTAL_JANJANG,
            data,
            path: '',
            blockName: '',
            werk_afd_blok_code: '',
            werks: ''
        }
    }

    componentWillMount(){
        this.loadData()
    }

    getEstateName(werks){
        try {
            let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
            return data.EST_NAME;
        } catch (error) {
            return '';
        }
    }
    getStatusBlok(werk_afd_blok_code){
        try {
            let data = TaskServices.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
            return data.MATURITY_STATUS;
        } catch (error) {
            return ''
        }
    }

    // getDataBlock(werk_afd_blok_code){
    //     try {
    //         let data = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
    //         return data;
    //     } catch (error) {
    //         return ''
    //     }
    // }

    loadData(){
        var werksAfdBlockCode = `${this.state.data.WERKS}${this.state.data.AFD_CODE}${this.state.data.BLOCK_CODE}`
        var dataBlock = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werksAfdBlockCode)
        var blockName = dataBlock !== undefined ? dataBlock.BLOCK_NAME:''
        var werk_afd_blok_code = dataBlock !== undefined ? dataBlock.WERKS_AFD_BLOCK_CODE:''
        var werks = dataBlock !== undefined ? dataBlock.WERKS:''

        let imgBaris = TaskServices.findByWithList('TR_IMAGE', ['TR_CODE', 'STATUS_IMAGE'], [this.state.data.EBCC_VALIDATION_CODE, 'JANJANG']);
        let path = '';
        try {
            path = `file://${imgBaris[0].IMAGE_PATH_LOCAL}`;
        } catch (error) {
            path = '';
        }

        this.setState({blockName, werk_afd_blok_code, werks, path})

        //kondisi panen
        let hasilPanen = TaskServices.findByWithList('TR_D_EBCC_VALIDATION', ['GROUP_KUALITAS', 'UOM', 'EBCC_VALIDATION_CODE'], ['HASIL PANEN', 'JJG', this.state.data.EBCC_VALIDATION_CODE])
        if(hasilPanen !== undefined){
            hasilPanen.map(item =>{
                this.state.arrHasilPanen.push(item)
                let model = {
                    EBCC_VALIDATION_CODE: item.EBCC_VALIDATION_CODE,
                    GROUP_KUALITAS: item.GROUP_KUALITAS,
                    UOM: item.UOM,
                    ID_KUALITAS: item.ID_KUALITAS.ID_KUALITAS,
                    NAMA_KUALITAS: item.NAMA_KUALITAS.NAMA_KUALITAS,
                    JUMLAH: item.JUMLAH,
                    INSERT_TIME: item.INSERT_TIME,
                    STATUS_SYNC: item.STATUS_SYNC,
                    SYNC_TIME: item.SYNC_TIME
                };
                this.state.valueHasilPanen.push(model)
            })
        }

        //kondisi panen janjang
        let hasilPanen2 = TaskServices.findByWithList('TR_D_EBCC_VALIDATION', ['GROUP_KUALITAS', 'UOM', 'EBCC_VALIDATION_CODE'], ['HASIL PANEN', 'KG', this.state.data.EBCC_VALIDATION_CODE])
        if(hasilPanen2 !== undefined){
            hasilPanen2.map(item =>{
                this.state.arrJjg.push(item)
                let model = {
                    EBCC_VALIDATION_CODE: item.EBCC_VALIDATION_CODE,
                    GROUP_KUALITAS: item.GROUP_KUALITAS,
                    UOM: item.UOM,
                    ID_KUALITAS: item.ID_KUALITAS.ID_KUALITAS,
                    NAMA_KUALITAS: item.NAMA_KUALITAS.NAMA_KUALITAS,
                    JUMLAH: item.JUMLAH,
                    INSERT_TIME: item.INSERT_TIME,
                    STATUS_SYNC: item.STATUS_SYNC,
                    SYNC_TIME: item.SYNC_TIME
                }
                this.state.valueJjg.push(model)
            })
        }

        //kondisi buah
        let kondisiBuah = TaskServices.findByWithList('TR_D_EBCC_VALIDATION', ['GROUP_KUALITAS', 'UOM', 'EBCC_VALIDATION_CODE'], ['KONDISI BUAH', 'JJG', this.state.data.EBCC_VALIDATION_CODE])
        if(kondisiBuah !== undefined){
            kondisiBuah.map(item =>{
                this.state.arrKondisiBuah.push(item)
                let model = {
                    EBCC_VALIDATION_CODE: item.EBCC_VALIDATION_CODE,
                    GROUP_KUALITAS: item.GROUP_KUALITAS,
                    UOM: item.UOM,
                    ID_KUALITAS: item.ID_KUALITAS.ID_KUALITAS,
                    NAMA_KUALITAS: item.NAMA_KUALITAS.NAMA_KUALITAS,
                    JUMLAH: item.JUMLAH,
                    INSERT_TIME: item.INSERT_TIME,
                    STATUS_SYNC: item.STATUS_SYNC,
                    SYNC_TIME: item.SYNC_TIME
                }
                this.state.valueKondisiBuah.push(model)
            })
        }

        let penaltyTph = TaskServices.findByWithList('TR_D_EBCC_VALIDATION', ['GROUP_KUALITAS', 'UOM', 'EBCC_VALIDATION_CODE'], ['PENALTY DI TPH', 'TPH', this.state.data.EBCC_VALIDATION_CODE])
        if(penaltyTph !== undefined){
            penaltyTph.map(item =>{
                this.state.arrPenaltyTph.push(item)
                let model = {
                    EBCC_VALIDATION_CODE: item.EBCC_VALIDATION_CODE,
                    GROUP_KUALITAS: item.GROUP_KUALITAS,
                    UOM: item.UOM,
                    ID_KUALITAS: item.ID_KUALITAS.ID_KUALITAS,
                    NAMA_KUALITAS: item.NAMA_KUALITAS.NAMA_KUALITAS,
                    JUMLAH: item.JUMLAH,
                    INSERT_TIME: item.INSERT_TIME,
                    STATUS_SYNC: item.STATUS_SYNC,
                    SYNC_TIME: item.SYNC_TIME
                }
                this.state.valuePenaltyTph.push(model)
            })
        }

    }

    renderDynamicComp(data, index){
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={styles.txtLabel}>{data.NAMA_KUALITAS}</Text>
                <View style={[styles.containerInput, { flex: 1 }]}>
                    <TextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        value={data.JUMLAH.toString()} />
                </View>
            </View>
        )
    }

    renderDynamicCompNotUpdate(data, index){
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={styles.txtLabel}>{data.NAMA_KUALITAS}</Text>
                <View style={[styles.containerInput, { flex: 1 }]}>
                    <TextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        value={data.JUMLAH.toString()}/>
                </View>
            </View>
        )
    }

    renderDynamicCompBtn(data, index){
        let val = data.JUMLAH > 0 ? 'Ada':'Tidak Ada'
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={styles.txtLabel}>{data.NAMA_KUALITAS}</Text>
                <View style={[styles.containerInput, { flex: 1 }]}>
                    <TextInput
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput, {backgroundColor: Colors.brand, borderWidth:0, borderColor:'transparent', color: '#ffffff'}]}
                        value={val}/>
                </View>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary} />


                {/*LABEL*/}
                <View style={styles.containerHeader}>
                    <View style={{ flexDirection: 'row', height: 200 }} >
                        <Image style={{ width: '100%', height: '100%' }} source={{uri: this.state.path}}></Image>
                    </View>
                    <Text style={{ fontSize: 17, fontWeight: '500', marginTop: 10 }}>{`${this.state.blockName}/${this.getStatusBlok(this.state.werk_afd_blok_code)}/${this.getEstateName(this.state.werks)}`}</Text>
                    <Text style={{ fontSize: 14, color: 'grey', fontWeight: '500', marginTop: 10 }}>TPH {this.state.data.NO_TPH}</Text>
                </View>

                <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

                {/*INPUT*/}
                <View style={{ backgroundColor: 'white' }}>

                    <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, marginTop: 10 }}>Hasil Panen</Text>
                    {this.state.arrHasilPanen.map((data, idx) => this.renderDynamicComp(data, idx))}
                    {/* total janjang */}
                    <View style={styles.containerLabel}>
                        <Text style={{ fontSize: 16, color: 'grey', fontWeight: '500', flex: 2 }}>Total Janjang</Text>
                        <View style={[styles.containerInput, { flex: 1 }]}>
                            <TextInput
                                editable={false}
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput, {backgroundColor: Colors.abuabu}]}
                                maxLength={3}
                                keyboardType={'numeric'}
                                value={this.state.totalJanjang} />
                        </View>
                    </View>
                    {this.state.arrJjg.map((data, idx) => this.renderDynamicCompNotUpdate(data, idx))}

                    <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />
                    {/* kondisi buah */}
                    <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, marginTop: 10 }}>Kondisi Buah</Text>
                    {this.state.arrKondisiBuah.map((data, idx) => this.renderDynamicComp(data, idx))}

                    <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />
                    {/* Penalty TPH */}
                    <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, marginTop: 10 }}>Penalti di TPH</Text>
                    {this.state.arrPenaltyTph.map((data, idx) => this.renderDynamicCompBtn(data, idx))}

                    <View style={{padding:10, alignItems:'center', marginTop:10, marginBottom: 10}}/>
                </View>

            </ScrollView>
        )
    }
}

export default DetailEbcc;

const styles = {

    mainContainer: {flex: 1,backgroundColor: 'white'},
    containerHeader: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10
    },
    txtLabel: {flex: 2,color: 'grey',fontSize: 15,},
    containerInput: {flexDirection: 'row',alignItems: 'center',justifyContent: 'center',},
    btnMinus: {
        borderWidth: 3,
        borderColor: '#cca300',
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
        backgroundColor: '#e6b800',
        borderRadius: 100,

    },
    btnAdd: {
        borderWidth: 3,
        borderColor: '#00e639',
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
        backgroundColor: Colors.brand,
        borderRadius: 100,
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
    searchInput: {
        height: 38,
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
        flex: 1,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#989898',
        color: '#808080',
        textAlign: 'center'
    },
    bubbleLeftOff: { backgroundColor: Colors.abuabu, borderTopLeftRadius: 20,borderBottomLeftRadius: 20,},
    bubbleRightOff: { backgroundColor: Colors.abuabu, borderTopRightRadius: 20,borderBottomRightRadius: 20,},
    bubbleLeftOn: { backgroundColor: Colors.brand, borderTopLeftRadius: 20,borderBottomLeftRadius: 20,},
    bubbleRightOn: { backgroundColor: Colors.brand, borderTopRightRadius: 20,borderBottomRightRadius: 20,},
    buttonTextSideOn: { fontSize: 11,color: '#ffffff',textAlign: 'center'},
    buttonTextSideOff: {fontSize: 11,color: '#808080',textAlign: 'center'},
    buttonSide: {width: 75,alignItems: 'center',padding: 10,},
    bubble: {
        // backgroundColor: '#ff8080',
        backgroundColor: Colors.brand,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {fontSize: 17,color: '#ffffff',textAlign: 'center'},
    button: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },
    buttonContainer: {flexDirection: 'row',marginVertical: 20,backgroundColor: 'transparent',},
    buttonSlide: {width: 200,borderRadius: 20,backgroundColor: '#DCDCDC',},
    tumbButtonSlide:{
        width: 55,
        height:45,
        borderRadius: 20,
        borderWidth:1,
        borderColor:'#C8C8C8',
        backgroundColor: Colors.tintColor,
    },
    titleText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#A9A9A9',
        paddingHorizontal: 18,
        paddingVertical: 12,
    }
}
