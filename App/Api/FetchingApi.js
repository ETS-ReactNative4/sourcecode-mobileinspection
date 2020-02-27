import TaskServices from "../Database/TaskServices";
import moment from 'moment';

//di pakai untuk ngefetch specific URL
export function fetchPostWithUrl(URL, fetchBody, fetchHeaders) {
    return fetch(URL, {
        method: 'POST',
        headers: fetchHeaders,
        body: JSON.stringify(fetchBody)
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
        else {
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPostWithUrl${momentTime}`,
                PARAM: JSON.stringify(fetchBody),
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(response),
                DEV_NOTE: `response status !== 200`,
                FROM: `${URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPostWithUrl${momentTime}`,
                PARAM: JSON.stringify(fetchBody),
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `${URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchPostWithUrl${momentTime}`,
            PARAM: JSON.stringify(fetchBody),
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `${URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined;
    });
}

//fetch PUT
export function fetchPut(serviceName, fetchBody, fetchHeaders){
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        headers = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
    }
    else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }

    if(fetchBody !== null && fetchBody !== undefined){
        return fetch(serviceDetail.API_URL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(fetchBody)
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            }
            else {
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPut${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: JSON.stringify(response),
                    DEV_NOTE: `response status !== 200`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
                return undefined;
            }
        }).then((data) => {
            if(data.status === false){
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPut${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: data.message,
                    DEV_NOTE: `response status false`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
            }
            return data;
        }).catch((err) => {
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPut${momentTime}`,
                PARAM: JSON.stringify(fetchBody),
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(err),
                DEV_NOTE: `fetch error catch`,
                FROM: `${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        });
    }
    return undefined;
}

//fetch POST
export function fetchPost(serviceName, fetchBody, fetchHeaders) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        headers = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
    }
    else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }

    if(fetchBody !== null && fetchBody !== undefined){
        return fetch(serviceDetail.API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(fetchBody)
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            }
            else {
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPost${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: JSON.stringify(response),
                    DEV_NOTE: `response status !== 200`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
                return undefined;
            }
        }).then((data) => {
            if(data.status === false){
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPost${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: data.message,
                    DEV_NOTE: `response status false`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
            }
            return data;
        }).catch((err) => {
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPost${momentTime}`,
                PARAM: JSON.stringify(fetchBody),
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(err),
                DEV_NOTE: `fetch error catch`,
                FROM: `${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        });
    }
    return undefined;
}

//fetch POST form (image)
export function fetchPostForm(serviceName, fetchBody, fetchHeaders) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        headers = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
    }
    else {
        headers = {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN,
        }
    }

    if(fetchBody !== null && fetchBody !== undefined){
        return fetch(serviceDetail.API_URL, {
            method: 'POST',
            headers: headers,
            body: fetchBody
        }).then((response) => {
            if (response.status === 200) {
                return response.json()
            }
            else {
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPostForm${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: JSON.stringify(response),
                    DEV_NOTE: `response status !== 200`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
                return undefined;
            }
        }).then((data) => {
            if(data.status === false){
                let momentTime = moment().format("YYYYMMDDHHmmss").toString();
                let LogModel = {
                    ID_LOG: `fetchPostForm${momentTime}`,
                    PARAM: JSON.stringify(fetchBody),
                    INSERT_TIME: momentTime,
                    MESSAGE: data.message,
                    DEV_NOTE: `response status false`,
                    FROM: `${serviceName}:${serviceDetail.API_URL}`,
                };
                TaskServices.saveData('TR_LOG', LogModel);
            }
            return data;
        }).catch((err) => {
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPostForm${momentTime}`,
                PARAM: JSON.stringify(fetchBody),
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(err),
                DEV_NOTE: `fetch error catch`,
                FROM: `${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);

            return undefined;
        });
    }
    return undefined;
}

//fetch GET
export function fetchGet(serviceName, fetchHeaders) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        headers = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }
    else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }

    // let tempURL = null;
    // switch (serviceName) {
    //     case "INTERNAL-PETA-PANEN-HEADER":
    //         tempURL = "http://msadev.tap-agri.com:4015/api/v1.0/peta-panen/header";
    //         break;
    //     case "INTERNAL-PETA-PANEN-DETAIL":
    //         tempURL = "http://msadev.tap-agri.com:4015/api/v1.0/peta-panen/detail";
    //         break;
    //     default:
    //         tempURL = serviceDetail.API_URL;
    //         break;
    // }

    return fetch(serviceDetail.API_URL, {
        method: 'GET',
        headers: headers
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
        else {
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchGet${momentTime}`,
                PARAM: `FETCH-GET-NODATA`,
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(response),
                DEV_NOTE: `response status !== 200`,
                FROM: `${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchGet${momentTime}`,
                PARAM: `FETCH-GET-NODATA`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchGet${momentTime}`,
            PARAM: `FETCH-GET-NODATA`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `${serviceName}:${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined
    });
}
