import './Config'
import DebugConfig from './Config/DebugConfig'
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import createSore from './Redux';
import RootNavigation from './Navigation/RootNavigation'
import {
    AppRegistry
  } from 'react-native';

const store = createSore();
const LogLocation = async (data) => {
    navigator.geolocation.getCurrentPosition((position) => {
     console.log(position.coords);
    });
}

class AppMain extends Component{

    render(){
        return(
            <Provider store={store}>
                <RootNavigation/>
            </Provider>
        )
    }
}

//AppRegistry.registerHeadlessTask('LogLocation', () => LogLocation);
// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(AppMain) : AppMain);