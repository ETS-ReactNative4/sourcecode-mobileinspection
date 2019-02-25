
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

import HistoryInspection from './HistoryInscpection';
import ListInspection from './ListInspection';

export default createMaterialTopTabNavigator({
  Riwayat: {
    screen: HistoryInspection,
    navigationOptions: {
      tabBarLabel: 'Riwayat'
    }
  },
  DaftarInspeksi: {
    screen: ListInspection,
    navigationOptions: {
      tabBarLabel: 'Daftar Inspeksi'
    }
  }
}, {
    initialRouteName: 'DaftarInspeksi',
    order: ['DaftarInspeksi', 'Riwayat'],
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: '#51A977',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white',
        borderTopColor: "transparent",
        elevation: 0,
        marginTop: -20
      },
      indicatorStyle: {
        backgroundColor: '#2db92d',
        width: 15,
        maxWidth: 15,
        marginStart: '23%'
      },
      showIcon: true,
    }
  });



