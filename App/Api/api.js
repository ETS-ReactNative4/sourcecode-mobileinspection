import apisauce from 'apisauce';
import TaskServices from '../Database/TaskServices'
import ServerName from '../Constant/ServerName'

var user = TaskServices.getAllData('TR_LOGIN')

//const apiLogin = "http://app.tap-agri.com/mobileinspection/ins-msa-auth/api"

const create = () => {
  let baseUrl = "";
  user = TaskServices.getAllData('TR_LOGIN');
  if (user.length > 0) {
    baseUrl = ServerName[user[0].SERVER_NAME_INDEX].data;
  }
  else {
    baseUrl = ServerName[2].data;
  }
  baseUrl = baseUrl.slice(0, baseUrl.length - 1);
  let api = apisauce.create({
    baseURL: baseUrl,
    headers: {
      'Cache-Control': 'no-cache',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  });
  let getAPIURL = (apiName, body) => {
    let serv = TaskServices.getAllData("TM_SERVICE").filtered('API_NAME="' + apiName + '" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
    if (serv.length > 0) {
      serv = serv[0]
    }
    api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
    if (serv.METHOD == 'GET') {
      if (body) {
        return api.get(serv.API_URL, body);
      }
      else {
        return api.get(serv.API_URL);
      }
    }
    else {
      if (body) {
        return api.post(serv.API_URL, body);
      }
      else {
        return api.post(serv.API_URL);
      }
    }
  }
  // POST
  const login = body => getAPIURL('AUTH-LOGIN', body);
  /*
      const logout = body => api.post('/logut', body);
      const postRegion = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postBlock = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postUserAuth = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postEst = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postKriteria = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/kriteria', body);
      }
  
      const postAfd = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postPjs = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postEmployeeHris = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postComp = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postLandUse = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postContent = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postContentLabel = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  
      const postFinding = body => {
          api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
          return api.post('/mobile-sync', body);
      }
  */
  //insepksi
  const postInspeksiHeader = body => {
    return getAPIURL('INSPECTION-HEADER-INSERT');
  };

  const postInspeksiDetail = body => {
    return getAPIURL('INSPECTION-DETAIL-INSERT');
  }

  const postFindingData = body => {
    return getAPIURL('FINDING-INSERT');
  }

  const postInspeksiTrackingPath = body => {
    return getAPIURL('INSPECTION-TRACKING-INSERT');
  }

  const postReset = body => {
    return getAPIURL('AUTH-SYNC-RESET');
  }

  const postGenbaInspection = body => {
    return getAPIURL('INSPECTION-GENBA-INSERT')
  }

  //GET
  const getCategory = () => {
    return getAPIURL('AUTH-CATEGORY');
  }

  const getContact = () => {
    return getAPIURL('AUTH-SYNC-CONTACT');
  }

  const getRegion = () => {
    return getAPIURL('AUTH-SYNC-HS-REGION');
  }

  const getBlock = () => {
    return getAPIURL('AUTH-SYNC-HS-BLOCK');
  }

  /*const getUserAuth = () => {
      api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
      return api.get('/mobile-sync/hectare-statement/user-authorization')
  }*/

  const getEst = () => {
    return getAPIURL('AUTH-SYNC-HS-EST');
  }

  const getKriteria = () => {
    return getAPIURL('AUTH-SYNC-KRITERIA');
  }

  const getAfd = () => {
    return getAPIURL('AUTH-SYNC-HS-AFD');
  }

  /*const getPjs = () => {
      api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
      return api.get('/mobile-sync/hectare-statement/afdeling')
  }*/

  /*const getEmployeeHris = () => {
      api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
      return api.get('/mobile-sync/hectare-statement/employee-hris')
  }*/

  const getLandUse = () => {
    return getAPIURL('AUTH-SYNC-HS-LANDUSE');
  }

  const getComp = () => {
    return getAPIURL('AUTH-SYNC-HS-COMP');
  }

  const getContent = () => {
    return getAPIURL('AUTH-SYNC-CONTENT');
  }

  const getContentLabel = () => {
    return getAPIURL('AUTH-SYNC-CONTENT-LABEL');
  }

  const getFinding = () => {
    return getAPIURL('AUTH-SYNC-FINDING');
  }

  const getFindingImage = () => {
    return getAPIURL('AUTH-SYNC-FINDING-IMAGES');
  }

  const getInspeksiParamTrackingPath = () => {
    return getAPIURL('AUTH-PARAMETER-TRACK');
  }

  const getKualitas = () => {
    return getAPIURL('AUTH-SYNC-EBCC-KUALITAS');
  }

  const getServerTime = () => {
    return getAPIURL('AUTH-SERVER-TIME');
  }

  return {
    api,
    login,
    getCategory,
    getContact,
    getRegion,
    //postRegion,
    postInspeksiHeader,
    postInspeksiDetail,
    postFindingData,

    //Add by Aminju
    //Post
    /*postBlock,
    postUserAuth,
    postEst,
    postKriteria,
    postAfd,
    postLandUse,
    postPjs,
    postEmployeeHris,
    postComp,
    postContent,
    postContentLabel,
    postFinding,*/
    postInspeksiTrackingPath,
    postReset,
    postGenbaInspection,

    //Get
    getBlock,
    //getUserAuth,
    getEst,
    getKriteria,
    getAfd,
    getLandUse,
    //getPjs,
    //getEmployeeHris,
    getComp,
    getContent,
    getContentLabel,
    getFinding,
    getFindingImage,
    getInspeksiParamTrackingPath,
    getKualitas,
    getServerTime

  };
};

export default { create };