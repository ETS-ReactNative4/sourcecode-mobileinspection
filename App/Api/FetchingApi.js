import TaskServices from "../Database/TaskServices";

export function fetchGetAPI(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        if (response.status == 200) {
            return response.json()
        }
    }).then((data) => {
        return data;
    }).catch((err) => {
        console.log(err)
    });
}

export function fetchPostAPI(token, url, param) {
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(param)
    }).then((response) => {
        // console.log('Response : ', response.json)
        if (response.status == 200) {
            return response.json()
        }
    }).then((data) => {
        return data;
    }).catch((err) => {
        console.log(err)
    });
}

export function fetchFormPostAPI(token, url, param) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
        },
        body: param
    }).then((response) => {
        // console.log('Response : ', response.json)
        if (response.status == 200) {
            return response.json()
        }
    }).then((data) => {
        return data;
    }).catch((err) => {
        console.log(err)
    });
}

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
        return data;
    }).catch((err) => {
        console.log("fetch "+ serviceName +" api error :", err);
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
        return data;
    }).catch((err) => {
        console.log("fetch "+ serviceName +" api error :", err);
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
        return data;
    }).catch((err) => {
        console.log(err)
    });
}
