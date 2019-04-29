
import { Alert, Clipboard } from 'react-native';
import { parsingPathToMessage } from '../Lib/Utils';
// import { sendMail } from 'react-native-send-intent';
import Config from 'react-native-config';

const eventTrackMiddleware = store => next => action => {
	let actionType = action.type;
	if (actionType) {
		if (actionType.includes('CONNECTION_CHANGE')) {
			if (action.payload != store.getState().network.isConnected) {
				/*if (action.payload) {
					console.tron.log('== BACK ONLINE ==');
					// TODO Process Queue
				} else console.tron.log('== WORKING OFFLINE ==');*/
			}
		}
		if (actionType.includes('FAILURE')) {
			//console.tron.log(`eventTrackMiddleware : ${JSON.stringify(action)}`);
			if (actionType.includes('POST') && !store.getState().network.isConnected) {
				// console.tron.log(`Put : ${actionType} on queue`);
				// TODO Add Queue
			}
			if (action.error) {
				if (typeof action.error == "string") {
					Alert.alert('Error', action.error);
				} else {
					if (Config.ENV != "DEVELOPMENT") {
						Alert.alert('Error at : ' + parsingPathToMessage(action.error.path),action.error.message);
					} else {
						// writeToClipboard = async (data) => {
						// 	await Clipboard.setString(data);
						// 	Toast.show({ text: 'Response Copied to Clipboard !'})
						// };
						Alert.alert(
							'Error at : ' + parsingPathToMessage(action.error.path),
							action.error.message,
							[
								{
									text: 'Send Error to Developer',
									onPress: () => {
										// sendMail('mrizaldi2@gmail.com', 'DDMS Mobile Sales Ops - Error Reporting', JSON.stringify(action.error.response))
									}
								},
								// {
								// 	text: 'Copy Response API',
								// 	onPress: () => {
								// 		writeToClipboard(JSON.stringify(action.error.response));
								// 	}
								// },
								{
									text: 'OK',
									onPress: () => {}
								}
							]
						);
					}
				}
			}
		}
	}
	let result = next(action);

	return result;
};

export default eventTrackMiddleware;
