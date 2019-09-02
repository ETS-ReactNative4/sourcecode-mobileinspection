import RealmSchemas from './RealmSchema'
import { getThumnail } from "../Lib/Utils";
import ServerName from "../Constant/ServerName";

const TaskServices = {

    getPath: function () {
        return RealmSchemas.path;
    },

    getImagePath(userAuthCode) {
        let trImageProfile = RealmSchemas.objects('TR_IMAGE_PROFILE').filtered('USER_AUTH_CODE == \"' + userAuthCode + '\" ')[0];
        if (trImageProfile !== undefined) {
            return { uri: "file://" + trImageProfile.IMAGE_PATH_LOCAL + '?' + new Date() }
        }
        else {
            //return default image
            return getThumnail()
        }
    },

    saveData: async function (table, obj) {
        try {
            if (table == 'TR_SUMMARY') {
                console.log('Save Data : ' + table + ' ' + JSON.stringify(obj));
            }

            await RealmSchemas.write(() => {
                RealmSchemas.create(table, obj, true);
            })
        } catch (error) {
            console.log(error)
        }
    },

    insertSameObject: async function (table, obj) {
        try {
            // var saved = null;
            // console.log('Save Data : ' + table + ' ' + JSON.stringify(obj));

            await RealmSchemas.write(() => {
                RealmSchemas.create(table, obj);
                // saved = RealmSchemas.create(table, obj);
            })
            // return saved;
        } catch (error) {
            console.log(error)
        }
    },

    updatedDataNew: function (table, primary_key, obj) {
        var updated = null;
        console.log('Update Data : ' + table + ' ' + JSON.stringify(obj));

        RealmSchemas.write(() => {
            updated = RealmSchemas.create(table, { REGION_CODE: primary_key, obj }, true);
        })
        return updated;
    },

    deleteDataNew: function (table, primary_key, obj) {
        var deleted = null;
        console.log('Delete Data : ' + table + ' ' + JSON.stringify(obj));

        RealmSchemas.write(() => {
            deleted = RealmSchemas.delete(table, { REGION_CODE: primary_key, obj }, true);
        })
        return deleted;
    },

    getAllData: function (table) {
        return RealmSchemas.objects(table);
    },
    getService: function (serviceName) {
        let service = RealmSchemas.objects("TM_SERVICE");
        return service.filtered('API_NAME == "' + serviceName + '\" ')[0];
    },

    getLastTracking: function (blokInsCode) {
        return RealmSchemas.objects('TM_INSPECTION_TRACK').filtered('BLOCK_INSPECTION_CODE = \"' + blokInsCode + '\" ').sorted('INSERT_TIME', true)[0];
    },


    getTotalData: function (table) {
        return RealmSchemas.objects(table).length;
    },

    findBy2: function (table, param, value) {
        let list = RealmSchemas.objects(table);
        return list.filtered(param + ' == \"' + value + '\" ')[0];
    },

    findBy: function (table, param, value) {
        let list = RealmSchemas.objects(table);
        return list.filtered(param + ' == \"' + value + '\" ');
    },

    query: function (table, query) {
        let list = RealmSchemas.objects(table);
        return list.filtered(query);
    },

    deleteAllData: function (table) {
        RealmSchemas.write(() => {
            let data = RealmSchemas.objects(table);
            RealmSchemas.delete(data);
        })
    },

    deleteRecord: function (table, index) {
        RealmSchemas.write(() => {
            RealmSchemas.delete(RealmSchemas.objects(table)[index]);
        });
    },

    deleteRecordByPK: function (table, PK_NAME, primary_key) {
        // console.log('Primary Key Finding Code PK: ' + JSON.stringify(primary_key))
        let result = RealmSchemas.objects(table).find(row => {
            // console.log('Row : ', row)
            return row[PK_NAME] == primary_key
        })
        if (result) {
            RealmSchemas.write(() => {
                RealmSchemas.delete(result);
            });
        }
    },

    deleteRecordPrimaryKey: function (table, primary_key) {
        let result = RealmSchemas.objects(table).find(row => {
            return row.FINDING_CODE == primary_key.FINDING_CODE
        })
        RealmSchemas.write(() => {
            RealmSchemas.delete(result);
        });
    },
    updateByPrimaryKey: function (table, param) {
        RealmSchemas.write(() => {
            RealmSchemas.create(table, param, true)
        });
    },

    updateLogin: function () {
        let data = RealmSchemas.objects('TR_LOGIN')[0];
        RealmSchemas.write(() => {
            data.STATUS = 'LOGOUT';
        });
    },

    //di pake buat update TR_BARIS_INSPECTION.TR_FINDING_CODES
    updateInspeksiFindingList(TR_BARIS_INSPECTION_id, TR_FINDING_CODES_value) {
        let selectedBarisInspection = this.findBy2("TR_BARIS_INSPECTION", "ID_INSPECTION", TR_BARIS_INSPECTION_id);
        RealmSchemas.write(() => {
            selectedBarisInspection.TR_FINDING_CODES = TR_FINDING_CODES_value
        })
    },

    updateAfdeling: function (param, index) {
        // let data = RealmSchemas.objects('TM_AFD')[index];
        let result = RealmSchemas.objects('TM_AFD').find(row => {
            return row.WERKS_AFD_CODE == param.WERKS_AFD_CODE
        })
        RealmSchemas.write(() => {
            data.REGION_CODE = result.REGION_CODE;
            data.COMP_CODE = result.COMP_CODE;
            data.EST_CODE = result.EST_CODE;
            data.WERKS = result.WERKS;
            data.AFD_CODE = result.AFD_CODE;
            data.AFD_NAME = result.AFD_NAME;
        });
    },

    updateBlock: function (param, index) {
        // let data = RealmSchemas.objects('TM_BLOCK')[index];
        let result = RealmSchemas.objects('TM_BLOCK').find(row => {
            return row.WERKS_AFD_BLOCK_CODE == param.WERKS_AFD_BLOCK_CODE
        })
        RealmSchemas.write(() => {
            data.REGION_CODE = result.REGION_CODE;
            data.COMP_CODE = result.COMP_CODE;
            data.EST_CODE = result.EST_CODE;
            data.WERKS = result.WERKS;
            data.AFD_CODE = result.AFD_CODE;
            data.BLOCK_CODE = result.BLOCK_CODE;
            data.BLOCK_NAME = result.BLOCK_NAME;
            data.WERKS_AFD_CODE = result.WERKS_AFD_CODE;
            data.LATITUDE_BLOCK = result.LATITUDE_BLOCK;
            data.LONGITUDE_BLOCK = result.LONGITUDE_BLOCK;
        });
    },

    updateRegion: function (param, index) {
        // let data = RealmSchemas.objects('TM_REGION')[index];
        let result = RealmSchemas.objects('TM_REGION').find(row => {
            return row.REGION_CODE == param.REGION_CODE
        })
        RealmSchemas.write(() => {
            data.NATIONAL = result.NATIONAL;
            data.REGION_NAME = result.REGION_NAME
        });
    },

    updateEstate: function (param, index) {
        // let data = RealmSchemas.objects('TM_EST')[index];
        let result = RealmSchemas.objects('TM_EST').find(row => {
            return row.WERKS == param.WERKS
        })
        RealmSchemas.write(() => {
            data.REGION_CODE = result.REGION_CODE;
            data.COMP_CODE = result.COMP_CODE;
            data.EST_CODE = result.EST_CODE;
            data.EST_NAME = result.EST_NAME;
            data.CITY = result.CITY;
        });
    },

    updateLandUse: function (param, index) {
        // let data = RealmSchemas.objects('TM_LAND_USE')[index];
        let result = RealmSchemas.objects('TM_LAND_USE').find(row => {
            return row.WERKS_AFD_BLOCK_CODE == param.WERKS_AFD_BLOCK_CODE
        })
        RealmSchemas.write(() => {
            data.NATIONAL = result.NATIONAL;
            data.REGION_CODE = result.REGION_CODE;
            data.COMP_CODE = result.COMP_CODE;
            data.WERKS = result.WERKS;
            data.SUB_BA_CODE = result.SUB_BA_CODE,
                data.KEBUN_CODE = result.KEBUN_CODE,
                data.AFD_CODE = result.AFD_CODE;
            data.AFD_NAME = result.AFD_NAME;
            data.WERKS_AFD_CODE = result.WERKS_AFD_CODE;
            data.BLOCK_CODE = result.BLOCK_CODE;
            data.BLOCK_NAME = result.BLOCK_NAME;
            data.LAND_USE_CODE = result.LAND_USE_CODE;
            data.LAND_USE_NAME = result.LAND_USE_NAME;
            data.LAND_USE_CODE_GIS = result.LAND_USE_CODE_GIS;
            data.SPMON = result.SPMON;
            data.LAND_CAT = result.LAND_CAT;
            data.LAND_CAT_L1_CODE = result.LAND_CAT_L1_CODE;
            data.LAND_CAT_L1 = result.LAND_CAT_L1;
            data.LAND_CAT_L2_CODE = result.LAND_CAT_L2_CODE;
            data.MATURITY_STATUS = result.MATURITY_STATUS;
            data.SCOUT_STATUS = result.SCOUT_STATUS;
            data.AGES = parresultam.AGES;
            data.HA_SAP = paresultram.HA_SAP;
            data.PALM_SAP = result.PALM_SAP;
            data.SPH_SAP = result.SPH_SAP;
            data.HA_GIS = result.HA_GIS;
            data.PALM_GIS = result.PALM_GIS;
            data.SPH_GIS = result.SPH_GIS;
        });
    },

    updateComp: function (param, index) {
        // let data = RealmSchemas.objects('TM_COMP')[index];
        let result = RealmSchemas.objects('TM_COMP').find(row => {
            return row.COMP_CODE == param.COMP_CODE
        })
        RealmSchemas.write(() => {
            data.NATIONAL = result.NATIONAL;
            data.REGION_CODE = result.REGION_CODE;
            data.COMP_NAME = result.COMP_NAME;
            data.ADDRESS = result.ADDRESS;
        });
    },

    updateInspectionHScore: function (blockCode, param) {
        let data = RealmSchemas.objects('TR_BLOCK_INSPECTION_H').filtered('BLOCK_INSPECTION_CODE == \"' + blockCode + '\" ')[0];
        RealmSchemas.write(() => {
            data.INSPECTION_SCORE = param[0];
            data.INSPECTION_RESULT = param[1];
        });
    },

    updateScoreInspeksi: function (param, index) {
        let data = RealmSchemas.objects('TR_BARIS_INSPECTION')[index];
        RealmSchemas.write(() => {
            data.INSPECTION_SCORE = param[0];
            data.INSPECTION_RESULT = param[1];
            data.FULFILL_BARIS = param[2];
        });
    },

    deleteTmRegionByRegionCode: function (value) {
        let total = RealmSchemas.objects('TM_REGION');
        for (var i = 0; i < total.length; i++) {
            if (value === total[i].REGION_CODE) {
                RealmSchemas.write(() => {
                    RealmSchemas.delete(RealmSchemas.objects('TM_REGION')[i]);
                });
            }
        }
    },

    findByWithList: function (table, listWhereClause, listValueClause) {
        let list = RealmSchemas.objects(table);
        let str = '';

        for (var i = 0; i < listWhereClause.length; i++) {
            if (i == 0) {
                str = listWhereClause[i] + '= "' + listValueClause[i] + '" '
            }
            else {
                str = str + ' AND ' + listWhereClause[i] + '= "' + listValueClause[i] + '" '
            }
        }
        // console.log(str)
        return list.filtered(str);
        // return list.filtered(param+' == \"'+ value +'\" AND BLOCK_INSPECTION_CODE == \"'+blokInsCode+ '\"');
    },

    getEstateName: function () {
        try {
            let auth = this.getAllData('TR_LOGIN')[0];
            let refCode = auth.REFFERENCE_ROLE;
            let valueRefCode = auth.LOCATION_CODE;
            let est;
            let arrEst = []
            if (refCode === 'REGION_CODE') {

                // if(valueRefCode.includes(',')){
                //   valueRefCode = valueRefCode.split(',')
                //   valueRefCode.map(item =>{
                //     let reg = this.findBy('TM_REGION', 'REGION_CODE', item);
                //     let comp = this.findBy('TM_COMP', 'REGION_CODE', reg.REGION_CODE);
                //     est = this.findBy('TM_EST', 'COMP_CODE', comp.COMP_CODE);
                //     arrEst.push(est.EST_NAME)
                //   })
                // }else{
                //   let reg = this.findBy('TM_REGION', 'REGION_CODE', valueRefCode);
                //   let comp = this.findBy('TM_COMP', 'REGION_CODE', reg.REGION_CODE);
                //   est = this.findBy('TM_EST', 'COMP_CODE', comp.COMP_CODE);
                // }

            } else if (refCode === 'COMP_CODE') {

                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        est = this.findBy2('TM_EST', 'COMP_CODE', item);
                        arrEst.push(est.EST_NAME)
                    })
                } else {
                    est = this.findBy2('TM_EST', 'COMP_CODE', valueRefCode);
                    arrEst.push(est.EST_NAME)
                }

            } else if (refCode === 'BA_CODE') {

                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        est = this.findBy2('TM_EST', 'WERKS', item);
                        arrEst.push(est.EST_NAME)
                    })
                } else {
                    est = this.findBy2('TM_EST', 'WERKS', valueRefCode);
                    arrEst.push(est.EST_NAME)
                }

            } else if (refCode === 'AFD_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', item);
                        est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
                        arrEst.push(est.EST_NAME)
                    })
                } else {
                    let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', valueRefCode);
                    est = this.findBy('TM_EST', 'WERKS', afd.WERKS);
                    arrEst.push(est.EST_NAME)
                }
            }
            return arrEst
        } catch (error) {
            return []
        }

    },
    getRegionName: function () {
        try {
            let auth = this.getAllData('TR_LOGIN')[0];
            let refCode = auth.REFFERENCE_ROLE;
            let valueRefCode = auth.LOCATION_CODE;
            let arrEst = []
            let est;
            if (refCode === 'NATIONAL') {
                let data = TaskServices.getAllData('TM_REGION')
                if (data !== undefined) {
                    data.map(item => {
                        arrEst.push(item.REGION_NAME)
                    })
                }
            } else if (refCode === 'REGION_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        let reg = TaskServices.findBy2('TM_REGION', 'REGION_CODE', item);
                        arrEst.push(reg.REGION_NAME)
                    })
                } else {
                    let reg = TaskServices.findBy2('TM_REGION', 'REGION_CODE', valueRefCode);
                    arrEst.push(reg.REGION_NAME)
                }

            } else if (refCode === 'BA_CODE') {

                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode = valueRefCode[0]
                }
                est = this.findBy2('TM_EST', 'WERKS', valueRefCode);
                let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                arrEst.push(reg.REGION_NAME)

            } else if (refCode === 'AFD_CODE') {

                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode = valueRefCode[0]
                }

                let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', valueRefCode);
                est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
                let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                arrEst.push(reg.REGION_NAME)
            }

            return arrEst;
        } catch (error) {
            return []
        }

    },

    getRegionCode: function () {
        try {
            let auth = this.getAllData('TR_LOGIN')[0];
            let refCode = auth.REFFERENCE_ROLE;
            let valueRefCode = auth.LOCATION_CODE;
            let arrEst = []
            let est;
            if (refCode === 'NATIONAL') {
                let data = TaskServices.getAllData('TM_REGION');
                if (data !== undefined) {
                    data.map(item => {
                        if (!arrEst.includes(item.REGION_CODE)) {
                            arrEst.push(item.REGION_CODE);
                        }
                    })
                }
            } else if (refCode === 'COMP_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        let comp = TaskServices.findBy2('TM_COMP', 'COMP_CODE', item);
                        if (!arrEst.includes(comp.REGION_CODE)) {
                            arrEst.push(comp.REGION_CODE)
                        }
                    });
                } else {
                    let comp = TaskServices.findBy2('TM_COMP', 'COMP_CODE', valueRefCode);
                    if (!arrEst.includes(comp.REGION_CODE)) {
                        arrEst.push(comp.REGION_CODE)
                    }
                }
            } else if (refCode === 'REGION_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        let reg = TaskServices.findBy2('TM_REGION', 'REGION_CODE', item);
                        if (!arrEst.includes(reg.REGION_CODE)) {
                            arrEst.push(reg.REGION_CODE)
                        }
                    });
                } else {
                    let reg = TaskServices.findBy2('TM_REGION', 'REGION_CODE', valueRefCode);
                    if (!arrEst.includes(reg.REGION_CODE)) {
                        arrEst.push(reg.REGION_CODE)
                    }
                }
            } else if (refCode === 'BA_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        est = this.findBy2('TM_EST', 'WERKS', item);
                        let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                        if (!arrEst.includes(reg.REGION_CODE)) {
                            arrEst.push(reg.REGION_CODE)
                        }
                    });
                }
                else {
                    est = this.findBy2('TM_EST', 'WERKS', valueRefCode);
                    let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                    if (!arrEst.includes(reg.REGION_CODE)) {
                        arrEst.push(reg.REGION_CODE)
                    }
                }
            } else if (refCode === 'AFD_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(',')
                    valueRefCode.map(item => {
                        let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', item);
                        est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
                        let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                        if (!arrEst.includes(reg.REGION_CODE)) {
                            arrEst.push(reg.REGION_CODE);
                        }
                    });
                }
                else {
                    let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', valueRefCode);
                    est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
                    let reg = this.findBy2('TM_REGION', 'REGION_CODE', est.REGION_CODE);
                    if (!arrEst.includes(reg.REGION_CODE)) {
                        arrEst.push(reg.REGION_CODE)
                    }
                }
            }
            return arrEst;
        } catch (error) {
            console.log("catch getRegionCode", error);
            return []
        }
    },

    getBlockInAFD: function () {
        let arrBlock = []
        try {
            let auth = this.getAllData('TR_LOGIN')[0];
            let refCode = auth.REFFERENCE_ROLE;
            let valueRefCode = auth.LOCATION_CODE;
            if (refCode === 'AFD_CODE') {
                if (valueRefCode.includes(',')) {
                    valueRefCode = valueRefCode.split(",");
                    valueRefCode.map(item => {
                        const afd_code = item.substring(4, 5);
                        let data = this.query('TM_BLOCK', `AFD_CODE = "${afd_code}"`)
                        if (data.length > 0) {
                            data.map(item2 => {
                                arrBlock.push(item2.BLOCK_NAME)
                            })
                        }
                    });
                } else {
                    const afd_code = valueRefCode.substring(4, 5);
                    let data = this.query('TM_BLOCK', `AFD_CODE = "${afd_code}"`)
                    if (data.length > 0) {
                        data.map(item2 => {
                            arrBlock.push(item2.BLOCK_NAME)
                        })
                    }
                }
            }
            return arrBlock
        } catch (error) {
            return arrBlock
        }
    },
};

export default TaskServices;
