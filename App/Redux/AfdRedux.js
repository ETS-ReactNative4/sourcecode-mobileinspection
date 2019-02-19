import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	afdRequest: null,
	afdPost: ['data'],
	afdSuccess: ['payload'],
	afdFailure: null,
	resetAfd: null
});

export const AfdTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingAfd: null,
	error: null,
	afd: null,
});

/* ------------- Selectors ------------- */

export const AfdSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingAfd: true, error: null, afd: null });
export const postAfd = (state, { data }) => state.merge({ fetchingAfd: true, data, afd: null });
export const reset = (state) => state.merge({ fetchingAfd: null, afd: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingAfd: false, error: null, afd: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingAfd: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.AFD_REQUEST]: request,
	[Types.AFD_POST]: postAfd,
	[Types.AFD_SUCCESS]: success,
	[Types.AFD_FAILURE]: failure,
	[Types.RESET_AFD]: reset
});
