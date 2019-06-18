let FETCH_DATA =  (
                    body        = Boolean (false), 
                    endpoint_api= String (''), 
                    data_body   = String (''), 
                    method_api  = String ('POST'),
                    token       = String ('') ) => {

    let endpoint    = endpoint_api;
    let method      = method_api;
    let gettoken    = token;
    let headers     = {
        'Authorization' : 'Bearer ' + gettoken ,
        'cache-control' : 'no-cache',
        Accept          : 'application/json',
        'Content-Type'  : 'application/json'
    };

    if(body) {
        try{
            return fetch(endpoint, {
                method  : method,
                headers : headers,
                body    : JSON.stringify(data_body)
            }).then( response=> response.json()).then((responsedata)=>{
                return responsedata
            }).catch(( e ) => console.error ( e ));
        }
        catch(e){
            console.warn('');
        }
    }
    else{
        try{
            return fetch(endpoint, {
                method  : method,
                headers : headers,
            }).then(response=> response.json()).then((responsedata)=>{
                //console.log("trace data : " + JSON.stringify(responsedata));
                return responsedata
            }).catch(( e ) => console.error ( e ));
        }
        catch(e) {
            console.warn("")
        };
    }
    
}

export default {
    FETCH_DATA
}






