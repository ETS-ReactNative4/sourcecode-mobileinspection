import React, { Component } from 'react';
import {
    BackHandler,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Card, Container, Content, } from 'native-base';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/Ionicons';
import R from 'ramda'
import TaskServices from '../../Database/TaskServices'
import RNFS from 'react-native-fs';
import ModalAlert from '../../Component/ModalAlert';
import HeaderDefault from '../../Component/Header/HeaderDefault';

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

export default class Step1Finding extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        let params = props.navigation.state.params;
        let inspeksiHeader = R.clone(params.data);
        let dataInspeksi = R.clone(params.dataInspeksi);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.clearFoto = this.clearFoto.bind(this);

        this.state = {
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
            inspeksiHeader,
            dataInspeksi,

            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: ''
        }
    }

    clearFoto() {
        if (this.state.photos.length > 0) {
            this.state.photos.map(item => {
                RNFS.unlink(item.uri).then(unlink => {
                    console.log('File deleted : ', item.uri)
                })
            })
            this.props.navigation.goBack()
        };
    }

    componentDidMount() {
        this.getLocation();
        this.props.navigation.setParams({ clearFoto: this.clearFoto })
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
        });
        this.blurListener = this.props.navigation.addListener("didBlur", () => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        })
    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.blurListener.remove();
    }

    handleBackButtonClick() {
        if (this.state.photos.length > 0) {
            this.clearFoto()
            return true
        } else {
            this.props.navigation.goBack();
            return true;
        }
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.setState({ latitude: lat, longitude: lon, fetchLocation: false });

            },
            (error) => {
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                this.setState({ fetchLocation: false })
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    onBtnClick() {

        if (this.state.photos.length == 0) {
            this.setState({ showModal: true, title: "Ambil Foto", message: 'Opps kamu belum ambil Foto Temuan yaaa', icon: require('../../Images/ic-no-pic.png') });
        }
        // else if (this.state.selectedPhotos.length == 0) {
        //     this.setState({ showModal: true, title: 'Foto Temuan', message: 'Kamu harus ambil min. 1 foto yoo.', icon: require('../../Images/ic-no-pic.png') });
        // } 
        else {
            const photos = R.clone(this.state.photos);
            this.props.navigation.navigate('Step2Finding', {
                image: photos,
                lat: this.state.latitude,
                lon: this.state.longitude,
                data: this.state.inspeksiHeader,
                dataInspeksi: this.state.dataInspeksi,
                finish: this.finish
            });
        }
    }

    onRefresh = image => {
        const photos = R.clone(this.state.photos)
        photos.push({ uri: FILE_PREFIX + image, index: photos.length })
        this.setState({
            photos,
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    finish = data => {
        if (data !== 'data') {
            this.props.navigation.state.params.updateTRBaris(data);
        }
        this.props.navigation.goBack(null);
    }

    takePicture() {
        const photos = R.clone(this.state.photos);
        if (photos.length == 3) {
            this.setState({ showModal: true, title: 'Pilih Foto', message: 'Kamu cuma bisa 3 foto aja yaa..', icon: require('../../Images/ic-no-pic.png') });
        } else {
            this.props.navigation.navigate('TakeFotoFinding', { onRefresh: this.onRefresh, authCode: this.state.user.USER_AUTH_CODE })
        }

    }

    _onSelectedPhoto = foto => {
        const photos = R.clone(this.state.photos);
        var arrRemove = arrayRemove(photos, foto);
        RNFS.unlink(foto);

        this.setState({
            photos: arrRemove
        })
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
                activeOpacity={0}
                style={{ height: 100, width: 100, marginLeft: 10 }}
                key={foto.index}>
                <Image style={[
                    {
                        alignItems: 'stretch',
                        width: 100,
                        height: 100,
                        borderRadius: 10
                    },
                ]}
                    source={foto} />

                <TouchableOpacity
                    onPress={() => { this._onSelectedPhoto(foto.uri) }}
                    style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        height: 30,
                        width: 30,
                        alignItems: 'center',
                        padding: 3,
                        right: 0,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10
                    }}>
                    <Icon color={'red'} name={'close'} size={25} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    render() {
        const initialPage = '1';
        return (
            <Container style={{ flex: 1, backgroundColor: 'white' }}>
                <Content style={{ flex: 1 }}>
                    {/* STEPPER */}

                    <StatusBar
                        hidden={false}
                        barStyle="light-content"
                        backgroundColor={Colors.tintColorPrimary}
                    />

                    <HeaderDefault
                        title={'Buat Laporan Temuan'}
                        onPress={() => this.handleBackButtonClick()}
                    />
                    <ModalAlert
                        icon={this.state.icon}
                        visible={this.state.showModal}
                        onPressCancel={() => this.setState({ showModal: false })}
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
                                alignSelf: 'center',
                                alignItems: 'stretch',
                                width: 55,
                                height: 55
                            }}
                                source={require('../../Images/icon/ic_camera_big.png')}
                            />
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

const style = {
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


export function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele.uri != value;
    });
}