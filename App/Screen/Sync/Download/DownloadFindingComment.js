import TaskServices from '../../../Database/TaskServices'
import { getAPIFunction } from "./ApiFunction";
import { NotificationComment } from '../Notification/NotificationComment';
import moment from 'moment';
import { postMobileSync } from "../Upload/UploadMobileSync";

export async function getFindingComment() {

    let dbLocal = TaskServices.getAllData('TR_FINDING_COMMENT');

    let downloadLabels = {
        downloadCount: 0,
        totalCount: dbLocal.length
    };

    /* DEFAULT MIDLEWARE */
    await getAPIFunction('AUTH-SYNC-FINDING-COMMENT').then((data) => {

        let user = TaskServices.getAllData('TR_LOGIN')[0];

        try {
            if (data != null) {
                /* INSERT DATA FINDING COMMENT */
                if (data.simpan.length > 0) {

                    Promise.all(
                        data.simpan.map(item => {

                            let model = {
                                FINDING_COMMENT_ID: item.FINDING_COMMENT_ID,
                                FINDING_CODE: item.FINDING_CODE,
                                USER_AUTH_CODE: item.USER_AUTH_CODE,
                                MESSAGE: item.MESSAGE,
                                INSERT_TIME: item.INSERT_TIME !== undefined ? item.INSERT_TIME.toString() : "0",
                                TAGS: item.TAGS !== undefined ? item.TAGS : [],
                                /* LOCAL PARAM */
                                STATUS_SYNC: 'Y',
                                USERNAME: item.FULLNAME !== undefined ? item.FULLNAME : "NO_NAME"
                            };


                            if (model.USER_AUTH_CODE !== user.USER_AUTH_CODE) {
                                /* INSERT NOTIFICATION COMMENT */
                                NotificationComment(model, user)
                            }

                            TaskServices.saveData("TR_FINDING_COMMENT", model);

                            /* CALLBACK DATA */
                            downloadLabels = {
                                ...downloadLabels,
                                downloadCount: downloadLabels.downloadCount + 1
                            }
                        })
                    )
                }


                /* UPDATE DATA FINDING COMMENT */
                if (data.ubah.length > 0 && dbLocal.length > 0) {
                    data.ubah.map(item => {
                        let model = {
                            FINDING_COMMENT_ID: item.FINDING_COMMENT_ID,
                            FINDING_CODE: item.FINDING_CODE,
                            USER_AUTH_CODE: item.USER_AUTH_CODE,
                            MESSAGE: item.MESSAGE,
                            INSERT_TIME: item.INSERT_TIME !== undefined ? item.INSERT_TIME.toString() : "0",
                            TAGS: item.TAGS !== undefined ? item.TAGS : [],
                            /* LOCAL PARAM */
                            STATUS_SYNC: 'Y',
                            USERNAME: item.FULLNAME !== undefined ? item.FULLNAME : "NO_NAME"
                        };

                        TaskServices.updateByPrimaryKey('TR_FINDING_COMMENT', model)
                    })
                }
            } else {
                /* CALLBACK DATA */
                downloadLabels = {
                    ...downloadLabels
                }
            }

            /* UPDATE TM_MOBILE_SYNC */
            const param = {
                TGL_MOBILE_SYNC: moment().format('YYYY-MM-DD kk:mm:ss'),
                TABEL_UPDATE: 'finding-comment'
            };
            postMobileSync(param, 'TR_IMAGE FINDING');

        } catch (error) {
            console.log('CATCH FINDING COMMENT : ', error)
        }
    })

    return downloadLabels;
}
