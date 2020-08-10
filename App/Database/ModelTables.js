const SCHEMA_VERSION = 29;

const TR_CONFIG = {
    name: 'TR_CONFIG',
    primaryKey: 'VERSION',
    properties: {
        VERSION: 'string',
        FORCE_UPDATE: { type: 'bool', default: false }
    }
};

const TR_LOGIN = {
    name: 'TR_LOGIN',
    primaryKey: 'USER_AUTH_CODE',
    properties: {
        NIK: 'string',
        ACCESS_TOKEN: 'string',
        JOB_CODE: 'string',
        LOCATION_CODE: 'string',
        REFFERENCE_ROLE: 'string',
        USERNAME: 'string',
        USER_AUTH_CODE: 'string',
        USER_ROLE: 'string',
        CURR_WERKS: { type: 'string', default: '', optional: true },
        SERVER_NAME_INDEX: 'string',
        STATUS: 'string'
    }
};

const TR_BLOCK_INSPECTION_H = {
    name: 'TR_BLOCK_INSPECTION_H',
    primaryKey: 'BLOCK_INSPECTION_CODE',
    properties: {
        BLOCK_INSPECTION_CODE: 'string',
        ID_INSPECTION: 'string',
        WERKS: 'string',
        AFD_CODE: 'string',
        BLOCK_CODE: 'string',
        AREAL: 'string',
        INSPECTION_TYPE: "string",
        STATUS_BLOCK: 'string',
        INSPECTION_DATE: 'string',
        INSPECTION_RESULT: 'string',
        INSPECTION_SCORE: 'string',
        STATUS_SYNC: 'string',
        SYNC_TIME: 'string',
        START_INSPECTION: 'string',
        END_INSPECTION: 'string',
        LAT_START_INSPECTION: 'string',
        LONG_START_INSPECTION: 'string',
        LAT_END_INSPECTION: 'string',
        LONG_END_INSPECTION: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string',
        TIME: 'string',
        DISTANCE: 'string',

        //localParam
        inspectionType: 'string'
    }
}

const TR_BLOCK_INSPECTION_D = {
    name: 'TR_BLOCK_INSPECTION_D',
    primaryKey: 'BLOCK_INSPECTION_CODE_D',
    properties: {
        BLOCK_INSPECTION_CODE_D: 'string',
        BLOCK_INSPECTION_CODE: 'string',
        ID_INSPECTION: 'string',
        CONTENT_INSPECTION_CODE: 'string',
        VALUE: 'string',
        AREAL: 'string',
        STATUS_SYNC: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string',
    }
}

const TM_INSPECTION_TRACK = {
    name: 'TM_INSPECTION_TRACK',
    primaryKey: 'TRACK_INSPECTION_CODE',
    properties: {
        TRACK_INSPECTION_CODE: 'string',
        BLOCK_INSPECTION_CODE: 'string',
        ID_INSPECTION: 'string',
        DATE_TRACK: 'string',
        LAT_TRACK: 'string',
        LONG_TRACK: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string',
        STATUS_SYNC: 'string'
    }
}

const TR_GENBA_INSPECTION = {
    name: 'TR_GENBA_INSPECTION',
    primaryKey: 'BLOCK_INSPECTION_CODE',
    properties: {
        BLOCK_INSPECTION_CODE: 'string',
        GENBA_USER: { type: 'list', objectType: 'TR_GENBA_SELECTED' },
        STATUS_SYNC: 'string'
    }
}

//local table
const TR_BARIS_INSPECTION = {
    name: 'TR_BARIS_INSPECTION',
    primaryKey: 'ID_INSPECTION',
    properties: {
        ID_INSPECTION: 'string',
        BLOCK_INSPECTION_CODE: 'string',
        EST_NAME: 'string',
        WERKS: 'string',
        BLOCK_CODE: 'string',
        AFD_CODE: 'string',
        WERKS_AFD_BLOCK_CODE: 'string',
        INSPECTION_DATE: 'string',
        STATUS_SYNC: 'string',
        INSPECTION_RESULT: 'string',
        INSPECTION_SCORE: 'string',
        FULFILL_BARIS: 'string',
        TR_FINDING_CODES: { type: 'list', objectType: 'string' },

        //LOCAL
        syncHeader: 'string',
        syncDetail: 'string',
        syncTracking: 'string',
        syncImage: 'string'
    }
}

