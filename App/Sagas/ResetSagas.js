import {call, put} from 'redux-saga/effects';
import ResetActions from '../Redux/ResetRedux';

export function* postReset(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postReset, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST Reset Sync ^^^');
        }

        if (response.ok) {
            yield put(ResetActions.resetSuccess({ payload: response.data, change: true }));
        } else {
            yield put(ResetActions.resetFailure({
                path: 'Complete Post Region',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}
