import {createStackNavigator} from 'react-navigation';

import DetailHistory from '../InpectionDetail';

export default createStackNavigator({
    DetailHistory: {screen: DetailHistory},
}, {
    headerMode: 'none',
    initialRouteName: 'DetailHistory',
    transitionConfig: () => ({ screenInterpolator: () => null }),
  }
);
