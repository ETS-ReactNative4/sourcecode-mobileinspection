import { call, put } from 'redux-saga/effects';
import EstActions from '../Redux/EstRedux';

export function* getEst(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getEst, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL EST ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(EstActions.estFailure('Paramater Salah'));
                    break;
                case true:
    
                    console.log('^^^ SUCCESS EST ^^^');
                    yield put(EstActions.estSuccess(response.data.data));
                    break;
                default:
                    yield put(EstActions.estFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(EstActions.estFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }    

}

export function* postEst(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postEst, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST EST ^^^');
        }
    
        if (response.ok) {
            yield put(EstActions.estSuccess({ payload: response.data, change: true }));
        } else {
            yield put(EstActions.estFailure({
                path: 'Complete Post Est',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

