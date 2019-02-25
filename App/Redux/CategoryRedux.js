import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	categoryRequest: null,
	categorySuccess: ['payload'],
	categoryFailure: null,
	resetCategory: null
});

export const CategoryTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingCategory: null,
	error: null,
	category: null
});

/* ------------- Selectors ------------- */

export const CategorySelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetchingCategory: true, error: null, category: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingCategory: false, error: null, category: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingCategory: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingCategory: null, error: null, category: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.CATEGORY_REQUEST]: request,
	[Types.CATEGORY_SUCCESS]: success,
	[Types.CATEGORY_FAILURE]: failure,
	[Types.RESET_CATEGORY]: reset
});
