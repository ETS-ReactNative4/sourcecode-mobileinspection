import React, { Component } from 'react';
import { TouchableOpacity, View, Text, TextInput, ScrollView, Image, BackAndroid, StatusBar } from 'react-native';
import Colors from '../../Constant/Colors'
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import R from 'ramda';
import TaskServices from '../../Database/TaskServices'
import { getTodayDate } from '../../Lib/Utils'

import ModalAlertConfirmation from '../../Component/ModalAlertConfirmation';

class KriteriaBuah extends Component {

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

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        // let params = props.navigation.state.params;
        // let fotoJanjang = R.clone(params.fotoJanjang);
        // let tphAfdWerksBlockCode = R.clone(params.tphAfdWerksBlockCode);

        this.state = {
            arrHasilPanen: [],
            valueHasilPanen:[],
            arrKondisiBuah:[],
            valueKondisiBuah:[],
            arrPenaltyTph:[],
            valuePenaltyTph:[],
            arrJjg:[],
            valueJjg:[],
            totalJanjang: '0',  
            
            btnAda: styles.bubbleLeftOff,
            btnTdkAda: styles.bubbleRightOff,
            txtAda: styles.buttonTextSideOff,
            txtTdkAda: styles.buttonTextSideOff,       
            // tphAfdWerksBlockCode,
            // fotoJanjang,


            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: ''
        }
    }

    componentWillMount(){
        this.loadData()
    }

    componentDidMount() {        
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.setState({
            showModal: true, title: 'Data Hilang',
            message: 'Inspeksi mu belum tersimpan loh. Yakin mau dilanjutin?',
            icon: require('../../Images/ic-not-save.png')
        });
        return true;
    }

    loadData(){

        //kondisi panen
        this.state.arrHasilPanen.push('Mentah')
        this.state.arrHasilPanen.push('Mengkal/Kurang Masak')
        this.state.arrHasilPanen.push('Masak')
        this.state.arrHasilPanen.push('Overripe/Terlalu Masak')
        this.state.arrHasilPanen.push('Busuk')  
        
        this.state.valueHasilPanen.push('0')
        this.state.valueHasilPanen.push('0')
        this.state.valueHasilPanen.push('0')
        this.state.valueHasilPanen.push('0')
        this.state.valueHasilPanen.push('0')
        
        //kondisi panen janjang
        this.state.arrJjg.push('Total Brondolan') 
        this.state.valueJjg.push('0')

        //kondisi buah
        this.state.arrKondisiBuah.push('Parthenocarpic/Abnormal')
        this.state.arrKondisiBuah.push('Buah Masak Tangkai Panjang')
        this.state.arrKondisiBuah.push('Dimakan Hama')

        this.state.valueKondisiBuah.push('0')
        this.state.valueKondisiBuah.push('0')
        this.state.valueKondisiBuah.push('0')

        //penalty tph
        this.state.arrPenaltyTph.push('Alas Brondolan(TPH)')
        this.state.valuePenaltyTph.push('')

    }

    validation(){
        alert(JSON.stringify(this.state.valuePenaltyTph))
    }

    insertDB() {
        this.props.navigation.navigate('KondisiBaris2', {
            kondisiBaris1: kondisiBaris1,
        });
    }

    renderDynamicComp(data, index, arr){
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={styles.txtLabel}>{data}</Text>
                <View style={[styles.containerInput, { flex: 1 }]}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={2}
                        keyboardType={'numeric'}
                        value={arr[index]}
                        onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, ''); this.updateArrValue(index, text, arr) }} />
                </View>
            </View>
        )
    }

    renderDynamicCompNotUpdate(data, index, arr){
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={styles.txtLabel}>{data}</Text>
                <View style={[styles.containerInput, { flex: 1 }]}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={2}
                        keyboardType={'numeric'}
                        value={arr[index]}
                        onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, '') }} />
                </View>
            </View>
        )
    }

    renderDynamicCompBtn(data, index, arr){
        return(
            <View style={styles.containerLabel} key={index}>
                <Text style={[styles.txtLabel, {flex:1}]}>{data}</Text>
                <View style={{ flex: 1, flexDirection:'row', alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{marginRight:1}}>
                        <TouchableOpacity style={[this.state.btnAda, styles.buttonSide] } onPress={()=>{this.getValueAndChangeColor('ADA', index, arr)}}>
                            <Text style={this.state.txtAda}>Ada</Text>
                        </TouchableOpacity>  
                    </View>
                    <View>
                        <TouchableOpacity style={[this.state.btnTdkAda, styles.buttonSide]} onPress={()=>{this.getValueAndChangeColor('TIDAK ADA', index, arr)}}>
                            <Text style={this.state.txtTdkAda}>Tidak Ada</Text>
                        </TouchableOpacity>  
                    </View> 
                </View> 
            </View>
        )
    }

    updateArrValue(index, strUpdate, arr){
        let newArray = [...arr];
        newArray[index] = strUpdate;
        this.setState({valueHasilPanen: newArray});
        if(strUpdate !== ''){
            let total = 0;
            newArray.map(item => {
                total = total+parseInt(item)
            });
            this.setState({totalJanjang: total.toString()})
        }
    }

    updateArrBtn(index, strUpdate, arr){
        let newArray = [...arr];
        newArray[index] = strUpdate;
        this.setState({valuePenaltyTph: newArray});
    }

    getValueAndChangeColor(value, index, arr){
        switch(value){
            case 'ADA':
                this.updateArrBtn(index, value, arr)
                this.setState({btnAda: styles.bubbleLeftOn, btnTdkAda: styles.bubbleRightOff, txtAda: styles.buttonTextSideOn, txtTdkAda: styles.buttonTextSideOff});
                break;
            case 'TIDAK ADA':
                this.updateArrBtn(index, value, arr)
                this.setState({btnTdkAda: styles.bubbleRightOn, btnAda: styles.bubbleLeftOff, txtAda: styles.buttonTextSideOff, txtTdkAda: styles.buttonTextSideOn});
                break;
            default:
                break;
        }
    }

    onSlideRight = () => {
        this.validation()
    };

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
                />
                <ModalAlertConfirmation
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    onPressSubmit={() => { this.setState({ showModal: false }); this.props.navigation.goBack(null) }}
                    title={this.state.title}
                    message={this.state.message}
                />
                

                {/*LABEL*/}
                <View style={styles.containerHeader}>
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>A10/TM/GAWI INTI 1</Text>
                    <Text style={{ fontSize: 14, color: 'grey', fontWeight: '500', marginTop: 10 }}>TPH 001</Text>
                </View>

                <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

                {/*INPUT*/}
                <View style={{ backgroundColor: 'white' }}>

                    {this.state.arrHasilPanen.map((data, idx) => this.renderDynamicComp(data, idx, this.state.valueHasilPanen))}
                    {/* total janjang */}
                    <View style={styles.containerLabel}>
                        <Text style={{ fontSize: 16, color: 'grey', fontWeight: '500', flex: 2 }}>Total Janjang</Text>
                        <View style={[styles.containerInput, { flex: 1 }]}>
                            <TextInput
                                editable={false}
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput, {backgroundColor: Colors.abuabu}]}
                                maxLength={2}
                                keyboardType={'numeric'}
                                value={this.state.totalJanjang} />
                        </View>
                    </View>
                    {this.state.arrJjg.map((data, idx) => this.renderDynamicCompNotUpdate(data, idx, this.state.valueJjg))}

                    <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />
                    {/* kondisi buah */}
                    {this.state.arrKondisiBuah.map((data, idx) => this.renderDynamicComp(data, idx, this.state.valueKondisiBuah))}

                    <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />
                    {/* Penalty TPH */}
                    {this.state.arrPenaltyTph.map((data, idx) => this.renderDynamicCompBtn(data, idx, this.state.valuePenaltyTph))}

                    {/*SLIDER*/}
                    <View style={{padding:10, alignItems:'center', marginTop:30, marginBottom: 10}}>
                        <RNSlidingButton
                            style={styles.buttonSlide}
                            height={45}
                            onSlidingSuccess={this.onSlideRight}
                            slideDirection={SlideDirection.RIGHT}>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={[styles.bubble, styles.tumbButtonSlide] } onPress={()=>{}}>
                                    <Icon name={"chevron-right"}  size={20} color="white" />
                                </TouchableOpacity>
                                <Text numberOfLines={1} style={[styles.titleText,{alignItems:'center'}]}>
                                    Selesai
                                </Text>
                            </View>
                            </RNSlidingButton>
                    </View>
                </View>

            </ScrollView>
        )
    }
}

export default KriteriaBuah;

const styles = {

    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
        // padding:20
    },
    containerHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 10
    },
    containerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10
    },
    txtLabel: {
        flex: 2,
        color: 'grey',
        fontSize: 15,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
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
    bubbleLeftOff: {     
        backgroundColor: Colors.abuabu,   
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    bubbleRightOff: {    
        backgroundColor: Colors.abuabu, 
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    bubbleLeftOn: {     
        backgroundColor: Colors.brand,   
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    bubbleRightOn: {    
        backgroundColor: Colors.brand, 
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    buttonTextSideOn: {
        fontSize: 11,
        color: '#ffffff',
        textAlign: 'center'
    },  
    buttonTextSideOff: {
        fontSize: 11,
        color: '#808080',
        textAlign: 'center'
    },  
    buttonSide: {
        width: 75,
        alignItems: 'center',
        padding: 10,
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
    buttonSlide: {
        width: 200,
        borderRadius: 20,
        backgroundColor: '#DCDCDC',
    },
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