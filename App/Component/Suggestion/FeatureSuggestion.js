import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Card} from 'native-base'
import ButtonSuggestion from '../Suggestion/ButtonSuggestion'
import Icon from 'react-native-vector-icons/MaterialIcons'

//FEATURE SUGGETION
const FeatureSuggestion = (props) => {
    return (
        <Card key={props.index} style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={props.image} style={styles.image} />
                <View style={styles.imageOpacity} />
                <TouchableOpacity activeOpacity={0.8} onPress={props.onPressClose} style={styles.iconClose}>
                    <Icon name={'close'} size={20} color={'white'} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={{ fontSize: 14, fontWeight: '500' }}> {props.title}</Text>
                <Text style={{ fontSize: 12, fontWeight: '400' }}> {props.desc}</Text>
                <ButtonSuggestion title={'Inspeksi Blok Ini'} onPress={props.onPress}/>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    topContainer: {
        position: 'relative',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    image: {
        height: 230, width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    iconClose: {
        width: 30,
        height: 30,
        backgroundColor: '#707070',
        opacity: 0.70,
        position: 'absolute',
        right: 10,
        top: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
    },
    bottomContainer: {
        flex: 1,
        height: 120,
        padding: 12,
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center'
    }
});

export default FeatureSuggestion
