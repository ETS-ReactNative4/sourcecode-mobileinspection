import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	paramTrackRequest: null,
	paramTrackSuccess: ['payload'],
	paramTrackFailure: null,
	resetParamTrack: null
});

export const ParamTrackTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingParamTrack: null,
	error: null,
	paramTrack: null
});

/* ------------- Selectors ------------- */

export const fetchingParamTrackSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetchingParamTrack: true, error: null, paramTrack: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingParamTrack: false, error: null, paramTrack: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingParamTrack: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingParamTrack: null, paramTrack: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.PARAM_TRACK_REQUEST]: request,
	[Types.PARAM_TRACK_SUCCESS]: success,
	[Types.PARAM_TRACK_FAILURE]: failure,
	[Types.RESET_PARAM_TRACK]: reset
});
