import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Colors from '../Constant/Colors';
import * as Progress from 'react-native-progress';

const heightProgress = 5

const ProgressSync = (props) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.labelProgress}>{props.title}</Text>
                <View style={styles.sectionProgress}>
                    <Text style={styles.labelProgress}>{props.value}</Text>
                    <Text style={styles.labelProgress}>/</Text>
                    <Text style={styles.labelProgress}>{props.total}</Text>
                </View>
            </View>
            <Progress.Bar
                height={heightProgress}
                width={null}
                style={styles.progress}
                color={props.color}
                progress={props.progress}
                backgroundColor={Colors.colorProgress}
                borderColor={Colors.colorWhite}
                indeterminate={false} />
        </View>
    )
}

export default ProgressSync;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 12
    },
    sectionProgress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    progress: {
        marginTop: 2
    },
    labelProgress: {
        fontSize: 12
    }
});
