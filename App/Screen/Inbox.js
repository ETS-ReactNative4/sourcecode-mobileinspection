import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content } from 'native-base'
import Colors from '../Constant/Colors';
import TaskServices from '../Database/TaskServices';
import moment from 'moment';
import { dateDisplayMobile, changeFormatDate } from '../Lib/Utils'
import { Images, Fonts } from '../Themes';
import Swipeout from 'react-native-swipeout';

import ModalConfirmation from '../Component/ModalAlertConfirmation'

import ModalAlert from '../Component/ModalAlert';

export default class Inbox extends React.Component {

	constructor(props) {
		super(props);
		let data = this.getNotif();

		this.state = {
			data,

			//Add Modal Alert by Aminju
			title: 'Data Finding Tidak Ada',
			message: 'Finding tidak di temukan pada Handphone ini',
			showModal: false,
			icon: Images.ic_data_not_match,
			isFilter: false,
			showConfirm: false
		}
	}
	static navigationOptions = ({ navigation }) => ({
		headerStyle: {
			backgroundColor: Colors.tintColorPrimary
		},
		headerTitleStyle: {
			textAlign: "left",
			flex: 1,
			fontSize: 18,
			fontWeight: '400'
		},
		title: 'Inbox',
		headerTintColor: '#fff'
	})

	getNotif = () => {
		let notifData = TaskServices.getAllData('TR_NOTIFICATION_1').sorted('INSERT_TIME', true);
		return notifData;
	}

	onClickItem(id) {
		let notifData = TaskServices.findBy2('TR_NOTIFICATION_1', 'NOTIFICATION_ID', id);

		notifData = {
			...notifData,
			NOTIFICATION_STATUS: 1
		};

		TaskServices.updateByPrimaryKey('TR_NOTIFICATION_1', notifData);
		let notifCount = TaskServices.getAllData('TR_NOTIFICATION_1').filtered('NOTIFICATION_STATUS = 0').length;

		notifCount = (notifCount >= 100) ? "99+" : notifCount + "";
		this.setState({ data: this.getNotif() });
		this.props.navigation.setParams({ notifCount: notifCount })

		var data = TaskServices.findBy2('TR_FINDING', 'FINDING_CODE', notifData.FINDING_CODE);

		if (notifData.CATEGORY == "DAPAT POINT" || notifData.CATEGORY == "TOTAL POINT") {
			this.setState({
				showModal: true,
				title: notifData.CATEGORY,
				message: notifData.MESSAGE,
				icon: notifData.CATEGORY == "DAPAT POINT" ? Images.ic_get_point : Images.ic_total_point
			})
		} else {
			if (data !== undefined) {
				this.props.navigation.navigate('DetailFinding', { _backFromDetail: this._backFromDetail, ID: notifData.FINDING_CODE })
			} else {
				this.setState({
					showModal: true
				})
			}
		}

	}

