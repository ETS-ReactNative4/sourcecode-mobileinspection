import TaskServices from "./TaskServices";
import moment from 'moment';
import RNFS from 'react-native-fs';
import { isEmpty } from 'ramda'

/** GET CURRENT USER ADD BY AMINJU 2019/12/20 */
export function getCurrentUser() {
    let user = TaskServices.getAllData('TR_LOGIN')[0];
    return user;
}

/** 
 * GET DATA HISTORY FINDING
 * ADD BY AMINJU 2019/12/20
 */
export function getListHistoryFinding() {
    let data = TaskServices.query('TR_FINDING', `(INSERT_USER = "${getCurrentUser().USER_AUTH_CODE}" OR ASSIGN_TO = '${getCurrentUser().USER_AUTH_CODE}')`);
    data = data.sorted('INSERT_TIME', true);
    return data;
}


/** 
 * GET DATA LIST FINDING
 * ADD BY AMINJU 2019/12/20
 */
export function getListFinding(type) {

    var data = TaskServices.query('TR_FINDING', `PROGRESS < 100 AND ASSIGN_TO = "${getCurrentUser().USER_AUTH_CODE}"`);
    var dataSelesai = TaskServices.query('TR_FINDING', `PROGRESS = 100 AND ASSIGN_TO = "${getCurrentUser().USER_AUTH_CODE}"`);
    var dataLewat = [], data7Hari = [], dataMore7Hari = [], dataNoDate = [];
    var now = moment(new Date())

    data.map(item => {
        if (isEmpty(item.DUE_DATE)) {
            dataNoDate.push(item)
        } else {
            let dueDate = item.DUE_DATE;
            if (dueDate.includes(' ')) {
                dueDate = dueDate.substring(0, dueDate.indexOf(' '))
            }
            var diff = moment(new Date(dueDate)).diff(now, 'day');
            if (diff < 0) {
                return dataLewat.push(item)
            } else if (diff < 7) {
                data7Hari.push(item)
            } else {
                dataMore7Hari.push(item)
            }
        }
    })

    switch (type) {
        case 0:
            return data;
        case 1:
            return dataLewat;
        case 2:
            return data7Hari;
        case 3:
            return dataMore7Hari;
        case 4:
            return dataNoDate;
        case 5:
            return dataSelesai;
        default:
            return data;
    }
}



/** 
 * DELETE DATA FINDING MELEBIHI 7 HARI DAN STATUS SYCNC = 'Y'
 * ADD BY AMINJU 2019/12/18
 */
export async function deleteDataFinding() {
    var data = TaskServices.query('TR_FINDING', `PROGRESS = '100' AND STATUS_SYNC = "Y" AND syncImage = "Y"`);
    var now = moment(new Date());

    console.log('DATA LENGTH : ', data);

    data.map(async (item) => {
        let dueDate = item.DUE_DATE.substring(0, 10);
        var diff = moment(new Date(dueDate)).diff(now, 'day');

        if (diff < -7) {
            await querySelectImagePath(item.FINDING_CODE);
        } else {
            console.log('Diff Range Hari : ', diff)
        }
    })
}

/** 
 * QUERY SELECT IMAGE FINDING YANG AKAN DI DELETE
 * ADD BY AMINJU 2019/12/18
 */
export function querySelectImagePath(findingCode) {
    let dataImage = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${findingCode}"`);

    if (dataImage != undefined) {
        dataImage.map(item => {
            deleteImageFileFinding(item.IMAGE_PATH_LOCAL, findingCode)
        })
    }
}

/** 
 * DELETE IMAGE FINDING MELEBIHI 7 HARI DAN STATUS SYNC = 'Y'
 * ADD BY AMINJU 2019/12/18
 */
export function deleteImageFileFinding(path, primaryKey) {
    RNFS.exists(path)
        .then((result) => {
            if (result) {
                RNFS.unlink(path)
                    .then(() => {
                        console.log(`${path} DELETED`);
                        TaskServices.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', primaryKey);
                    });
            } else {
                TaskServices.deleteRecordByPK('TR_FINDING', 'FINDING_CODE', primaryKey)
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
}

