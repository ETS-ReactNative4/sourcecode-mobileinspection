import React, { Component } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, View } from 'native-base';
// import { Colors, Fonts } from '../Themes';
import Colors from '../Constant/Colors';
import Fonts from '../Constant/Fonts';

export default class ModalConfirmation extends Component {
    // Prop type warnings
    static propTypes = {
        onPressCancel: PropTypes.func,
        onPressSubmit: PropTypes.func,
        btnCancelText: PropTypes.string,
        btnSubmitText: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string,
        visible: PropTypes.bool
    };

    // Defaults for props
    static defaultProps = {
        onPressCancel: () => { },
        onPressSubmit: () => { },
        title: 'Title',
        message: 'Message',
        btnCancelText: 'CANCEL',
        btnSubmitText: 'OK',
        visible: false
    };

    render() {
        const props = this.props;
        return (
            <Modal
                visible={props.visible}
                animationType={'fade'}
                transparent={true}
                onRequestClose={props.onPressCancel}
            >
                <View style={style.modalContainer}>
                    <View style={style.modalInnerContainer}>
                        <Text style={[Fonts.style.subhead, { color: 'black', fontWeight: 'bold' }]}>{props.title}</Text>
                        <Text style={{ padding: 24, paddingBottom: 8, textAlign: 'center' }}>{props.message}</Text>
                        <View style={{ flexDirection: 'row', paddingTop: 12, paddingBottom: 8, justifyContent: 'space-between', width:'100%'}}>
                            <TouchableOpacity onPress={props.onPressCancel} style={style.btnNo}>
                                <View transparent style={style.button}>
                                    <Text style={{ color: '#0F5CBF' }}>{props.btnCancelText}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={props.onPressSubmit} style={style.btnYes}>
                                <View transparent style={style.button}>
                                    <Text style={{color: 'white'}}>{props.btnSubmitText}</Text>
                                </View>
                            </TouchableOpacity>
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
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 4
    },
    button: {
        justifyContent: 'center',
        alignSelf: 'center'
    },
    btnYes: {
        backgroundColor: '#0F5CBF',
        height: 40,
        justifyContent: 'center',
        borderRadius: 8,
        width: '47%',
        marginBottom: 10

    },
    btnNo: {
        backgroundColor: 'transparent',
        height: 40,
        justifyContent: 'center',
        borderRadius: 8,
        width: '47%'

    }
};
