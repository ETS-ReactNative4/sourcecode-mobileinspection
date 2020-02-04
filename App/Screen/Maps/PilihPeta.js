'use strict';
import React, { Component } from 'react'
import { BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container, Content, } from 'native-base'
import Colors from '../../Constant/Colors'
import Dash from 'react-native-dash'
import TaskServices from '../../Database/TaskServices'
import ServerName from '../../Constant/ServerName'
import Icon2 from 'react-native-vector-icons/AntDesign'
import ModalLoading from '../../Component/ModalLoading'
import ModalAlert from '../../Component/ModalAlert';
import MapView, { Marker, Polygon, ProviderPropType } from 'react-native-maps';

import { fetchPost } from "../../Api/FetchingApi";
import { Fonts } from '../../Themes';

const LATITUDE = -2.952421;
const LONGITUDE = 112.354931;

export default class PilihPeta extends Component {

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return {
			headerStyle: {
				backgroundColor: Colors.tintColorPrimary
			},
			title: 'Peta Lokasi',
			headerTintColor: '#fff',
			headerTitleStyle: {
				flex: 1,
				fontSize: 18,
				fontWeight: '400'
			},
			headerLeft: (
				<Icon2 style={{ paddingLeft: 16 }} name={'arrowleft'} size={25} color={'white'} onPress={() => params.handleBack()} />
			)
		}
	};

	constructor(props) {
		super(props);

		let user = TaskServices.getAllData('TR_LOGIN')[0];
		this.state = {
			regions: [],
			est: [],
			estateName: '',
			currWerk: '',
			title: 'Title',
			message: 'Message',
			showLoading: false,
			showAlert: false,
			icon: '',
			isDeleteImage: false,
			latitude: LATITUDE,
			longitude: LONGITUDE,
			region: {
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: 0.0075,
				longitudeDelta: 0.00721
			},
			poligons: []
		}
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	}

	componentDidMount() {
		// AsyncStorage.clear();
		this.initData();
		this.props.navigation.setParams({ handleBack: this.handleBackButtonClick });
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	//Fumc Handle Back Press (Aminju)
	handleBackButtonClick() {
		const { navigation } = this.props;
		const param = navigation.getParam('more')
		if (param == 'Sync') {
			const data = TaskServices.getAllData('TR_LOGIN')
			console.log('Data User Role : ', data[0].USER_ROLE)
			if (data != undefined) {
				if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
					navigation.navigate('MainMenuMil')
				} else {
					navigation.navigate('MainMenu')
				}
			}
		} else {
			this.props.navigation.goBack(null);
		}
		return true;
	}

	initData() {
		let user = TaskServices.getAllData('TR_LOGIN')[0];
		let regions = TaskServices.getRegionCode();
		let est = [];
		regions.map((regionCode, index, arr) => {
			let data = TaskServices.findBy2('TM_REGION', 'REGION_CODE', regionCode);
			let comp = TaskServices.findBy('TM_COMP', 'REGION_CODE', regionCode);
			if (comp !== undefined) {
				comp.map(item => {
					let arr = TaskServices.findBy('TM_EST', 'COMP_CODE', item.COMP_CODE);
					for (let x in arr) {
						if (arr[x].WERKS[2] != 4) {
							if (user.CURR_WERKS && user.CURR_WERKS == arr[x].WERKS) {
								this.setState({
									estateName: arr[x].EST_NAME,
									currWerk: arr[x].WERKS
								});
							}
							let exists = TaskServices.findBy2('TR_POLYGON', 'WERKS', arr[x].WERKS);
							est.push({
								REGION_CODE: arr[x].REGION_CODE, WERKS: arr[x].WERKS,
								EST_NAME: arr[x].EST_NAME, HAS_MAP: (exists !== undefined)
							});
						}
					}
				})
			}
			arr[index] = { regionCode, REGION_NAME: data.REGION_NAME };
		})
		this.setState({ regions, est })
	}

	getEstateName(werks) {
		try {
			let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
			return data.EST_NAME;
		} catch (error) {
			return '';
		}
	}

	// async onClickItem(data) {
	// 	let user = TaskServices.getAllData('TR_LOGIN')[0];
	// 	if (!data.HAS_MAP) {
	// 		this.setState({
	// 			showLoading: true,
	// 			title: 'Tunggu sebentar',
	// 			message: 'Sedang download map ' + data.EST_NAME,
	// 			icon: require('../../Images/ic-progress.png')
	// 		})
	// 		let downloadServ = TaskServices.getAllData("TM_SERVICE")
	// 			.filtered('API_NAME="HECTARESTATEMENT-GEOJSON" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
	// 		if (downloadServ && downloadServ.length > 0) {
	// 			downloadServ = downloadServ[0];
	// 		}
	// 		let pickedWerks = data.WERKS;
	// 		let pickedEst = data.EST_NAME;
	// 		let param = {};
	// 		let bodyService = JSON.parse(downloadServ.BODY);
	// 		for (let x in bodyService) {
	// 			if (typeof (data[x]) !== "undefined") {
	// 				param[x] = data[x]
	// 			}
	// 		}
	// 		fetch(downloadServ.API_URL, {
	// 			method: downloadServ.METHOD,
	// 			headers: {
	// 				'Cache-Control': 'no-cache',
	// 				'Accept': 'application/json',
	// 				'Content-Type': 'application/json',
	// 				'Authorization': `Bearer ${user.ACCESS_TOKEN}`
	// 			},
	// 			body: JSON.stringify(param)
	// 		})
	// 			.then((response) => {
	// 				return response.json();
	// 			})
	// 			.then((data) => {
	// 				if (data.status) {
	// 					let result = data.data.polygons;
	// 					let tempPoly = {};
	// 					let tempCoords = [];
	// 					for (let x in result) {
	// 						tempCoords = [];
	// 						for (let y in result[x].coords) {
	// 							tempCoords.push({
	// 								LATLONG: result[x].coords[y].latitude + "" + result[x].coords[y].longitude,
	// 								longitude: result[x].coords[y].longitude,
	// 								latitude: result[x].coords[y].latitude
	// 							})
	// 						}
	// 						tempPoly = {
	// 							WERKS: pickedWerks,
	// 							afd_code: result[x].afd_code,
	// 							werks_afd_block_code: result[x].werks_afd_block_code,
	// 							blokname: result[x].blokname,
	// 							coords: tempCoords
	// 						}
	// 						TaskServices.saveData('TR_POLYGON', tempPoly);
	// 					}
	// 					let currEst = this.state.est;
	// 					currEst.map(item => {
	// 						if (item.WERKS == pickedWerks) {
	// 							item.HAS_MAP = true;
	// 						}
	// 						return item;
	// 					});
	// 					this.setState({ est: currEst });
	// 					TaskServices.updateByPrimaryKey('TR_LOGIN', {
	// 						"USER_AUTH_CODE": user.USER_AUTH_CODE,
	// 						"CURR_WERKS": pickedWerks
	// 					});
	// 					this.setState({ estateName: pickedEst, currWerk: pickedWerks });
	// 				}
	// 				else {
	// 					this.setState({
	// 						showAlert: true,
	// 						title: 'Error',
	// 						message: "Peta belum tersedia. Mohon hubungi IT Site di wilayahmu.",
	// 						icon: require('../../Images/icon/icon_maps.png')
	// 					})
	// 				}
	// 				this.setState({ showLoading: false });
	// 			})
	// 			.catch((e) => {
	// 				this.setState({
	// 					showLoading: false,
	// 					showAlert: true,
	// 					title: 'Error',
	// 					message: e,
	// 					icon: require('../../Images/icon/icon_maps.png')
	// 				})
	// 			});
	// 	}
	// 	else {
	// 		TaskServices.updateByPrimaryKey('TR_LOGIN', {
	// 			"USER_AUTH_CODE": user.USER_AUTH_CODE,
	// 			"CURR_WERKS": data.WERKS
	// 		});
	// 		this.setState({ estateName: data.EST_NAME, currWerk: data.WERKS })
	// 	}
	// }

	async onClickItem(data) {
		let user = TaskServices.getAllData('TR_LOGIN')[0];
		if (!data.HAS_MAP) {
			this.setState({
				showLoading: true,
				title: 'Tunggu sebentar',
				message: 'Sedang download map ' + data.EST_NAME,
				icon: require('../../Images/ic-progress.png')
			});
			let downloadServ = TaskServices.getAllData("TM_SERVICE")
				.filtered('API_NAME="HECTARESTATEMENT-GEOJSON" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
			if (downloadServ && downloadServ.length > 0) {
				downloadServ = downloadServ[0];
			}
			let pickedWerks = data.WERKS;
			let pickedEst = data.EST_NAME;
			let param = {};
			let bodyService = JSON.parse(downloadServ.BODY);
			for (let x in bodyService) {
				if (typeof (data[x]) !== "undefined") {
					param[x] = data[x]
				}
			}
			fetchPost("HECTARESTATEMENT-GEOJSON", param)
				.then((data) => {
					if (data.status) {
						let result = data.data.polygons;
						let tempPoly = {};
						let tempCoords = [];
						for (let x in result) {
							tempCoords = [];
							for (let y in result[x].coords) {
								tempCoords.push({
									LATLONG: result[x].coords[y].latitude + "" + result[x].coords[y].longitude,
									longitude: result[x].coords[y].longitude,
									latitude: result[x].coords[y].latitude
								})
							}
							tempPoly = {
								WERKS: pickedWerks,
								afd_code: result[x].afd_code,
								werks_afd_block_code: result[x].werks_afd_block_code,
								blokname: result[x].blokname,
								coords: tempCoords
							}
							TaskServices.saveData('TR_POLYGON', tempPoly);
						}
						let currEst = this.state.est;
						currEst.map(item => {
							if (item.WERKS == pickedWerks) {
								item.HAS_MAP = true;
							}
							return item;
						});
						this.setState({ est: currEst });
						TaskServices.updateByPrimaryKey('TR_LOGIN', {
							"USER_AUTH_CODE": user.USER_AUTH_CODE,
							"CURR_WERKS": pickedWerks
						});
						this.setState({ estateName: pickedEst, currWerk: pickedWerks });
					}
					else {
						this.setState({
							showAlert: true,
							title: 'Error',
							message: "Peta belum tersedia. Mohon hubungi IT Site di wilayahmu.",
							icon: require('../../Images/icon/icon_maps.png')
						})
					}
					this.setState({ showLoading: false });
				})
				.catch((e) => {
					this.setState({
						showLoading: false,
						showAlert: true,
						title: 'Error',
						message: e,
						icon: require('../../Images/icon/icon_maps.png')
					})
				});
		}
		else {
			TaskServices.updateByPrimaryKey('TR_LOGIN', {
				"USER_AUTH_CODE": user.USER_AUTH_CODE,
				"CURR_WERKS": data.WERKS
			});
			this.setState({ estateName: data.EST_NAME, currWerk: data.WERKS })
		}
	}

	renderMapsByRegion(item, index) {
		return (
			<View style={{ marginTop: 15 }} key={index}>
				<Text style={{ fontSize: 14, paddingHorizontal: 16, fontFamily: Fonts.book }}>
					{item.REGION_NAME !== undefined ? item.REGION_NAME : ''}
				</Text>
				<View style={{ marginTop: 16 }}>
					<ScrollView contentContainerStyle={{ paddingRight: 16 }} horizontal={true} showsHorizontalScrollIndicator={false}>
						{this.state.est.map((est, iest) => {
							if (est.REGION_CODE == item.regionCode) {
								return this._renderItem(est, iest);
							}
						}
						)}
					</ScrollView >
				</View>
			</View>
		)
	}

	_renderItem = (item, index) => {
		let showImage;
		showImage = <Image style={{ alignItems: 'stretch', height: 100, width: 150 }} source={require('../../Images/forest.jpg')} />
		let bgStyle = [styles.bgBelumDownload];
		if (!item.HAS_MAP) {
			bgStyle = [styles.bgBelumDownload, { backgroundColor: 'rgba(169,169,169,0.8)' }];
		}
		return (
			< TouchableOpacity
				onPress={() => { this.onClickItem(item) }}
				style={{ flex: 1 }}
				key={index}
			>
				<View style={{
					flex: 1, height: 106, width: 156, marginLeft: 10, borderWidth: ((this.state.currWerk == item.WERKS) * 3),
					borderColor: '#FFB300'
				}}>
					{showImage}
					<View style={bgStyle}>
						{!item.HAS_MAP &&
							<Icon2 name={'clouddownload'} color={'white'} size={20}
								style={{ justifyContent: 'center', alignItems: 'center' }} /> &&
							<Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{item.EST_NAME}</Text>
						}
						{item.HAS_MAP &&
							<Text style={{
								justifyContent: 'center', padding: 3, fontSize: 8, color: 'white', width: "100%", position: 'absolute', bottom: 0,
								backgroundColor: 'rgba(0,0,0,0.8)', alignSelf: 'stretch'
							}}>
								{item.EST_NAME}
							</Text>
						}
					</View>
				</View>
			</TouchableOpacity >
		)
	}

	convertGeoJson(raw) {
		let arrPoli = [];
		for (let x in raw) {
			let tempItem = raw[x];
			let tempArrCoords = [];
			for (let y in tempItem.coords) {
				tempArrCoords.push(tempItem.coords[y]);
			}
			tempItem = { ...tempItem, coords: tempArrCoords }
			arrPoli.push(tempItem);
		}
		return arrPoli;
	}

	render() {
		let data = this.state.regions
		return (
			<Container style={{ flex: 1 }}>
				<ModalLoading
					visible={this.state.showLoading}
					title={this.state.title}
					message={this.state.message} />
				<ModalAlert
					icon={this.state.icon}
					visible={this.state.showAlert}
					onPressCancel={() => this.setState({ showAlert: false })}
					title={this.state.title}
					message={this.state.message} />
				<Content style={styles.container} >

					<MapView
						ref={map => this.map = map}
						provider={this.props.provider}
						style={styles.map}
						mapType={"satellite"}
						showsUserLocation={true}
						showsMyLocationButton={true}
						showsCompass={true}
						showScale={true}
						showsIndoors={true}
						initialRegion={this.state.region}
						followsUserLocation={false}
						zoomEnabled={true}
						scrollEnabled={false}
					>
					</MapView>
					{this.state.poligons.length > 0 && this.state.poligons.map((poly, index) => (
						<View key={index}>
							<Polygon
								coordinates={poly.coords}
								fillColor="rgba(0, 200, 0, 0.5)"
								strokeColor="rgba(0,0,0,0.5)"
								strokeWidth={2}
								tappable={false}
							/>
							<Marker
								ref={ref => poly.marker = ref}
								coordinate={this.centerCoordinate(poly.coords)}>
								<View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
									<View style={styles.marker}>
										<Text style={{ color: '#000000', fontSize: 20 }}>{poly.blokname}</Text>
									</View>
								</View>
							</Marker>
						</View>
					))}

					<View style={[styles.containerLabel, { marginTop: 15, marginBottom: 15 }]}>
						<View style={{ flex: 2 }}>
							<Image source={require('../../Images/icon/ic_my_location.png')} style={[styles.icon, { marginLeft: 10 }]} />
						</View>
						<View style={{ flex: 7 }}>
							<Text style={{ fontSize: 18, fontWeight: '400', fontFamily: Fonts.medium }}>{this.state.estateName}</Text>
							<Text style={{ fontSize: 12, color: 'grey', marginTop: 5, fontFamily: Fonts.book }}>Lokasimu saat ini</Text>
						</View>
					</View>

					<View style={{ height: 1, backgroundColor: '#989898', marginBottom: 5, marginTop: 5 }} />

					<Text style={{ fontSize: 16, fontFamily: Fonts.bold, paddingHorizontal: 16 }}>Peta</Text>

					<Dash
						dashColor={'#ccc'}
						dashThickness={1}
						dashGap={5}
						style={{
							height: 1, marginLeft: 16, marginRight: 16, marginTop: 10
						}} />

					<View style={{ paddingBottom: 30 }}>
						{data !== null && data.map((item, index) => this.renderMapsByRegion(item, index))}
					</View>

				</Content>
			</Container >

		)
	}

	centerCoordinate(coordinates) {
		let x = coordinates.map(c => c.latitude)
		let y = coordinates.map(c => c.longitude)

		let minX = Math.min.apply(null, x)
		let maxX = Math.max.apply(null, x)

		let minY = Math.min.apply(null, y)
		let maxY = Math.max.apply(null, y)

		return {
			latitude: (minX + maxX) / 2,
			longitude: (minY + maxY) / 2
		}
	}
}


PilihPeta.propTypes = {
	provider: ProviderPropType,
};


const styles = StyleSheet.create({
	map: {
		...StyleSheet.absoluteFillObject,
		height: 0.1,
		bottom: 0,
		position: "absolute"

	},
	container: {
		flex: 1,
		paddingTop: 16,
		backgroundColor: '#fff'
	},
	ActionButtonStyle: {
		color: Colors.tintColor,
		backgroundColor: Colors.tintColor
	},
	FloatingButtonStyle: {
		resizeMode: 'contain',
		width: 50,
		height: 50,
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},
	devider: {
		marginBottom: 16, marginTop: 16, backgroundColor: '#ccc', height: 8
	},

	labelBackground: {
		width: 150, padding: 5, position: 'absolute', bottom: 0,
		justifyContent: 'center', flex: 1, flexDirection: 'row'
	},
	bgBelumDownload: {
		flex: 1, position: 'absolute', top: 0,
		width: 150, height: 100, padding: 5,
		justifyContent: 'center', alignItems: 'center'
	},

	containerLabel: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	icon: {
		alignContent: 'flex-end',
		height: 45,
		width: 45,
		resizeMode: 'stretch',
		alignItems: 'center'
	},
});
