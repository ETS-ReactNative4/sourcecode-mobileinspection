import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	compRequest: null,
	compPost: ['data'],
	compSuccess: ['payload'],
	compFailure: null,
	resetComp: null
});

export const CompTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingComp: null,
	error: null,
	comp: null
});

/* ------------- Selectors ------------- */

export const CompSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingComp: true, error: null, comp: null });
export const postComp = (state, { data }) => state.merge({ fetchingComp: true, data, comp: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingComp: false, error: null, comp: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingComp: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingComp: null, error: null, comp: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.COMP_REQUEST]: request,
	[Types.COMP_POST]: postComp,
	[Types.COMP_SUCCESS]: success,
	[Types.COMP_FAILURE]: failure,
	[Types.RESET_COMP]: reset
});
