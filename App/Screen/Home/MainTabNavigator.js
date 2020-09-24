import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import FindingScreen from '../Finding/FindingScreen';
import InspectionScreen from '../Inspeksi/InspectionScreen';
import EbccValidationScreen from '../Ebcc/EbccValidationScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { Fonts } from '../../Themes';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Beranda',
};

const FindingStack = createStackNavigator({
  Finding: FindingScreen,
});

FindingStack.navigationOptions = {
  tabBarLabel: 'Temuan',
};

const InspectionStack = createStackNavigator({
  Inspection: { screen: InspectionScreen },
});

InspectionStack.navigationOptions = {
  tabBarLabel: 'Inspeksi',
};

const EbccValidationStack = createStackNavigator({
  EbccValidation: EbccValidationScreen,
});

EbccValidationStack.navigationOptions = {
  tabBarLabel: 'Sampling',
};

export default (
  MainTabNavigator = createBottomTabNavigator({
    HomeStack,
    FindingStack,
    InspectionStack,
    EbccValidationStack
  }, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'HomeStack') {
          iconName = `home`;
          return <Entypo name={iconName} size={horizontal ? 20 : 20} color={tintColor} />;
        } else if (routeName === 'FindingStack') {
          iconName = `flashlight`;
          return <Entypo name={iconName} size={horizontal ? 20 : 20} color={tintColor} />;
        } else if (routeName === 'InspectionStack') {
          iconName = `search`;
          return <FontAwesome name={iconName} size={horizontal ? 20 : 20} color={tintColor} />;
        } else if (routeName === 'EbccValidationStack') {
          iconName = `check-circle`;
          return <FontAwesome name={iconName} size={horizontal ? 20 : 20} color={tintColor} />;
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: '#0F5CBF',
      labelStyle: {
        fontSize: 14,
        fontFamily: Fonts.book
      },
    }
  }
  ));


