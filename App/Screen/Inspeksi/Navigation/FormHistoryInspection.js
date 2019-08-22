import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../../../Constant/Colors'
import FormHistoryInspectionNavigator from './FormHistoryInspectionNavigator'


class FormHistoryInspection extends Component{

    // static router = FormHistoryInspection.router;

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor
        },
        title: 'Inspeksi',
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
    };

    render() {
        return (
            <View style={styles.container}>
                <FormHistoryInspectionNavigator />
            </View >
        )
    }

}

export default FormHistoryInspection;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    }
});
