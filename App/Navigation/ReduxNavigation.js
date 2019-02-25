import React from 'react';
import * as ReactNavigation from 'react-navigation';
import { connect } from 'react-redux';
import AppNavigation from './AppNavigation';
// import MainNavigation from './MainNavigation';
// import TestSwitch from './TestSwitch'
import { BackHandler } from 'react-native';
import PropTypes from 'prop-types';

class ReduxNavigation extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		nav: PropTypes.object.isRequired
	};

	render() {
		return <AppNavigation />;
		
		// return <TestSwitch />;
	}
}

const mapStateToProps = (state) => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation);
