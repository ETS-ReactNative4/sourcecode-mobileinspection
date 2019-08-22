import {call, put} from 'redux-saga/effects';
import TMobileActions from '../Redux/TMobileRedux';

export function* postTMobileSync(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postRegion, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST Mobile Sync ^^^');
        }

        if (response.ok) {
            yield put(TMobileActions.tmSuccess({ payload: response.data, change: true }));
        } else {
            yield put(TMobileActions.tmFailure({
                path: 'Complete Post Region',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}
