import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	kriteriaRequest: null,
	kriteriaPost: ['data'],
	kriteriaSuccess: ['payload'],
	kriteriaFailure: null,
	resetKriteria: null
});

export const KriteriaTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingKriteria: null,
	error: null,
	kriteria: null
});

/* ------------- Selectors ------------- */

export const KriteriaSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetchingKriteria: true, error: null, kriteria: null });
export const postKriteria = (state, { data }) => state.merge({ fetchingKriteria: true, data, kriteria: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingKriteria: false, error: null, kriteria: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingKriteria: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingKriteria: null, kriteria: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.KRITERIA_REQUEST]: request,
	[Types.KRITERIA_POST]: postKriteria,
	[Types.KRITERIA_SUCCESS]: success,
	[Types.KRITERIA_FAILURE]: failure,
	[Types.RESET_KRITERIA]: reset
});
