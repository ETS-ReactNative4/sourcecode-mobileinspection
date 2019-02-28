
import React from 'react';
import { StatusBar, Text, TouchableOpacity, StyleSheet, AsyncStorage, ListView } from 'react-native';
import Colors from '../Constant/Colors';
import { Container, Content, Icon, Picker, Form, View } from 'native-base';
import { getTodayDate, changeFormatDate } from '../Lib/Utils';
import { Calendar } from 'react-native-calendars'
import TaskServices from '../Database/TaskServices';
import Moment from 'moment'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class FilterScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: Colors.tintColorPrimary
            },
            headerTitleStyle: {
                textAlign: "left",
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            },
            title: 'Filter',
            headerTintColor: '#fff',
            // headerRight: (
            //     <TouchableOpacity onPress={navigation.getParam('resetFilter')}>
            //         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 12, marginTop: 1 }}>
            //             <Text style={{ fontSize: 18, color: 'white', marginRight: 16, alignSelf: 'center' }} >Reset</Text>
            //         </View>
            //     </TouchableOpacity>
            // ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            valBisnisArea: 'Pilih Lokasi',
            valAssignto: 'Pilih Pemberi Tugas',
            valUserAuthCode: '',
            valTanggal: 'Pilih Batas Waktu',
            valBatasWaktu: 'Pilih Batas Waktu',
            valStBatasWaktu: '',
            valEndBatasWaktu: '',
            selected: "key0",
            selectedTanggal: "key0",
            arrDataFilter: []
        }
    }

    componentDidMount() {
        // this.props.navigation.setParams({ resetFilter: this._resetFilter });
        this._retrieveData();
    }

    _setDataFilter(data) {
        console.log('Data Set : ' + data);
        let parseData = JSON.parse(data);
        parseData.map(item => {
            console.log('Data valBisnisArea : ' + item.ba)
            this.setState({
                valBisnisArea: item.ba,
                selected: this.getSetStatus(item.status),
                valStBatasWaktu: item.stBatasWaktu,
                valEndBatasWaktu: item.endBatasWaktu,
                valBatasWaktu: item.valBatasWaktu,
                valUserAuthCode: item.userAuth,
                valAssignto: item.valAssignto
            });
        })
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('data');
            if (value !== null) {
                // We have data!!
                console.log('Data : ' + value);
                this._setDataFilter(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    _storeData = async (data) => {
        try {
            await AsyncStorage.setItem('data', data);
        } catch (error) {
            // Error saving data
        }
    };

    _resetFilter = () => {
        this.setState({
            valBisnisArea: 'Pilih Lokasi',
            valAssignto: 'Pilih Pemberi Tugas',
            valUserAuthCode: '',
            valTanggal: 'Pilih Batas Waktu',
            valBatasWaktu: 'Pilih Batas Waktu',
            valStBatasWaktu: '',
            valEndBatasWaktu: '',
            selected: "key0",
            selectedTanggal: "key0",
        })
    }

    changeBa = data => {
        this.setState({ valBisnisArea: data.fullName })
    }

    assignTo = data => {
        this.setState({
            valAssignto: data.fullName,
            valUserAuthCode: data.userAuth
        });
    }

    changeBatasWaktu = data => {
        let resultParsed = JSON.parse(data)

        let stDate = Moment(resultParsed.startDate).format('YYYYMMDDHHmmss');
        let endDate = Moment(resultParsed.endDate).format('YYYYMMDDHHmmss');

        let setData;
        let endDataParam;
        if (endDate == 'Invalid date') {
            setData = Moment(changeFormatDate(stDate, "YYYY-MM-DD hh-mm-ss")).format('LL');
            endDataParam = Moment(resultParsed.startDate).format('YYYYMMDDHHmmss');
        } else {
            setData = Moment(changeFormatDate(stDate, "YYYY-MM-DD hh-mm-ss")).format('LL') + " s/d " +
                Moment(changeFormatDate(endDate, "YYYY-MM-DD hh-mm-ss")).format('LL');
            endDataParam = Moment(resultParsed.endDate).format('YYYYMMDDHHmmss');
        }

        this.setState({
            valStBatasWaktu: stDate,
            valEndBatasWaktu: endDataParam,
            valBatasWaktu: setData
        })
    }

    _changeFilterList() {
        let arrData = [];
        arrData.push({
            ba: this.state.valBisnisArea,
            status: this.getStatus(this.state.selected),
            stBatasWaktu: this.state.valStBatasWaktu,
            endBatasWaktu: this.state.valEndBatasWaktu,
            valBatasWaktu: this.state.valBatasWaktu,
            userAuth: this.state.valUserAuthCode,
            valAssignto: this.state.valAssignto
        });

        this._storeData(JSON.stringify(arrData));

        this.props.navigation.state.params._changeFilterList(arrData);
        this.props.navigation.goBack();
    };

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    onValueChangeTanggal(value) {
        this.setState({
            selectedTanggal: value
        });
    }

    getStatus(param) {
        switch (param) {
            case 'key1':
                return 'BARU';
            case 'key2':
                return 'SEDANG DIPROSES';
            case 'key3':
                return 'SELESAI';
            default:
                return 'Pilih Status';
        }
    }

    getSetStatus(param) {
        switch (param) {
            case 'BARU':
                return 'key1';
            case 'SEDANG DIPROSES':
                return 'key2';
            case 'SELESAI':
                return 'key3';
            default:
                return 'key0';
        }
    }

    render() {
        return (
            <Container>
                <StatusBar
                    hidden={false}
                    barStyle="light-content" />
                <Content style={{ padding: 16 }}>
                    <Form>
                        <Text style={{ fontWeight: '400', marginLeft: 8, fontSize: 14, color: 'grey' }}>Bisnis Area</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BisnisArea', { changeBa: this.changeBa })} >
                            <Text style={{ color: 'black', marginLeft: 8, fontSize: 16, marginTop: 8 }}>{this.state.valBisnisArea}</Text>
                            <View style={{ height: 0.5, flex: 1, flexDirection: 'row', backgroundColor: 'grey', marginTop: 8 }}></View>
                        </TouchableOpacity>

                        <Text style={{ fontWeight: '400', marginLeft: 8, fontSize: 14, marginTop: 16, color: 'grey' }}>Pemberi Tugas</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('PemberiTugas', { assignTo: this.assignTo })} >
                            <Text style={{ color: 'black', marginLeft: 8, fontSize: 16, marginTop: 8 }}>{this.state.valAssignto}</Text>
                            <View style={{ height: 0.5, flex: 1, flexDirection: 'row', backgroundColor: 'grey', marginTop: 8 }}></View>
                        </TouchableOpacity>

                        <Text style={{ fontWeight: '400', marginLeft: 8, fontSize: 14, marginTop: 16, color: 'grey' }}>Tanggal Pembuatan</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Calendar', { changeBatasWaktu: this.changeBatasWaktu })}  >
                            <Text style={{ color: 'black', marginLeft: 8, fontSize: 16, marginTop: 8 }}>{this.state.valBatasWaktu}</Text>
                            <View style={{ height: 0.5, flex: 1, flexDirection: 'row', backgroundColor: 'grey', marginTop: 8 }}></View>
                        </TouchableOpacity>

                        <Text style={{ fontWeight: '400', marginLeft: 8, fontSize: 14, marginTop: 16, color: 'grey' }}>Status Temuan</Text>
                        <Picker
                            mode="dropdown"
                            iosHeader="Select your SIM"
                            iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
                            style={{ width: undefined }}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            <Picker.Item label="Pilih Status" value="key0" />
                            <Picker.Item label="BARU" value="key1" />
                            <Picker.Item label="SEDANG DI PROSES" value="key2" />
                            <Picker.Item label="SELESAI" value="key3" />
                        </Picker>
                        <View style={{ height: 0.5, flex: 1, flexDirection: 'row', backgroundColor: 'grey' }}></View>

                        <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'row', marginTop: 16 }}>
                            <TouchableOpacity onPress={this._resetFilter} style={[styles.button, {
                                marginRight: 3,
                                borderWidth: 1,
                                borderColor: Colors.tintColor,
                            }]}>
                                <Text style={[styles.buttonText, { color: Colors.tintColor, }]}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this._changeFilterList() }} style={[styles.button, { marginLeft: 3, backgroundColor: Colors.tintColor }]}>
                                <Text style={[styles.buttonText, { color: 'white' }]}>Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </Form>
                </Content>
            </Container >
        )
    }
}

const styles = StyleSheet.create({
    containerBisnisArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    textinput: {
        flex: 1,
        paddingLeft: 5,
        marginLeft: 5,
        marginRight: 5,
        height: 45,
        backgroundColor: 'white'
    },
    button: {
        flex: 1,
        height: 45,
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    }
});


export default FilterScreen;