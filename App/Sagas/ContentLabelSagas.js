import { call, put } from 'redux-saga/effects';
import ContentLabelActions from '../Redux/ContentLabelRedux';

export function* getContentLabel(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getContentLabel, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^GET ALL CONTENT LABEL^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(ContentLabelActions.contentLabelFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^SUCCESS CONTENT LABEL^^^');
                    yield put(ContentLabelActions.contentLabelSuccess(response.data.data));
                    break;
                default:
                    yield put(ContentLabelActions.contentLabelFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(ContentLabelActions.contentLabelFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
}

export function* postContentLabel(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postContentLabel, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST CONTENT LABEL ^^^');
        }

        if (response.ok) {
            yield put(ContentLabelActions.contentLabelSuccess({ payload: response.data, change: true }));
        } else {
            yield put(ContentLabelActions.contentLabelFailure({
                path: 'Complete Post Content Label',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

