import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'native-base';
import colors from '../Themes/Colors';

const ItemMenuDashboardKebun = (props) => {
    return (
        <TouchableOpacity
            disabled={props.isActive}
            activeOpacity={0.8}
            style={{ flex: 1 }}>
            <View>
                <Card
                    style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        backgroundColor: props.isActive ? '#F5F5F5' : colors.white
                    }}>
                    <Image source={props.icon} style={{ height: 62, width: '100%', resizeMode: 'contain' }} />
                    <Text style={{ marginTop: 8, color: colors.black, fontSize: 13, fontWeight: '500' }}>{props.title}</Text>
                </Card>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})

export default ItemMenuDashboardKebun;