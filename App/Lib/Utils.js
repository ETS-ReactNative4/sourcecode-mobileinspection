import { isEmpty, isNil } from 'ramda';
import DeviceInfo from 'react-native-device-info';
import { Alert, Dimensions, PermissionsAndroid, PixelRatio, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const moment = require('moment');
const momentTimezone = require('moment-timezone');
var uuid = require('react-native-uuid');
import TaskServices from '../Database/TaskServices'
import RNFetchBlob from "rn-fetch-blob";

export function downloadImage(url, path) {
	const { config, fs } = RNFetchBlob
	let options = {
		fileCache: false,
		addAndroidDownloads: {
			useDownloadManager: true,
			notification: true,
			path: path,
			description: 'Image'
		}
	}
	config(options).fetch('GET', url).then((res) => {
        RNFetchBlob.android.actionViewIntent(res.path(), '/')
	});
}

export function fetchPostDataWithToken(URL, data, token) {
	fetch(URL, {
		method: 'POST',
		headers: {
			// 'Cache-Control': 'no-cache',
			//  Accept: 'application/json',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(data)
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(JSON.str(data))
			return data
		})
		.catch((err) => { return err });
}

export function kirimImage(URL, Formdata) {
	fetch(url, {
		method: 'POST',
		headers: {
			'Cache-Control': 'no-cache',
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${user[0].ACCESS_TOKEN}`,
		},
		body: data

	}).then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			return responseJson;
		}).catch((error) => {
			console.error(error);
			return error;
		});
}

export function getSticker(score) {
	var arrA = [require('../Images/stiker-A-1.png'), require('../Images/stiker-A-2.png'), require('../Images/stiker-A-3.png')];
	var arrB = [require('../Images/stiker-B-1.png'), require('../Images/stiker-B-2.png'), require('../Images/stiker-B-3.png')];
	var arrC = [require('../Images/stiker-C-1.png'), require('../Images/stiker-C-2.png'), require('../Images/stiker-C-3.png')];
	var arrF = [require('../Images/stiker-F-1.png'), require('../Images/stiker-F-2.png'), require('../Images/stiker-F-3.png')];
	var randomItem;
	switch (score) {
		case 'A':
			return randomItem = arrA[Math.floor(Math.random() * arrA.length)];
		case 'B':
			return randomItem = arrB[Math.floor(Math.random() * arrB.length)];
		case 'C':
			return randomItem = arrC[Math.floor(Math.random() * arrC.length)];
		case 'F':
			return randomItem = arrF[Math.floor(Math.random() * arrF.length)];
		default:
			break;
	}
}

export function getThumnail() {
	let arrA = [
		require('../Images/icon/ic-orang-1.png'),
		require('../Images/icon/ic-orang-2.png'),
		require('../Images/icon/ic-orang-3.png'),
		require('../Images/icon/ic-orang-4.png'),
		require('../Images/icon/ic-orang-5.png'),
		require('../Images/icon/ic-orang-6.png'),
		require('../Images/icon/ic-orang-7.png')];

	return randomItem = arrA[Math.floor(Math.random() * arrA.length)];
}

export function getPhoto(imageName) {
	if (imageName !== null) {
		let isImageContain = RNFS.exists("file://" + imageName);
		if (isImageContain) {
			return "file://" + imageName;
		}
		else {
			let arrA = [
				require('../Images/icon/ic-orang-1.png'),
				require('../Images/icon/ic-orang-2.png'),
				require('../Images/icon/ic-orang-3.png'),
				require('../Images/icon/ic-orang-4.png'),
				require('../Images/icon/ic-orang-5.png'),
				require('../Images/icon/ic-orang-6.png'),
				require('../Images/icon/ic-orang-7.png')];

			return arrA[Math.floor(Math.random() * arrA.length)];
		}
	}
	return null;

}

export function getCalculateTime(date1, date2) {
	//date1 is today
	// var today = new Date();
	// var Christmas = new Date("12-25-2012");
	// var diffMs = (Christmas - today); // milliseconds between now & Christmas
	// var diffDays = Math.floor(diffMs / 86400000); // days
	// var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	// var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
	// alert(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");

	var diffMs = (date1 - date2); //millisecond between now and last
	var diffDays = Math.floor(diffMs / 86400000); // days
	var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
	diffMins = Math.round(60 - diffMins);

	return diffMins
}

export async function getPermission() {
	try {
		const phone = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
			{
				'title': 'ReactNativeCode wants to READ_PHONE_STATE',
				'message': 'ReactNativeCode App needs access to your personal data. '
			}
		);
		const camera = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA,
			{
				'title': 'ReactNativeCode wants to CAMERA',
				'message': 'ReactNativeCode App needs access to your personal data. '
			}
		);
		const storage = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			{
				'title': 'ReactNativeCode wants to READ_EXTERNAL_STORAGE',
				'message': 'ReactNativeCode App needs access to your personal data. '
			}
		);
		const location = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				'title': 'ReactNativeCode wants to ACCESS_FINE_LOCATION',
				'message': 'ReactNativeCode App needs access to your personal data. '
			}
		);
		const storageWrite =  await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE ,
			{
			  'title': 'ReactNativeCode wants to WRITE_EXTERNAL_STORAGE',
			  'message': 'ReactNativeCode App needs access to your personal data. '
			}
		);
		if (phone === PermissionsAndroid.RESULTS.GRANTED && camera === PermissionsAndroid.RESULTS.GRANTED &&
			storage === PermissionsAndroid.RESULTS.GRANTED && location === PermissionsAndroid.RESULTS.GRANTED && storageWrite) {
			return true;
		}
	} catch (e) {
		console.warn(e)
		return false;
	}
}

export function getFileFromDirectory(path) {
	RNFS.readDir(path)
		.then((result) => {
			console.log('GOT RESULT', result);
			return Promise.all([RNFS.stat(result[0].path), result[0].path]);
		}).then((statResult) => {
			if (statResult[0].isFile()) {
				return RNFS.readFile(statResult[1], 'utf8');
			}
			return 'no file';
		}).then((contents) => {
			console.log(contents);
		})
		.catch((err) => {
			console.log(err.message, err.code);
		});
}

export function getUUID() {
	return uuid.v4();
}

export async function getTodayDateFromGPS(format) {
	var response = { fetchLocation: false };
	var getPosition = function (options) {
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}

	await getPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 })
		.then((position) => {
			response = { fetchLocation: true, currTimeStamp: position.timestamp };
		})
		.catch((err) => {
			response = { fetchLocation: false, msg: err.message };
		});
	if (response.fetchLocation) {
		let currentTimestamp = convertTimestampToDate(response.currTimeStamp, format);
		return currentTimestamp;
	}
	else {
		return response;
	}
}

export function getTodayDate(format) {
	var tgl = moment().format(format)
	return tgl;
}

export function dateDisplayMobile(date) {
	var format = moment(date).format('DD MMM YYYY kk:mm')
	return format;
}

export function dateDisplayMobileWithoutHours(date) {
	var format = moment(date).format('DD MMM YYYY')
	return format;
}

export function changeFormatDate(value, format) {

	var result = '';
	value = value.replace(/-/g, "");
	value = value.replace(/:/g, "");
	value = value.replace(/ /g, "");

	if (value == 'now') {
		value = momentTimezone(new Date()).tz("Asia/Jakarta").format("YYYYMMDDHHmmss");
	}

	switch (format) {
		case 'YYYYMMDD':
			if (value.length == 14 || value.length == 8) {
				result = value.substr(0, 4) + value.substr(4, 2) + value.substr(6, 2);
				result = value;
			}
			else {
				result = '';
			}
			break;
		case 'YYYY-MM-DD':
			if (value.length == 14 || value.length == 8) {
				result = value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2);
			}
			else {
				result = '';
			}
			break;
		case 'YYYYMMDDhhmmss':
			if (value.length == 14) {
				result = value.substr(0, 4) + value.substr(4, 2) + value.substr(6, 2) + value.substr(8, 2) + value.substr(10, 2) + value.substr(12, 2);
			}
			else {
				result = '';
			}
			break;
		case 'YYYY-MM-DD hh-mm-ss':
			if (value.length == 14) {
				result = value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) + ' ' + value.substr(8, 2) + ':' + value.substr(10, 2) + ':' + value.substr(12, 2);
			}
			else {
				result = '';
			}
			break;
	}
	return result;
};

export function convertTimestampToDate(timestamp, format) {
	var dateString = moment(timestamp).format(format);
	// const formatted = moment(timestamp).format('L'); //MM/DD/YYYY
	return dateString;
}

export async function request_READ_PHONE_STATE() {

	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
			{
				'title': 'ReactNativeCode wants to READ_PHONE_STATE',
				'message': 'ReactNativeCode App needs access to your personal data. '
			}
		)
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {

			Alert.alert("Permission Granted.");
		}
		else {

			Alert.alert("Permission Not Granted");

		}
	} catch (err) {
		console.warn(err)
	}
}

export function formatRp(num, fixed = 0) {
	num = parseFloat(num);
	var p = num.toFixed(fixed).split('.');
	return (
		'Rp ' +
		p[0]
			.split('')
			.reverse()
			.reduce(function (acc, num, i, orig) {
				return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc;
			}, '') +
		(isNil(p[1]) ? '' : ',' + p[1])
	);
}

export function toTitleCase(str) {
	if (isNil(str) || isEmpty(str)) return '';
	let newstr = str.split('_').join(" ");
	return newstr.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function formatRpWithoutRp(num, fixed = 0) {
	const brand = DeviceInfo.getBrand() == "unknown" ? "emulator" : DeviceInfo.getBrand();
	if (brand == "Xiaomi") return num.toString();

	num = parseFloat(num);
	var p = num.toFixed(fixed).split('.');
	return (
		p[0]
			.split('')
			.reverse()
			.reduce(function (acc, num, i, orig) {
				return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc;
			}, '') +
		(isNil(p[1]) ? '' : ',' + p[1])
	);
}

export function parsingPathToMessage(msg) {
	return toTitleCase(msg.split(".").join(" ").split("/").join(""));
}

export function validateTelephone(hp) {
	var re = /^((?:\+62|62)|0)[2-9]{1}[0-9]+$/;
	return re.test(hp);
};


export function debounce(callback, wait, context = this) {
	let timeout = null;
	let callbackArgs = null;

	const later = () => callback.apply(context, callbackArgs);

	return function () {
		callbackArgs = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

const {
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
	if (Platform.OS === 'ios') {
		return Math.round(PixelRatio.roundToNearestPixel(size))
	} else {
		return Math.round(PixelRatio.roundToNearestPixel(size)) - 2
	}
}

export function getFormatDate(time) {
	var day = time.getDay();
	var month = time.getMonth();
	var date = time.getDate();
	var year = time.getFullYear();
	var minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
	var clock = time.getHours() + ":" + minute

	switch (day) {
		case 0:
			day = 'Minggu';
			break;
		case 1:
			day = 'Senin';
			break;
		case 2:
			day = 'Selasa';
			break;
		case 3:
			day = 'Rabu';
			break;
		case 4:
			day = 'Kamis';
			break;
		case 5:
			day = 'Jumat';
			break;
		case 6:
			day = 'Sabtu';
			break;
		case 7:
			day = 'Minggu';
			break;
	}

	switch (month) {
		case 0:
			month = 'Januari';
			break;
		case 1:
			month = 'Februari';
			break;
		case 2:
			month = 'Maret';
			break;
		case 3:
			month = 'April';
			break;
		case 4:
			month = 'Mei';
			break;
		case 5:
			month = 'Juni';
			break;
		case 6:
			month = 'Juli';
			break;
		case 7:
			month = 'Agustus';
			break;
		case 8:
			month = 'Sepember';
			break;
		case 9:
			month = 'Oktober';
			break;
		case 10:
			month = 'November';
			break;
		case 11:
			month = 'Desember';
			break;
	}

	return `${day}, ${date} ${month} ${year}, ${clock}`
}

export function syncDays() {
	let latestSync = TaskServices.getAllData('TR_SYNC_LOG');

	let divDays = 0;
	if (latestSync.length > 0) {
		latestSyncDay = new Date(latestSync.max("SYNC_TIME"));
		console.log('latestSyncDay : ', latestSyncDay)
		divDays = Math.floor((new Date() - latestSyncDay) / (1000 * 60 * 60 * 24));
	}

	return divDays;
}

export function notifInbox() {
	let notifCount = TaskServices.getAllData('TR_NOTIFICATION').filtered('NOTIFICATION_STATUS=0').length;

	if (notifCount > 99) {
		notifCount = 99
	}

	return notifCount;
}

export function isNotUserMill() {
    const data = TaskServices.getAllData('TR_LOGIN')
    if (data != undefined) {
      if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
        return false
      } else {
        return true
      }
    }
  }
