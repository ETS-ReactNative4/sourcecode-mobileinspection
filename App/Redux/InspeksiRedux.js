import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	inspeksiPostHeader: ['data'],
	inspeksiPostDetail: ['data'],
	inspeksiPostTrackingPath: ['data'],
	// inspeksiGetParamTrackingPath: null,
	inspeksiSuccess: ['payload'],
	inspeksiFailure: null
});

export const InspeksiTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingInspeksi: null,
	fetchingInspeksiParam: null,
	error: null,
	inspeksi: null
});

/* ------------- Selectors ------------- */

export const InspeksiSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const postInspeksiHeader = (state, { data }) => state.merge({ fetchingInspeksi: true, data, inspeksi: null });
export const postInspeksiDetail = (state, { data }) => state.merge({ fetchingInspeksi: true, data, inspeksi: null });
export const postInspeksiTrackingPath = (state, { data }) => state.merge({ fetchingInspeksi: true, data, inspeksi: null });
// export const getInspeksiParamTrackingPath = (state, { data }) => state.merge({ fetchingInspeksiParam: true, error: null, inspeksi: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingInspeksi: false, error: null, inspeksi: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetchingInspeksi: false, error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
	[Types.INSPEKSI_POST_HEADER]: postInspeksiHeader,
	[Types.INSPEKSI_POST_DETAIL]: postInspeksiDetail,
	[Types.INSPEKSI_POST_TRACKING_PATH]: postInspeksiTrackingPath,
	// [Types.INSPEKSI_GET_PARAM_TRACKING_PATH]: getInspeksiParamTrackingPath,
	[Types.INSPEKSI_SUCCESS]: success,
	[Types.INSPEKSI_FAILURE]: failure
});
