import React from 'react'
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Card } from 'native-base'
import ButtonSuggestion from './ButtonSuggestion'
import { Images, Fonts } from '../../Themes'

const desc = 'Kamu menolak semua rekomendasi.\nTekan tombol di bawah untuk \nmulai aktivitas di lokasimu saat ini'
const descNoConnection = 'Harus terhubung jaringan untuk\nlihat rekomandsi inspeksi'

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 300,
        backgroundColor: '#F7F7F7',
        padding: 16
    },
    image: {
        height: 100,
        width: 100,
        opacity: 0.4
    },
    text: {
        textAlign: 'center',
        fontSize: 15,
        marginTop: 20,
        color: '#AAAAAA',
        fontFamily: Fonts.medium
    }
})

//NO DATA SUGGESTION
const EmptySuggestion = (props) => {
    return (
        <View style={{ paddingHorizontal: 16, flex: 1, height: 350 }}>
            <Card style={styles.container}>
                <View style={{ flex: 1 }}>

                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Image source={props.isDisconnect ? Images.ic_no_wifi : Images.ic_data_not_match} style={styles.image} />
                        <Text style={[styles.text, { marginBottom: props.isGenba ? 0 : 36 }]}>{props.isDisconnect ? descNoConnection : desc}</Text>
                    </View>

                    <View style={{
                        width: '100%',
                        justifyContent: 'flex-end'
                    }}>
                        {props.isGenba ? <ButtonSuggestion title={'Mulai Genba'} noData={'orange'} onPress={props.onPressGenba} /> : <View style={{ height: 35 }} />}
                        <ButtonSuggestion title={'Mulai Inspeksi'} noData={'primary'} onPress={props.onPressInspeksi} />
                    </View>
                </View>

            </Card >
        </View >
    )
}

export default EmptySuggestion
