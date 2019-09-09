import {fetchPost} from "../FetchingApi";

export async function syncFetchPost(serviceName, fetchBody, fetchHeaders) {
    let fetchData = null;
    await fetchPost(serviceName, fetchBody, fetchHeaders)
        .then(((response) => {
            if (response !== undefined) {
                if (response.status) {
                    fetchData = response.data
                }
                else {
                    console.log("upload "+ serviceName +" failed");
                    console.log("upload "+ serviceName +" Body ", fetchBody);
                    console.log("upload "+ serviceName +" Response ", response);
                }
            }
            else {
                console.log("upload "+ serviceName +" Server Timeout");
                console.log("upload "+ serviceName +" Body ", fetchBody);
                console.log("upload "+ serviceName +" Response ", response);
            }
        }));
    return fetchData;
}
