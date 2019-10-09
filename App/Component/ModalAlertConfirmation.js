import React, {Component} from 'react';
import {Image, Modal, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Text, View} from 'native-base';
// import { Colors, Fonts } from '../Themes';
import Colors from '../Constant/Colors';

export default class ModalConfirmation extends Component {
	// Prop type warnings
	static propTypes = {
		onPressCancel: PropTypes.func,
		onPressSubmit: PropTypes.func,
        cancelText: PropTypes.string,
        submitText: PropTypes.string,
		icon: PropTypes.string,
		title: PropTypes.string,
		message: PropTypes.string,
		visible: PropTypes.bool
	};

	// Defaults for props
	static defaultProps = {
		onPressCancel: () => { },
		onPressSubmit: () => { },
        cancelText: "Tidak",
        submitText: "Iya",
		icon: require('../Images/img-no-data.png'),
		title: 'Title',
		message: 'Message',
		visible: false
	};

	render() {
		const props = this.props;
		return (
			<Modal
				visible={props.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={props.onPressCancel}>
				<View style={style.modalContainer}>
					<View style={style.modalInnerContainer}>
						{/* <Icon size={24} name={'close'} /> */}
						<View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
							<Image style={{ width: 150, height: 150, marginTop: 12 }} source={props.icon} />
							<Text style={style.textTitle}> {props.title}</Text>
							<Text style={style.textMessage}>{props.message}</Text>
						</View>
						<View style={style.bottomContainer} >
							<View style={{
								flex: 1, width: '100%', flexDirection: 'row', backgroundColor: '#f9cb3a',
								borderBottomEndRadius: 10,
								borderBottomStartRadius: 10
							}}>
								<TouchableOpacity onPress={props.onPressCancel} style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
									<View transparent style={style.button}>
										<Text style={{ color: 'black', fontSize: 16 }}>{props.cancelText}</Text>
									</View>
								</TouchableOpacity>
								<View style={{ backgroundColor: Colors.background, width: 0.5 }}></View>
								<TouchableOpacity onPress={props.onPressSubmit} style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
									<View transparent style={style.button}>
										<Text style={{ color: 'grey', fontSize: 16 }}>{props.submitText}</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

const style = {
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: Colors.shade,
		paddingLeft: 24,
		paddingRight: 24
	},
	modalInnerContainer: {
		alignItems: 'center',
		backgroundColor: Colors.background,
		borderRadius: 10
	},
	textTitle: {
		fontSize: 20,
		fontWeight: '400',
		textAlign: 'center',
		color: 'grey',
		paddingLeft: 12,
		paddingRight: 12
	},
	textMessage: {
		fontSize: 14,
		textAlign: 'center',
		color: '#c5c5c5',
		paddingLeft: 12,
		paddingRight: 12
	},
	button: {
		justifyContent: 'center',
		alignSelf: 'center'
	},
	bottomContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 64,
		width: '100%',
		backgroundColor: '#f9cb3a',
		borderBottomEndRadius: 10,
		borderBottomStartRadius: 10,
		marginTop: 12
	}
};
