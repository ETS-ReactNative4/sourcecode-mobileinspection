import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	blockRequest: null,
	blockPost: ['data'],
	blockSuccess: ['payload'],
	blockFailure: null,
	resetBlock: null
});

export const BlockTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetchingBlock: null,
	error: null,
	block: null
});

/* ------------- Selectors ------------- */

export const BlockSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const requestBlock = (state, { data }) => state.merge({ fetchingBlock: true, error: null, block: null });
export const postBlock = (state, { data }) => state.merge({ fetchingBlock: true, data, block: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetchingBlock: false, error: null, block: payload });
};

// Something went wrong somewhere.
export const failure = (state,msg) => state.merge({ fetchingBlock: false, error: true, payload: msg });

export const reset = (state) => state.merge({ fetchingBlock: null, error: null, block: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.BLOCK_REQUEST]: requestBlock,
	[Types.BLOCK_POST]: postBlock,
	[Types.BLOCK_SUCCESS]: success,
	[Types.BLOCK_FAILURE]: failure,
	[Types.RESET_BLOCK]: reset
});
