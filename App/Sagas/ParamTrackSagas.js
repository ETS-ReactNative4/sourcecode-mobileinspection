import {call, put} from 'redux-saga/effects';
import TrackActions from '../Redux/ParamTrackRedux';

export function* getInspeksiParamTrackingPath(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getInspeksiParamTrackingPath, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL PARAM TRACK ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(TrackActions.paramTrackFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS PARAM TRACKING PATH ^^^');
                    // yield put(TrackActions.paramTrackSuccess({ payload: response.data, change: true }));
                    yield put(TrackActions.paramTrackSuccess(response.data.data));
                    break;
                default:
                    yield put(TrackActions.paramTrackFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(TrackActions.inspeksiFailed({
                path: 'Complete Post Inspeksi Detail',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}
