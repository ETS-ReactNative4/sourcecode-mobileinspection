// ERROR_PARAMETER_TYPE
const ERR_CODE_ENDPOINT_DEV_MODE_STR    = 'CODE_ERR : PTx0 - Parameter development mode must be boolean type.';
const ERR_CODE_DEBUG_ONSCREEN_STR       = 'CODE_ERR : PTx1 - Parameter debug on screen mode must be boolean type';

// ERROR_FETCH_DATA
const ERR_CODE_NO_DATA_DB_STR   = 'CODE_ERR : FDx0 - No such data in database.';
const ERR_CODE_NO_SCHEMA_STR    = 'CODE_ERR : FDx1 - NO schema';

// ERROR_SERVER_INDEX
const ERR_CODE_SERVER_INDEX_NOT_FOUND_STR = 'CODE_ERR : SIx0 - Server index not found';

let ERR_CODE_ENDPOINT_DEV_MODE = () => {
    console.error(ERR_CODE_ENDPOINT_DEV_MODE_STR);
}

let ERR_CODE_DEBUG_ONSCREEN_MODE = () => {
    console.error(ERR_CODE_DEBUG_ONSCREEN_STR);
}

let ERR_CODE_NO_DATA_MODE = () => {
    console.error(ERR_CODE_NO_DATA_DB_STR);
}

let ERR_CODE_NO_SCHEMA_MODE = () => {
    console.error(ERR_CODE_NO_SCHEMA_STR);
}

let ERR_CODE_SERVER_INDEX_NOT_FOUND_MODE = () => {
    console.error(ERR_CODE_SERVER_INDEX_NOT_FOUND_STR);
}

export default {
    ERR_CODE_ENDPOINT_DEV_MODE,
    ERR_CODE_DEBUG_ONSCREEN_MODE,
    ERR_CODE_NO_DATA_MODE,
    ERR_CODE_NO_SCHEMA_MODE,
    ERR_CODE_SERVER_INDEX_NOT_FOUND_MODE
}