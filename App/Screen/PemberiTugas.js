
import React from 'react';
import { StatusBar, Text, TouchableOpacity, StyleSheet, TextInput, ListView, BackHandler } from 'react-native';
import { Container, Content, View } from 'native-base';
import TaskServices from '../Database/TaskServices';
import Icons from 'react-native-vector-icons/Ionicons'

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class FilterScreen extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            searchedKontak: [],
            kontak: [],
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
        let data = TaskServices.getAllData('TR_CONTACT');
        let arr = [];
        for (var i = 0; i < data.length; i++) {
            arr.push({
                userAuth: data[i].USER_AUTH_CODE,
                fullName: data[i].FULLNAME,
                userRole: data[i].USER_ROLE,
            });
            this.setState({ kontak: arr, searchedKontak: arr })
        }
    }

    onSelectAssignto(user){
        this.props.navigation.state.params.assignTo(user);
        this.props.navigation.goBack();
      };

    searchedKontak = (searchedText) => {
        var searchedKontak = this.state.kontak.filter(function (adress) {
            return adress.fullName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
        this.setState({ searchedKontak: searchedKontak });
    };

    renderkontak = (user) => {
        return (
            <View style={{ flex: 1, padding: 5 }}>
                <TouchableOpacity onPress={() => { this.onSelectAssignto(user) }}>
                    <Text style={{ fontSize: 15, color: 'black' }}>{user.fullName}</Text>
                    <Text style={{ fontSize: 13, color: 'grey', marginTop: 3 }}>{user.userRole}</Text>
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
                        <View style={styles.containerkontak}>
                            <View style={{ justifyContent: 'center' }} >
                                <Icons name="ios-search" color={'grey'} size={20} style={{ marginLeft: 12, marginRight: 6 }} />
                            </View>
                            <TextInput
                                style={styles.textinput}
                                onChangeText={this.searchedKontak}
                                placeholder="Pilih Pemberi Tugas" />
                        </View>

                        <View style={{ flex:0.2, alignContent: 'center' }}>
                            <TouchableOpacity onPress={() => { this.handleBackButtonClick() }}>
                                <Text style={{ fontSize: 16, fontWeight: '300', alignSelf: 'center', marginTop: 8, marginLeft: 8 }}>
									Cancel
								</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.separator} />

                    <View style={{ marginTop: 5, padding: 16 }}>
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.searchedKontak)}
                            renderRow={this.renderkontak}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />} />
                    </View>

                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    containerkontak: {
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


export default FilterScreen;
