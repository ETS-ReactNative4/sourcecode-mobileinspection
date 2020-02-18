import { fetchPost } from "../../../Api/FetchingApi";
import { storeData } from "../../../Database/Resources";

export async function postWeeklySummary(type) {

    const content = 'WeeklySummary'

    const param = {
        IS_VIEW: 1
    }

    let isSuccess = true;

    await fetchPost(type, param, null)
        .then(((response) => {
            try {
                if (response !== undefined) {
                    if (type == 'INSPECTION-SUMMARY') {
                        storeData('InspectionSummary', response.data)
                    } else if (type == 'FINDING-SUMMARY') {
                        storeData('FindingSummary', response.data)
                    } else if (type == 'EBCC-SUMMARY') {
                        storeData('EbccSummary', response.data)
                    }
                } else {
                    isSuccess = false
                    console.log(`${content} ${type} Failed`);
                    console.log(`${content} ${type} Server Timeout`)
                }
            } catch (error) {
                console.log('CATCH WEEKLY SUMMARY : ', error)
            }

        }));
    return isSuccess;
}
