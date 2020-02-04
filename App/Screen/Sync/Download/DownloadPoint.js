import { getAPIFunction } from "./ApiFunction";

export async function getPoint() {

    let downloadLabels = {
        data: 0,
    };

    await getAPIFunction('POINT-CURRENT-USER').then((data) => {

        try {
            if (data != null) {
                console.log('DATA POINT : ', data.POINT)
                downloadLabels = {
                    ...downloadLabels,
                    data: data.POINT
                }
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH ESTATE : ', error)
        }
    })

    return downloadLabels;
}