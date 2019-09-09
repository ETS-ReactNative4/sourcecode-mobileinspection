import { fetchPost } from "../../../Api/FetchingApi";

export async function postMobileSync(param, type) {
    await fetchPost('AUTH-SYNC', param, null)
        .then(((response) => {
            if (response !== undefined) {
                // console.log(`Response Status MobileSync ${type} : `, response.status)
                if (response.status) {
                    console.log(`Mobile Sync ${type} Success`)
                } else {
                    console.log(`Mobile Sync ${type} Failed`);
                }
            } else {
                console.log(`Mobile Sync ${type} Server Timeout`)
            }
        }));
    return;
}
