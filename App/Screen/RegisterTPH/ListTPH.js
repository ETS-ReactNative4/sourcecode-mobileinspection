import React from 'react';
import { BackHandler, ListView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Container, Content, View, Card, Col } from 'native-base';
import TaskServices from '../../Database/TaskServices';
import Icons from 'react-native-vector-icons/MaterialIcons'
import { Fonts, Colors } from '../../Themes';
import { convertTimestampToDate, dateDisplayMobile, dateDisplayMobileWithoutHours, getTodayDate } from '../../Lib/Utils';
import moment from "moment"

import { NavigationActions, StackActions } from 'react-navigation';
var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

import DateTimePicker from 'react-native-modal-datetime-picker'

export default class ListTPH extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        const block_code = props.navigation.getParam('block_code');

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            bisnisArea: [],
            user: null,
            date: new Date(),
            isDateTimePickerVisible: false,
            block_code
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.colorPrimary
            },
            title: 'List TPH',
            headerTintColor: '#fff',
            headerTitleStyle: {
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            }
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    async componentDidMount() {
        await this._deleteDataTPH();
        this._queryDataTPH(this.state.date);
    }

    /** 
   * DELETE DATA TPH MELEBIHI 7 HARI DAN STATUS SYCNC = 'Y'
   * ADD BY AMINJU 2019/12/18
   */
    async _deleteDataTPH() {
        let getData = TaskServices.getAllData('TR_REGISTER_TPH');
        var now = moment(new Date());
        getData.map((item, index) => {
            if (item.STATUS_SYNC == "Y") {
                let endTime = item.SYNC_TIME.substring(0, 10);
                var diff = moment(new Date(endTime)).diff(now, 'day');

                if (diff < -7) {
                    TaskServices.deleteRecord('TR_REGISTER_TPH', index);
                } else {
                    console.log('Diff Range Hari : ', diff)
                }
            }
        })
    }


    _queryDataTPH(date) {
        const format = convertTimestampToDate(date, "YYYY-MM-DD");

        let dataSorted = TaskServices.getAllData('TR_REGISTER_TPH').sorted('NO_TPH', false);
        let data = dataSorted.filtered(`INSERT_TIME CONTAINS[c] "${format}" AND BLOCK_CODE == "${this.state.block_code}"`);

        if (data.length > 0) {
            let arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    no_tph: data[i].NO_TPH,
                    werks: data[i].WERKS,
                    afd_code: data[i].AFD_CODE,
                    block_code: data[i].BLOCK_CODE,
                    status_sync: data[i].STATUS_SYNC,
                });
                this.setState({ bisnisArea: arr })
            }
        } else {
            this.setState({ bisnisArea: [] })
        }

    }

    onSelectBa(user) {
        console.log(user)
        // this.props.navigation.navigate('RegisterTPH', {
        //     location: user
        // })
    };

    renderBisnisArea = (user) => {

        const list = user.werks + "-" + user.afd_code + "-" + user.block_code + "-" + user.no_tph;

        return (
            <View style={{ flex: 1, padding: 5 }}>
                <TouchableOpacity activeOpacity={1} onPress={() => { this.onSelectBa(user) }}>
                    <Text style={{ fontFamily: Fonts.demi, fontSize: 16, color: 'black' }}>{"TPH " + user.no_tph}</Text>
                    <Text style={{ fontFamily: Fonts.demi, fontSize: 12, color: 'grey', marginTop: 3 }}>{list}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ date: dateDisplayMobileWithoutHours(date) })
        this._hideDateTimePicker();
        this._deleteDataTPH()
        this._queryDataTPH(date)
    };

    _goToHome = () => {

        const navigation = this.props.navigation;
        let routeName = 'MainMenu';
        Promise.all([
            navigation.dispatch(
                StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: routeName })]
                })
            )])
    }

    render() {
        return (
            <Container>
                <StatusBar
                    hidden={false}
                    barStyle="light-content" />
                <Content >
                    <View style={{ flex: 1, padding: 12 }}>
                        {/* <View style={styles.containerBisnisArea}>
                            <View style={{ justifyContent: 'center' }} >
                                <Icons name="ios-search" color={'grey'} size={20} style={{ marginLeft: 12, marginRight: 6 }} />
                            </View>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={this.searchedBisnisArea}
                                placeholder="Pilih Blok" />
                        </View>

                        <View style={{ flex: 0.2, alignContent: 'center' }}>
                            <TouchableOpacity onPress={() => { this.handleBackButtonClick() }}>
                                <Text style={{ fontSize: 16, fontWeight: '300', alignSelf: 'center', marginTop: 8, marginLeft: 8 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View> */}

                        <Card style={{ flex: 1, height: 50, borderRadius: 5 }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={this._showDateTimePicker}
                                style={{
                                    flex: 1,
                                    justifyContent: 'space-between',
                                    height: 50,
                                    borderRadius: 5,
                                    borderWidth: 0.8,
                                    borderColor: Colors.colorPrimary,
                                    flexDirection: "row",
                                    alignItems: 'center',
                                    paddingHorizontal: 12
                                }}>

                                <Text style={{
                                    marginLeft: 8,
                                    fontSize: 14,
                                    color: Colors.colorPrimary,
                                    fontFamily: Fonts.book,

                                }}>{dateDisplayMobileWithoutHours(this.state.date)}</Text>

                                <Icons name={'keyboard-arrow-down'} size={24} color={Colors.colorPrimary} />

                            </TouchableOpacity>
                        </Card>

                        <DateTimePicker
                            // minimumDate={new Date()}
                            maximumDate={new Date()}
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker} />

                    </View>

                    <View style={styles.separator} />

                    <View style={{ padding: 16 }}>
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.bisnisArea)}
                            renderRow={this.renderBisnisArea}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />} />
                    </View>
                </Content>


                <Card style={{ height: 54, borderRadius: 10, backgroundColor: Colors.colorPrimary, elevation: 2, position: 'absolute', bottom: 16, right: 12, left: 12 }}>
                    <TouchableOpacity onPress={() => this._goToHome()} style={{ width: '100%', height: 54, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Fonts.book, color: 'white', fontSize: 16 }}>SELESAI</Text>
                    </TouchableOpacity>
                </Card>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    containerBisnisArea: {
        flex: 0.8,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        height: 40
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#D5D5D5',
    },
    textinput: {
        marginTop: 2,
        flex: 1,
        height: 40,
        color: 'grey'
    }
});
