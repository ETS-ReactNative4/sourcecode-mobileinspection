import { call, put } from 'redux-saga/effects';
import InspeksiActions from '../Redux/InspeksiRedux';

export function* postInspeksiHeader(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postInspeksiHeader, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST INSPEKSI ^^^');
        }
    
        if (response.ok) {
            yield put(InspeksiActions.inspeksiSuccess({ payload: response.data, change: true }));
        } else {
            yield put(InspeksiActions.inspeksiFailed({
                path: 'Complete Post Inspeksi Header',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

export function* postInspeksiDetail(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postInspeksiDetail, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST INSPEKSI DETAIL^^^');
        }
    
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(FindingActions.inspeksiFailed('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS INSPEKSI DETAIL ^^^');
                    yield put(InspeksiActions.inspeksiSuccess({ payload: response.data, change: true }));
                    break;
                default:
                    yield put(InspeksiActions.inspeksiFailed('Unknown responseType'));
                    break;
            }
        } else {
            yield put(InspeksiActions.inspeksiFailed({
                path: 'Complete Post Inspeksi Detail',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

export function* postInspeksiTrackingPath(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postInspeksiTrackingPath, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST INSPEKSI TRACKING PATH^^^');
        }

        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(InspeksiActions.inspeksiFailed('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS INSPEKSI TRACKING PATH ^^^');
                    yield put(InspeksiActions.inspeksiSuccess({ payload: response.data, change: true }));
                    break;
                default:
                    yield put(InspeksiActions.inspeksiFailed('Unknown responseType'));
                    break;
            }
        } else {
            yield put(InspeksiActions.inspeksiFailed({
                path: 'Complete Post Inspeksi Detail',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}

export function* postFindingData(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postFindingData, data);
    
        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST FINDING DATA');
        }
    
        if (response.ok) {
            yield put(InspeksiActions.inspeksiSuccess({ payload: response.data, change: true }));
        } else {
            yield put(InspeksiActions.inspecsiFailed({
                path: 'Complete Post Finding Data',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }
    
}
