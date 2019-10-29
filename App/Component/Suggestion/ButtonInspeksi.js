import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import colors from '../../Themes/Colors'

const styles = StyleSheet.create({
    button: {
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        flex: 1
    },
    text: {
        color: colors.white,
        fontWeight: '500'
    }
})

const ButtonInspeksi = (props) => {
    return (
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginTop: 30 }}>
            <TouchableOpacity
                onPress={props.onPressLater}
                style={[styles.button, { backgroundColor: colors.lightGrey, marginRight: 8 }]}>
                <Text style={styles.text}>Inspeksi Nanti</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.colorPrimary, marginLeft: 8 }]}>
                <Text style={styles.text}>Inspeksi Sekarang</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ButtonInspeksi;