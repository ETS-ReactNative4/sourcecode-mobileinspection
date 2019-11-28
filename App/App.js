import './Config'
import DebugConfig from './Config/DebugConfig'
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import createStore from './Redux';
import RootNavigation from './Navigation/RootNavigation'

const store = createStore();
class AppMain extends Component{

    render(){
        return(
            <Provider store={store}>
                <RootNavigation/>
            </Provider>
        )
    }
}

export default AppMain;
