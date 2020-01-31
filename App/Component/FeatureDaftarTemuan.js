import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Dash from 'react-native-dash'
import { Fonts } from '../Themes';

const FeatureDaftarTemuan = (props) => {
    return (
        <View>
            <Text style={styles.title}>{props.title}</Text>

            <Dash
                dashColor={'#ccc'}
                dashThickness={1}
                dashGap={5}
                style={styles.dash} />

            <View style={{ marginTop: 16, height: 120 }}>
                <ScrollView
                    contentContainerStyle={{ paddingRight: 16 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {props.children}
                </ScrollView >
            </View>
            {props.divider ? null : <View style={styles.devider} />}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16, paddingHorizontal: 16, fontFamily: Fonts.demi
    },
    dash: {
        height: 1,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 10
    },
    devider: {
        marginBottom: 16, marginTop: 16, backgroundColor: '#ccc', height: 8
    }
})

export default FeatureDaftarTemuan;

// create by Aminju 05/08/2019
