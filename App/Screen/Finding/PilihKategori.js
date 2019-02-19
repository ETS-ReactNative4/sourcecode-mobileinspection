
'use strict';

import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet, ListView, TouchableOpacity, BackAndroid } from 'react-native';
import TaskService from '../../Database/TaskServices';
import FastImage from 'react-native-fast-image'
import { dirPhotoKategori } from '../../Lib/dirStorage';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class PilihKategori extends Component {  

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      searchedAdresses: [],
      adresses: [],
      user: null,
      categories: TaskService.getAllData('TR_CATEGORY')
    };
  };

  static navigationOptions = {
    header: null
  };

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }   

   componentDidMount() {
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonClick);
   } 

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  onSelect(user){
    this.props.navigation.state.params.changeCategory(user);
    this.props.navigation.goBack();
  };

  searchedAdresses = (searchedText) => {
    var searchedAdresses = this.state.adresses.filter(function(adress) {
      return adress.fullName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    this.setState({searchedAdresses: searchedAdresses});
  };
  
  render() {
    return (
        <View style={[styles.containerSlidingUpPanel]}>
            <View style={{ width: '100%', height: 20 }} onPress={() => this.setState({ isCategoryVisible: false })}>
                <View
                    style={{
                        backgroundColor: '#CCC', alignSelf: 'center',
                        height: 4, width: 80
                    }}
                ></View>
            </View>

            <Text style={{ marginBottom: 20, fontSize: 16, fontWeight: 'bold', alignSelf: 'center' }}>Pilih Kategori</Text>
            <FlatList
                data={this.state.categories}
                keyExtractor={item => item.id}
                numColumns={4}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => this.onSelect(item)}
                            style={styles.itemCategory}>
                            <FastImage style={{ width: 40, height: 40 }}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{
                                    uri: `file://${dirPhotoKategori}/${item.ICON}`,
                                    priority: FastImage.priority.normal,
                                }} />
                            <Text style={styles.textCategory}>{item.CATEGORY_NAME}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
  };
}

export default PilihKategori;

var styles = StyleSheet.create({
    containerSlidingUpPanel: {
        marginTop: 5,
        flex: 1,
        zIndex: 1,
        padding: 16,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white'
    },
    itemCategory: {
        alignItems: "center",
        flexGrow: 1,
        flex: 1,
        margin: 4,
        padding: 5,
        flexBasis: 0,
    },
    textCategory: {
        textAlign: 'center',
        fontSize: 9,
        color: "#333333"
    },
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
        flex:1,
        paddingLeft: 5,
        marginLeft:5,
        marginRight:5,
        height: 45,
        backgroundColor:'#f2f2f2',
        ...border
    }
});
const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 3
};