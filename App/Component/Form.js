import React, { Component } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    NetInfo,
    Picker,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ModalAlert from '../Component/ModalAlert'
import PropTypes from 'prop-types';
import { AlertContent, Images, Colors } from '../Themes'
import { storeData } from '../Database/Resources';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class Form extends Component {

    // Prop type warnings
    static propTypes = {
        onBtnClick: PropTypes.func,
    };

    // Defaults for props
    static defaultProps = {
        onBtnClick: () => { },
    };

    constructor() {
        super();
        this.state = {
            strEmail: '',
            strPassword: '',
            selectedServer: "1",
            title: 'Title',
            message: 'Message',
            showModal: false,
            icon: '',
            secure: true,
            iconName: "eye-off"
        }
    }

    makeAlert(msg) {
        Alert.alert('Peringatan', msg, [
            {
                text: 'OK'
            }], { cancelable: false })
    }

    onBtnClick(props) {
        Keyboard.dismiss();
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                switch (true) {
                    case this.state.strEmail === '':
                        this.setState(AlertContent.email_kosong)
                        break;
                    case this.state.strPassword === '':
                        this.setState(AlertContent.password_kosong)
                        break;
                    case this.state.selectedServer === '1':
                        storeData('typeApp', 'PROD')
                    default:
                        props.onBtnClick({
                            ...this.state
                        });
                        break;
                }
            } else {
                this.setState(AlertContent.no_internet)
            }
        });
        function handleFirstConnectivityChange(isConnected) {
            NetInfo.isConnected.removeEventListener(
                'connectionChange',
                handleFirstConnectivityChange
            );
        }
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            handleFirstConnectivityChange
        );
    }
    onValueChange(value) {
        this.setState({
            selectedServer: value
        });
    }

    triggerShowHide = () => {
        this.setState(prevState => ({
            iconName: prevState.iconName === 'eye' ? 'eye-off' : 'eye',
            secure: !this.state.secure
        }));
    }

    render() {

        const props = this.props;
        return (
            // <KeyboardAvoidingView style={{flex:1}}>
            <View style={styles.container}>

                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    title={this.state.title}
                    message={this.state.message} />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image source={Images.logo_pic} style={{ width: 250, height: 80, resizeMode: 'stretch', marginBottom: 30 }} />
                </View>

                <View style={styles.sectionInput}>
                    <Image source={Images.ic_user} style={styles.iconInput} />
                    <TextInput
                        style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Email"
                        placeholderTextColor="#51a977"
                        selectionColor="#51a977"
                        keyboardType="email-address"
                        onChangeText={(strEmail) => { this.setState({ strEmail: strEmail }) }}
                        value={this.state.strEmail}
                        onSubmitEditing={() => this.password.focus()} />
                </View>

                <View style={styles.sectionInput}>
                    <Image source={Images.ic_password} style={styles.iconInput} />
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Password"
                        secureTextEntry={this.state.secure}
                        placeholderTextColor="#51a977"
                        onChangeText={(strPassword) => { this.setState({ strPassword: strPassword }) }}
                        value={this.state.strPassword}
                        ref={(input) => this.password = input} />

                    <Icon style={{ paddingRight: 10 }} name={this.state.iconName} onPress={() => this.triggerShowHide()} color={Colors.inputBox} size={20} />
                </View>

                <View style={styles.sectionInput}>
                    <Picker
                        mode="dropdown"
                        iosHeader="Select your SIM"
                        iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
                        style={styles.picker}
                        selectedValue={this.state.selectedServer}
                        onValueChange={this.onValueChange.bind(this)}>

                        <Picker.Item label="Production" value="1" />
                        <Picker.Item label="QA" value="2" />
                        <Picker.Item label="Development" value="3" />
                    </Picker>
                </View>

                <TouchableOpacity style={[styles.button, { marginTop: 20 }]}
                    onPress={() => this.onBtnClick(props)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>


                <View style={styles.footerView}>
                    <Text style={styles.footerText}>{'\u00A9'} 2018 Copyrights PT Triputra Agro Persada</Text>
                </View>
            </View>
            // </KeyboardAvoidingView>

        );
    }
}

export default Form

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center'
    },
    tapText: {
        height: 41,
        fontSize: 20,
        color: '#FFFFFF'
    },
    appText: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#FFFFFF',
    },
    sectionInput: {
        flexDirection: 1,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.67,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        marginVertical: 10,
        paddingHorizontal: 12,
        borderColor: '#51a977',
        borderWidth: 1
    },
    iconInput: {
        padding: 10,
        height: 25,
        width: 25,
        resizeMode: 'stretch'
    },
    inputBox: {
        width: 200,
        height: 42,
        fontSize: 16,
        color: '#51a977',
        textAlign: "left",
        paddingVertical: 10,

    },
    picker: {
        flex: 1,
        flexDirection: "row",
        height: 42,
        fontSize: 16,
        color: '#51a977',
        textAlign: "left",

    },
    button: {
        justifyContent: 'center',
        flexDirection: 1,
        flexDirection: 'row',
        backgroundColor: '#068D0D',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    footerView: {
        position: 'absolute',
        bottom: 20,


    }
});
