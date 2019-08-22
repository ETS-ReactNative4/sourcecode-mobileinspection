import {call, put} from 'redux-saga/effects';
import AuthActions from '../Redux/AuthRedux';
import {isNil} from 'ramda';

export function* getAuth(api, action) {
	try {
		const { data } = action;
		const response = yield call(api.login, data);

		if (typeof atob !== 'undefined') {
			console.log(response);
			console.log('^^^ GET AUTH ^^^');
		}
		if (response.ok) {
			switch (response.data.status) {
				case false:
					if (response.data.message == 'Request Timeout') {
						yield put(AuthActions.authFailure('Masalah jaringan coba lagi'));
					} else {
						yield put(AuthActions.authFailure('Username atau Password Salah !'));
					}
					break;
				case true:
					yield put(AuthActions.authSuccess(response.data.data));
					break;
				default:
					yield put(AuthActions.authFailure('Unknown responseType'));
					break;
			}
		} else {
			if (response.data !== null) {
				if (response.data.status == 500) {
					return yield put(AuthActions.authFailure({
						path: 'Sign In',
						message: response.data.message, response
					}));
				}
				yield put(AuthActions.authFailure('Username atau Password Salah !'));
			} else {
				yield put(AuthActions.authFailure('Terjadi Kesalahan Koneksi !'));
			}
		}
	} catch (error) {
		alert(error)
	}

}

// export function* getAuthLogOut(api, action) {
// 	const { data } = action;
// 	const response = yield call(api.logout, data);

// 	if (typeof atob !== 'undefined') {
// 		console.log(response);
// 		console.log('^^^ GET AUTH LOGOUT^^^');
// 	}
// 	if (response.ok) {
// 		switch (response.data.status) {
// 			case false:
// 				yield put(AuthActions.authFailure('Username atau Password Salah !'));
// 				break;
// 			case true:
// 				console.log(response);
// 				yield put(AuthActions.authSuccess(response.data.data));
// 				break;
// 			default:
// 				yield put(AuthActions.authFailure('Unknown responseType'));
// 				break;
// 		}
// 	} else {
// 		if (response.data.status == 500) {
// 			return yield put(AuthActions.authFailure({
// 				path: 'Sign In',
// 				message: response.data.message, response
// 			}));
// 		}
// 		yield put(AuthActions.authFailure('Username atau Password Salah !'));
// 	}
// }

export function* userUpdate(api, action) {
	try {
		const { data } = action;
		const response = yield call(api.userUpdate, { userProfileDTO: data });

		if (typeof atob !== 'undefined') {
			console.log(response);
			console.log('^^^ USER UPDATE ^^^');
		}

		if (response.ok) {
			if (isNil(response.data.responseType)) yield put(AuthActions.authFailure('Invalid responseType'));
			else {
				switch (response.data.responseType) {
					case 'FAILED':
						yield put(AuthActions.authFailure(response.data.responseDesc));
						break;
					case 'SUCCESS':
						yield put(AuthActions.authSuccess(response.data));
						break;
					default:
						yield put(AuthActions.authFailure('Unknown responseType'));
						break;
				}
			}
		} else {
			yield put(AuthActions.authFailure(`${response.status} : Server error`));
		}
	} catch (error) {
		alert(error)
	}

}
