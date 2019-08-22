import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	serverTimeRequest: null,
	serverTimePost: ['data'],
	serverTimeSuccess: ['payload'],
	serverTimeFailure: null,
	resetServerTime: null
});

export const ServerTimeTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingServerTime: null,
	error: null,
	serverTime: null,
});

/* ------------- Selectors ------------- */

export const ServerTimeSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingServerTime: true, error: null, serverTime: null });
export const postServerTime = (state, { data }) => state.merge({ fetchingServerTime: true, data, serverTime: null });
export const reset = (state) => state.merge({ fetchingServerTime: null, error: null, serverTime: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingServerTime: false, error: null, serverTime: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingServerTime: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.SERVER_TIME_REQUEST]: request,
	[Types.SERVER_TIME_POST]: postServerTime,
	[Types.SERVER_TIME_SUCCESS]: success,
	[Types.SERVER_TIME_FAILURE]: failure,
	[Types.RESET_SERVER_TIME]: reset
});
