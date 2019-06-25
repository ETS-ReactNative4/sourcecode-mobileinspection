let verAPI = "v1.0";
let verAPK = "2.9";
export default {
	verAPK,
	verAPI,
	1:{
		data:"http://app.tap-agri.com/mobileinspection/ins-msa-auth/api/"+verAPI+"/",
		image:"http://imagesapp.tap-agri.com:3012/"
	},
	2:{
		data:"http://149.129.250.199:3008/api/"+verAPI+"/",
		image:"http://149.129.250.199:3012/"
	},
	3:{
		data:"http://149.129.250.199:4008/api/v1.0/",
		service:"http://149.129.250.199:4008/api/v1.0/server/service-list?v="+verAPK
	},
	10000:{
		data:"http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/v1.0/",
		service:"http://app.tap-agri.com/mobileinspectiondev/ins-msa-dev-auth/api/v1.0/server/service-list?v="+verAPK
	}
};