
'use strict';

import React, { Component } from 'react';
import { BackHandler, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TaskServices from '../../Database/TaskServices';
import { Fonts } from '../../Themes';

class PilihRoad extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      dataList: [],
      user: null
    };
  };

  static navigationOptions = {
    header: null
  };

  onSelect(user) {
    this.props.navigation.state.params.changeRoad(user);
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    const dataRoad = TaskServices.getAllData('TM_ROAD');

    this.setState({ adresses: dataRoad, dataList: dataRoad })
  }

  searchedAdresses = (searchedText) => {
    var result = this.state.adresses.filter(function (adress) {
      return adress.ROAD_NAME.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    this.setState({ dataList: result });
  };

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#DDDDDD',
          padding: 10
        }}>
          <TextInput
            style={styles.textinput}
            onChangeText={this.searchedAdresses}
            placeholder="Cari nama jalan" />
        </View>
        <View style={{
          flex: 1
        }}>
          <FlatList
            style={{ flex: 1 }}
            data={this.state.dataList}
            extraData={this.state}
            removeClippedSubviews={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.onSelect(item)
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#8E8E8E'
                  }}
                >
                  <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 15, color: 'black', fontFamily: Fonts.book }}>{item.ROAD_NAME}</Text>
                    <Text style={{ fontSize: 13, color: 'grey', marginTop: 3, fontFamily: Fonts.book }}>{item.ROAD_CODE}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    );
  };
}

export default PilihRoad;

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
    paddingLeft: 12,
    marginLeft: 5,
    marginRight: 5,
    height: 45,
    backgroundColor: '#f2f2f2',
    ...border,
    fontFamily: Fonts.medium
  }
});
const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 3
};
