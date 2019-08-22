import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	resetPost: ['data'],
	resetSuccess: ['payload'],
	resetFailure: null
});

export const ResetTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingReset: null,
	error: null,
});

/* ------------- Selectors ------------- */

export const ResetSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const postReset = (state, { data }) => state.merge({ fetchingReset: true, data, region: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingReset: false, error: null, region: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingReset: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.RESET_POST]: postReset,
	[Types.RESET_SUCCESS]: success,
	[Types.RESET_FAILURE]: failure
});
