import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	findingRequest: null,
	findingPost: ['data'],
	findingSuccess: ['payload'],
	findingFailure: null,
	resetFinding: null
});

export const FindingTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingFinding: null,
	error: null,
	finding: null
});

/* ------------- Selectors ------------- */

export const FindingSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingFinding: true, error: null, finding: null });
export const postFinding = (state, { data }) => state.merge({ fetchingFinding: true, data, finding: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingFinding: false, error: null, finding: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingFinding: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingFinding: null, error: null, finding: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.FINDING_REQUEST]: request,
	[Types.FINDING_POST]: postFinding,
	[Types.FINDING_SUCCESS]: success,
	[Types.FINDING_FAILURE]: failure,
	[Types.RESET_FINDING]: reset
});
