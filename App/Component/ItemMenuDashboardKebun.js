import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'native-base';
import colors from '../Themes/Colors';

const ItemMenuDashboardKebun = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.isDisabled}
            activeOpacity={0.8}
            style={{ flex: 1 }}>
            <View>
                <Card
                    style={{
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        backgroundColor: props.isActive ? '#F5F5F5' : colors.white
                    }}>
                    <Image source={props.icon} style={{ height: 64, width: '100%', resizeMode: 'contain' }} />
                    <Text style={{ marginTop: 8, color: colors.black, fontSize: 12, fontWeight: '500' }}>{props.title}</Text>
                </Card>
            </View>
        </TouchableOpacity>
    )
}

export default ItemMenuDashboardKebun;
