import React from 'react'
import Colors from '../../Constant/Colors'
import {BackHandler, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import TaskService from '../../Database/TaskServices';
import ModalAlert from '../../Component/ModalAlert';
import Icon2 from 'react-native-vector-icons/Ionicons';
import ModalAlertConfirmation from '../../Component/ModalAlertConfirmation';
import {NavigationActions, StackActions} from 'react-navigation';
import R from 'ramda';

class ManualInputTPH extends React.Component{

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerStyle: {
            backgroundColor: Colors.tintColorPrimary
          },
          title: 'Input TPH',
          headerTintColor: '#fff',
          headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
          },
          headerLeft: (
            <TouchableOpacity onPress={() => {params.handleBackButtonClick()}}>
                <Icon2 style={{marginLeft: 12}} name={'ios-arrow-round-back'} size={45} color={'white'} />
            </TouchableOpacity>
          )
        };
      }

    constructor(props){
        super(props);
        let params = props.navigation.state.params;
        let werkAfdBlockCode = R.clone(params.werkAfdBlockCode)
        let statusScan = R.clone(params.statusScan)
        let reason = R.clone(params.reason)
        let latitude = R.clone(params.latitude)
        let longitude = R.clone(params.longitude)

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.backSpaceFocus3 = this.backSpaceFocus3.bind(this);
        this.backSpaceFocus2 = this.backSpaceFocus2.bind(this);
        this.state = {
            btnHilang: styles.bubbleOff,
            btnRusak: styles.bubbleOff,
            textHilang: styles.buttonTextOff,
            textRusak: styles.buttonTextOff,
            text1:'', text2: '', text3: '',
            werks: '',
            afdCode: '',
            blokCode: '',
            blokName: '',
            statusBlok: '',
            estateName: '',
            totalTph: 0,
            werkAfdBlockCode,
            statusScan,
            reason,
            latitude,
            longitude,
            title: 'Title',
            message: 'Message',
            showModal: false,
            showModal2: false,
            icon: ''

        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ handleBackButtonClick: this.handleBackButtonClick })
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)

        if(this.state.reason !== null && this.state.reason == 'HILANG'){
            this.setState({btnHilang: styles.bubbleOn, btnRusak: styles.bubbleOff, textHilang: styles.buttonTextOn, textRusak: styles.buttonTextOff})
        }else if(this.state.reason !== null && this.state.reason == 'RUSAK'){
            this.setState({btnHilang: styles.bubbleOff, btnRusak: styles.bubbleOn, textHilang: styles.buttonTextOff, textRusak: styles.buttonTextOn})
        }
        this.loadDataBlock(this.state.werkAfdBlockCode)
    }

    componentWillUnmount(){
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.setState({
            showModal2: true, title: 'Data Hilang',
            message: 'Datamu belum tersimpan loh. Yakin mau dilanjutin?',
            icon: require('../../Images/ic-not-save.png')
        });
        return true;
    }

    onClickButton(param){
        switch(param){
            case 'HILANG':
                this.setState({btnHilang: styles.bubbleOn, btnRusak: styles.bubbleOff, textHilang: styles.buttonTextOn, textRusak: styles.buttonTextOff, reason : 'HILANG'})
                break;
            case 'RUSAK':
                this.setState({btnHilang: styles.bubbleOff, btnRusak: styles.bubbleOn, textHilang: styles.buttonTextOff, textRusak: styles.buttonTextOn, reason: 'RUSAK'})
                break;
            default:
                break;
        }
    }

    nextFocus(param, txt){
        if(param !== '' && txt == '1'){
            this.txt2.focus()
        }else if(param !== '' && txt == '2'){
            this.txt3.focus()
        }
    }

    backSpaceFocus3({ nativeEvent: { key: keyValue } }) {
        if (keyValue === 'Backspace') {
            this.txt2.focus()
        }

    }

    backSpaceFocus2({ nativeEvent: { key: keyValue } }) {
        if (keyValue === 'Backspace') {
            this.txt1.focus()
        }
    }

    getStatusBlok(werk_afd_blok_code){
        try {
            let data = TaskService.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
            return data.MATURITY_STATUS;
        } catch (error) {
            return ''
        }
    }

    getEstateName(werks){
        try {
            let data = TaskService.findBy2('TM_EST', 'WERKS', werks);
            return data.EST_NAME;
        } catch (error) {
            return '';
        }

    }

    loadDataBlock(werkAfdBlockCode){
        let data = TaskService.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlockCode);
        if(data !== undefined){
            let statusBlok= this.getStatusBlok(data.WERKS_AFD_BLOCK_CODE);
            let estateName = this.getEstateName(data.WERKS);
            this.setState({
                blokCode: data.BLOCK_CODE,
                blokName: data.BLOCK_NAME,
                afdCode: data.AFD_CODE,
                werks: data.WERKS,
                totalTph: data.JUMLAH_TPH,
                statusBlok, estateName
            })
        }else{
            this.setState({ showModal: true, title: 'Salah Blok', message: 'Kamu ga bisa buat inspeksi di blok ini', icon: require('../../Images/ic-blm-input-lokasi.png') });
        }
    }

    selesai=()=>{

        const navigation = this.props.navigation;
        let routeName = 'MainMenu';
        this.setState({showModal: false})
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        Promise.all([
            navigation.dispatch(
                StackActions.reset({
                    index:0,
                    actions:[NavigationActions.navigate({ routeName : routeName})]
                })
            )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'))
        // Promise.all([navigation.dispatch(NavigationActions.navigate({ routeName : routeName}))]).
        // then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('DaftarEbcc'));
    }

    validation(){
        let tph = `${this.state.text1}${this.state.text2}${this.state.text3}`
        let tphAfdWerksBlockCode = `${tph}-${this.state.afdCode}-${this.state.werks}-${this.state.blokCode}`
        if(this.state.text1 == '' && this.state.text1 == '' && this.state.text1 == '') {
            this.setState({ showModal: true, title: 'TPH Belum di Isi', message: 'Kamu harus isi TPH dulu', icon: require('../../Images/ic-blm-input-lokasi.png') });
        }else if(tph === '000'){
            this.setState({ showModal: true, title: 'TPH Salah cuy', message: 'Kamu ga boleh isi no TPH 000', icon: require('../../Images/ic-blm-input-lokasi.png') });
        }else if(parseInt(tph) > this.state.totalTph){
            this.setState({ showModal: true, title: 'TPH kelebihan', message: `TPH yang diinput melibihi jumlah total TPH ${this.state.blokName}`, icon: require('../../Images/ic-blm-input-lokasi.png') });
        }else{
            this.props.navigation.navigate('FotoJanjang', {statusScan: 'MANUAL', tphAfdWerksBlockCode: tphAfdWerksBlockCode, reason: this.state.reason});
        }
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.mainContainer} behavior="padding" enabled>

                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => {this.setState({ showModal: false })}}
                    title={this.state.title}
                    message={this.state.message} />

                <ModalAlertConfirmation
                    icon={this.state.icon}
                    visible={this.state.showModal2}
                    onPressCancel={() => this.setState({ showModal2: false })}
                    onPressSubmit={() => {this.selesai(); this.setState({ showModal2: false })}}
                    title={this.state.title}
                    message={this.state.message}
                />

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style={{ fontSize: 15, fontWeight: '500'}}>Kamu tidak bisa scan TPH?</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 5 }}>Kenapa?</Text>

                    <View style={[styles.buttonContainer, {marginTop:35, paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[this.state.btnHilang, styles.button] } onPress={()=>this.onClickButton('HILANG')}>
                            <Text style={this.state.textHilang}>QR Code TPH-nya Hilang</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.buttonContainer,{paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[this.state.btnRusak, styles.button] } onPress={()=>this.onClickButton('RUSAK')}>
                            <Text style={this.state.textRusak}>QR Code TPH-nya Rusak</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 10 }}>Lokasi</Text>
                    <Text style={{ fontSize: 15, color: Colors.brandSecondary, marginTop: 5 }}>{`${this.state.blokName}/${this.state.statusBlok}/${this.state.estateName}`}</Text>

                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 20 }}>TPH</Text>
                    <View style={{marginTop: 5, flexDirection: 'row', marginTop: 5}}>
                        <TextInput
                            ref={(input) => this.txt1 = input}
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, { width: 40, textAlign:'center'}]}
                            keyboardType="numeric"
                            maxLength={1}
                            onSubmitEditing={() => this.txt2.focus()}
                            value={this.state.text1}
                            onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, ''); this.setState({text1: text}); this.nextFocus(text, '1')}} />
                        <TextInput
                            ref={(input) => this.txt2 = input}
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, {width: 40, textAlign:'center'}]}
                            keyboardType="numeric"
                            maxLength={1}
                            onSubmitEditing={() => this.txt3.focus()}
                            onKeyPress={ this.backSpaceFocus2 }
                            value={this.state.text2}
                            onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, ''); this.setState({text2: text}); this.nextFocus(text, '2') }}/>
                        <TextInput
                            ref={(input) => this.txt3 = input}
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput, {width: 40, textAlign:'center'}]}
                            keyboardType="numeric"
                            maxLength={1}
                            onKeyPress={ this.backSpaceFocus3 }
                            value={this.state.text3}
                            onChangeText={(text) => { text = text.replace(/[^0-9 ]/g, ''); this.setState({text3: text}) }}/>
                    </View>

                    <Text style={[styles.textLabel, {marginTop:60}]}>
                        Pastikan Lokasi & TPH benar
                    </Text>

                    <View style={[styles.buttonContainer, {marginTop: 20}]}>
                        <TouchableOpacity style={[styles.bubbleBtn, styles.button2] } onPress={()=>{this.validation()}}>
                            <Text style={styles.buttonText2}>Lanjut</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        )
    }
}

export default ManualInputTPH

const styles = {
    mainContainer: { flex: 1, backgroundColor: 'white'},
    bubble: { borderWidth: 1, borderColor: '#989898', borderRadius: 20},
    button: { flex:1, alignItems: 'center', padding: 10},
    buttonContainer: { flexDirection: 'row', marginVertical: 5,backgroundColor: 'transparent'},
    bubbleBtn: {
        backgroundColor: '#ff8080',
        // backgroundColor: Colors.brand,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText2: { fontSize: 17, color: '#ffffff', textAlign: 'center'},
    button2: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },
    searchInput: {
        height: 60,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        color: '#808080',
    },
    textLabel:{ color: Colors.brand, textAlign: 'center', fontSize: 16},
    bubbleOff: { borderWidth: 1, borderColor: '#989898', borderRadius: 20},
    bubbleOn: { backgroundColor: Colors.brand, borderRadius: 20,},
    buttonTextOff: { fontSize: 14, color: '#808080', textAlign: 'center'},
    buttonTextOn: { fontSize: 14, color: '#ffffff', textAlign: 'center'}
}
