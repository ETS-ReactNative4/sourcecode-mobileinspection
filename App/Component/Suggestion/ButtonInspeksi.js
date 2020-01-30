import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import colors from '../../Themes/Colors'
import Icon from 'react-native-vector-icons/AntDesign'
import { Fonts } from '../../Themes'


const styles = StyleSheet.create({
    button: {
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    buttonFav: {
        marginLeft: 16,
        backgroundColor: '#F5F5F5',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: colors.black,
        padding: 4
    },
    text: {
        color: colors.white,
        fontFamily: Fonts.bold 
    }
})

const ButtonInspeksi = (props) => {
    return (
        <View style={{ flexDirection: 'row', height: 48, justifyContent: "flex-end", backgroundColor: 'white', alignItems: 'center' }}>

            <TouchableOpacity
                disabled={props.isFav ? true : false}
                onPress={props.onPressFavorite}
                style={styles.buttonFav}>

                {props.isFav ? <Icon name={'star'} size={25} color={colors.orange} /> : <Icon name={'staro'} size={25} color={colors.black} />}

            </TouchableOpacity>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', }}>
                <TouchableOpacity
                    onPress={props.onPressInspeksi}
                    style={[styles.button, { backgroundColor: colors.colorPrimary, marginHorizontal: 8 }]}>
                    <Text style={styles.text}>Mulai Inspeksi</Text>
                </TouchableOpacity>

                {props.isGenba && <TouchableOpacity
                    onPress={props.onPressGenba}
                    style={[styles.button, { backgroundColor: colors.orange, marginRight: 16 }]}>
                    <Text style={styles.text}>Mulai Genba</Text>
                </TouchableOpacity>}
            </View>

        </View>
    )
}

export default ButtonInspeksi;