//local
const TR_GENBA_SELECTED = {
    name: 'TR_GENBA_SELECTED',
    primaryKey: 'USER_AUTH_CODE',
    properties: {
        USER_AUTH_CODE: 'string',
        EMPLOYEE_NIK: 'string',
        USER_ROLE: 'string',
        LOCATION_CODE: { type: 'string', optional: true },
        REF_ROLE: 'string',
        JOB: 'string',
        FULLNAME: 'string',
        REGION_CODE: { type: 'string', optional: true }
    }
}

const TR_IMAGE = {
    name: 'TR_IMAGE',
    primaryKey: 'IMAGE_CODE',
    properties: {
        TR_CODE: 'string',
        IMAGE_CODE: 'string',
        IMAGE_NAME: 'string',
        IMAGE_PATH_LOCAL: 'string',
        IMAGE_URL: 'string',
        STATUS_IMAGE: 'string',
        STATUS_SYNC: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string'
    }
}

const TR_IMAGE_PROFILE = {
    name: 'TR_IMAGE_PROFILE',
    primaryKey: 'USER_AUTH_CODE',
    properties: {
        USER_AUTH_CODE: 'string',
        IMAGE_NAME: 'string',
        IMAGE_PATH_LOCAL: 'string',
        IMAGE_URL: 'string',
        STATUS_IMAGE: 'string',
        STATUS_SYNC: 'string',
        INSERT_TIME: 'string',
    }
}

const TM_REGION = {
    name: 'TM_REGION',
    primaryKey: 'REGION_CODE',
    properties: {
        NATIONAL: 'string',
        REGION_CODE: 'string',
        REGION_NAME: 'string'
    }
}

const TM_COMP = {
    name: 'TM_COMP',
    primaryKey: 'COMP_CODE',
    properties: {
        NATIONAL: 'string',
        REGION_CODE: 'string',
        COMP_CODE: 'string',
        COMP_NAME: 'string',
        ADDRESS: 'string'
    }
}

const TM_EST = {
    name: 'TM_EST',
    primaryKey: 'WERKS',
    properties: {
        REGION_CODE: 'string',
        COMP_CODE: 'string',
        EST_CODE: 'string',
        EST_NAME: 'string',
        WERKS: 'string',
        CITY: 'string',
        LONGITUDE: { type: 'double', default: 0, optional: true },
        LATITUDE: { type: 'double', default: 0, optional: true }
    }
}

const TM_AFD = {
    name: 'TM_AFD',
    primaryKey: 'WERKS_AFD_CODE',
    properties: {
        REGION_CODE: 'string',
        COMP_CODE: 'string',
        EST_CODE: 'string',
        WERKS: 'string',
        AFD_CODE: 'string',
        AFD_NAME: 'string',
        WERKS_AFD_CODE: 'string'
    }
}

const TM_BLOCK = {
    name: 'TM_BLOCK',
    primaryKey: 'WERKS_AFD_BLOCK_CODE',
    properties: {
        REGION_CODE: 'string',
        COMP_CODE: 'string',
        EST_CODE: 'string',
        WERKS: 'string',
        JUMLAH_TPH: { type: 'int', default: 0 },
        AFD_CODE: 'string',
        BLOCK_CODE: 'string',
        BLOCK_NAME: 'string',
        WERKS_AFD_CODE: 'string',
        WERKS_AFD_BLOCK_CODE: 'string',
        LATITUDE_BLOCK: 'string',
        LONGITUDE_BLOCK: 'string',
        TOPOGRAPHY: 'string',
    }
}

