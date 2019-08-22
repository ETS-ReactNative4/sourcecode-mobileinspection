import {call, put} from 'redux-saga/effects';
import KriteriaActions from '../Redux/KriteriaRedux';

export function* getKriteria(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getKriteria, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^GET ALL KRITERIA^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(KriteriaActions.kriteriaFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^SUCCESS KRITERIA^^^');
                    yield put(KriteriaActions.kriteriaSuccess(response.data.data));
                    break;
                default:
                    yield put(KriteriaActions.kriteriaFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(KriteriaActions.kriteriaFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }

}

export function* postKriteria(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postKriteria, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST KRITERIA ^^^');
        }

        if (response.ok) {
            yield put(KriteriaActions.kriteriaSuccess({ payload: response.data, change: true }));
        } else {
            yield put(KriteriaActions.kriteriaFailure({
                path: 'Complete Post Content Label',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}

