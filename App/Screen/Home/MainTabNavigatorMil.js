import React from 'react';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import EbccValidationScreen from '../Ebcc/EbccValidationScreen';
import MoreScreen from '../More/MoreScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MoreStack = createStackNavigator({
    More: { screen: MoreScreen, navigationOptions: { header: null } },
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
    EbccValidationStack,
    MoreStack
  }, {
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'EbccValidationStack') {
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
        activeTintColor: '#0F5CBF'
      }
    }
  ));


