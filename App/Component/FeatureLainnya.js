import React from 'react';
import { Image, Text, TouchableOpacity, View , StyleSheet} from 'react-native';

import Icon2 from 'react-native-vector-icons/AntDesign'

const FeatureLainnya = (props) => {
    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1, height: props.signout || props.lineTop ? 10 : 1, backgroundColor: '#F5F5F5' }} />

            {/*SignOut Menu*/}
            {props.signout ? <TouchableOpacity style={[styles.containerLabel, { justifyContent: 'center' }]} onPress={props.onPressSignOut}>
                <Text style={{ fontSize: 14, color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{props.title}</Text>

                {/* Default Menu */}
            </TouchableOpacity> :
                <TouchableOpacity style={styles.containerLabel} onPress={props.onPressDefault}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={props.icon} style={[styles.icon, { height: props.sizeIcon, width: props.sizeIcon }]} />
                        <Text style={{ fontSize: 14, color: 'black', textAlign: 'center' }}>{props.title}</Text>
                    </View>
                    <Icon2 name='right' color={'black'} size={14} style={{ marginRight: 15 }} />
                </TouchableOpacity>
            }

            <View style={{ flex: 1, height: props.signout || props.line ? 10 : 1, backgroundColor: '#F5F5F5' }} />
        </View>
    )
}

export default FeatureLainnya;


const styles = StyleSheet.create({
    icon: {
      marginLeft: 12,
      marginRight: 12
    },
    containerLabel: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      padding: 12
    }
  });

