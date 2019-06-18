import ERROR from 'constant/error-code';

let ENDPOINT = (
        server_idx  = String (''),
        request     = String (''),
    ) =>  {

    // If server index is not set ( Empty ), show error. 
    // If server index is 2, then give development endpoint. Otherwise, give production endpoint.
    
    let dev_mode = ( server_idx === '' ) ?  ERROR.ERR_CODE_SERVER_INDEX_NOT_FOUND_MODE() : ( server_idx === '2' ) ? Boolean(true) : Boolean(false);
    return response =  ( dev_mode ) ? ENDPOINT_DEV(request) : ENDPOINT_PRO(request);
}


let ENDPOINT_DEV = (request='') => {
    const url         = '149.129.250.199'; 
    const protocol    = 'http'; 
    const port_number = '3008';
    const folder_api  = 'api';

    return String( protocol + "://" + url + ':' + port_number + "/" + folder_api + "/" + request );
}

let ENDPOINT_PRO = (request='') => {
    return String ( null );
}

export default {
    ENDPOINT
}