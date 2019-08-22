import React from "react";
import {Header} from "react-navigation";
import {TouchableOpacity, View} from "react-native";
import {Text} from 'native-base';
import Color from '../Constant/Colors';
import TaskServices from '../Database/TaskServices';

const CustomHeader = props => {
	let latestSync = TaskServices.getAllData('TR_SYNC_LOG');
	let divDays = 0;
	if (latestSync.length > 0) {
		latestSyncDay = new Date(latestSync.max("SYNC_TIME"));
		divDays = Math.floor((new Date() - latestSyncDay) / (1000 * 60 * 60 * 24));
	}
	let notifCount = TaskServices.getAllData('TR_NOTIFICATION').filtered('NOTIFICATION_STATUS=0').length;
	let digits = 0;
	let calcDigits = notifCount;
	while (calcDigits >= 1) {
		digits++;
		calcDigits /= 10;
	}
	let notifPadding = 3;
	let widthPerDigit = 6;
	let notifSize = widthPerDigit * digits + notifPadding * 2;
	if (notifSize > 24) {
		notifSize = 24;
	}
	return (
		<View style={{
			backgroundColor: Color.errorBackground
		}}>
			{notifCount > 0 &&
				<TouchableOpacity style={{
					position: 'absolute', backgroundColor: 'red', zIndex: 5, elevation: 5,
					right: 10, top: 10,
					justifyContent: 'center', alignItems: 'center', textAlign: 'center',
					padding: notifPadding, width: notifSize, height: notifSize, borderRadius: notifSize / 2
				}}
					onPress={() => props.navigation.navigate('Inbox')}>
					<Text style={{ fontSize: 10, color: '#fff' }}>
						{notifCount}
					</Text>
				</TouchableOpacity>
			}
			<Header {...props} />
			{divDays > 0 && <Text style={{
				alignSelf: 'center',
				justifyContent: 'center',
				color: Color.errorText,
				fontSize: 12,
				padding: 5
			}}
			>Kamu belum melakukan sync data selama {divDays} hari</Text>}
		</View>
	);
};

export default CustomHeader;
