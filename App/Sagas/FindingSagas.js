import {call, put} from 'redux-saga/effects';
import FindingActions from '../Redux/FindingRedux';

export function* getFinding(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getFinding, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL FINDING ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(FindingActions.findingFailure('Paramater Salah'));
                    break;
                case true:

                    console.log('^^^ SUCCESS FINDING ^^^');
                    yield put(FindingActions.findingSuccess(response.data.data));
                    break;
                default:
                    yield put(FindingActions.findingFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(FindingActions.findingFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }


}

export function* postFinding(api, action) {
    try {
        const { data } = action;
        console.log('data Param : ', data)
        const response = yield call(api.postFindingData, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST FINDING ^^^');
        }

        if (response.ok) {
            console.log('response');
            console.log(response)
            yield put(FindingActions.findingSuccess({ payload: response.data, change: true }));
        } else {
            yield put(FindingActions.findingFailure({
                path: 'Complete Post Finding',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}

