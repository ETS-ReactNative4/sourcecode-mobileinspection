import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../../../Constant/Colors'
import FormInspectionNavigator from './FormInspectionNavigator'


class FormInspection extends Component{

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColor
        },
        title: 'Buat Inspeksi',
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
                <FormInspectionNavigator />
            </View >
        )
    }

}

export default FormInspection;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    }
});
