import React from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, View} from 'react-native';

class Contact extends React.PureComponent {

	static propTypes = {
		onSelect: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	_onSelectedItem = () => {
		this.props.onSelect(this.props.user);
	};

	render() {
		const user = this.props.user
		return (
			<View style={{ flex: 1 }}>
				<TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 16 }}
					onPress={this._onSelectedItem}>
					{/* <FastImage style={{ marginRight: 16, width: 40, height: 40, borderRadius: 20 }}
						resizeMode={FastImage.resizeMode.contain}
						source={{
							uri: user.EMPLOYEE_NIK,
							priority: FastImage.priority.normal,
						}} /> */}
					<View style={{ flex: 1 }} >
						<Text style={{ fontSize: 14, color: 'black' }}>{user.FULLNAME}</Text>
						<Text style={{ fontSize: 12, color: 'grey', marginTop: 3 }}>{user.USER_ROLE}</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default Contact
