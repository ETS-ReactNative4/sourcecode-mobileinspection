import React from "react";
import { Header } from "react-navigation";
import { View, Platform } from "react-native";
import { Thumbnail, Text } from 'native-base';
import Color from '../Constant/Colors';
import TaskServices from '../Database/TaskServices';

const CustomHeader = props => {
	let latestSync = TaskServices.getAllData('TR_SYNC_LOG');
	let divDays = 0;
	if(latestSync.length>0){
		latestSyncDay = new Date(latestSync.max("SYNC_TIME"));
		divDays = Math.floor((new Date() - latestSyncDay)/(1000 * 60 * 60 * 24));
	}
	return (
		<View style={{
			backgroundColor:Color.errorBackground
		}}>
			<Header {...props} />
			{divDays>0 && <Text style={{
						alignSelf: 'center',
						justifyContent: 'center',
						color:Color.errorText,
						fontSize: 12
					}}
			>Kamu belum melakukan sync data selama {divDays} hari</Text>}
		</View>
	);
};

export default CustomHeader;