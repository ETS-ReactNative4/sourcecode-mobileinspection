
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