const TR_CATEGORY = {
    name: 'TR_CATEGORY',
    primaryKey: 'CATEGORY_CODE',
    properties: {
        CATEGORY_CODE: 'string',
        CATEGORY_NAME: 'string',
        ICON: 'string',
        ICON_URL: 'string'
    }
}

const TR_CONTACT = {
    name: 'TR_CONTACT',
    primaryKey: 'USER_AUTH_CODE',
    properties: {
        USER_AUTH_CODE: 'string',
        EMPLOYEE_NIK: 'string',
        USER_ROLE: 'string',
        LOCATION_CODE: { type: 'string', optional: true },
        REF_ROLE: 'string',
        JOB: 'string',
        FULLNAME: 'string'
    }
}

const TR_FINDING = {
    name: 'TR_FINDING',
    primaryKey: 'FINDING_CODE',
    properties: {
        FINDING_CODE: { type: 'string' },
        WERKS: { type: 'string', optional: true },
        AFD_CODE: { type: 'string', optional: true },
        BLOCK_CODE: 'string',
        FINDING_CATEGORY: 'string',
        FINDING_DESC: 'string',
        FINDING_PRIORITY: 'string',
        DUE_DATE: 'string',//{ type: 'int', default: 0 },
        STATUS: { type: 'string', optional: true },
        ASSIGN_TO: 'string',
        PROGRESS: { type: 'int', default: 0 },//'string',
        LAT_FINDING: 'string',
        LONG_FINDING: 'string',
        REFFERENCE_INS_CODE: 'string',
        INSERT_USER: { type: 'string', optional: true },
        INSERT_TIME: { type: 'string', optional: true },
        UPDATE_USER: { type: 'string', optional: true },
        UPDATE_TIME: { type: 'string', optional: true },
        STATUS_SYNC: 'string',
        RATING_VALUE: { type: 'int', default: 0 },
        RATING_MESSAGE: { type: 'string', optional: true },
        END_TIME: { type: 'string', optional: true },

        //LOCAL
        syncImage: 'string'
    }
}

const TR_RATING = {
    name: 'TR_RATING',
    primaryKey: 'FINDING_CODE',
    properties: {
        FINDING_CODE: 'string',
        RATE: 'int',
        MESSAGE: { type: 'string', optional: true, default: '' }
    }
}

const TR_FINDING_COMMENT = {
    name: 'TR_FINDING_COMMENT',
    primaryKey: 'FINDING_COMMENT_ID',
    properties: {
        FINDING_COMMENT_ID: { type: 'string' },
        FINDING_CODE: { type: 'string' },
        USER_AUTH_CODE: { type: 'string' },
        MESSAGE: { type: 'string' },
        INSERT_TIME: { type: 'string' },
        TAGS: { type: 'list', objectType: 'TR_CONTACT' },
        //LOCAL PARAM
        STATUS_SYNC: { type: 'string' },
        USERNAME: { type: 'string' }
    }
}

const TM_KRITERIA = {
    name: 'TM_KRITERIA',
    primaryKey: 'KRITERIA_CODE',
    properties: {
        KRITERIA_CODE: 'string',
        COLOR: 'string',
        GRADE: 'string',
        BATAS_ATAS: 'float',
        BATAS_BAWAH: 'float'
    }
}

const TM_PJS = {
    name: 'TM_PJS',
    properties: {
        EMPLOYEE_NIK: 'string',
        USERNAME: 'string',
        NAMA_LENGKAP: 'string',
        JOB_CODE: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string',
        UPDATE_USER: 'string',
        UPDATE_TIME: 'string',
        DELETE_USER: 'string',
        DELETE_TIME: 'string'
    }
}

