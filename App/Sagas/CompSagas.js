import {call, put} from 'redux-saga/effects';
import CompActions from '../Redux/CompRedux';

export function* getComp(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getComp, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL COMP ^^^');
        }
        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(CompActions.compFailure('Paramater Salah'));
                    break;
                case true:

                    console.log('^^^ SUCCESS Comp ^^^');
                    yield put(CompActions.compSuccess(response.data.data));
                    break;
                default:
                    yield put(CompActions.compFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(CompActions.compFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }


}

export function* postComp(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postComp, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST COMP ^^^');
        }

        if (response.ok) {
            yield put(CompActions.compSuccess({ payload: response.data, change: true }));
        } else {
            yield put(CompActions.compFailure({
                path: 'Complete Post Comp',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}

