import {createMaterialTopTabNavigator} from 'react-navigation';

import HistoryEbcc from './HistoryEbcc';
import ListEbcc from './ListEbcc';

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
      tabBarLabel: 'Daftar Sampling'
    }
  }
}, {
    initialRouteName: 'DaftarEbcc',
    order: ['DaftarEbcc', 'Riwayat'],
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



