import { call, put } from 'redux-saga/effects';
import AfdActions from '../Redux/AfdRedux';

export function* getAfd(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getAfd, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL AFD ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(AfdActions.afdFailure('Paramater Salah'));
                    break;
                case true:
    
                    console.log('^^^ SUCCESS AFD ^^^');
                    yield put(AfdActions.afdSuccess(response.data.data));
                    break;
                default:
                    yield put(AfdActions.afdFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(AfdActions.afdFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
    

}

export function* postAfd(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postAfd, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST AFD ^^^');
        }
    
        if (response.ok) {
            yield put(AfdActions.afdSuccess({ payload: response.data, change: true }));
        } else {
            yield put(AfdActions.afdFailure({
                path: 'Complete Post Afd',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

