import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	regionRequest: ['data'],
	regionPost: ['data'],
	regionSuccess: ['payload'],
	regionFailure: null
});

export const RegionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	region: null
});

/* ------------- Selectors ------------- */

export const RegionSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetching: true, error: null, region: null });
export const postRegion = (state, { data }) => state.merge({ fetching: true, data, region: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, region: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.REGION_REQUEST]: request,
	[Types.REGION_POST]: postRegion,
	[Types.REGION_SUCCESS]: success,
	[Types.REGION_FAILURE]: failure
});