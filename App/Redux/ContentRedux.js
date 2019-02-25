import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	contentRequest: null,
	contentPost: ['data'],
	contentSuccess: ['payload'],
	contentFailure: null,
	resetContent: null
});

export const ContentTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingContent: null,
	error: null,
	content: null
});

/* ------------- Selectors ------------- */

export const ContentSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingContent: true, error: null, content: null });
export const postContent = (state, { data }) => state.merge({ fetchingContent: true, data, content: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingContent: false, error: null, content: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingContent: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingContent: null, error: null, content: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.CONTENT_REQUEST]: request,
	[Types.CONTENT_POST]: postContent,
	[Types.CONTENT_SUCCESS]: success,
	[Types.CONTENT_FAILURE]: failure,
	[Types.RESET_CONTENT]: reset
});