	_renderItem = (item, index) => {

		const title = item.CATEGORY;
		const desc = item.MESSAGE;
		const notifCreateDate = dateDisplayMobile(changeFormatDate(item.INSERT_TIME.toString(), "YYYY-MM-DD hh-mm-ss"));

		let notifColor = item.NOTIFICATION_STATUS == 1 ? "white" : "#AFAFAF"
		let sources;

		if (item.CATEGORY == "TUGAS BARU") {
			sources = Images.ic_task_new;
		} else if (item.CATEGORY == 'UPDATE PROGRESS') {
			sources = Images.ic_task_wip;
		} else if (item.CATEGORY == 'LEWAT BATAS WAKTU') {
			sources = Images.ic_task_overdue;
		} else if (item.CATEGORY == 'BELUM ADA RESPON') {
			sources = Images.ic_task_no_response;
		} else if (item.CATEGORY == "TUGAS SELESAI") {
			sources = Images.ic_wait_rating;
		} else if (item.CATEGORY == "DAPAT RATING") {
			sources = Images.ic_get_rating;
		} else if (item.CATEGORY == "KOMENTAR BARU") {
			sources = Images.ic_get_comment;
		} else if (item.CATEGORY == "MENTION BARU") {
			sources = Images.ic_get_comment;
		} else if (item.CATEGORY == "DAPAT POINT") {
			sources = Images.ic_get_point;
		} else if (item.CATEGORY == "TOTAL POINT") {
			sources = Images.ic_total_point;
		}

		// Buttons
		var swipeoutBtns = [
			{
				text: 'Hapus',
				backgroundColor: 'red',
				color: "white",
				onPress: () => this._deleteNotif(item.NOTIFICATION_ID)
			}
		]

		return (
			// Swipeout component
			<Swipeout
				autoClose={true}
				right={swipeoutBtns}>
				<TouchableOpacity
					style={{
						width: '100%', flex: 1, flexDirection: 'row', backgroundColor: notifColor,
						borderBottomColor: 'grey', borderBottomWidth: 2, paddingBottom: 10, paddingTop: 10
					}}
					onPress={() => {
						this.onClickItem(item.NOTIFICATION_ID)
					}}
					key={index}
				>
					<Image style={{ alignItems: 'stretch', alignSelf: 'center', resizeMode: 'contain', width: '15%', height: 40 }}
						source={sources}></Image>
					<View style={{ width: '85%', paddingRight: 10 }} >
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={{ fontSize: 16, color: 'black', fontFamily: Fonts.demi }}>{title}</Text>
							<Text style={{ fontSize: 10, color: Colors.textSecondary, alignSelf: 'flex-end', fontFamily: Fonts.demi, }}>
								{notifCreateDate}
							</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ fontSize: 12, color: 'black', fontFamily: Fonts.book, }}>{desc}</Text>
						</View>
					</View>
				</TouchableOpacity>
			</Swipeout>
		)
	}

	_backFromDetail = data => {
		console.log('Data : ', data)
	}

	_deleteNotif(notifID) {
		TaskServices.deleteRecordByPK('TR_NOTIFICATION_1', 'NOTIFICATION_ID', notifID);

		this.setState({
			data: this.getNotif()
		})
	}

	async _deleteAllNotif() {

		await TaskServices.deleteAllData("TR_NOTIFICATION_1");

		this.setState({
			data: this.getNotif(),
			showConfirm: false,
		})
	}

	_renderData() {
		return (
			<View style={{ flex: 1 }}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}>
					<View style={{ marginBottom: 48 }}>
						{this.state.data.map((item, index) => this._renderItem(item, index))}
					</View>
				</ScrollView>
				<View style={{
					position: 'absolute',
					bottom: 0,
					justifyContent: 'center',
					alignItems: 'center',
					width: "100%",
					padding: 20
				}}>
					<TouchableOpacity
						onPress={() => this.setState({
							showConfirm: true
						})}
						activeOpacity={0.6}
						style={{
							height: 48,
							width: 200,
							backgroundColor: Colors.tintColorPrimary,
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 30,
							elevation: 3
						}}>
						<Text style={{ color: 'white', fontSize: 16, fontFamily: Fonts.book }}>Hapus Semua</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	render() {
		let show;
		if (this.state.data.length > 0) {
			show = this._renderData()
		}
		return (
			<Container>
				<ModalConfirmation
					icon={null}
					visible={this.state.showConfirm}
					onPressCancel={() =>
						this.setState({ showConfirm: false })}
					onPressSubmit={() => {
						this._deleteAllNotif();
					}}
					title={'Hapus Semua'}
					message={`Yakin mau menghapus semua notification inbox?`}
				/>

				<ModalAlert
					visible={this.state.showModal}
					icon={this.state.icon}
					onPressCancel={() => this.setState({ showModal: false })}
					title={this.state.title}
					message={this.state.message} />
				{show}
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		padding: 16,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	sectionRow: {
		flexDirection: 'row'
	},
	imageThumnail: {
		height: 64,
		width: 64,
		borderWidth: 3,
		borderColor: 'white',
		borderRadius: 50,
		marginRight: 12,
	},
	name: {
		color: 'black',
		fontWeight: '400',
		fontSize: 18,
		marginRight: 8
	},
	dotNotif: {
		marginTop: 8,
		backgroundColor: 'red',
		height: 10,
		width: 10,
		borderRadius: 50
	},
	sectionCardView: {
		flex: 1,
		flexDirection: 'row'
	},
	sectionDesc: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 80,
	}
});

