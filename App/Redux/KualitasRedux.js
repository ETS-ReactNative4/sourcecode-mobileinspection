import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	kualitasRequest: null,
	kualitasPost: ['data'],
	kualitasSuccess: ['payload'],
	kualitasFailure: null,
	resetKualitas: null
});

export const KualitasTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingKualitas: null,
	error: null,
	kualitas: null,
});

/* ------------- Selectors ------------- */

export const KualitasSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingKualitas: true, error: null, kualitas: null });
export const postKwalitas = (state, { data }) => state.merge({ fetchingKualitas: true, data, kualitas: null });
export const reset = (state) => state.merge({ fetchingKualitas: null, error: null, kualitas: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingKualitas: false, error: null, kualitas: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingKualitas: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.KUALITAS_REQUEST]: request,
	[Types.KUALITAS_POST]: postKwalitas,
	[Types.KUALITAS_SUCCESS]: success,
	[Types.KUALITAS_FAILURE]: failure,
	[Types.RESET_KUALITAS]: reset
});
