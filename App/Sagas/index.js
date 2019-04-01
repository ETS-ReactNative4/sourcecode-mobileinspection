import { takeLatest, takeEvery, all, take, fork } from 'redux-saga/effects';
import API from '../Api/api';
import FixtureAPI from '../Api/FixtureAPI';
import DebugConfig from '../Config/DebugConfig';
import { networkEventsListenerSaga } from 'react-native-offline';

/* ------------- Types ------------- */
import { StartupTypes } from '../Redux/StartupRedux';
import { AuthTypes } from '../Redux/AuthRedux';
import { CategoryTypes } from '../Redux/CategoryRedux';
import { ContactTypes } from '../Redux/ContactRedux';
import { RegionTypes } from '../Redux/RegionRedux';
import { InspeksiTypes } from '../Redux/InspeksiRedux';
import { BlockTypes } from '../Redux/BlockRedux';
import { AfdTypes } from '../Redux/AfdRedux';
import { EstTypes } from '../Redux/EstRedux';
import { KriteriaTypes } from '../Redux/KriteriaRedux';
import { UserAuthTypes } from '../Redux/UserAuthRedux';
import { LandUseTypes } from '../Redux/LandUseRedux';
import { CompTypes } from '../Redux/CompRedux';
import { ContentTypes } from '../Redux/ContentRedux';
import { ContentLabelTypes } from '../Redux/ContentLabelRedux';
import { FindingTypes } from '../Redux/FindingRedux';
import { FindingImageTypes } from '../Redux/FindingImageRedux';
import { FindingUploadTypes } from '../Redux/FindingUploadRedux';
import { TMobileTypes } from '../Redux/TMobileRedux';
import { ParamTrackTypes } from '../Redux/ParamTrackRedux';
import { ResetTypes } from '../Redux/ResetRedux';
import { KualitasTypes } from '../Redux/KualitasRedux';
import { ServerTimeTypes } from '../Redux/ServerTimeRedux';

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas';
import { getAuth, userUpdate } from './AuthSagas';
import { getCategory } from './CategorySagas';
import { getContact } from './ContactSagas';
import { getRegion } from './RegionSagas';
import { postInspeksiHeader, postInspeksiDetail, postInspeksiTrackingPath } from './InspeksiSagas';
import { getAfd, postAfd } from './AfdSagas';
import { getEst, postEst } from './EstSagas';
import { getKriteria, postKriteria } from './KriteriaSagas';
import { getUserAuth, postUserAuth } from './UserAuthSagas';
import { getLandUse, postLandUse } from './LandUseSagas';
import { getComp, postComp } from './CompSagas';
import { getContent, postContent } from './ContentSagas';
import { getContentLabel, postContentLabel } from './ContentLabelSagas';
import { getFinding } from './FindingSagas';
import { getFindingImage } from './FindingImageSagas';
import { postFindingData } from './FindingUploadSagas';
import {postTMobileSync } from './TMobileSagas';
import {getInspeksiParamTrackingPath } from './ParamTrackSagas';
import {postReset } from './ResetSagas';
import {getKualitas } from './KualitasSagas';
import {getServerTime } from './ServerTimeSagas';

//Add by Aminju
import { getBlock, postBlock } from './BlockSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const idpApi = DebugConfig.useFixtures == 'true' ? FixtureAPI : API.create('IDP');

const miApi = DebugConfig.useFixtures == 'true' ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
	yield all([
		takeLatest(StartupTypes.STARTUP, startup),
		takeLatest(AuthTypes.AUTH_REQUEST, getAuth, miApi),
		takeLatest(AuthTypes.AUTH_USER_UPDATE, userUpdate, miApi),
		takeLatest(CategoryTypes.CATEGORY_REQUEST, getCategory, miApi),
		takeLatest(ContactTypes.CONTACT_REQUEST, getContact, miApi),
		takeLatest(RegionTypes.REGION_REQUEST, getRegion, miApi),
		takeLatest(InspeksiTypes.INSPEKSI_POST_HEADER, postInspeksiHeader, miApi),
		takeLatest(InspeksiTypes.INSPEKSI_POST_DETAIL, postInspeksiDetail, miApi),
		takeLatest(InspeksiTypes.INSPEKSI_POST_TRACKING_PATH, postInspeksiTrackingPath, miApi),
		// takeLatest(InspeksiTypes.INSPEKSI_GET_PARAM_TRACKING_PATH, getInspeksiParamTrackingPath, miApi),
		takeLatest(BlockTypes.BLOCK_REQUEST, getBlock, miApi),
		takeLatest(BlockTypes.BLOCK_POST, postBlock, miApi),
		takeLatest(AfdTypes.AFD_REQUEST, getAfd, miApi),
		takeLatest(AfdTypes.AFD_POST, postAfd, miApi),
		takeLatest(EstTypes.EST_REQUEST, getEst, miApi),
		takeLatest(EstTypes.EST_POST, postEst, miApi),
		takeLatest(KriteriaTypes.KRITERIA_REQUEST, getKriteria, miApi),
		takeLatest(KriteriaTypes.KRITERIA_POST, postKriteria, miApi),
		takeLatest(UserAuthTypes.USER_AUTH_REQUEST, getUserAuth, miApi),
		takeLatest(UserAuthTypes.USER_AUTH_POST, postUserAuth, miApi),
		takeLatest(LandUseTypes.LAND_USE_REQUEST, getLandUse, miApi),
		takeLatest(LandUseTypes.LAND_USE_POST, postLandUse, miApi),
		takeLatest(CompTypes.COMP_REQUEST, getComp, miApi),
		takeLatest(CompTypes.COMP_POST, postComp, miApi),
		takeLatest(ContentTypes.CONTENT_REQUEST, getContent, miApi),
		takeLatest(ContentTypes.CONTENT_POST, postContent, miApi),
		takeLatest(ContentLabelTypes.CONTENT_LABEL_REQUEST, getContentLabel, miApi),
		takeLatest(ContentLabelTypes.CONTENT_LABEL_POST, postContentLabel, miApi),
		takeLatest(FindingTypes.FINDING_REQUEST, getFinding, miApi),
		takeLatest(FindingImageTypes.FINDING_IMAGE_REQUEST, getFindingImage, miApi),
		takeLatest(FindingUploadTypes.FINDING_POST_DATA, postFindingData, miApi),		
		takeLatest(TMobileTypes.TM_POST, postTMobileSync, miApi),
		takeLatest(ParamTrackTypes.PARAM_TRACK_REQUEST, getInspeksiParamTrackingPath, miApi),
		takeLatest(ResetTypes.RESET_POST, postReset, miApi),
		takeLatest(KualitasTypes.KUALITAS_REQUEST, getKualitas, miApi),
		takeLatest(ServerTimeTypes.SERVER_TIME_REQUEST, getServerTime, miApi),

		fork(networkEventsListenerSaga, { timeout: 2000, checkConnectionInterval: 20000 })
	]);
}
