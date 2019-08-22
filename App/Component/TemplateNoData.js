import React, {Component} from 'react'
import {Image, View} from 'react-native'

class TemplateNoData extends Component {
    render() {
        const container = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }
        return (
            <View style={container}>
                <Image
                    style={{ width: 300, height: 220 }}
                    source={this.props.img} />
            </View>
        )
    }
}

export default TemplateNoData;
