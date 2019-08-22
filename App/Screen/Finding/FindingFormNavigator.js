import {createStackNavigator} from 'react-navigation';

import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import TakeFoto from './TakeFoto'

export default createStackNavigator({
  Step1: {
    screen: FormStep1
  },
  Step2: {
    screen: FormStep2
  },
  TakeFoto: {screen: TakeFoto}
}, {
    headerMode: 'screen',
    initialRouteName: 'Step1',
    transitionConfig: () => ({ screenInterpolator: () => null }),
  }
);
