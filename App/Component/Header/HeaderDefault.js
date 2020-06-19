import React from 'react'
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Colors from '../../Constant/Colors'

export default function HeaderDefault(props) {
    return (
        <View style={{
            height: 56,
            backgroundColor: Colors.tintColorPrimary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            elevation: 2,
            alignItems: 'center'
        }}>
            <Icon onPress={props.onPress} name={'arrowleft'} size={24} color={Colors.WHITE} />
            <Text style={{ color: 'white', marginLeft: 26, fontSize: 18 }}>{props.title}</Text>
        </View>
    )
}