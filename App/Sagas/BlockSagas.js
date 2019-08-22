import {call, put} from 'redux-saga/effects';
import BlockAction from '../Redux/BlockRedux';

export function* getBlock(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getBlock, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL BLOCK ^^^');
        }

        if (response.ok) {
            switch (response.data.status) {
                case false:
                    yield put(BlockAction.blockFailure('Paramater Salah'));
                    break;
                case true:
                    console.log('^^^ SUCCESS BLOCK ^^^');
                    yield put(BlockAction.blockSuccess(response.data.data));
                    break;
                default:
                    yield put(BlockAction.blockFailure('Unknown responseType'));
                    break;
            }
        } else {
            yield put(BlockAction.blockFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
}

export function* postBlock(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.postBlock, data);

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ POST BLOCK ^^^');
        }

        if (response.ok) {
            yield put(BlockAction.blockSuccess({ payload: response.data, change: true }));
        } else {
            yield put(BlockAction.blockFailure({
                path: 'Complete Post Block',
                message: response.data.message ? response.data.message : '',
                response
            }));
        }
    } catch (error) {
        alert(error)
    }

}

