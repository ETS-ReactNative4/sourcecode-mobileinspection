import React from 'react';
import { Alert } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import FindingScreen from '../Finding/FindingScreen';
import InspectionScreen from '../Inspeksi/InspectionScreen';
import EbccValidationScreen from '../Ebcc/EbccValidationScreen';
import MoreScreen from '../More/MoreScreen';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

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

const MoreStack = createStackNavigator({
  More: MoreScreen,
});

MoreStack.navigationOptions = {
  tabBarLabel: 'Lainnya',
};

const EbccValidationStack = createStackNavigator({
  EbccValidation: EbccValidationScreen,
});

EbccValidationStack.navigationOptions = {
  tabBarLabel: 'Sampling EBCC',
};

export default (
  MainTabNavigator = createBottomTabNavigator({
    HomeStack,
    FindingStack,
    InspectionStack,
    EbccValidationStack,
    MoreStack
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
          } else if (routeName === 'MoreStack') {
            iconName = `more-horiz`;
            // You can return any component that you like here! We usually use an
            // icon component from react-native-vector-icons
            return <MaterialIcons name={iconName} size={horizontal ? 20 : 20} color={tintColor} />;
          }
        },
      }),
      tabBarOptions: {
        activeTintColor: '#36A100'
      }
    }
  ));


