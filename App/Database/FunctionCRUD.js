import TaskServices from '../Database/TaskServices'
import moment from 'moment'

var RNFS = require('react-native-fs');

const FuntionCRUD = {

    DELETE_FINDING: async function () {
        console.log('MASUK DELETE_FINDING')
        var data = TaskServices.query('TR_FINDING', `PROGRESS = '100' AND STATUS_SYNC = 'Y' AND DUE_DATE != "" AND FINDING_CODE = "FTAC001070190717110903"`);
        var now = moment(new Date());

        console.log('MASUK DELETE_FINDING DATA', data)
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let dueDate = data[i].DUE_DATE;
                console.log('DUE DATE : ', dueDate)
                if (dueDate.includes(' ')) {
                    dueDate = dueDate.substring(0, dueDate.indexOf(' '))
                }
                var diff = moment(new Date(dueDate)).diff(now, 'day');
                if (diff < -7) {
                    // this.DELETE_IMAGE_FINDING(data[i]);
                    console.log('MASUK DELETE_IMAGE_FINDING')
                    let DATA_IMAGE = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${data[i]}"`);
                    if (DATA_IMAGE != undefined) {
                        this.DELETE_IMAGE_FILE(DATA_IMAGE, FINDING_CODE);
                    }
                }
            }
        }
    },
    DELETE_IMAGE_FINDING: async function (FINDING_CODE) {
        console.log('MASUK DELETE_IMAGE_FINDING')
        let DATA_IMAGE = TaskServices.query('TR_IMAGE', `STATUS_SYNC = "Y" AND TR_CODE = "${FINDING_CODE}"`);
        if (DATA_IMAGE != undefined) {
            this.DELETE_IMAGE_FILE(DATA_IMAGE, FINDING_CODE);
        }
    },
    DELETE_IMAGE_FILE: async function (IMAGE, FINDING_CODE) {
        console.log('MASUK DELETE_IMAGE_FILE')
        const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";
        for (let i = 0; i < IMAGE.length; i++) {
            const PATH = `${FILE_PREFIX}${dirPhotoTemuan}/${IMAGE[i].IMAGE_NAME}`;
            RNFS.exists(PATH)
                .then((result) => {
                    if (result) {
                        return RNFS.unlink(PATH)
                            .then(() => {
                                TaskServices.deleteRecordPrimaryKey('TR_FINDING', FINDING_CODE)
                                console.log('MASUK DELETE_IMAGE_FILE & DELETE DATA FINDING')
                            })
                            .catch((err) => {
                                console.log(err.message);
                            });
                    }
                    else {
                        TaskServices.deleteRecordPrimaryKey('TR_FINDING', FINDING_CODE)
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        return;
    }
};

export default FuntionCRUD;
