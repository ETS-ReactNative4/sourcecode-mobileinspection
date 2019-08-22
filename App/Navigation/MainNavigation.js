import {createStackNavigator, createSwitchNavigator} from 'react-navigation';

import SplashScreen from '../Screen/SplashScreen';
import Login from '../Screen/Login'
import MainMenu from '../Screen/Home/MainTabNavigator'

const LoginStack = createStackNavigator({ Login: Login });
const AppTack = createStackNavigator({ MainMenu: MainMenu });
AppTack.navigationOptions = {
  header: null
}

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    SplashScreen: SplashScreen,
    LoginStack: LoginStack,
    AppTack: AppTack  
},
{
  headerMode: 'none',
  initialRouteName: 'SplashScreen',
  navigationOptions: {
    header: null
  },
});
