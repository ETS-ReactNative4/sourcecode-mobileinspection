import RealmSchemas from './RealmSchema'
import R from 'ramda'

const TaskServices = {

  getPath: function () {
    return RealmSchemas.path;
  },

  saveData: async function (table, obj) {
    try {      
      console.log('Save Data : ' + table + ' ' + JSON.stringify(obj));
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
      console.log('Save Data : ' + table + ' ' + JSON.stringify(obj));

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

  // deleteTest: function (object) {
  //   RealmSchemas.write(() => {
  //     RealmSchemas.delete(object);
  //   });
  // },


  // deleteTrackInsByTrackInsCode: function (value) {
  //   let total = RealmSchemas.objects('TR_TRACK_INSPECTION');
  //   for (var i = 0; i < total.length; i++) {
  //     if (value === total[i].TRACK_INSPECTION_CODE) {
  //       RealmSchemas.write(() => {
  //         RealmSchemas.delete(RealmSchemas.objects('TR_TRACK_INSPECTION')[i]);
  //       });
  //     }
  //   }
  // },

  // deleteInpeksiHeaderByBlockInsCode: function (value) {
  //   let total = RealmSchemas.objects('TR_BLOCK_INSPECTION_H');
  //   for (var i = 0; i < total.length; i++) {
  //     if (value === total[i].BLOCK_INSPECTION_CODE) {
  //       RealmSchemas.write(() => {
  //         RealmSchemas.delete(RealmSchemas.objects('TR_BLOCK_INSPECTION_H')[i]);
  //       });
  //     }
  //   }
  // },

  // deleteTRBaris: function (value) {
  //   let total = RealmSchemas.objects('TR_BARIS_INSPECTION');
  //   for (var i = 0; i < total.length; i++) {
  //     if (value === total[i].BLOCK_INSPECTION_CODE) {
  //       RealmSchemas.write(() => {
  //         RealmSchemas.delete(RealmSchemas.objects('TR_BARIS_INSPECTION')[i]);
  //       });
  //     }
  //   }
  // },

  // deleteTRBarisByID: function (value) {
  //   let total = RealmSchemas.objects('TR_BARIS_INSPECTION');
  //   for (var i = 0; i < total.length; i++) {
  //     if (value === total[i].ID) {
  //       RealmSchemas.write(() => {
  //         RealmSchemas.delete(RealmSchemas.objects('TR_BARIS_INSPECTION')[i]);
  //       });
  //     }
  //   }
  // },

  // deleteBy: function (table, param, value) {
  //   let sortedPeople = RealmSchemas.objects(table).sorted(param)
  //   let Dave = RealmSchemas.objects(table).filtered("ID=1")
  //   let indexOfDave = sortedPeople.indexOf(Dave)
  //   return indexOfDave;
  // },

  //   deleteByQuery(table, param, value){    
  //     RealmSchemas.write(() => {
  //         RealmSchemas.delete(RealmSchemas.objects(table).filtered(param+' == \"'+ value +'\" '));        
  //     })
  //   },


  //deleteby

  //   RealmSchema.write(() => {           
  //     RealmSchema.delete(RealmSchema.objects('TR_TRACK_INSPECTION')[0]);

  // });

  //update yg jalan
  // var data = RealmSchema.objects('TR_TRACK_INSPECTION');
  // RealmSchema.write(() => {
  //     data[0].LAT_TRACK = 'HATI'
  // })

  // updateData: function (table, whereClause, value) {
  //   var data = RealmSchemas.objects(table);
  //   var field = whereClause;
  //   RealmSchemas.write(() => {
  //     data[0].field = value
  //   })
  // },

  // updateData2: function (table, whereClause, valueClause, param, value) {
  //   let list = RealmSchemas.objects(table);

  //   RealmSchemas.write(() => {
  //     for (var i = 0; i < list.length; i++) {
  //       data[i].param = value[i]
  //     }
  //   });
  // },

  updateLogin: function(){
    let data = RealmSchemas.objects('TR_LOGIN')[0];
    RealmSchemas.write(() => {
      data.STATUS = 'LOGOUT';
    });
  },

  updateAfdeling: function(param, index){
    let data = RealmSchemas.objects('TM_AFD')[index];
    RealmSchemas.write(() => {
      data.REGION_CODE = param.REGION_CODE;
      data.COMP_CODE = param.COMP_CODE;
      data.EST_CODE = param.EST_CODE;
      data.WERKS = param.WERKS;
      data.AFD_CODE = param.AFD_CODE;
      data.AFD_NAME = param.AFD_NAME;
    });
  },

  updateBlock: function(param, index){
    let data = RealmSchemas.objects('TM_BLOCK')[index];
    RealmSchemas.write(() => {
      data.REGION_CODE = param.REGION_CODE;
      data.COMP_CODE = param.COMP_CODE;
      data.EST_CODE = param.EST_CODE;
      data.WERKS = param.WERKS;
      data.AFD_CODE = param.AFD_CODE;
      data.BLOCK_CODE = param.BLOCK_CODE;
      data.BLOCK_NAME = param.BLOCK_NAME;
      data.WERKS_AFD_CODE = param.WERKS_AFD_CODE;
      data.LATITUDE_BLOCK = param.LATITUDE_BLOCK;
      data.LONGITUDE_BLOCK = param.LONGITUDE_BLOCK;
    });
  },

  updateRegion: function (param, index){
    let data = RealmSchemas.objects('TM_REGION')[index];
    RealmSchemas.write(() => {
      data.NATIONAL = param.NATIONAL;
      data.REGION_NAME = param.REGION_NAME
    });
  },

  updateEstate: function(param, index){
    let data = RealmSchemas.objects('TM_EST')[index];
    RealmSchemas.write(() => {
      data.REGION_CODE = param.REGION_CODE;
      data.COMP_CODE = param.COMP_CODE;
      data.EST_CODE = param.EST_CODE;
      data.EST_NAME = param.EST_NAME;
      data.CITY = param.CITY;
    });
  },

  updateLandUse: function(param, index){
    let data = RealmSchemas.objects('TM_LAND_USE')[index];
    RealmSchemas.write(() => {
      data.NATIONAL = param.NATIONAL;
      data.REGION_CODE = param.REGION_CODE;
      data.COMP_CODE = param.COMP_CODE;
      data.WERKS = param.WERKS;
      data.SUB_BA_CODE = param.SUB_BA_CODE,
      data.KEBUN_CODE = param.KEBUN_CODE,
      data.AFD_CODE = param.AFD_CODE;
      data.AFD_NAME = param.AFD_NAME;
      data.WERKS_AFD_CODE = param.WERKS_AFD_CODE;
      data.BLOCK_CODE = param.BLOCK_CODE;
      data.BLOCK_NAME = param.BLOCK_NAME;
      data.LAND_USE_CODE = param.LAND_USE_CODE;
      data.LAND_USE_NAME = param.LAND_USE_NAME;
      data.LAND_USE_CODE_GIS= param.LAND_USE_CODE_GIS;
      data.SPMON = param.SPMON;
      data.LAND_CAT= param.LAND_CAT;
      data.LAND_CAT_L1_CODE = param.LAND_CAT_L1_CODE;
      data.LAND_CAT_L1 = param.LAND_CAT_L1;
      data.LAND_CAT_L2_CODE = param.LAND_CAT_L2_CODE;
      data.MATURITY_STATUS = param.MATURITY_STATUS;
      data.SCOUT_STATUS = param.SCOUT_STATUS;
      data.AGES = param.AGES;
      data.HA_SAP = param.HA_SAP;
      data.PALM_SAP = param.PALM_SAP;
      data.SPH_SAP = param.SPH_SAP;
      data.HA_GIS = param.HA_GIS;
      data.PALM_GIS = param.PALM_GIS;
      data.SPH_GIS = param.SPH_GIS;
    });
  },

  updateComp: function(param, index){
    let data = RealmSchemas.objects('TM_COMP')[index];
    RealmSchemas.write(() => {
      data.NATIONAL = param.NATIONAL;
      data.REGION_CODE = param.REGION_CODE;
      data.COMP_NAME = param.COMP_NAME;
      data.ADDRESS = param.ADDRESS;
    });
  },

  updateContent: function(param, index){
    let data = RealmSchemas.objects('TM_CONTENT')[index];
    RealmSchemas.write(() => {
      data.GROUP_CATEGORY = param.GROUP_CATEGORY;
      data.CATEGORY = param.CATEGORY;
      data.CONTENT_NAME = param.CONTENT_NAME;
      data.UOM = param.UOM;
      data.FLAG_TYPE = param.FLAG_TYPE;
      data.URUTAN = param.URUTAN;
    });
  },

  updateFindingDownload: function(param, index){
    let data = RealmSchemas.objects('TR_FINDING')[index];
    RealmSchemas.write(() => {
      data.WERKS = param.WERKS;
      data.AFD_CODE = param.AFD_CODE;
      data.BLOCK_CODE = param.BLOCK_CODE;
      data.FINDING_CATEGORY = param.FINDING_CATEGORY;
      data.FINDING_DESC = param.FINDING_DESC;
      data.FINDING_PRIORITY = param.FINDING_PRIORITY;      
      data.DUE_DATE = param.DUE_DATE;
      data.STATUS = param.STATUS;
      data.ASSIGN_TO = param.ASSIGN_TO;
      data.PROGRESS = param.PROGRESS;
      data.LAT_FINDING = param.LAT_FINDING;
      data.LONG_FINDING = param.LONG_FINDING;      
      data.REFFERENCE_INS_CODE = param.REFFERENCE_INS_CODE;
      data.INSERT_USER = param.INSERT_USER;
      data.INSERT_TIME = param.INSERT_TIME;
      data.STATUS_SYNC = param.STATUS_SYNC;
    });
  },

  updateParamTrack: function(param, index){
    let data = RealmSchemas.objects('TM_TIME_TRACK')[index];
    RealmSchemas.write(() => {
      data.PARAMETER_GROUP = param.PARAMETER_GROUP;
      data.PARAMETER_NAME = param.PARAMETER_NAME;
      data.DESC = param.DESC;
      data.NO_URUT = param.NO_URUT;
    });
  },
  
  updateFinding: function (table, param, index){
    let data = RealmSchemas.objects(table)[index];
    RealmSchemas.write(() => {
      data.STATUS = param[0];
      data.PROGRESS = param[1];
      data.STATUS_SYNC = param[2];
      data.DUE_DATE = param[3];
    });
  },

  updateFindingSync: function (table, param, index){
    let data = RealmSchemas.objects(table)[index];
    alert(JSON.stringify(param))
    RealmSchemas.write(() => {
      data.PROGRESS = param[0];
      data.STATUS_SYNC = param[1];
      data.DUE_DATE = param[2];
    });
  },

  updateInspeksiSync: function (table, param, index){
    let data = RealmSchemas.objects(table)[index];
    RealmSchemas.write(() => {
      data.STATUS_SYNC = param;
    });
  },

  updateStatusImage: function (table, param, index){
    let data = RealmSchemas.objects(table)[index];
    RealmSchemas.write(() => {
      data.STATUS_SYNC = param;
    });
  },

  updateInspectionHScore: function (blockCode, param) {
    let data = RealmSchemas.objects('TR_BLOCK_INSPECTION_H').filtered('BLOCK_INSPECTION_CODE == \"' + blockCode + '\" ')[0];
    RealmSchemas.write(() => {
      data.INSPECTION_SCORE = param[0];
      data.INSPECTION_RESULT = param[1];
    });
  },

  updateScoreInspeksi: function (param, index){
    let data = RealmSchemas.objects('TR_BARIS_INSPECTION')[index];
    RealmSchemas.write(() => {
      data.INSPECTION_SCORE = param[0];
      data.INSPECTION_RESULT = param[1];
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

  updateTmRegionByRegionCode: function (regionCode, param) {
    let data = RealmSchemas.objects('TM_REGION').filtered('REGION_CODE == \"' + regionCode + '\" ')[0];
    RealmSchemas.write(() => {
      data.NATIONAL = param[0];
      data.REGION_CODE = param[1];
      data.REGION_NAME = param[2];
    });
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
    let auth = this.getAllData('TR_LOGIN')[0];
    let refCode = auth.REFFERENCE_ROLE;
    let valueRefCode = auth.LOCATION_CODE;
    let est;
    if (refCode === 'REGION_CODE') {
      let reg = this.findBy2('TM_REGION', 'REGION_CODE', valueRefCode);
      let comp = this.findBy2('TM_COMP', 'REGION_CODE', reg.REGION_CODE);
      est = this.findBy2('TM_EST', 'COMP_CODE', comp.COMP_CODE);
      return est.EST_NAME;
    } else if (refCode === 'COMP_CODE') {
      est = this.findBy2('TM_EST', 'COMP_CODE', valueRefCode);
      return est.EST_NAME
    } else if (refCode === 'BA_CODE') {
      est = this.findBy2('TM_EST', 'WERKS', valueRefCode);
      return est.EST_NAME
    } else if (refCode === 'AFD_CODE') {
      let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', valueRefCode);
      // est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
      return afd.EST_NAME
    }
  },

  getWerks: function () {
    let auth = this.getAllData('TR_LOGIN')[0];
    let refCode = auth.REFFERENCE_ROLE;
    let valueRefCode = auth.LOCATION_CODE
    let est;
    if (refCode === 'REGION_CODE') {
      let reg = this.findBy2('TM_REGION', 'REGION_CODE', valueRefCode);
      let comp = this.findBy2('TM_COMP', 'REGION_CODE', reg.REGION_CODE);
      est = this.findBy2('TM_EST', 'COMP_CODE', comp.COMP_CODE);
      return est.WERKS;
    } else if (refCode === 'COMP_CODE') {
      est = this.findBy2('TM_EST', 'COMP_CODE', valueRefCode);
      return est.WERKS
    } else if (refCode === 'BA_CODE') {
      est = this.findBy2('TM_EST', 'WERKS', valueRefCode);
      return est.WERKS
    } else if (refCode === 'AFD_CODE') {
      let afd = this.findBy2('TM_AFD', 'WERKS_AFD_CODE', valueRefCode);
      // est = this.findBy2('TM_EST', 'WERKS', afd.WERKS);
      return afd.WERKS
    }
  }
};

export default TaskServices;
