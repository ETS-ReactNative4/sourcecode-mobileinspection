import { call, put } from 'redux-saga/effects';
import RegionActions from '../Redux/RegionRedux';
import TaskServices from '../Database/TaskServices'

export function* getRegion(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getRegion, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL REGION ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(RegionActions.regionFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ Succes REGION ^^^');
                    yield put(RegionActions.regionSuccess(response.data.data));
                    break;
                default:
                    yield put(RegionActions.regionFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(RegionActions.regionFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }

}

