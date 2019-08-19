import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Card } from 'native-base'
import ButtonSuggestion from './ButtonSuggestion'
import { Images } from '../../Themes'

const desc = 'Kamu menolak semua rekomendasi.\nTekan tombol di bawah untuk \nmulai aktivitas di lokasimu saat ini'

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 350,
        width: '100%',
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: "center",
        padding: 16
    },
    image: {
        height: 100,
        width: 100,
        opacity: 0.4
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
        color: '#AAAAAA'
    }
})

//NO DATA SUGGESTION
const EmptySuggestion = (props) => {
    return (
        <Card style={styles.container}>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Image source={Images.ic_data_not_match} style={styles.image} />
                <Text style={[styles.text, { marginBottom: props.isGenba ? 0 : 36 }]}>{desc}</Text>

                <View style={{
                    width: '100%',
                    justifyContent: 'flex-end'
                }}>
                    {!props.isGenba && <ButtonSuggestion title={'Mulai Genba'} noData={true} onPress={props.onPressGenba} />}
                    <ButtonSuggestion title={'Mulai Inspeksi'}  noData={false} onPress={props.onPressInspeksi} />
                </View>
            </View>
        </Card >
    )
}

export default EmptySuggestion