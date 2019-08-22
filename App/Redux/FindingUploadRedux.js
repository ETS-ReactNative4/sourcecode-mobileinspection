import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	findingPostData:['data'],
	berhasilKirim: ['payload'],
	gagalKirim: null
});

export const FindingUploadTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingFindingPost: null,
	error: null,
	finding: null
});

/* ------------- Selectors ------------- */

export const InspeksiSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const postFindingData = (state, { data }) => state.merge({ fetchingFindingPost: true, data, finding: null });

// successful api lookup

export const successFindingPost = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingFindingPost: false, error: null, finding: payload });
};

// Something went wrong somewhere.
export const failureFindingPost = state => state.merge({ fetchingFindingPost: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
	[Types.FINDING_POST_DATA]: postFindingData,
	[Types.BERHASIL_KIRIM]: failureFindingPost,
	[Types.GAGAL_KIRIM]: successFindingPost

});
