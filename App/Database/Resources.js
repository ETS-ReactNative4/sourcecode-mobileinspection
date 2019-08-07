import TaskServices from "./TaskServices";
import { AsyncStorage } from 'react-native';

export async function storeData(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Error saving data
        console.log('Error Save : ' + error)
    }
};

export async function retrieveData(key) {
  try {
      const result = await AsyncStorage.getItem(key);
      // console.log('Result  : ', JSON.parse(result));
      if (result !== null) {
          // We have data!!
          return JSON.parse(result);
      } else {
          return null;
      }
  } catch (error) {
      // Error retrieving data
      console.log('Error Retriev : ' + error)
  }
};

export async function removeData(key) {
  try {
      await AsyncStorage.removeItem(key);
      return true;
  }
  catch (exception) {
      return false;
  }
};

export function getContactName(userAuth) {
  try {
    let data = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', userAuth);
    return data.FULLNAME;
  } catch (error) {
    return ''
  }
}

export function getCategoryName(categoryCode) {
  try {
    let data = TaskServices.findBy2('TR_CATEGORY', 'CATEGORY_CODE', categoryCode);
    return data.CATEGORY_NAME;
  } catch (error) {
    return ''
  }
}

export function getEstateName(werks) {
  try {
    let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
    return data.EST_NAME;
  } catch (error) {
    return '';
  }
}

export function getBlokName(werkAfdBlokCode) {
  try {
    let data = TaskServices.findBy2('TM_BLOCK', 'WERKS_AFD_BLOCK_CODE', werkAfdBlokCode);
    return data.BLOCK_NAME;
  } catch (error) {
    return ''
  }
}

export function getStatusBlok(werk_afd_blok_code) {
  try {
    let data = TaskServices.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
    return data.MATURITY_STATUS;
  } catch (error) {
    return ''
  }
}