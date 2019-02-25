import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	landUseRequest: null,
	landUsePost: ['data'],
	landUseSuccess: ['payload'],
	landUseFailure: null,
	resetLandUse: null
});

export const LandUseTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingLandUse: null,
	error: null,
	landUse: null
});

/* ------------- Selectors ------------- */

export const LandUseSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingLandUse: true, error: null, landUse: null });
export const postLandUse = (state, { data }) => state.merge({ fetchingLandUse: true, data, landUse: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingLandUse: false, error: null, landUse: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingLandUse: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingLandUse: null, error: null, landUse: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.LAND_USE_REQUEST]: request,
	[Types.LAND_USE_POST]: postLandUse,
	[Types.LAND_USE_SUCCESS]: success,
	[Types.LAND_USE_FAILURE]: failure,
	[Types.RESET_LAND_USE]: reset
});
