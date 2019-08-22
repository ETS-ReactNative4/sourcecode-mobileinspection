import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	tmPost: ['data'],
	tmSuccess: ['payload'],
	tmFailure: null
});

export const TMobileTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingMobile: null,
	error: null,
});

/* ------------- Selectors ------------- */

export const TMobileSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const postMobileSync = (state, { data }) => state.merge({ fetchingMobile: true, data, region: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingMobile: false, error: null, region: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingMobile: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingMobile: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.TM_POST]: postMobileSync,
	[Types.TM_SUCCESS]: success,
	[Types.TM_FAILURE]: failure
});
