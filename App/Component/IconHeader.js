import React from 'react'
import {Image, TouchableOpacity, View} from 'react-native'

const IconHeader = (props) => {
    if (props.show) {
        return (
            <TouchableOpacity onPress={props.onPress}>
                <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, props.padding]}>
                    <Image style={{ width: 28, height: 28 }} source={props.icon} />
                </View>
            </TouchableOpacity>
        )
    } else {
        return null
    }
}

export default IconHeader
