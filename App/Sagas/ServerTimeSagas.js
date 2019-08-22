import {call, put} from 'redux-saga/effects';
import ServerTimeActions from '../Redux/ServerTimeRedux';

export function* getServerTime(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getServerTime, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET Server Time ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(ServerTimeActions.serverTimeFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS Server Time ^^^');
                    yield put(ServerTimeActions.serverTimeSuccess(response.data.data));
                    break;
                default:
                    yield put(ServerTimeActions.serverTimeFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(ServerTimeActions.serverTimeFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }


}
