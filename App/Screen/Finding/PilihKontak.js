
'use strict';

import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, ListView, TouchableOpacity, Alert } from 'react-native';
import TaskServices from '../../Database/TaskServices';

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class PilihKontak extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedAdresses: [],
      adresses: [],
      user: null
    };
  };

  static navigationOptions = {
    header: null
  };

  onSelect(user) {
    this.props.navigation.state.params.changeContact(user);
    this.props.navigation.goBack();
  };

  componentDidMount() {

    const { navigation } = this.props;
    const afdCode = navigation.getParam('afdCode');
    const werks = navigation.getParam('werks');
    const withAfd = werks + afdCode;

    const login = TaskServices.getAllData('TR_LOGIN')

    let dataUser = TaskServices.query('TR_CONTACT', `USER_AUTH_CODE = "${login[0].USER_AUTH_CODE}"`);
    console.log(JSON.stringify(dataUser));
    let data = TaskServices.query('TR_CONTACT', `REF_ROLE = "AFD_CODE" AND LOCATION_CODE = "${withAfd}" AND USER_ROLE CONTAINS[c] "ASISTEN" AND USER_AUTH_CODE != "${login[0].USER_AUTH_CODE}"`);
    console.log(JSON.stringify(data));
    let data1 = TaskServices.query('TR_CONTACT', `REF_ROLE = "BA_CODE" AND LOCATION_CODE = "${werks}" AND USER_ROLE CONTAINS[c] "ASISTEN" AND USER_AUTH_CODE != "${login[0].USER_AUTH_CODE}"`);
    console.log(JSON.stringify(data1));

    let arr = [];
    for (var i = 0; i < dataUser.length; i++) {
      arr.push({
        userAuth: dataUser[i].USER_AUTH_CODE,
        fullName: dataUser[i].FULLNAME,
        userRole: dataUser[i].USER_ROLE,
      });
    }
    console.log("Array User: " + JSON.stringify(arr));

    for (var j = 0; j < data.length; j++) {
      arr.push({
        userAuth: data[j].USER_AUTH_CODE,
        fullName: data[j].FULLNAME,
        userRole: data[j].USER_ROLE,
      });
    }
    console.log("Array : " + JSON.stringify(arr));

    for (var k = 0; k < data1.length; k++) {
      arr.push({
        userAuth: data[k].USER_AUTH_CODE,
        fullName: data[k].FULLNAME,
        userRole: data[k].USER_ROLE
      })
    }
    console.log("Array Update : " + JSON.stringify(arr));

    this.setState({ adresses: arr, searchedAdresses: arr })
  }

  searchedAdresses = (searchedText) => {
    var searchedAdresses = this.state.adresses.filter(function (adress) {
      return adress.fullName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    this.setState({ searchedAdresses: searchedAdresses });
  };

  renderAdress = (user) => {
    return (
      <View style={{ flex: 1, padding: 5 }}>
        <TouchableOpacity onPress={() => { this.onSelect(user) }}>
          <Text style={{ fontSize: 15, color: 'black' }}>{user.fullName}</Text>
          <Text style={{ fontSize: 13, color: 'grey', marginTop: 3 }}>{user.userRole}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', backgroundColor: '#DDDDDD', padding: 10 }}>
          <TextInput
            style={styles.textinput}
            onChangeText={this.searchedAdresses}
            placeholder="Cari nama" />
        </View>
        <View style={{ marginTop: 5 }}>
          <ListView
            dataSource={ds.cloneWithRows(this.state.searchedAdresses)}
            renderRow={this.renderAdress}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </View>

      </View>
    );
  };
}

export default PilihKontak;

var styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#f2f2f2',
    ...border
  }
});
const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 3
};