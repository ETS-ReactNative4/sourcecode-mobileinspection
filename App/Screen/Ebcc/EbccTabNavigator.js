import { createMaterialTopTabNavigator } from 'react-navigation';

import HistoryEbcc from './HistoryEbcc';
import ListEbcc from './ListEbcc';
import { Fonts } from '../../Themes';

export default createMaterialTopTabNavigator({
  Riwayat: {
    screen: HistoryEbcc,
    navigationOptions: {
      tabBarLabel: 'Riwayat'
    }
  },
  DaftarEbcc: {
    screen: ListEbcc,
    navigationOptions: {
      tabBarLabel: 'Daftar Sampling',
      fontSize: 5
    }
  }
}, {
  initialRouteName: 'DaftarEbcc',
  order: ['DaftarEbcc', 'Riwayat'],
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



