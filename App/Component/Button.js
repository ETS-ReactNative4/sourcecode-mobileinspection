import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import Colors from '../Constant/Colors';

const Button = (props) => {
    return (
        <TouchableOpacity style={[styles.button, { marginTop: props.marginTop }]}
            onPress={props.onPress}>
            <Text style={style.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 200,
        backgroundColor: Colors.brand,
        borderRadius: 25,
        padding: 15,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.colorWhite,
        textAlign: 'center'
    },
})

export default Button;