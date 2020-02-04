import { getAPIFunction } from "./ApiFunction";

export async function getPointLeaderBoard() {

    let downloadLabels = {
        data: 0,
    };

    await getAPIFunction('POINT-LEADER-BOARD').then((data) => {
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
            console.log('CATCH LEADERBOARD : ', error)
        }
    })

    return downloadLabels;
}