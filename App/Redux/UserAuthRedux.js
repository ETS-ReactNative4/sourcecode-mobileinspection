import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	userAuthRequest: null,
	userAuthPost: ['data'],
	userAuthSuccess: ['payload'],
	userAuthFailure: null
});

export const UserAuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	userAuth: null
});

/* ------------- Selectors ------------- */

export const UserAuthSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetching: true, error: null, userAuth: null });
export const postUserAuth = (state, { data }) => state.merge({ fetching: true, data, userAuth: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, userAuth: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.USER_AUTH_REQUEST]: request,
	[Types.USER_AUTH_POST]: postUserAuth,
	[Types.USER_AUTH_SUCCESS]: success,
	[Types.USER_AUTH_FAILURE]: failure
});
