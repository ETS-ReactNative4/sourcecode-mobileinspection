import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	contactRequest: null,
	contactSuccess: ['payload'],
	contactFailure: null,
	resetContact: null
});

export const ContactTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingContact: null,
	error: null,
	contact: null
});

/* ------------- Selectors ------------- */

export const ContactSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetchingContact: true, error: null, contact: null });
export const reset = (state) => state.merge({ fetchingContact: null, contact: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingContact: false, error: null, contact: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingContact: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.CONTACT_REQUEST]: request,
	[Types.CONTACT_SUCCESS]: success,
	[Types.CONTACT_FAILURE]: failure,
	[Types.RESET_CONTACT]: reset
});
