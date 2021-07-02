import { createMaterialTopTabNavigator } from 'react-navigation';

import HistoryBBC from './HistoryBBC';
import ListBBC from './ListBBC';
import { Fonts } from '../../Themes';

export default createMaterialTopTabNavigator({
  Riwayat: {
    screen: HistoryBBC,
    navigationOptions: {
      tabBarLabel: 'Riwayat'
    }
  },
  DaftarBBC: {
    screen: ListBBC,
    navigationOptions: {
      tabBarLabel: 'Daftar BBC',
      fontSize: 5
    }
  }
}, {
  initialRouteName: 'DaftarBBC',
  order: ['DaftarBBC', 'Riwayat'],
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#0F5CBF',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: 'white',
      borderTopColor: "transparent",
      elevation: 0,
      marginTop: -20,
    },
    indicatorStyle: {
      backgroundColor: '#0F5CBF',
      width: 15,
      maxWidth: 15,
      marginStart: '23%',
    },
    showIcon: true,
    labelStyle: {
      fontSize: 14,
      fontFamily: Fonts.medium
    },
  }
});



