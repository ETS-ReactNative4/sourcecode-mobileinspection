import React, { Component } from 'react';
import { BackHandler, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../Constant/Colors'
import Fonts from '../../Constant/Fonts'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import R from 'ramda';
import { getTodayDate } from '../../Lib/Utils'
import TaskService from "../../Database/TaskServices";
import ModalAlert from "../../Component/ModalAlert";
import Font from '../../Themes/Fonts'

class KondisiBaris1 extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.tintColorPrimary
            },
            title: 'Kondisi Baris',
            headerTintColor: '#fff',
            headerTitleStyle: {
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            },
            headerRight: (
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Step1Finding', {
                        data: params.getData,
                        dataInspeksi: params.getDataInspeksi,
                        updateTRBaris: params.updateTRBaris
                    }
                    )
                }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 16 }}>
                        <Entypo name='flashlight' size={24} color='white' />
                    </View>
                </TouchableOpacity>
            ),
        }
    };

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        let params = props.navigation.state.params;
        let fotoBaris = R.clone(params.fotoBaris);
        let inspeksiHeader = R.clone(params.inspeksiHeader);
        let dataUsual = R.clone(params.dataUsual);
        let statusBlok = R.clone(params.statusBlok);
        let intervalId = R.clone(params.intervalId);
        let dataInspeksi = R.clone(params.dataInspeksi);
        let barisIdInspection = R.clone(params.barisIdInspection);

        this.state = {
            intervalId,
            jumlahPokok: '0',
            pokokPanen: '0',
            buahTinggal: '0',
            brondolPinggir: '0',
            brondolTPH: '0',
            pokokTdkPupuk: '0',
            fotoBaris,
            inspeksiHeader,
            dataUsual,
            statusBlok,
            dataInspeksi,

            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            showModalAlert: false,
            icon: '',
            inspectionType: props.navigation.getParam('inspectionType', 'normal')
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ getData: this.state.inspeksiHeader, getDataInspeksi: this.state.dataInspeksi, updateTRBaris: this.updateTRBaris })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        // this.setState({
        //     showModal: true, title: 'Data Hilang',
        //     message: 'Inspeksi mu belum tersimpan loh. Yakin mau dilanjutin?',
        //     icon: require('../../Images/ic-not-save.png')
        // });
        return false;
    }

    updateTRBaris = data => {
        let model = {
            ID_INSPECTION: data.ID_INSPECTION,
            BLOCK_INSPECTION_CODE: data.BLOCK_INSPECTION_CODE,
            EST_NAME: data.EST_NAME,
            WERKS: data.WERKS,
            BLOCK_CODE: data.BLOCK_CODE,
            AFD_CODE: data.AFD_CODE,
            WERKS_AFD_BLOCK_CODE: data.WERKS_AFD_BLOCK_CODE,
            INSPECTION_DATE: data.INSPECTION_DATE,
            STATUS_SYNC: data.STATUS_SYNC,
            INSPECTION_RESULT: data.INSPECTION_RESULT,
            INSPECTION_SCORE: data.INSPECTION_SCORE,
            FULFILL_BARIS: data.FULFILL_BARIS,
            TR_FINDING_CODES: data.TR_FINDING_CODES
        }
        this.setState({ dataInspeksi: model }, () => {
            this.props.navigation.setParams({ getDataInspeksi: this.state.dataInspeksi })
        })
    }

    checkJarakBaris(inputBaris) {
        let idInspection = this.state.inspeksiHeader.ID_INSPECTION;
        let data = TaskService.findBy2('TR_BARIS_INSPECTION', 'ID_INSPECTION', idInspection)
        //cek baris inspection udh ada ato blom
        if (data !== undefined) {
            let header = TaskService.findBy('TR_BLOCK_INSPECTION_H', 'ID_INSPECTION', idInspection)
            //cek di TR_BLOCK_INSPECTION_H udh ad apa belum
            if (header !== undefined && header.length > 0) {
                let rangeMin = parseInt(inputBaris) <= 5 ? 1 : parseInt(inputBaris) - 4;
                let rangeMax = parseInt(inputBaris) + 4;
                let inputNo = [];
                let validation = header.some((val) => {
                    inputNo.push(val.AREAL)
                    return (val.AREAL <= rangeMax && val.AREAL >= rangeMin)
                });
                console.log("VALIDATION:" + JSON.stringify(inputNo), rangeMin, rangeMax)
                return validation;
            }
        }
        return false
    }

    insertDB() {
        if (this.state.inspeksiHeader.AREAL !== "" && this.state.inspeksiHeader.AREAL !== undefined) {
            if (!this.checkJarakBaris(this.state.inspeksiHeader.AREAL)) {
                var today = getTodayDate('YYYYMMDDHHmmss');
                var kondisiBaris1 = []
                var data = {
                    BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}2`,
                    BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                    ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                    CONTENT_INSPECTION_CODE: 'CC0002',
                    VALUE: this.state.pokokPanen,
                    AREAL: this.state.dataUsual.BARIS,
                    STATUS_SYNC: 'N',
                }
                kondisiBaris1.push(data);

                data = {
                    BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}3`,
                    BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                    ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                    CONTENT_INSPECTION_CODE: 'CC0003',
                    VALUE: this.state.buahTinggal,
                    AREAL: this.state.dataUsual.BARIS,
                    STATUS_SYNC: 'N'
                }
                kondisiBaris1.push(data);

                data = {
                    BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}4`,
                    BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                    ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                    CONTENT_INSPECTION_CODE: 'CC0004',
                    VALUE: this.state.brondolPinggir,
                    AREAL: this.state.dataUsual.BARIS,
                    STATUS_SYNC: 'N'
                }
                kondisiBaris1.push(data);

                data = {
                    BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}5`,
                    BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                    ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                    CONTENT_INSPECTION_CODE: 'CC0005',
                    VALUE: this.state.brondolTPH,
                    AREAL: this.state.dataUsual.BARIS,
                    STATUS_SYNC: 'N'
                }
                kondisiBaris1.push(data);

                data = {
                    BLOCK_INSPECTION_CODE_D: `ID${this.state.dataUsual.USER_AUTH}${today}6`,
                    BLOCK_INSPECTION_CODE: this.state.dataUsual.BLOCK_INSPECTION_CODE,
                    ID_INSPECTION: this.state.dataInspeksi.ID_INSPECTION,
                    CONTENT_INSPECTION_CODE: 'CC0006',
                    VALUE: this.state.pokokTdkPupuk,
                    AREAL: this.state.dataUsual.BARIS,
                    STATUS_SYNC: 'N'
                }
                kondisiBaris1.push(data);

                this.props.navigation.navigate('KondisiBaris2', {
                    fotoBaris: this.state.fotoBaris,
                    inspeksiHeader: this.state.inspeksiHeader,
                    kondisiBaris1: kondisiBaris1,
                    dataUsual: this.state.dataUsual,
                    statusBlok: this.state.statusBlok,
                    intervalId: this.state.intervalId,
                    dataInspeksi: this.state.dataInspeksi,
                    inspectionType: this.state.inspectionType === 'genba' ? 'genba' : 'normal'
                });
            }
            else {
                this.setState({ showModalAlert: true, title: 'Baris terlalu dekat', message: 'Opps, minimum jarak barisnya lebih dari 5 dari baris terakhir ya !', icon: require('../../Images/ic-blm-input-lokasi.png') });
            }
        }
        else {
            this.setState({ showModalAlert: true, title: 'Baris data salah', message: 'Opps, data baris salah atau kosong. Tolong cek ulang!', icon: require('../../Images/ic-no-data.png') });
        }
    }

    increaseNumber(param) {
        var sum = 0;
        switch (param) {
            case 'JP':
                sum = parseInt(this.state.jumlahPokok) + 1;
                this.setState({ jumlahPokok: sum.toString() })
                break;
            case 'PP':
                sum = parseInt(this.state.pokokPanen) + 1;
                this.setState({ pokokPanen: sum.toString() })
                break;
            case 'BT':
                sum = parseInt(this.state.buahTinggal) + 1;
                this.setState({ buahTinggal: sum.toString() })
                break;
            case 'BP':
                sum = parseInt(this.state.brondolPinggir) + 1;
                this.setState({ brondolPinggir: sum.toString() })
                break;
            case 'BTP':
                sum = parseInt(this.state.brondolTPH) + 1;
                this.setState({ brondolTPH: sum.toString() })
                break;
            case 'PTP':
                sum = parseInt(this.state.pokokTdkPupuk) + 1;
                this.setState({ pokokTdkPupuk: sum.toString() })
                break;
            default:
                break;

        }
    }

    decreaseNumber(param) {
        var sum = 0;
        switch (param) {
            case 'JP':
                if (parseInt(this.state.jumlahPokok) > 0) {
                    sum = parseInt(this.state.jumlahPokok) - 1;
                    this.setState({ jumlahPokok: sum.toString() })
                }
                break;
            case 'PP':
                if (parseInt(this.state.pokokPanen) > 0) {
                    sum = parseInt(this.state.pokokPanen) - 1;
                    this.setState({ pokokPanen: sum.toString() })
                }
                break;
            case 'BT':
                if (parseInt(this.state.buahTinggal) > 0) {
                    sum = parseInt(this.state.buahTinggal) - 1;
                    this.setState({ buahTinggal: sum.toString() })
                }
                break;
            case 'BP':
                if (parseInt(this.state.brondolPinggir) > 0) {
                    sum = parseInt(this.state.brondolPinggir) - 1;
                    this.setState({ brondolPinggir: sum.toString() })
                }
                break;
            case 'BTP':
                if (parseInt(this.state.brondolTPH) > 0) {
                    sum = parseInt(this.state.brondolTPH) - 1;
                    this.setState({ brondolTPH: sum.toString() })
                }
                break;
            case 'PTP':
                if (parseInt(this.state.pokokTdkPupuk) > 0) {
                    sum = parseInt(this.state.pokokTdkPupuk) - 1;
                    this.setState({ pokokTdkPupuk: sum.toString() })
                }
                break;
            default:
                break;

        }
    }

    remove0(param) {
        console.log(param)
        var str = param.toString();
        if (str.lenght > 1) {
            if (str.indexOf(0) == '0') {
                var val = str.substring(0);
                console.log(val);
                return val;
            }
        }
    }

    _render_variable_input() {
        console.log(this.state.statusBlok);
        if (this.state.statusBlok == "TBM 0" || this.state.statusBlok == "TBM 1" || this.state.statusBlok == "TBM 2") {
            return null;
        }
        else {
            return ([<View style={styles.containerLabel}>
                <Text style={styles.txtLabel}>Pokok Panen</Text>
                <View style={[styles.containerInput, { flex: 5 }]}>
                    <TouchableOpacity style={styles.btnMinus} onPress={() => { this.decreaseNumber('PP') }}>
                        <Icon2 name={"minus"} size={20} color="white" />
                    </TouchableOpacity>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={2}
                        keyboardType={'numeric'}
                        value={this.state.pokokPanen}
                        onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, ''); this.setState({ pokokPanen: text }) }} />
                    <TouchableOpacity style={styles.btnAdd} onPress={() => { this.increaseNumber('PP') }}>
                        <Icon name={"add"} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>,
            <View style={styles.containerLabel}>
                <Text style={styles.txtLabel}>Buah Tinggal</Text>
                <View style={[styles.containerInput, { flex: 5 }]}>
                    <TouchableOpacity
                        style={styles.btnMinus}
                        onPress={() => this.decreaseNumber('BT')} >
                        <Icon2 name={"minus"} size={20} color="white" />
                    </TouchableOpacity>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={2}
                        keyboardType={'numeric'}
                        value={this.state.buahTinggal}
                        onChangeText={(text) => { text = text.replace(/[^0-9]/g, ''); this.setState({ buahTinggal: text }) }} />
                    <TouchableOpacity
                        style={styles.btnAdd}
                        onPress={() => this.increaseNumber('BT')}>
                        <Icon name={"add"} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>,
            <View style={styles.containerLabel}>
                <Text style={styles.txtLabel}>Brondolan di Piringan</Text>
                <View style={[styles.containerInput, { flex: 5 }]}>
                    <TouchableOpacity style={styles.btnMinus}
                        onPress={() => { this.decreaseNumber('BP') }}>
                        <Icon2 name={"minus"} size={20} color="white" />
                    </TouchableOpacity>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={3}
                        keyboardType={'numeric'}
                        value={this.state.brondolPinggir}
                        onChangeText={(text) => { text = text.replace(/[^0-9]/g, ''); this.setState({ brondolPinggir: text }) }} />
                    <TouchableOpacity style={styles.btnAdd} onPress={() => { this.increaseNumber('BP') }}>
                        <Icon name={"add"} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>,
            <View style={styles.containerLabel}>
                <Text style={[styles.txtLabel, { fontWeight: '300' }]}>Brondolan di TPH</Text>
                <View style={[styles.containerInput, { flex: 5 }]}>
                    <TouchableOpacity style={styles.btnMinus}
                        onPress={() => { this.decreaseNumber('BTP') }}>
                        <Icon2 name={"minus"} size={20} color="white" />
                    </TouchableOpacity>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[styles.searchInput]}
                        maxLength={3}
                        keyboardType={'numeric'}
                        value={this.state.brondolTPH}
                        onChangeText={(text) => { text = text.replace(/[^0-9]/g, ''); this.setState({ brondolTPH: text }) }}
                    />
                    <TouchableOpacity style={styles.btnAdd} onPress={() => { this.increaseNumber('BTP') }}>
                        <Icon name={"add"} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>]);
        }
    }

    cancelOrder() {
        this.props.navigation.goBack(null)
        // const navigation = this.props.navigation;
        // let routeName = 'MainMenu';
        // this.setState({showModal: false})
        // Promise.all([navigation.dispatch(NavigationActions.navigate({ routeName : routeName}))]).
        // then(() => navigation.navigate('Inspection')).then(() => navigation.navigate('DaftarInspeksi'));

    }

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <StatusBar
                    hidden={false}
                    barStyle="light-content"
                    backgroundColor={Colors.tintColorPrimary}
                />

                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModalAlert}
                    onPressCancel={() => this.setState({ showModalAlert: false })}
                    title={this.state.title}
                    message={this.state.message} />

                {/*<ModalAlertConfirmation*/}
                {/*    icon={this.state.icon}*/}
                {/*    visible={this.state.showModal}*/}
                {/*    onPressCancel={() => this.setState({ showModal: false })}*/}
                {/*    onPressSubmit={() => { this.setState({ showModal: false }); this.cancelOrder() }}*/}
                {/*    title={this.state.title}*/}
                {/*    message={this.state.message}*/}
                {/*/>*/}

                {/*STEPPER*/}
                <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.brand }]}>
                            <Text style={styles.stepperNumberText}>1</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.brand, fontFamily: Font.book }]}>Pilih Lokasi</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.brand}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.brand }]}>
                            <Text style={styles.stepperNumberText}>2</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.brand, fontFamily: Font.book }]}>Kondisi Baris</Text>
                        <View>
                            <Icon
                                name="chevron-right"
                                size={24}
                                color={Colors.buttonDisabled}
                                style={styles.stepperNext} />
                        </View>
                    </View>

                    <View style={styles.containerStepper}>
                        <View style={[styles.stepperNumber, { backgroundColor: Colors.buttonDisabled }]}>
                            <Text style={styles.stepperNumberText}>3</Text>
                        </View>
                        <Text style={[Fonts.style.caption, { paddingLeft: 3, color: Colors.textSecondary, fontFamily: Font.book }]}>Summary</Text>
                    </View>
                </View>

                {/*LABEL*/}
                <View style={styles.containerLabel}>
                    <View style={{ flex: 2 }}>
                        <Image source={require('../../Images/icon/ic_walking.png')} style={styles.icon} />
                    </View>
                    <View style={{ flex: 7 }}>
                        <Text style={{ fontSize: 16, fontFamily: Font.demi }}>Sambil Jalan</Text>
                        <Text style={{ fontSize: 12, color: 'grey', fontFamily: Font.book }}>Kamu bisa input ini ketika berjalan disepanjang baris.</Text>
                    </View>
                </View>

                <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

                {/*GANTI BARIS*/}
                <View style={{ backgroundColor: 'white' }}>
                    <View style={styles.containerLabel}>
                        <Text style={styles.txtLabel}>Baris</Text>
                        <View style={[styles.containerInput, { flex: 5 }]}>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput]}
                                keyboardType={'numeric'}
                                value={this.state.inspeksiHeader.AREAL}
                                onChangeText={(value) => {
                                    let text = value.replace(/[^0-9 ]/g, '');
                                    if (text !== "0") {
                                        let oldHeader = R.clone(this.state.inspeksiHeader);
                                        let oldDataUsual = R.clone(this.state.dataUsual);
                                        oldHeader.AREAL = text;
                                        oldDataUsual.BARIS = text;
                                        this.setState({
                                            inspeksiHeader: oldHeader,
                                            dataUsual: oldDataUsual
                                        });
                                    }
                                }} />
                        </View>
                    </View>
                </View>

                {/*INPUT*/}
                <View style={{ backgroundColor: 'white' }}>
                    {this._render_variable_input()}
                    <View style={styles.containerLabel}>
                        <Text style={[styles.txtLabel, { fontWeight: '300' }]}>Pokok Tidak di Pupuk</Text>
                        <View style={[styles.containerInput, { flex: 5 }]}>
                            <TouchableOpacity style={styles.btnMinus}
                                onPress={() => { this.decreaseNumber('PTP') }}>
                                <Icon2 name={"minus"} size={20} color="white" />
                            </TouchableOpacity>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                style={[styles.searchInput]}
                                maxLength={2}
                                keyboardType={'numeric'}
                                value={this.state.pokokTdkPupuk}
                                onChangeText={(text) => { text = text.replace(/[^0-9]/g, ''); this.setState({ pokokTdkPupuk: text }) }
                                } />
                            <TouchableOpacity style={styles.btnAdd} onPress={() => { this.increaseNumber('PTP') }}>
                                <Icon name={"add"} size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*CIRCLE*/}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                    {/*Gani*/}
                    <TouchableOpacity onPress={() => { this.insertDB() }}
                        style={[styles.buttonSubmit, { backgroundColor: Colors.tintColor }]}>
                        <Image style={styles.imageSubmit} source={require('../../Images/icon/ic_lanjut.png')} />
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={styles.cicle} onPress={() => { }}>*/}
                    {/* <Icon name={"chevron-left"}  size={10} color="white" /> */}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={[styles.cicle2, { marginLeft: 10 }]} onPress={() => { this.insertDB() }}>*/}
                    {/* <Icon name={"chevron-right"}  size={10} color="white" /> */}
                    {/*</TouchableOpacity>*/}
                    {/*End Gani*/}
                </View>

            </ScrollView>
        )
    }
}

