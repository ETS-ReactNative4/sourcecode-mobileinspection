import React from 'react'
import Colors from '../../Constant/Colors'
import { TouchableOpacity, View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import Fonts from '../../Constant/Fonts'

class ManualInputTPH extends React.Component{

    static navigationOptions = {
        headerStyle: {
          backgroundColor: Colors.tintColorPrimary
        },
        title: 'Input TPH',
        headerTintColor: '#fff',
        headerTitleStyle: {
          flex: 1,
          fontSize: 18,
          fontWeight: '400'
        },
    };

    constructor(props){
        super(props);
        this.state = {
            btnHilang: styles.bubbleOff,
            btnRusak: styles.bubbleOn,
            textHilang,
            textRusak
        }
    }

    onClickButton(param){
        switch(param){
            case 'HILANG':
                this.setState({btnHilang: styles.bubbleOn, btnRusak: styles.bubbleOff})
                break;
            case 'RUSAK':
                this.setState({btnHilang: styles.bubbleOff, btnRusak: styles.bubbleOn})
                break;
            default:
                break;
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.mainContainer} behavior="padding" enabled>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style={{ fontSize: 15, fontWeight: '500'}}>Kamu tidak bisa scan TPH?</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 5 }}>Kenapa?</Text>

                    <View style={[styles.buttonContainer, {marginTop:35, paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[this.state.btnHilang, styles.button] } onPress={()=>this.onClickButton('HILANG')}>
                            <Text style={styles.buttonText}>QR Code TPH-nya Hilang</Text>
                        </TouchableOpacity>                        
                    </View>
                    <View style={[styles.buttonContainer,{paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[this.state.btnRusak, styles.button] } onPress={()=>this.onClickButton('RUSAK')}>
                            <Text style={styles.buttonText}>QR Code TPH-nya Rusak</Text>
                        </TouchableOpacity>                        
                    </View>

                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 10 }}>Lokasi</Text> 
                    <Text style={{ fontSize: 15, color: Colors.brandSecondary, marginTop: 5 }}>A10/TM/GAWI INTI 1</Text>

                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 20 }}>TPH</Text>
                    <View style={{marginTop: 5, flexDirection: 'row', marginTop: 5}}>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, { width: 40, textAlign:'center'}]}
                            placeholder='0' />
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, {width: 40, textAlign:'center'}]}
                            placeholder='0' />
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, {width: 40, textAlign:'center'}]}
                            placeholder='0' />
                    </View>

                    <Text style={[styles.textLabel, {marginTop:60}]}>
                        Pastikan Lokasi & TPH benar
                    </Text>

                    <View style={[styles.buttonContainer, {marginTop: 20}]}>
                        <TouchableOpacity style={[styles.bubbleBtn, styles.button2] } onPress={()=>{this.validation()}}>
                            <Text style={styles.buttonText2}>Mulai Inspeksi</Text>
                        </TouchableOpacity>                        
                    </View>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

export default ManualInputTPH

const styles = {
    mainContainer: { flex: 1, backgroundColor: 'white'},
    bubble: { borderWidth: 1, borderColor: '#989898', borderRadius: 20},
    buttonText: { fontSize: 14, color: '#808080', textAlign: 'center'},
    button: { flex:1, alignItems: 'center', padding: 10},
    buttonContainer: { flexDirection: 'row', marginVertical: 5,backgroundColor: 'transparent'},
    bubbleBtn: {
        backgroundColor: '#ff8080',        
        // backgroundColor: Colors.brand,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText2: { fontSize: 17, color: '#ffffff', textAlign: 'center'},
    button2: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },
    searchInput: {
        height: 60,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        color: '#808080',
    },
    textLabel:{ color: Colors.brand, textAlign: 'center', fontSize: 16},
    bubbleOff: { borderWidth: 1, borderColor: '#989898', borderRadius: 20},
    bubbleOn: { backgroundColor: Colors.brand, borderRadius: 20,},
    buttonTextHilang: {
        fontSize: 11,
        color: '#808080',
        textAlign: 'center'
    },  
    buttonRusak: {
        width: 75,
        alignItems: 'center',
        padding: 10,
    },
}