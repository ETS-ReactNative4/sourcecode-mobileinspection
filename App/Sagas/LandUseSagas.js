import { call, put } from 'redux-saga/effects';
import LandUseActions from '../Redux/LandUseRedux';

export function* getLandUse(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getLandUse, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL LAND USE ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(LandUseActions.landUseFailure('Paramater Salah'));
                    break;
                case true:

                    console.log('^^^ SUCCESS LAND USE ^^^');
                    yield put(LandUseActions.landUseSuccess(response.data.data));
                    break;
                default:
                    yield put(LandUseActions.landUseFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(LandUseActions.landUseFailure(response.problem));
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

