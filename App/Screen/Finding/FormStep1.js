import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { StyleSheet,BackHandler, Text, FlatList, ScrollView, TouchableOpacity, View, Image, Alert, Platform, BackAndroid
} from 'react-native';
import {
    Container,
    Content,
    Card,
} from 'native-base';
import { connect } from 'react-redux'
import ModalAlert from '../../Component/ModalAlert';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/Ionicons';
import R from 'ramda'
import { dirPhotoTemuan } from '../../Lib/dirStorage'
import ImagePickerCrop from 'react-native-image-crop-picker'
import random from 'random-string'
import TaskServices from '../../Database/TaskServices'
import RNFS from 'react-native-fs';
import MapView from 'react-native-maps';
import ModalAlertConfirmation from "../../Component/ModalAlertConfirmation";
const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
const LATITUDE = -2.952421;
const LONGITUDE = 112.354931;

class FormStep1 extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerStyle: {
            backgroundColor: Colors.tintColor
          },
          title: 'Buat Laporan Temuan',
          headerTintColor: '#fff',
          headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
          },
          headerLeft: (
              <TouchableOpacity onPress={() => {navigation.goBack(null)}}>
                  <Icon2 style={{marginLeft: 12}} name={'ios-arrow-round-back'} size={45} color={'white'} />
              </TouchableOpacity>
          )
        };
    }

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.clearFoto = this.clearFoto.bind(this);

        this.state = {
			track:true,
			latitude: 0.0,
			longitude: 0.0,
			region: {
			  latitude: LATITUDE,
			  longitude: LONGITUDE,
			  latitudeDelta:0.0075,
			  longitudeDelta:0.00721
			},
            user: TaskServices.getAllData('TR_LOGIN')[0],
            photos: [],
            selectedPhotos: [],
            stepper: [
                { step: '1', title: 'Ambil Photo' },
                { step: '2', title: 'Tulis Keterangan' }
            ],
            latitude: 0.0,
            longitude: 0.0,
            fetchLocation: false,
            isMounted: false,

            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: ''
        }
    }

    clearFoto(){
        if(this.state.photos.length > 0){
            this.state.photos.map(item =>{
                RNFS.unlink(item.uri)
            })
        }
        this.props.navigation.goBack();
    }

    componentDidMount() {
       this.getLocation();
       this.props.navigation.setParams({ clearFoto: this.clearFoto })
       BackAndroid.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

    componentWillUnmount(){
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        if(this.state.photos.length > 0){
            this.setState({
                showModalConfirmation: true,
                title: 'Data Hilang',
                message: 'Temuan mu belum tersimpan loh. Yakin nih mau dilanjutin?',
                icon: require('../../Images/ic-not-save.png')
            });
            return true
        }
        return false;
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.setState({latitude:lat, longitude:lon, fetchLocation: false});

            },
            (error) => {
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                this.setState({fetchLocation:false})
                // alert('Informasi', message);
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    // exitAlert = () => {
    //     if (this.state.photos.length == 0) {
    //         this.props.navigation.goBack(null)
    //     } else {
    //         Alert.alert(
    //             'Peringatan',
    //             'Transaksi kamu tidak akan tersimpan, kamu yakin akan melanjutkan?',
    //             [
    //                 { text: 'NO', style: 'cancel' },
    //                 { text: 'YES', onPress: () => this.props.navigation.goBack(null) }
    //             ]
    //         );
    //     }

    // };

    // handleAndroidBackButton = callback => {
    //     BackHandler.addEventListener('hardwareBackPress', () => {
    //         callback();
    //         return true;
    //     });
    // };

    // componentDidMount() {
        // this.handleAndroidBackButton(this.exitAlert);
    // }

    onBtnClick() {
        if (this.state.photos.length == 0) {
            this.setState({ showModal: true, title: "Ambil Foto", message: 'Opps kamu belum ambil Foto Temuan yaaa', icon: require('../../Images/ic-no-pic.png') });
        } else if (this.state.selectedPhotos.length == 0) {
            this.setState({ showModal: true, title: 'Foto Temuan', message: 'Kamu harus ambil min. 1 foto yoo.', icon: require('../../Images/ic-no-pic.png') });
        } else {
            BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
            let images = [];
            this.state.selectedPhotos.map((item) => {
                let da = item.split('/');
                let imgName = da[da.length-1];
                images.push(imgName);
                this.props.navigation.navigate('Step2', {image: images, lat: this.state.latitude, lon:this.state.longitude});
                // const navigation = this.props.navigation;
                // const resetAction = StackActions.reset({
                //     index: 0,
                //     actions: [NavigationActions.navigate({ routeName: 'Step2', params:{image: images, lat: this.state.latitude, lon:this.state.longitude} })],
                // });
                // navigation.dispatch(resetAction);

            });
        }
    }

    onRefresh = image =>{
        const photos = R.clone(this.state.photos)
        photos.push({ uri: FILE_PREFIX+image, index: photos.length })
        this.setState({
            photos,
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    takePicture() {
        this.props.navigation.navigate('TakeFoto', {onRefresh: this.onRefresh, authCode: this.state.user.USER_AUTH_CODE})
    }

    _onSelectedPhoto = foto => {
        const selectedPhotos = R.clone(this.state.selectedPhotos)
        if (selectedPhotos.includes(foto)) {
            var index = selectedPhotos.indexOf(foto);
            selectedPhotos.splice(index, 1);
        } else {
            if (selectedPhotos.length > 2) {
                // alert("Hanya 3 foto yang bisa dipilih")
                this.setState({ showModal: true, title: 'Pilih Foto', message: 'Kamu cuma bisa pilih 3 foto aja yaa..', icon: require('../../Images/ic-no-pic.png') });
            } else {
                selectedPhotos.push(foto);
            }
        }

        this.setState({
            selectedPhotos,
        });
    }

    _renderFoto = (foto) => {
        let border = { borderWidth: 0 }
        {
            if (this.state.selectedPhotos.includes(foto.uri)) {
                border = { borderWidth: 5, borderColor: 'red' }
            }
        }

        return (
            <TouchableOpacity
                onPress={() => { this._onSelectedPhoto(foto.uri) }}
                style={{ height: 100, width: 100, marginLeft: 10 }}
                key={foto.index}>
                <Image style={[{
                    alignItems: 'stretch', width: 100, height: 100,
                    borderRadius: 10
                }, border]} source={foto} />
            </TouchableOpacity>
        )
    }

    render() {
        const initialPage = '1';
        return (
            <Container style={{ flex: 1, backgroundColor: 'white' }}>
				<MapView
				  ref={ref => this.map = ref}
				  style={style.map}
				  provider="google"
				  initialRegion={this.state.region}
				  region={this.state.region}
				  liteMode={true}
				  showsUserLocation={true}
				  showsMyLocationButton={false}
				  showsPointsOfInterest={false}
				  showsCompass={false}
				  showsScale={false}
				  showsBuildings={false}
				  showsTraffic={false}
				  showsIndoors={false}
				  zoomEnabled={false}
				  scrollEnabled={false}
				  pitchEnabled={false}
				  toolbarEnabled={false}
				  moveOnMarkerPress={false}
				  zoomControlEnabled={false}
				  minZoomLevel={10}
				  onUserLocationChange={event => {
					if(this.state.track){
						let lat = event.nativeEvent.coordinate.latitude;
						let lon = event.nativeEvent.coordinate.longitude;
						this.setState({
							track:false,
							latitude:lat,
							longitude:lon,
							region : {
								latitude: lat,
								longitude: lon,
								latitudeDelta:0.0075,
								longitudeDelta:0.00721
							}});
						setTimeout(()=>{
							this.setState({track:true})
						},5000);
					}
				  }}
				>
				</MapView >

                <Content style={{ flex: 1 ,marginTop:5}}>
                    {/* STEPPER */}

                    <ModalAlert
                        icon={this.state.icon}
                        visible={this.state.showModal}
                        onPressCancel={() => this.setState({ showModal: false })}
                        title={this.state.title}
                        message={this.state.message} />

                    <ModalAlertConfirmation
                        icon={this.state.icon}
                        visible={this.state.showModalConfirmation}
                        onPressCancel={() => this.setState({ showModalConfirmation: false })}
                        onPressSubmit={() => { this.clearFoto() }}
                        title={this.state.title}
                        message={this.state.message} />

                    <FlatList
                        style={[style.stepperContainer, { margin: 15, alignSelf: 'center' }]}
                        horizontal
                        data={this.state.stepper}
                        getItemLayout={this.getItemLayout}
                        initialScrollIndex={Number(initialPage) - 1}
                        initialNumToRender={2}
                        renderItem={({ item: rowData }) => {
                            return (
                                <TouchableOpacity>
                                    <View
                                        style={[
                                            style.stepperListContainer,
                                            { paddingRight: rowData.step === '2' ? 16 : 0 }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                style.stepperNumber,
                                                {
                                                    backgroundColor:
                                                        rowData.step === initialPage
                                                            ? Colors.brand
                                                            : Colors.buttonDisabled
                                                }
                                            ]}
                                        >
                                            <Text style={style.stepperNumberText}>{rowData.step}</Text>
                                        </View>
                                        <Text
                                            style={[
                                                Fonts.style.caption,
                                                { paddingLeft: 3, color: rowData.step == initialPage ? Colors.brand : Colors.textSecondary }
                                            ]}
                                        >
                                            {rowData.title}
                                        </Text>
                                        {rowData.step !== '2' && (
                                            <View style={{ flex: 1 }}>
                                                <Icon
                                                    name="chevron-right"
                                                    size={24}
                                                    color={Colors.buttonDisabled}
                                                    style={style.stepperNext}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <Card style={[style.cardContainer]}>
                        <TouchableOpacity style={{ padding: 70 }}
                            onPress={() => { this.takePicture() }}
                        >
                            <Image style={{
                                alignSelf: 'center', alignItems: 'stretch',
                                width: 55, height: 55
                            }}
                                source={require('../../Images/icon/ic_camera_big.png')}></Image>
                        </TouchableOpacity>
                    </Card>

                    <View style={{ marginTop: 16, height: 120 }}>
                        <ScrollView contentContainerStyle={{ paddingRight: 16, paddingLeft: 6 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {this.state.photos.map(this._renderFoto)}
                        </ScrollView >
                    </View>

                    <TouchableOpacity style={[style.button, { marginTop: 16 }]}
                        onPress={() => this.onBtnClick()}>
                        <Text style={style.buttonText}>Pilih</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormStep1);

const style = {
	map: {
		...StyleSheet.absoluteFillObject,
		zIndex:100,
		height:5,
		top:0
	},
    stepperContainer: {
        flexDirection: 'row',
        height: 48,
    },
    stepperListContainer: { flexDirection: 'row', flex: 1, alignItems: 'center' },
    stepperNumber: {
        height: 24,
        width: 24,
        backgroundColor: Colors.buttonDisabled,
        borderRadius: 12,
        justifyContent: 'center'
    },
    stepperNumberText: [Fonts.style.caption, { textAlign: 'center', color: Colors.textDark }],
    stepperNext: { alignSelf: 'flex-end', paddingRight: 4 },
    sectionHeader: [
        Fonts.style.caption,
        { color: Colors.textSecondary, paddingLeft: 16, paddingTop: 16, paddingBottom: 8 }
    ],
    listContainer: {
        height: 80,
        backgroundColor: Colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    lContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        height: 40,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        flex: 1,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        color: '#808080',
    },
    txtLabel: {
        color: Colors.brand,
        fontSize: 17,
        padding: 10, textAlign: 'center', fontWeight: '400'
    },
    button: {
        width: 200,
        backgroundColor: Colors.brand,
        borderRadius: 25,
        padding: 15,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center'
    },
    cardContainer: {
        flex: 1,
        marginRight: 16,
        marginLeft: 16,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#eee',
        borderColor: '#ddd'
    }
};
