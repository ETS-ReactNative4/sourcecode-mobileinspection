import React, {Component} from 'react';
import ReduxNavigation from './ReduxNavigation';
import {connect} from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
// import ReduxPersist from '../Config/ReduxPersist';
import {ActionSheet, Toast} from 'native-base';

class RootContainer extends Component {
	componentDidMount() {
		// if redux persist is not active fire startup action
		// if (!ReduxPersist.active) {
		// 	this.props.startup();
		// }
	}

	componentWillUpdate() {
		Toast.toastInstance = null;
		ActionSheet.actionsheetInstance = null;
	}
	render() {
		return (
			<ReduxNavigation />
		);
	}
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = dispatch => ({
	startup: () => dispatch(StartupActions.startup())
});

export default connect(null, mapDispatchToProps)(RootContainer);
