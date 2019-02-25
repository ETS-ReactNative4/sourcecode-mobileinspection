import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	regionRequest: null,
	regionSuccess: ['payload'],
	regionFailure: null,
	resetRegion: null
});

export const RegionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingRegion: null,
	error: null,
	region: null
});

/* ------------- Selectors ------------- */

export const RegionSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingRegion: true, error: null, region: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingRegion: false, error: null, region: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingRegion: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingRegion: null, error: null, region: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.REGION_REQUEST]: request,
	[Types.REGION_SUCCESS]: success,
	[Types.REGION_FAILURE]: failure,
	[Types.RESET_REGION]: reset
});
