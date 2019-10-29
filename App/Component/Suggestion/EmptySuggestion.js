import React from 'react'
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Card } from 'native-base'
import ButtonSuggestion from './ButtonSuggestion'
import { Images } from '../../Themes'

const desc = 'Kamu menolak semua rekomendasi.\nTekan tombol di bawah untuk \nmulai aktivitas di lokasimu saat ini'

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 350,
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
        fontSize: 14,
        marginTop: 20,
        color: '#AAAAAA'
    }
})

//NO DATA SUGGESTION
const EmptySuggestion = (props) => {
    return (
        <View style={{ paddingHorizontal: 16, flex: 1, height: 350 }}>
            <Card style={styles.container}>
                <View style={{ flex: 1 }}>

                    {/* <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Image source={Images.ic_data_not_match} style={styles.image} />
                        <Text style={[styles.text, { marginBottom: props.isGenba ? 0 : 36 }]}>{desc}</Text>
                    </View> */}

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <Card style={{ width: 170, borderRadius: 10, marginRight: 10 }}>
                            <Image source={Images.img_forest} style={{ width: 170, flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
                            <View style={{ justifyContent: 'center', padding: 10, alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 12 }}> 20 Aug 2019 </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 3 }}> B34/TM/GAWI INTI - 1 </Text>
                            </View>
                        </Card>
                        <Card style={{ width: 170, borderRadius: 10, marginRight: 10 }}>
                            <Image source={Images.img_forest} style={{ width: 170, flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
                            <View style={{ justifyContent: 'center', padding: 10, alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 12 }}> 20 Aug 2019 </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 3 }}> B34/TM/GAWI INTI - 1 </Text>
                            </View>
                        </Card>
                        <Card style={{ width: 170, borderRadius: 10, marginRight: 10 }}>
                            <Image source={Images.img_forest} style={{ width: 170, flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
                            <View style={{ justifyContent: 'center', padding: 10, alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 12 }}> 20 Aug 2019 </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 3 }}> B34/TM/GAWI INTI - 1 </Text>
                            </View>
                        </Card>
                    </ScrollView>

                    <View style={{
                        width: '100%',
                        justifyContent: 'flex-end'
                    }}>
                        {props.isGenba ? <ButtonSuggestion title={'Mulai Genba'} noData={true} onPress={props.onPressGenba} /> : <View style={{ height: 35 }} />}
                        <ButtonSuggestion title={'Mulai Inspeksi'} noData={false} onPress={props.onPressInspeksi} />
                    </View>
                </View>

            </Card >
        </View >
    )
}

export default EmptySuggestion
