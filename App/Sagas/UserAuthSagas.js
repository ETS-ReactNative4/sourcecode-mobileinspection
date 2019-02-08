import { call, put } from 'redux-saga/effects';
import UserAuthAction from '../Redux/UserAuthRedux';

export function* getUserAuth(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getUserAuth, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL USER AUTH ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(UserAuthAction.userAuthFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ Succes USER AUTH ^^^');
                    yield put(UserAuthAction.userAuthSuccess(response.data.data));
                    break;
                default:
                    yield put(UserAuthAction.userAuthFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(UserAuthAction.userAuthFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
    
}

export function* postUserAuth(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postUserAuth, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST USER AUTH ^^^');
        }

        if (response.ok) {
            yield put(UserAuthAction.userAuthSuccess({ payload: response.data, change: true }));
        } else {
            yield put(UserAuthAction.userAuthFailure({
                path: 'Complete Post User Auth',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

