
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { Card } from 'native-base';
import PropTypes from 'prop-types';

const WeeklyFeature = (props) => {
    return (
        <View style={{ width: '50%', paddingHorizontal: 8, justifyContent: 'center', marginTop: 6 }}>
            <Card style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <View style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ height: 72, width: 72 }} source={props.img} />
                    <Text style={{ marginTop: 5, fontSize: 12, fontWeight: '500' }}> {props.title}</Text>
                    <Text style={{ marginTop: 2, fontSize: 14, fontWeight: '500', color: 'black' }}> {props.value}</Text>
                    <Text style={{ marginTop: 6, fontSize: 14, fontWeight: '400' }}> {props.target}</Text>
                </View>
            </Card>
        </View>
    )
}

class WeeklySummary extends Component {

    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onPressClose: PropTypes.func,
        visible: PropTypes.bool,
        data: PropTypes.array
    };

    // Defaults for props
    static defaultProps = {
        onPressClose: () => { },
        visible: false,
        data: []
    };

    render() {
        return (
            <Modal
                visible={this.props.visible}
                animationType={'fade'}
                transparent={true}
                onRequestClose={this.props.onPressClose}>
                <View style={styles.container}>
                    <View>
                        <ImageBackground imageStyle={{ borderRadius: 15 }} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} source={require('../../Images/summaryInspeksi/bg_weekly_summary.png')}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={this.props.onPressClose} style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 16 }}>
                                    <Image style={{ height: 30, width: 30, marginTop: 12 }} source={require('../../Images/summaryInspeksi/close.png')} />
                                </TouchableOpacity>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                                    <Image style={{ height: 70, width: 130, resizeMode: 'stretch' }} source={require('../../Images/summaryInspeksi/morning.png')} />
                                    <Text style={[styles.text, { color: 'black', marginTop: 16 }]}>Semangat Pagi, Paijo</Text>
                                    <Text style={[styles.text, { color: '#4f5154', marginTop: 3 }]}>Seminggu kemarin, kamu telah :</Text>
                                </View>

                                {/* Feature */}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, marginTop: 10 }}>
                                    <WeeklyFeature value={'10 (25 Baris)'} title={'inspeksi'} img={require('../../Images/summaryInspeksi/inspeksi.png')} target={'Target : 10'} />
                                    <WeeklyFeature value={'5'} title={'temuan'} img={require('../../Images/summaryInspeksi/temuan.png')} target={'Target : 50'} />
                                    <WeeklyFeature value={'50'} title={'ebcc validation'} img={require('../../Images/summaryInspeksi/ebcc.png')} target={'Target : 50'} />
                                    <WeeklyFeature value={'1,248 KM'} title={'berjalan kaki'} img={require('../../Images/summaryInspeksi/walk.png')} target={'10 jam 43 menit'} />
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                                    <Text style={styles.text_white}> Tetap semangat yaa...</Text>
                                    <Text style={styles.text_white}> Tingkatkan terus prestasimu!</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default WeeklySummary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    text: {
        fontSize: 14,
        fontWeight: '400'
    },
    text_white: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500'
    }

});

