import TaskServices from 'database/TaskServices';
import API_ENDPOINT from 'constant/endpoint-api';
import SHOW_DEBUG   from 'constant/debug';
import ERROR        from 'constant/error-code';
import FETCH        from 'constant/fetch-data';

let newData             = [];
let ACCESS_TOKEN        = null;
let REF_CODE            = null;
let SERVER_INDEX        = null;
let LOC_CODE            = null;
let CONTACT_ENDPOINT    = null;
let DEFAULT_BODY_DATA   = '';
let RESPONSE_DATA       = null;


/**
 *  Download Data From Server ( IF Network is available )
 */
let downloadAndStoreDataFromServer = () => {

    /**
     *  =====================================
     *  | Get login data from realm.        |
     *  =====================================
     *  Realm model for TR_LOGIN :
     *  {
            name: 'TR_LOGIN',
            primaryKey: 'USER_AUTH_CODE',
            properties: {
                NIK                 : 'string',
                ACCESS_TOKEN        : 'string',
                JOB_CODE            : 'string',
                LOCATION_CODE       : 'string',
                REFFERENCE_ROLE     : 'string',
                USERNAME            : 'string',
                USER_AUTH_CODE      : 'string',
                USER_ROLE           : 'string',
                SERVER_NAME_INDEX   : 'string',
                STATUS              : 'string'
            }
        }
     */
    
    const login_data    = getServerIndex();
    SERVER_INDEX        = String( login_data.SERVER_NAME_INDEX );
    ACCESS_TOKEN        = String( login_data.ACCESS_TOKEN );
    REF_CODE            = String( login_data.REFFERENCE_ROLE );
    LOC_CODE            = String( login_data.LOCATION_CODE );
    

    /**
     *  =========================================
     *  | Get endpoint for fetch contact :      |
     *  =========================================
     */

    CONTACT_ENDPOINT = getContactEndpoint(SERVER_INDEX);
    

    /**
     *  ===============================================================================
     *  | Fetch contact from server. The server is choosen by SERVER_INDEX variable.  |
     *  ===============================================================================
     */
    
    // static token ( for test only ) //
    //let ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6InVhdDQiLCJVU0VSX0FVVEhfQ09ERSI6IlRBQzAwMTAwNCIsIlVTRVJfUk9MRSI6IlNFTV9HTSIsIkxPQ0FUSU9OX0NPREUiOiI0NCw0Myw0NiIsIlJFRkZFUkVOQ0VfUk9MRSI6IkNPTVBfQ09ERSIsIkVNUExPWUVFX05JSyI6IkIxMTIyMzM0IiwiSU1FSSI6IjM1Nzg4NDA4Mjg5MjM2MSIsImp0aSI6IjI0ZDBiYzI3LWVlN2YtNGFhYi05MzgzLWE5YmZjMjQ3OTkwNSIsImlhdCI6MTU1NjA5OTU3MCwiZXhwIjoxNTU2NzA0MzcwfQ.rna4xWpWY4XY-ty8ElMWMc2as1Dr3QBMZtqfenTNCEQ";
    
    FETCH.FETCH_DATA(false, CONTACT_ENDPOINT, "", "GET", ACCESS_TOKEN ).then(( response ) => {
        RESPONSE_DATA       = response;
        let CONTACT_DATA    = RESPONSE_DATA.data;
        let SCHEMA_CONTACT  = 'TR_CONTACT';

        /**
         * ======================================
         * | Insert contact data into realm     |
         * ======================================
         * Realm model for TR_CONTACT :
         * {
                name: 'TR_CONTACT',
                primaryKey: 'USER_AUTH_CODE',
                properties: {
                    USER_AUTH_CODE: 'string',
                    EMPLOYEE_NIK: 'string',
                    USER_ROLE: 'string',
                    LOCATION_CODE: { type: 'string', optional: true },
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'string'
                }
            }
         */
        storeDataOffline(SCHEMA_CONTACT, CONTACT_DATA);
    });
}

/**
 * Get Server Index from Realm from Taskservices
 */
let getServerIndex = () => {
    
    let serverIndex = null;

    try {
        serverIndex = TaskServices.getLoginData();
    }
    catch(e) {
        /**
         * Show Error if Taskservices can not doing well
         */
        ERROR.ERR_CODE_NO_SCHEMA_MODE();
    }
   
    return serverIndex;
}


/**
 * Get Contact Endpoint
 */
let getContactEndpoint = (server_index= '') => {
    let get_server_index    = server_index;
    let request             = 'contacts'
    return API_ENDPOINT.ENDPOINT(get_server_index, request);
}


// SEND DATA TO SERVER
let sendDataToServer = (data='') => {

}


/**
 * Store Data into Realm
 */
let storeDataOffline = (schema_name='', data='') => {

    let OBJ_DATA;
    let SCHEMA  = schema_name;

    data.map(function(key){
        OBJ_DATA = {
            "USER_AUTH_CODE": key.USER_AUTH_CODE,
            "EMPLOYEE_NIK"  : key.EMPLOYEE_NIK,
            "USER_ROLE"     : key.USER_ROLE,
            "LOCATION_CODE" : key.LOCATION_CODE,
            "REF_ROLE"      : key.REF_ROLE,
            "JOB"           : key.JOB,
            "FULLNAME"      : key.FULLNAME
        };
        TaskServices.saveData(SCHEMA, OBJ_DATA);
    });
}


/**
 * Get Contact from Realm
 */
let getSpesificContactFromDB = (schema_name='', column='', values='') => {
    let SCHEMA  = schema_name;
    let COLUMN  = column;
    let VALUE   = values;

    // fill in query for fetching from location cpde
    return TaskServices.getAllDataContact(SCHEMA, COLUMN,VALUE);
}

let getAllContactFromDB = (SCHEMA) => {
    let data_db;

    switch(SCHEMA) {
        case  'TR_CONTACT_GENBA' : 
            data_db = TaskServices.getAllData(SCHEMA);
        break;

        case 'TR_GENBA_SELECTED' :
            data_db = TaskServices.getAllData(SCHEMA);
        break;

        default :
        break;
    }
    return data_db;
}


let convertDataFromRealmIntoJSONArray = (data) => {
    let new_data = [];
    data.map(function(item){
        new_data.push(item);
    });

    return new_data;
}


let filterData = (data, name) => {
    let search_name     = name.toLowerCase() ;
    let data_filtered   = data.filter(function(key){
        let name = key.FULLNAME;
        return !(name.toLowerCase().indexOf(search_name) == -1)
    });

    return data_filtered;
}


let storeDataChoosen = (SCHEMA, OBJ_DATA) => {
    TaskServices.saveData(SCHEMA, OBJ_DATA);
}

let deleteDataChoosen = (SCHEMA, PRIMARYKEY, VALUE) => {
    TaskServices.deleteRecordByPK(SCHEMA, PRIMARYKEY, VALUE);
}


export default {
    sendDataToServer,
    storeDataOffline,
    getServerIndex,
    getContactEndpoint,
    downloadAndStoreDataFromServer,
    getSpesificContactFromDB,
    getAllContactFromDB,
    convertDataFromRealmIntoJSONArray,
    filterData,
    storeDataChoosen,
    deleteDataChoosen
}