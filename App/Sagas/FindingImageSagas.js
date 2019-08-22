import {call, put} from 'redux-saga/effects';
import FindingImageActions from '../Redux/FindingImageRedux';

export function* getFindingImage(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getFindingImage, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL FINDING ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(FindingImageActions.findingImageFailure('Paramater Salah'));
                    break;
                case true:

                    console.log('^^^ SUCCESS FINDING ^^^');
                    yield put(FindingImageActions.findingImageSuccess(response.data.data));
                    break;
                default:
                    yield put(FindingImageActions.findingImageFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(FindingImageActions.findingImageFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }

}

