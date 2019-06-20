import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, AsyncStorage } from 'react-native'
import Calendar from 'react-native-calendario';
import Colors from '../Constant/Colors';
import DateRangePicker from '../Lib/DateRangePicker';


//customButton usage...
export default class NewPicker extends React.Component {

    static navigationOptions = {
        header: null
    }

    customButtonOnPress = () => {
        console.log('customButton');
        this.picker.onConfirm();
    }

    constructor(props) {
        super(props);

        this.state = {
            range: ''
        }
    }

    _onChooseDate() {
        AsyncStorage.getItem('range', (error, result) => {
            if (result) {
                console.log(result);
                let resultParsed = JSON.parse(result)
                console.log(resultParsed.startDate);
                console.log(resultParsed.endDate)

                this.props.navigation.state.params.changeBatasWaktu(result);
                this.props.navigation.goBack();
            }
        });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: ' white' }}>
                <View style={styles.container}>
					<DateRangePicker
						style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
						onSuccess={(s, e) => {
                            AsyncStorage.setItem('range', JSON.stringify({
                                startDate: s,
                                endDate: e
                            }))
                        }}
						theme={{ markColor: 'green', markTextColor: 'white' }}
						maxDate={new Date()}/>
                    {/*<Calendar
                        onChange={range => AsyncStorage.setItem('range', JSON.stringify(range))}
                        minDate="2018-04-20"
                        startDate="2018-04-30"
                        endDate="2018-05-05"
                    // theme={{
                    //     weekColumnTextStyle: {
                    //         color: 'red',
                    //     },
                    //     weekColumnStyle: {
                    //         paddingVertical: 20,
                    //     },
                    //     weekColumnsContainerStyle: {
                    //         backgroundColor: 'lightgrey',
                    //     },
                    //     monthTitleStyle: {
                    //         color: 'blue',
                    //     },
                    //     nonTouchableDayContainerStyle: {
                    //         backgroundColor: 'red',
                    //     },
                    //     nonTouchableDayTextStyle: {
                    //         color: 'green',
                    //     },
                    //     dayTextStyle: {
                    //         color: 'blue',
                    //     },
                    //     activeDayContainerStyle: {
                    //         backgroundColor: 'lightgrey',
                    //     },
                    //     activeDayTextStyle: {
                    //         color: 'red',
                    //     },
                    // }}
                    />*/}
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        this._onChooseDate(this.state.tanggal);
                    }} style={[styles.button]}>
                        <Text style={styles.buttonText}>Simpan</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.tintColor
    },
    buttonText: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center'
    },
	container: {
        flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	}
});