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

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas';
import { getAuth, userUpdate } from './AuthSagas';
import { getCategory } from './CategorySagas';
import { getContact } from './ContactSagas';
import { getRegion, postRegion } from './RegionSagas'
import TaskServices from '../Database/TaskServices'

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
		takeLatest(RegionTypes.REGION_POST, postRegion, miApi),

		fork(networkEventsListenerSaga, { timeout: 2000, checkConnectionInterval: 20000 })
	]);
}