const TM_LAND_USE = {
    name: 'TM_LAND_USE',
    primaryKey: 'WERKS_AFD_BLOCK_CODE',
    properties: {
        NATIONAL: 'string',
        REGION_CODE: 'string',
        COMP_CODE: 'string',
        WERKS: 'string',
        SUB_BA_CODE: 'string',
        KEBUN_CODE: 'string',
        AFD_CODE: 'string',
        AFD_NAME: 'string',
        WERKS_AFD_CODE: 'string',
        BLOCK_CODE: 'string',
        BLOCK_NAME: 'string',
        WERKS_AFD_BLOCK_CODE: 'string',
        LAND_USE_CODE: 'string',
        LAND_USE_NAME: 'string',
        LAND_USE_CODE_GIS: 'string',
        SPMON: { type: 'int', default: 0 },
        LAND_CAT: 'string',
        LAND_CAT_L1_CODE: 'string',
        LAND_CAT_L1: 'string',
        LAND_CAT_L2_CODE: 'string',
        MATURITY_STATUS: 'string',
        SCOUT_STATUS: 'string',
        AGES: { type: 'int', default: 0 },
        HA_SAP: 'string',
        PALM_SAP: 'string',
        SPH_SAP: 'string',
        HA_GIS: 'string',
        PALM_GIS: { type: 'int', default: 0 },
        SPH_GIS: { type: 'int', default: 0 }
    }
}

const TM_CONTENT = {
    name: 'TM_CONTENT',
    primaryKey: 'CONTENT_CODE',
    properties: {
        CONTENT_CODE: 'string',
        GROUP_CATEGORY: 'string',
        CATEGORY: 'string',
        CONTENT_NAME: 'string',
        CONTENT_TYPE: 'string',
        UOM: 'string',
        FLAG_TYPE: 'string',
        BOBOT: { type: 'int', default: 0 },
        URUTAN: 'string',
        TBM0: 'string',
        TBM1: 'string',
        TBM2: 'string',
        TBM3: 'string',
        TM: 'string'
    }
}

const TM_CONTENT_LABEL = {
    name: 'TM_CONTENT_LABEL',
    primaryKey: 'CONTENT_LABEL_CODE',
    properties: {
        CONTENT_LABEL_CODE: 'string',
        CONTENT_CODE: 'string',
        LABEL_NAME: 'string',
        LABEL_ICON: 'string',
        URUTAN_LABEL: 'string',
        LABEL_SCORE: { type: 'int', default: 0 }
    }
}

const TM_TIME_TRACK = {
    name: 'TM_TIME_TRACK',
    primaryKey: 'PARAMETER_GROUP',
    properties: {
        PARAMETER_GROUP: 'string',
        PARAMETER_NAME: 'string',
        DESC: 'string',
        NO_URUT: { type: 'int', default: 0 }
    }
}

const TM_KUALITAS = {
    name: 'TM_KUALITAS',
    primaryKey: 'ID_KUALITAS',
    properties: {
        ID_KUALITAS: 'string',
        NAMA_KUALITAS: 'string',
        UOM: 'string',
        GROUP_KUALITAS: 'string',
        ACTIVE_STATUS: 'string',
        PENALTY_STATUS: 'string',
        SHORT_NAME: 'string'
    }
}

const TR_H_EBCC_VALIDATION = {
    name: 'TR_H_EBCC_VALIDATION',
    primaryKey: 'EBCC_VALIDATION_CODE',
    properties: {
        EBCC_VALIDATION_CODE: 'string',
        WERKS: 'string',
        AFD_CODE: 'string',
        BLOCK_CODE: 'string',
        NO_TPH: 'string',
        STATUS_TPH_SCAN: 'string',
        ALASAN_MANUAL: 'string',
        LAT_TPH: 'string',
        LON_TPH: 'string',
        DELIVERY_CODE: 'string',
        STATUS_DELIVERY_CODE: 'string',
        TOTAL_JANJANG: 'string',
        STATUS_SYNC: 'string',
        SYNC_TIME: 'string',
        INSERT_USER: 'string',
        INSERT_TIME: 'string',

        //LOCAL
        syncImage: 'string',
        syncDetail: 'string'
    }
}

