
'use strict';

import React, { Component } from 'react';
import { BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TaskService from '../../Database/TaskServices';
import FastImage from 'react-native-fast-image'
import { dirPhotoKategori } from '../../Lib/dirStorage';
import Colors from '../../Constant/Colors';
import { Fonts } from '../../Themes'

class PilihKategori extends Component {

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      adresses: [],
      user: null,
      categoriesBlock: TaskService.getAllData('TR_CATEGORY').filtered('CATEGORY_CODE CONTAINS[c] "CA"').sorted('CATEGORY_NAME'),
      categoriesInfra: TaskService.getAllData('TR_CATEGORY').filtered('CATEGORY_CODE CONTAINS[c] "IF"').sorted('CATEGORY_NAME'),
      active: true,
      activeIndex: 0
    };
  };

  static navigationOptions = {
    header: null
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  onSelect(params) {

    const category = {
      CATEGORY_TYPE: this.state.activeIndex,
      CATEGORY_NAME: params.CATEGORY_NAME,
      CATEGORY_CODE: params.CATEGORY_CODE,
    }

    console.log('Pilih Category : ', category)

    this.props.navigation.state.params.changeCategory(category);
    this.props.navigation.goBack();
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

        <Text style={{ marginBottom: 12, fontSize: 16, fontFamily: Fonts.demi, alignSelf: 'center' }}>Pilih Kategori</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>

          {/* TAB BLOK */}
          <TabCategory
            onPress={() => this.tabClicked(0)}
            activeIndex={this.state.activeIndex}
            valueIndex={0}
            text={'Blok'} />

          {/* TAB INFRA */}
          <TabCategory
            onPress={() => this.tabClicked(1)}
            activeIndex={this.state.activeIndex}
            valueIndex={1}
            text={'Infra'} />
        </View>
        {this.renderSection()}

      </View>
    );
  };

  tabClicked(index) {
    this.setState({
      activeIndex: index,
    })
  }

  renderSection() {
    if (this.state.activeIndex === 0) {
      return (
        <FlatList
          extraData={this.state}
          data={this.state.categoriesBlock}
          keyExtractor={(item, index) => "Block" + item.id + index}
          numColumns={4}
          renderItem={({ item }) => {
            return <ItemCategory onPress={() => this.onSelect(item)} icon={item.ICON} catergoryName={item.CATEGORY_NAME} />
          }} />
      )
    }
    else if (this.state.activeIndex === 1) {
      return (
        <FlatList
          data={this.state.categoriesInfra}
          keyExtractor={(item, index) => "Infra" + item.id + index}
          numColumns={4}
          renderItem={({ item }) => {
            return <ItemCategory onPress={() => this.onSelect(item)} icon={item.ICON} catergoryName={item.CATEGORY_NAME} />
          }} />
      )
    }
  }
}

const ItemCategory = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.itemCategory}>
      <FastImage
        style={{ width: 40, height: 40 }}
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: `file://${dirPhotoKategori}/${props.icon}`,
          priority: FastImage.priority.normal,
        }} />
      <Text style={styles.textCategory}>{props.catergoryName}</Text>
    </TouchableOpacity>
  );
}

const TabCategory = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.tab, { backgroundColor: props.activeIndex == props.valueIndex ? Colors.tintColor : '#F7F7F7' }]}
      activeOpacity={0.8}>
      <Text style={{ color: props.activeIndex == props.valueIndex ? Colors.colorWhite : 'black', fontFamily: Fonts.medium }}>{props.text}</Text>
    </TouchableOpacity>
  );
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
    fontSize: 10,
    color: "#333333",
    fontFamily: Fonts.book,
    marginTop: 2
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
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
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
