import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Colors } from '../../Themes'

const ButtonSuggestion = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}
            style={[styles.button, {
                marginTop: 10,
                backgroundColor: props.noData == 'orange' ? Colors.orange : props.noData == 'primary' ? Colors.colorPrimary : '#E6E6E6',
            }]}>
            <Text style={[styles.buttonText, { color: props.noData ? Colors.white : Colors.black[300] }]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: '100%',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500'
    }
})

export default ButtonSuggestion;
