import { getAPIFunction } from "./ApiFunction";

export async function getTimeServer() {

    let isSync = true;

    await getAPIFunction('AUTH-SERVER-TIME').then((data) => {

        console.log('Data Servertime : ', data);

        if (data !== null) {
            let serverTime = new Date(data.time.replace(' ', 'T') + "+07:00");
            let localTime = new Date();

            serverTime.setMinutes(0, 0, 0);
            localTime.setMinutes(0, 0, 0);

            if (serverTime.getTime() !== localTime.getTime()) {
                isSync = false;
            }

        } else {
            console.log('Time Server Null')
        }
    })

    return isSync;
}