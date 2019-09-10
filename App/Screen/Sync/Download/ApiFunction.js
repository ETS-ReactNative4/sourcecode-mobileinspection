import { fetchGet } from "../../../Api/FetchingApi";

export async function getAPIFunction(apiName) {
    let dataAPI = null;
    await fetchGet(apiName)
        .then(((response) => {
            if (response !== undefined) {

                // if (apiName == 'AUTH-SYNC-FINDING') {
                //     console.log(`Response Status Download ${apiName} : `, response)
                // }

                if (response.status) {
                    return dataAPI = response.data
                } else {
                    console.log(`Download ${apiName} Failed`);
                }
            } else {
                console.log(`Download ${apiName} Server Timeout`)
            }
        }));
    return dataAPI;
}
