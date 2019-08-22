import {call, put} from 'redux-saga/effects';
import ContentActions from '../Redux/ContentRedux';

export function* getContent(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getContent, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL CONTENT ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(ContentActions.contentFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS CONTENT ^^^');
                    yield put(ContentActions.contentSuccess(response.data.data));
                    break;
                default:
                    yield put(ContentActions.contentFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(ContentActions.contentFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }


}

export function* postContent(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postContent, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST CONTENT ^^^');
        }

        if (response.ok) {
            yield put(ContentActions.contentSuccess({ payload: response.data, change: true }));
        } else {
            yield put(ContentActions.contentFailure({
                path: 'Complete Post Content',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}

