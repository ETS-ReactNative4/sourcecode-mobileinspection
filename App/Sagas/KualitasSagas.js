import { call, put } from 'redux-saga/effects';
import KualitasActions from '../Redux/KualitasRedux';

export function* getKualitas(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getKualitas, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL Kualitas ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(KualitasActions.kualitasFailure('Paramater Salah'));
                    break;
                case true:

                    console.log('^^^ SUCCESS KUALITAS ^^^');
                    yield put(KualitasActions.kualitasSuccess(response.data.data));
                    break;
                default:
                    yield put(KualitasActions.kualitasFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(KualitasActions.kualitasFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
    

}

export function* postLandUse(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postLandUse, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST LAND USE ^^^');
        }
    
        if (response.ok) {
            yield put(LandUseActions.landUseSuccess({ payload: response.data, change: true }));
        } else {
            yield put(LandUseActions.landUseFailure({
                path: 'Complete Post LandUse',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

