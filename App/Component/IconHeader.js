import React from 'react'
import { TouchableOpacity, View, Image } from 'react-native'

const IconHeader = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, props.padding]}>
                <Image style={{ width: 28, height: 28 }} source={props.icon} />
            </View>
        </TouchableOpacity>
    )
}

export default IconHeader