export default KondisiBaris1;

const styles = {

    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
        // padding:20
    },
    containerStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    stepperNumber: {
        height: 24,
        width: 24,
        backgroundColor: Colors.buttonDisabled,
        borderRadius: 12,
        justifyContent: 'center'
    },
    stepperNumberText: [Fonts.style.caption, { textAlign: 'center', color: Colors.textDark }],
    stepperNext: { alignSelf: 'flex-end', paddingRight: 4 },

    containerLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20
    },
    txtLabel: {
        flex: 3,
        color: 'grey',
        fontSize: 15,
        fontFamily: Font.book
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    btnMinus: {
        borderWidth: 3,
        borderColor: '#cca300',
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
        backgroundColor: '#e6b800',
        borderRadius: 100,

    },
    btnAdd: {
        borderWidth: 3,
        borderColor: '#00e639',
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
        height: 35,
        backgroundColor: Colors.brand,
        borderRadius: 100,
    },
    cicle: {
        borderWidth: 3,
        borderColor: '#A0A0A0',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#A9A9A9',
        borderRadius: 100,
    },
    cicle2: {
        borderWidth: 3,
        borderColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#E8E8E8',
        borderRadius: 100,
    },
    searchInput: {
        height: 40,
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
        flex: 1,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#989898',
        color: '#808080',
        textAlign: 'center',
        fontFamily: Font.book
    },
    icon: {
        alignContent: 'flex-end',
        height: 64,
        width: 64,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
    buttonSubmit: {
        width: 150,
        borderRadius: 25,
        margin: 5,
        padding: 10,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    imageSubmit: {
        flex: 1,
        width: 100,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
}