const TR_D_EBCC_VALIDATION = {
    name: 'TR_D_EBCC_VALIDATION',
    primaryKey: 'EBCC_VALIDATION_CODE_D',
    properties: {
        EBCC_VALIDATION_CODE_D: 'string',
        EBCC_VALIDATION_CODE: 'string',
        GROUP_KUALITAS: 'string',
        UOM: 'string',
        ID_KUALITAS: 'string',
        NAMA_KUALITAS: 'string',
        JUMLAH: 'int',
        INSERT_TIME: 'string',
        INSERT_USER: 'string',
        STATUS_SYNC: 'string',
        SYNC_TIME: 'string'
    }
}

const TR_NOTIFICATION = {
    name: 'TR_NOTIFICATION',
    primaryKey: 'NOTIFICATION_ID',
    properties: {
        NOTIFICATION_ID: 'string',
        NOTIFICATION_TIME: 'date',
        NOTIFICATION_STATUS: { type: 'int', default: 0 },
        NOTIFICATION_TYPE: { type: 'int', default: 0 },
        FINDING_UPDATE_TIME: { type: 'string' },
        FINDING_CODE: { type: 'string' },
    }
}
const TR_SYNC_LOG = {
    name: 'TR_SYNC_LOG',
    primaryKey: 'SYNC_TIME_ID',
    properties: {
        SYNC_TIME_ID: 'int',
        SYNC_TIME: 'date'
    }
}
const TM_SERVICE = {
    name: 'TM_SERVICE',
    primaryKey: 'SERVICE_ID',
    properties: {
        SERVICE_ID: 'int',
        MOBILE_VERSION: 'string',
        API_NAME: 'string',
        KETERANGAN: 'string',
        METHOD: 'string',
        BODY: { type: 'string', optional: true },
        API_URL: 'string'
    }
}

const TR_COORD = {
    name: 'TR_COORD',
    primaryKey: 'LATLONG',
    properties: {
        LATLONG: 'string',
        longitude: 'double',
        latitude: 'double'
    }
}

const TR_POLYGON = {
    name: 'TR_POLYGON',
    primaryKey: 'werks_afd_block_code',
    properties: {
        WERKS: 'string',
        afd_code: 'string',
        werks_afd_block_code: 'string',
        blokname: 'string',
        coords: { type: 'list', objectType: 'TR_COORD' }
    }
}

const TR_TITIK_RESTAN = {
    name: 'TR_TITIK_RESTAN',
    primaryKey: 'UNIK_ID',
    properties: {
        OPH: { type: 'string', optional: true },
        BCC: { type: 'string', optional: true },
        UNIK_ID: { type: 'string', optional: true },
        TPH_RESTANT_DAY: { type: 'double', optional: true },
        LATITUDE: { type: 'double', optional: true },
        LONGITUDE: { type: 'double', optional: true },
        JML_JANJANG: { type: 'double', optional: true },
        JML_BRONDOLAN: { type: 'double', optional: true },
        KG_TAKSASI: { type: 'double', optional: true },
        TGL_REPORT: { type: 'string', optional: true },
        WERKS: { type: 'string', optional: true },
        EST_NAME: { type: 'string', optional: true },
        AFD_CODE: { type: 'string', optional: true },
        BLOCK_CODE: { type: 'string', optional: true },
        BLOCK_NAME: { type: 'string', optional: true },
        SORT_SWIPE: { type: 'string', optional: true }
    }
};

const TR_SUMMARY = {
    name: 'TR_SUMMARY',
    primaryKey: 'SUMMARY_CODE',
    properties: {
        SUMMARY_CODE: 'string',
        WEEKLY_STATUS: 'string',

        SUMMARY_INSPEKSI: 'string',
        VALUE_INSPEKSI: 'string',
        TARGET_INSPEKSI: 'string',

        SUMMARY_TEMUAN: 'string',
        VALUE_TEMUAN: 'string',
        TARGET_TEMUAN: 'string',

        SUMMARY_EBCC: 'string',
        VALUE_EBCC: 'string',
        TARGET_EBCC: 'string',

        SUMMARY_WALK: 'string',
        VALUE_WALK: 'string',
        TARGET_WALK: 'string',
    }
};

