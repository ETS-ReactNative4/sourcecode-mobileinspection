import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	contentLabelRequest: null,
	contentLabelPost: ['data'],
	contentLabelSuccess: ['payload'],
	contentLabelFailure: null,
	resetContentLabel: null
});

export const ContentLabelTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingContentLabel: null,
	error: null,
	contentLabel: null
});

/* ------------- Selectors ------------- */

export const ContentSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingContentLabel: true, error: null, contentLabel: null });
export const postContentLabel = (state, { data }) => state.merge({ fetchingContentLabel: true, data, contentLabel: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingContentLabel: false, error: null, contentLabel: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingContentLabel: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingContentLabel: null, contentLabel: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.CONTENT_LABEL_REQUEST]: request,
	[Types.CONTENT_LABEL_POST]: postContentLabel,
	[Types.CONTENT_LABEL_SUCCESS]: success,
	[Types.CONTENT_LABEL_FAILURE]: failure,
	[Types.RESET_CONTENT_LABEL]: reset
});
