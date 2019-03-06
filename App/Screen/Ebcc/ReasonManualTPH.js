import React from 'react'
import Colors from '../../Constant/Colors'
import { TouchableOpacity, View, Text, StatusBar } from 'react-native';

class ReasonManualTPH extends React.Component{

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
        super(props)
    }

    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style={{ fontSize: 15, fontWeight: '500'}}>Kamu tidak bisa scan TPH?</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 5 }}>Kenapa?</Text>

                    <View style={[styles.buttonContainer, {marginTop:35, paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } >
                            <Text style={styles.buttonText}>QR Code TPH-nya Hilang</Text>
                        </TouchableOpacity>                        
                    </View>
                    <View style={[styles.buttonContainer,{paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } >
                            <Text style={styles.buttonText}>QR Code TPH-nya Rusak</Text>
                        </TouchableOpacity>                        
                    </View>  

                </View>
                

                
            </View>
        )
    }
}

export default ReasonManualTPH

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    bubble: {           
        borderWidth: 1,
        borderColor: '#989898',
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'center'
    },
    button: {
        flex:1,
        alignItems: 'center',
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
}