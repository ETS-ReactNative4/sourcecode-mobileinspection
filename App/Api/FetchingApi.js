
export function fetchGetAPI(url, method) {
    return fetch(url, {
        method: method,
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

export function fetchPostAPI(token, url, method, param) {
    return fetch(url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(param)
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