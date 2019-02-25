import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	findingImageRequest: null,
	findingImagePost: ['data'],
	findingImageSuccess: ['payload'],
	findingImageFailure: null,
	resetFindingImage: null
});

export const FindingImageTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingFindingImage: null,
	error: null,
	findingImage: null
});

/* ------------- Selectors ------------- */

export const FindingImageSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api

export const request = (state, { data }) => state.merge({ fetchingFindingImage: true, error: null, findingImage: null });
export const postFindingImage = (state, { data }) => state.merge({ fetchingFindingImage: true, data, findingImage: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingFindingImage: false, error: null, findingImage: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingFindingImage: false, error: true, payload: null });
export const reset = (state) => state.merge({ fetchingFindingImage: null, error: null, findingImage: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.FINDING_IMAGE_REQUEST]: request,
	[Types.FINDING_IMAGE_POST]: postFindingImage,
	[Types.FINDING_IMAGE_SUCCESS]: success,
	[Types.FINDING_IMAGE_FAILURE]: failure,
	[Types.RESET_FINDING_IMAGE]: reset
});
