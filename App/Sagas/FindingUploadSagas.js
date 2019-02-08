import { call, put } from 'redux-saga/effects';
import UploadActions from '../Redux/FindingUploadRedux';

export function* postFindingData(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postFindingData, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST FINDING DATA');
        }

        if (response.ok) {
            yield put(UploadActions.berhasilKirim({ payload: response.data, change: true }));
        } else {
            yield put(UploadActions.gagalKirim({
                path: 'Complete Post Finding Data',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}