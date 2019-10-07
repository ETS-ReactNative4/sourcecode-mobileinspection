import DeviceInfo from 'react-native-device-info'

let verAPI = "v1.1";
let verAPK = DeviceInfo.getVersion();

export default {
	verAPK,
	verAPI,
	1: {
		data: "http://app.tap-agri.com/mobileinspection/ins-msa-auth/api/" + verAPI + "/",
		service: "http://app.tap-agri.com/mobileinspection/ins-msa-auth/api/" + verAPI + "/server/service-list?v=" + verAPK
	},
	2: {
		data: "http://app.tap-agri.com/mobileinspectionqa/ins-msa-qa-auth/api/" + verAPI + "/",
		service: "http://app.tap-agri.com/mobileinspectionqa/ins-msa-qa-auth/api/" + verAPI + "/server/service-list?v=" + verAPK
	},
	3: {
		data: "http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/" + verAPI + "/",
		service: "http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/" + verAPI + "/server/service-list?v=" + verAPK
	},
	10000: {
		data: "http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/v1.0/",
		service: "http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/v1.0/server/service-list?v=" + verAPK
	}
};

async function getServiceQA(){
    let versionName = null;

    await DeviceInfo.getVersion()
        .then((response)=>{
            versionName = response
        });

    if(versionName !== undefined){
        return{
            data: `http://app.tap-agri.com/mobileinspectionqa/ins-msa-qa-auth/api/${versionName}/`,
            service: `http://app.tap-agri.com/mobileinspectionqa/ins-msa-qa-auth/api/${verAPI}/server/service-list?v=${versionName}`
        }
    }
}
