import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Colors } from '../../Themes'

const ButtonSuggestion = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={0.8}
            style={[styles.button, {
                marginTop: props.noData ? 16 : 10,
                backgroundColor: props.noData ? Colors.orange : Colors.colorPrimary,
            }]}>
            <Text style={styles.buttonText}>{props.title}</Text>
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