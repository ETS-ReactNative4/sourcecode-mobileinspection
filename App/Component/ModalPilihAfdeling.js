import React, { Component } from 'react';
import { Modal, Picker, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, View } from 'native-base';
import { Fonts } from '../Themes';
import Colors from '../Constant/Colors';
import { Icon } from 'native-base';
import { prop } from 'ramda';

export default class ModalPilihAfdeling extends Component {
	// Prop type warnings
	static propTypes = {
		onPressCancel: PropTypes.func,
		title: PropTypes.string,
		message: PropTypes.string,
		visible: PropTypes.bool
	};

	// Defaults for props
	static defaultProps = {
		onPressCancel: () => { },
		title: 'Title',
		message: 'Message',
		visible: false
	};

	render() {
		const props = this.props;
		console.log(props.data);
		return (
			<Modal
				visible={props.visible}
				animationType={'fade'}
				transparent={true}
				onRequestClose={props.onPressCancel}>
				<View style={style.modalContainer}>
					<View style={style.modalInnerContainer}>
						<View style={{ width: '100%', padding: 16 }}>
							<Text style={style.textTitle}>Pilih Afdeling Dulu</Text>
							{props.data.length > 0 &&
								<Picker
									mode="dropdown"
									iosHeader="Select your SIM"
									iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
									style={{ width: undefined, marginTop: 20 }}
									selectedValue={props.selectedValue}
									onValueChange={props.onValueChange}>
									<Picker.Item style={{ fontFamily: Fonts.book, color: Colors.greyText }} label={'Pilih Afdeling'} value={""} />
									{props.data.map((item) => {
										return (
											<Picker.Item style={{ fontFamily: Fonts.book, }} label={item.AFD_NAME} value={item.AFD_CODE} />
										)
									})}
								</Picker>}
							<View style={{
								justifyContent: 'center',
								alignItems: 'center',
								width: "100%",
								marginTop: 20,
								marginBottom: 10
							}}>
								<TouchableOpacity
									disabled={props.selectedValue !== "" ? false : true}
									onPress={props.onPressLanjut}
									activeOpacity={0.6}
									style={{
										height: 48,
										width: 200,
										backgroundColor: props.selectedValue !== "" ? Colors.tintColorPrimary : '#D5D5D5',
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 30,
										elevation: 3
									}}>
									<Text style={{ color: 'white', fontSize: 16, fontFamily: Fonts.book }}>Lanjut</Text>
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
		backgroundColor: Colors.shade,
		paddingLeft: 24,
		paddingRight: 24
	},
	modalInnerContainer: {
		marginTop: 100,
		alignItems: 'center',
		backgroundColor: Colors.background,
		borderRadius: 10
	},
	textTitle: {
		fontSize: 20,
		fontWeight: '400',
		textAlign: 'center',
		color: 'black',
		paddingLeft: 12,
		paddingRight: 12,
		fontFamily: Fonts.book
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
		height: 20,
		width: '100%',
		backgroundColor: Colors.background,
		borderBottomEndRadius: 10,
		borderBottomStartRadius: 10,
		marginTop: 10
	}
};