const TR_LOG = {
    name: 'TR_LOG',
    primaryKey: 'ID_LOG',
    properties: {
        ID_LOG: { type: 'string', optional: false },
        PARAM: { type: 'string', optional: true },
        INSERT_TIME: { type: 'string', optional: false },
        MESSAGE: { type: 'string', optional: false },
        DEV_NOTE: { type: 'string', optional: true },
        FROM: { type: 'string', optional: false },
    }
};

const TM_SUGGESTION_INSPECTION = {
    name: 'TM_SUGGESTION_INSPECTION',
    primaryKey: 'LOCATION_CODE',
    properties: {
        INSERT_TIME: 'string',
        LOCATION_CODE: 'string',
        IMAGE: 'string',

        /** INSPEKSI */
        TYPE_INSPECTION: 'string',
        DATE_INSPECTION_ASLAP: 'string',
        DESC_INSPECTION_ASLAP: 'string',
        JUMLAH_BARIS_ASLAP: 'string',

        DATE_INSPECTION_KABUN: 'string',
        DESC_INSPECTION_KABUN: 'string',
        JUMLAH_BARIS_KABUN: 'string',

        DATE_INSPECTION_EM: 'string',
        DESC_INSPECTION_EM: 'string',
        JUMLAH_BARIS_EM: 'string',

        DATE_INSPECTION_SEM_GM: 'string',
        DESC_INSPECTION_SEM_GM: 'string',
        JUMLAH_BARIS_SEM_GM: 'string',

        /** INSPEKSI PANEN*/
        TYPE_PANEN: 'string',
        DATE_PANEN: 'string',
        DESC_PANEN: 'string',
        TOTAL_JANJANG_PANEN: 'string',
        BJR_BULAN_LALU: 'string',
        TOTAL_RESTAN_TPH: 'string',

        /** INSPEKSI RAWAT*/
        TYPE_RAWAT: 'string',
        DATE_RAWAT: 'string',
        DESC_RAWAT: 'string',
        CPT_SPRAYING: 'string',
        SPOT_SPRAYING: 'string',
        LALANG_CTRL: 'string',

        ISFAVORITE: { type: 'bool', optional: true },
    }
};

const TR_PETAPANEN_HEADER = {
    name: 'TR_PETAPANEN_HEADER',
    properties: {
        "REGION_CODE": { type: 'string', default: null, optional: true },
        "COMP_CODE": { type: 'string', default: null, optional: true },
        "EST_CODE": { type: 'string', default: null, optional: true },
        "WERKS": { type: 'string', default: null, optional: true },
        "AFD_CODE": { type: 'string', default: null, optional: true },
        "AFD_NAME": { type: 'string', default: null, optional: true },
        "PER_TANGGAL": { type: 'string', default: null, optional: true },
        "TGL_PANEN": { type: 'string', default: null, optional: true },
        "TON_PRODUKTIVITAS": { type: 'double', default: null, optional: true },
        "LUAS_PANEN": { type: 'double', default: null, optional: true },
        "PEMANEN": { type: 'double', default: null, optional: true },
        "BBC_LAST": { type: 'double', default: null, optional: true },
        "TARGET_LAST": { type: 'double', default: null, optional: true },
        "BBC_BI": { type: 'double', default: null, optional: true },
        "TARGET_BI": { type: 'double', default: null, optional: true },
        "PERCENT_BBC": { type: 'double', default: null, optional: true },
        "PERCENT_TARGET": { type: 'double', default: null, optional: true },
        "INTER": { type: 'double', default: null, optional: true },
        "AKTUAL_TON": { type: 'double', default: null, optional: true },
        "D_1": { type: 'double', default: null, optional: true },
        "D_2": { type: 'double', default: null, optional: true },
        "D_3": { type: 'double', default: null, optional: true },
        "D_4": { type: 'double', default: null, optional: true },
        "D_5": { type: 'double', default: null, optional: true },
        "D_6": { type: 'double', default: null, optional: true },
        "D_7": { type: 'double', default: null, optional: true },
        "D_8": { type: 'double', default: null, optional: true },
        "MAX_D": { type: 'double', default: null, optional: true },
        "MIN_D": { type: 'double', default: null, optional: true },
        "BBC_TON_LAGI": { type: 'double', default: null, optional: true },
        "TARGET_TON_LAGI": { type: 'double', default: null, optional: true }
    }
};

