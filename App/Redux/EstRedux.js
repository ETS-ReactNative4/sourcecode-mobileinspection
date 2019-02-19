import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	estRequest: null,
	estPost: ['data'],
	estSuccess: ['payload'],
	estFailure: null,
	resetEst: null
});

export const EstTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingEst: null,
	error: null,
	est: null
});

/* ------------- Selectors ------------- */

export const EstSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingEst: true, error: null, est: null });
export const postEst = (state, { data }) => state.merge({ fetchingEst: true, data, est: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingEst: false, error: null, est: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingEst: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingEst: null, est: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.EST_REQUEST]: request,
	[Types.EST_POST]: postEst,
	[Types.EST_SUCCESS]: success,
	[Types.EST_FAILURE]: failure,
	[Types.RESET_EST]: reset
});
