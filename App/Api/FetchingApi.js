import TaskServices from "../Database/TaskServices";
import moment from 'moment';
import ServerName from "../Constant/ServerName";

// ======================================================================

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
                FROM: `POST - fetchPostWithUrl - ${serviceName}:${URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPostWithUrl${momentTime}`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `POST - fetchPostWithUrl - ${serviceName}:${URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchPostWithUrl${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `POST - fetchPostWithUrl - ${serviceName}:${URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined;
    });
}

export function fetchPut(serviceName, fetchBody, fetchHeaders){
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        let tempHeaders = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
        headers = tempHeaders
    }
    else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }

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
                FROM: `PUT - fetchPut - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPut${momentTime}`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `PUT - fetchPut - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchPut${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `PUT - fetchPut - ${serviceName}:${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined;
    });
}

export function fetchPost(serviceName, fetchBody, fetchHeaders) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        let tempHeaders = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
        headers = tempHeaders
    }
    else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        }
    }

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
                FROM: `POST - fetchPost - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPost${momentTime}`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `POST - fetchPost - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchPost${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `POST - fetchPost - ${serviceName}:${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined;
    });
}

export function fetchPostForm(serviceName, fetchBody, fetchHeaders) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = null;

    if (fetchHeaders !== undefined && fetchHeaders !== null) {
        let tempHeaders = {
            ...fetchHeaders,
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN
        };
        headers = tempHeaders
    }
    else {
        headers = {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + user.ACCESS_TOKEN,
        }
    }

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
                FROM: `POST - fetchPostForm - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchPostForm${momentTime}`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `POST - fetchPostForm - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchPostForm${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `POST - fetchPostForm - ${serviceName}:${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);

        return undefined;
    });
}

// ========================================================================

export function fetchGet(serviceName) {
    let serviceDetail = TaskServices.getService(serviceName);
    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.ACCESS_TOKEN
    }

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
                INSERT_TIME: momentTime,
                MESSAGE: JSON.stringify(response),
                DEV_NOTE: `response status !== 200`,
                FROM: `GET - fetchGet - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
            return undefined;
        }
    }).then((data) => {
        if(data.status === false){
            let momentTime = moment().format("YYYYMMDDHHmmss").toString();
            let LogModel = {
                ID_LOG: `fetchGet${momentTime}`,
                INSERT_TIME: momentTime,
                MESSAGE: data.message,
                DEV_NOTE: `response status false`,
                FROM: `GET - fetchGet - ${serviceName}:${serviceDetail.API_URL}`,
            };
            TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
            ID_LOG: `fetchGet${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: JSON.stringify(err),
            DEV_NOTE: `fetch error catch`,
            FROM: `GET - fetchGet - ${serviceName}:${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined
    });
}
