import { call, put } from 'redux-saga/effects';
import ContactActions from '../Redux/ContactRedux';
import TaskServices from '../Database/TaskServices'

export function* getContact(api, action) {
    try {
        const { data } = action;
        const response = yield call(api.getContact, data);    

        if (typeof atob !== 'undefined') {
            console.log(response);
            console.log('^^^ GET ALL CONTACT ^^^');
        }
        if (response.data.status && response.data.data.length > 0) {
            yield put(ContactActions.contactSuccess(response.data));
        } else {
            yield put(ContactActions.contactFailure(response.problem));
        }
    } catch (error) {
        alert(error)
    }
    
}
