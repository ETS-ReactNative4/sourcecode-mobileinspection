import {createMaterialTopTabNavigator} from 'react-navigation';

import HistoryFinding from './HistoryFinding';
import ListFinding from './ListFinding';

export default createMaterialTopTabNavigator({
  Riwayat: {
    screen: HistoryFinding,
    navigationOptions: {
      tabBarLabel: 'Riwayat'
    }
  },
  DaftarFinding: {
    screen: ListFinding,
    navigationOptions: {
      tabBarLabel: 'Daftar Temuan'
    }
  }
}, {
    initialRouteName: 'DaftarFinding',
    order: ['DaftarFinding', 'Riwayat'],
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: '#0F5CBF',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white',
        borderTopColor: "transparent",
        elevation: 0
      },
      indicatorStyle: {
        backgroundColor: '#0F5CBF',
        width: 15,
        maxWidth: 15,
        marginStart: '23%'
      }
    }
  });
