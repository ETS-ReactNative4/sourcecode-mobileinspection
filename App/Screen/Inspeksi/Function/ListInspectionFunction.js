
import { getTodayDate } from 'lib/Utils';
import TaskServices from 'database/TaskServices';

let loadData = ()=> {
    let dataHeader = TaskServices.getAllData('TR_BLOCK_INSPECTION_H');
    if (dataHeader !== null) {
      for (var i = 0; i < dataHeader.length; i++) {
        this.kirimInspeksiHeader(dataHeader[i]);
      }
    }
  }

  let loadDataDetail = (param)=> {
    let data = TaskServices.findBy('TR_BLOCK_INSPECTION_D', 'BLOCK_INSPECTION_CODE', param);
    if (data !== null) {
      for (var i = 0; i < data.length; i++) {
        this.kirimInspeksiDetail(data[i]);
      }
    }
  }

  let kirimInspeksiHeader = (param)=> {
    this.props.postInspeksi({
      BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
      WERKS: param.WERKS,
      AFD_CODE: param.AFD_CODE,
      BLOCK_CODE: param.AFD_CODE,
      INSPECTION_DATE: param.INSPECTION_DATE,
      INSPECTION_RESULT: param.INSPECTION_RESULT,
      STATUS_SYNC: 'YES',
      SYNC_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss'),
      START_INSPECTION: param.START_INSPECTION,
      END_INSPECTION: param.END_INSPECTION,
      LAT_START_INSPECTION: param.LAT_START_INSPECTION,
      LONG_START_INSPECTION: param.LONG_START_INSPECTION,
      LAT_END_INSPECTION: param.LAT_END_INSPECTION,
      LONG_END_INSPECTION: param.LONG_END_INSPECTION
    });
  }

  let kirimInspeksiDetail = (param)=> {
    this.props.postInspeksiDetail({
      BLOCK_INSPECTION_CODE: param.BLOCK_INSPECTION_CODE,
      BLOCK_INSPECTION_CODE_D: param.BLOCK_INSPECTION_CODE_D,
      CONTENT_CODE: param.CONTENT_CODE,
      AREAL: param.AREAL,
      VALUE: param.VALUE,
      STATUS_SYNC: 'YES',
      SYNC_TIME: getTodayDate('YYYY-MM-DD HH:mm:ss')
    });
  }

export default {
    loadData,
    loadDataDetail
}