const TR_PETAPANEN_DETAIL = {
    name: 'TR_PETAPANEN_DETAIL',
    properties: {
        "REGION_CODE": { type: 'string', default: null, optional: true },
        "COMP_CODE": { type: 'string', default: null, optional: true },
        "EST_CODE": { type: 'string', default: null, optional: true },
        "WERKS": { type: 'string', default: null, optional: true },
        "AFD_CODE": { type: 'string', default: null, optional: true },
        "AFD_NAME": { type: 'string', default: null, optional: true },
        "BLOCK_CODE": { type: 'string', default: null, optional: true },
        "BLOCK_NAME": { type: 'string', default: null, optional: true },
        "KG_ACTUAL": { type: 'double', default: null, optional: true },
        "KG_TARGET_MTD": { type: 'double', default: null, optional: true },
        "ACT_TAR": { type: 'double', default: null, optional: true },
        "ACT_TAR_COLOR": { type: 'string', default: null, optional: true },
        "ACT_BBC": { type: 'double', default: null, optional: true },
        "ACT_BBC_COLOR": { type: 'string', default: null, optional: true },
        "STATUS": { type: 'string', default: null, optional: true },
        "LUAS": { type: 'double', default: null, optional: true },
        "POKOK": { type: 'double', default: null, optional: true },
        "SPH": { type: 'double', default: null, optional: true },
        "TON": { type: 'double', default: null, optional: true },
        "LUASAN_PANEN": { type: 'double', default: null, optional: true },
        "PERCENT_BCC": { type: 'double', default: null, optional: true },
        "BBC_TON": { type: 'double', default: null, optional: true },
        "BBC_TON_LAGI": { type: 'double', default: null, optional: true },
        "PERCENT_TARGET": { type: 'double', default: null, optional: true },
        "TARGET_TON": { type: 'double', default: null, optional: true },
        "TARGET_TON_LAGI": { type: 'double', default: null, optional: true },
        "INTER": { type: 'double', default: null, optional: true },
        "ROTASI": { type: 'double', default: null, optional: true },
        "HK_MTD": { type: 'double', default: null, optional: true },
        "HK_MON": { type: 'double', default: null, optional: true }
    }
};

export default {
    TR_LOGIN,
    TR_CONFIG,
    TR_BLOCK_INSPECTION_H,
    TR_BLOCK_INSPECTION_D,
    TR_IMAGE,
    TR_IMAGE_PROFILE,
    TR_BARIS_INSPECTION,
    TM_AFD,
    TR_FINDING,
    TR_FINDING_COMMENT,
    TR_CATEGORY,
    TR_CONTACT,

    //Add by Aminju
    TM_REGION,
    TM_BLOCK,
    TM_EST,
    TM_KRITERIA,
    TM_PJS,
    TM_LAND_USE,
    TM_COMP,
    TM_CONTENT,
    TM_CONTENT_LABEL,
    TM_INSPECTION_TRACK,
    TM_TIME_TRACK,
    TM_SUGGESTION_INSPECTION,
    TM_SERVICE,
    TM_KUALITAS,

    TR_H_EBCC_VALIDATION,
    TR_D_EBCC_VALIDATION,
    TR_SYNC_LOG,
    TR_NOTIFICATION,
    TR_GENBA_SELECTED,
    TR_COORD,
    TR_POLYGON,
    TR_TITIK_RESTAN,
    TR_GENBA_INSPECTION,
    TR_RATING,
    TR_SUMMARY,
    TR_LOG,
    TR_PETAPANEN_HEADER,
    TR_PETAPANEN_DETAIL,


    SCHEMA_VERSION
}
