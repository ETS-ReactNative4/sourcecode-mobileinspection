import TaskServices from "./TaskServices";


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