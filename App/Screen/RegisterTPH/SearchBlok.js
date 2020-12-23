import React from 'react';
import { BackHandler, ListView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Container, Content, View } from 'native-base';
import TaskServices from '../../Database/TaskServices';
import Icons from 'react-native-vector-icons/Ionicons'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class SearchBlok extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            searchedBisnisArea: [],
            bisnisArea: [],
            user: null
        }
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

    componentDidMount() {

        let loginData = TaskServices.getAllData('TR_LOGIN')[0];
        let query;
        if (loginData.REFFERENCE_ROLE == "AFD_CODE") {

            const filters = loginData.LOCATION_CODE.split(',');
            //Filter By Afdeling
            query = 'WERKS_AFD_CODE == ';
            for (var i = 0; i < filters.length; i++) {
                query += `'${filters[i]}'`;
                if (i + 1 < filters.length) {
                    query += ` OR WERKS_AFD_CODE == `
                }
            }

            let result = TaskServices.getAllData('TM_BLOCK').sorted('BLOCK_NAME');
            var data = result.filtered(query);

            let arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    block_name: data[i].BLOCK_NAME,
                    block_code: data[i].BLOCK_CODE,
                    afd_code: data[i].AFD_CODE,
                    werks: data[i].WERKS,
                });
                this.setState({ bisnisArea: arr, searchedBisnisArea: arr })
            }
        } else {
            let data = TaskServices.getAllData('TM_BLOCK').sorted('BLOCK_NAME');
            let arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    block_name: data[i].BLOCK_NAME,
                    block_code: data[i].BLOCK_CODE,
                    afd_code: data[i].AFD_CODE,
                    werks: data[i].WERKS,
                });
                this.setState({ bisnisArea: arr, searchedBisnisArea: arr })
            }
        }


    }

    onSelectBa(location) {
        console.log(location)
        this.props.navigation.navigate('RegisterTPH', {
            location
        })
    };

    searchedBisnisArea = (searchedText) => {
        var searchedBisnisArea = this.state.bisnisArea.filter(function (adress) {
            return adress.block_name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
        this.setState({ searchedBisnisArea: searchedBisnisArea });
    };

    renderBisnisArea = (user) => {
        return (
            <View style={{ flex: 1, padding: 5 }}>
                <TouchableOpacity onPress={() => { this.onSelectBa(user) }}>
                    <Text style={{ fontSize: 15, color: 'black' }}>{user.block_name}</Text>
                    <Text style={{ fontSize: 13, color: 'grey', marginTop: 3 }}>{user.afd_code + " - " + user.werks + " - " + user.block_code}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        return (
            <Container>
                <StatusBar
                    hidden={false}
                    barStyle="light-content" />
                <Content >
                    <View style={{ flex: 1, flexDirection: 'row', padding: 16 }}>
                        <View style={styles.containerBisnisArea}>
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
                        </View>

                    </View>

                    <View style={styles.separator} />

                    <View style={{ marginTop: 5, padding: 16 }}>
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedBisnisArea)}
                            renderRow={this.renderBisnisArea}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />} />
                    </View>

                </Content>
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
