import { call, put } from 'redux-saga/effects';
import CategoryActions from '../Redux/CategoryRedux';
import TaskServices from '../Database/TaskServices'

export function* getCategory(api, action) {
    const { data } = action;
    const response = yield call(api.getCategory, data);

    if (typeof atob !== 'undefined') {
        console.log(response);
        console.log('^^^ GET ALL CATEGORY ^^^');
    }
    if(response.ok){
        switch (response.data.status) {
            case false:
                yield put(BlockAction.categoryFailure('Paramater Salah'));
                break;
            case true:
                console.log('^^^ SUCCESS Category ^^^');
                yield put(CategoryActions.categorySuccess(response.data.data));
                break;
            default:
                yield put(CategoryActions.categoryFailure('Unknown responseType'));
                break;
        }
    }
}
