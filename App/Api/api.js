import apisauce from 'apisauce';
import TaskServices from '../Database/TaskServices'
import ServerName from '../Constant/ServerName'

var user = TaskServices.getAllData('TR_LOGIN')

//const apiLogin = "http://app.tap-agri.com/mobileinspection/ins-msa-auth/api"

const create = () => {
	let baseUrl = "";
	user = TaskServices.getAllData('TR_LOGIN');
	console.log("user api",user);
	if(user.length>0){
		baseUrl = ServerName[user[0].SERVER_NAME_INDEX].data;
	}
	else{
		baseUrl = ServerName[2].data;
	}
	baseUrl = baseUrl.slice(0, baseUrl.length-1);
    let api = apisauce.create({
        baseURL: baseUrl,
        //baseURL: 'http://149.129.250.199:3008/api',
        //baseURL: 'http://149.129.245.230:3008/api',
        //baseURL: apiLogin,
        headers: {
            'Cache-Control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    });

    // POST
    const login = body => api.post('/login', body);
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

    //insepksi
    const postInspeksiHeader = body => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`);
        return api.post('/inspection-header', body);
    };

    const postInspeksiDetail = body => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`);
        return api.post('/inspection-detail', body);
    }

    const postFindingData = body => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`);
        return api.post('/finding', body);
    }

    const postInspeksiTrackingPath = body => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`);
        return api.post('/inspection-tracking', body);
    }

    const postReset = body => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`);
        return api.post('/mobile-sync/reset', body);
    }

    //GET
    const getCategory = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/category')
    }

    const getContact = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        // return api.get('/mobile-sync/auth/contact')
        return api.get('/contacts')
    }

    const getRegion = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/region')
    }

    const getBlock = () => {
		console.log("base url",api);
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/block')
    }

    const getUserAuth = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/user-authorization')
    }

    const getEst = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/est')
    }

    const getKriteria = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/kriteria')
    }

    const getAfd = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/afdeling')
    }

    const getPjs = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/afdeling')
    }

    const getEmployeeHris = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/employee-hris')
    }

    const getLandUse = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/land-use')
    }

    const getComp = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/hectare-statement/comp')
    }

    const getContent = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/content')
    }

    const getContentLabel = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/content-label')
    }

    const getFinding = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/finding')
    }

    const getFindingImage = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/finding-images')
    }

    const getInspeksiParamTrackingPath = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('./parameter/track')
    }

    const getKualitas = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/mobile-sync/ebcc/kualitas')
    }
	
    const getServerTime = () => {
        api.setHeader('Authorization', `Bearer ${user[0].ACCESS_TOKEN}`)
        return api.get('/server/time')
    }

    return {
        api,
        login,
        getCategory,
        getContact,
        getRegion,
        postRegion,
        postInspeksiHeader,
        postInspeksiDetail,
        postFindingData,

        //Add by Aminju
        //Post
        postBlock,
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
        postFinding,
        postInspeksiTrackingPath,
        postReset,

        //Get
        getBlock,
        getUserAuth,
        getEst,
        getKriteria,
        getAfd,
        getLandUse,
        getPjs,
        getEmployeeHris,
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