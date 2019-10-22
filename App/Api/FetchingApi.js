import TaskServices from "../Database/TaskServices";
import moment from 'moment';

// ======================================================================

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
    }).then((data) => {
        if(data.status === false){
          let momentTime = moment().format("YYYYMMDDHHmmss").toString();
          let LogModel = {
            ID_LOG: `fetchPost${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: data.message,
            DEV_NOTE: `response status false`,
            FROM: `POST - fetchPost - ${serviceDetail.API_URL}`,
          };
          TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
          ID_LOG: `fetchPost${momentTime}`,
          INSERT_TIME: momentTime,
          MESSAGE: `response status !== 200`,
          DEV_NOTE: null,
          FROM: `POST - fetchPost - ${serviceDetail.API_URL}`,
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
    }).then((data) => {
        if(data.status === false){
          let momentTime = moment().format("YYYYMMDDHHmmss").toString();
          let LogModel = {
            ID_LOG: `fetchPostForm${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: data.message,
            DEV_NOTE: `response status false`,
            FROM: `POST - fetchPostForm - ${serviceDetail.API_URL}`,
          };
          TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
          ID_LOG: `fetchPost${momentTime}`,
          INSERT_TIME: momentTime,
          MESSAGE: `response status !== 200`,
          DEV_NOTE: null,
          FROM: `POST - fetchPostForm - ${serviceDetail.API_URL}`,
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
    }).then((data) => {
        if(data.status === false){
          let momentTime = moment().format("YYYYMMDDHHmmss").toString();
          let LogModel = {
            ID_LOG: `fetchGet${momentTime}`,
            INSERT_TIME: momentTime,
            MESSAGE: data.message,
            DEV_NOTE: `response status false`,
            FROM: `POST - fetchGet - ${serviceDetail.API_URL}`,
          };
          TaskServices.saveData('TR_LOG', LogModel);
        }
        return data;
    }).catch((err) => {
        let momentTime = moment().format("YYYYMMDDHHmmss").toString();
        let LogModel = {
          ID_LOG: `fetchGet${momentTime}`,
          INSERT_TIME: momentTime,
          MESSAGE: `response status !== 200`,
          DEV_NOTE: null,
          FROM: `POST - fetchGet - ${serviceDetail.API_URL}`,
        };
        TaskServices.saveData('TR_LOG', LogModel);
        return undefined
    });
}
