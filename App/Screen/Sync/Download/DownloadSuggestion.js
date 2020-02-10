import { getAPIFunction } from "./ApiFunction";

export async function getPointSuggestion() {

    let downloadLabels = {
        data: null,
    };

    await getAPIFunction('INTERNAL-SUGGESTION').then((data) => {
        try {
            if (data != null) {
                downloadLabels = {
                    data: data
                }
            } else {
                downloadLabels = {
                    ...downloadLabels
                }
            }
        } catch (error) {
            console.log('CATCH SUGGESSTION : ', error)
        }
    })

    return downloadLabels;
}