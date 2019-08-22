import React from 'react';
import {BackHandler} from 'react-native'

import {withNavigation} from 'react-navigation';

class HandleBack extends React.Component {
    constructor(props) {
        super(props)

        this.didFocus = props.navigation.addListener('didFocus', payload => {
            BackHandler.addEventListener('hardwareBackPress', this.onBack)
        });
    }

    componentDidMount() {
        this.willBlur = this.props.navigation.addListener('willBlur', payload => {
            BackHandler.removeEventListener('hardwareBackPress', this.onBack)
        });
    }

    componentWillUnmount() {
        this.didFocus.remove();
        this.willBlur.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    }

    onBack = () => {
        return this.props.onBack();
    }

    render() {
        return this.props.children;
    }
}

export default withNavigation(HandleBack);
