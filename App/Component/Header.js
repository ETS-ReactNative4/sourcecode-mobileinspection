import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconHeader from '../Component/IconHeader'
import Colors from '../Constant/Colors';
import { Images } from '../Themes'

const Header = (props) => {
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 56, backgroundColor: Colors.tintColorPrimary }}>

                {/* ICON LEFT HEADER */}
                <IconHeader padding={{ paddingLeft: 12 }} onPress={props.onPressLeft} icon={Images.ic_sync} show={true} />

                {/* TITLE HEADER */}
                <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.title}>{props.title}</Text>
                </View>

                {/* ICON RIGHT HEADER */}
                <IconHeader padding={{ paddingRight: 12 }} onPress={props.onPressRight} icon={Images.ic_inbox} show={props.isNotUserMill} />

                {/* NOTIF HEADER */}
                {props.notif > 0 && <View style={{ position: 'absolute', right: 8, top: 10 }}>
                    <View style={styles.containerNotif}>
                        <Text style={styles.notif}>{props.notif}</Text>
                    </View>
                </View>}
            </View>
            
            {/* BELUM SYNC */}
            {props.divDays > 0 && <View style={{ backgroundColor: Colors.errorBackground }}>
                <Text style={styles.text}>Kamu belum melakukan sync data selama {props.divDays} hari</Text>
            </View>}
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: '400',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    notif: {
        textAlign: "center",
        fontSize: 10,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    containerNotif: {
        width: 19,
        height: 19,
        backgroundColor: 'red',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 1
    },
    text: {
        alignSelf: 'center',
        justifyContent: 'center',
        color: Colors.errorText,
        fontSize: 12,
        padding: 5
    }
})