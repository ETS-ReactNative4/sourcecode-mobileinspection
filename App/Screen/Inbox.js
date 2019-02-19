import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { Container, Content } from 'native-base'
import Colors from '../Constant/Colors';

export default class Inbox extends React.Component {

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

    render() {
        return (
            <Container style={{ flex: 1, padding: 16 }}>
                <Content>
                    <View style={styles.container}>
                        <Image style={{ width: 400, height: 300, marginTop: 110 }} source={require('../Images/img-cooming-soon-1.png')} />
                    </View>
                    {/* <TouchableOpacity>
                        <View style={styles.container}>
                            <View style={{ flex: 2 }}>
                                <Image style={styles.imageThumnail} source={require('../Images/dummy_image.png')} />
                            </View>
                            <View style={{ flex: 6, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.name}>Jurgen Kloop</Text>
                                    <View style={styles.dotNotif} />
                                </View>
                                <Text style={{ color: 'grey' }}>Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'flex-end', alignContent: 'center' }}>
                                <Text style={{ color: 'green', fontWeight: '500', fontSize: 16, alignItems: 'center', marginTop: 18, marginRight: 8 }}> 13:40</Text>
                            </View>
                        </View>
                    </TouchableOpacity> */}
                </Content>
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
    }
});

