import {createStackNavigator} from 'react-navigation';
import EbccQrCode from './EbccQrCode'
import FotoJanjangEbcc from './FotoJanjangEbcc'
import KriteriaBuah from './KriteriaBuah'
import FotoSelfieEbcc from './FotoSelfieEbcc'
import ReasonManualTPH from './ReasonManualTPH'
import ManualInputTPH from './ManualInputTPH'
import DetailEbcc from './DetailEbcc'

export default createStackNavigator({
    EbccQrCode: {screen: EbccQrCode},
    FotoJanjang: {screen: FotoJanjangEbcc},
    KriteriaBuah: {screen: KriteriaBuah},
    FotoSelfieEbcc: {screen: FotoSelfieEbcc},
    ReasonManualTPH: { screen: ReasonManualTPH },
    ManualInputTPH: { screen: ManualInputTPH },
    DetailEbcc: { screen: DetailEbcc },
  }, {
      headerMode: 'screen',
      initialRouteName: 'EbccQrCode',
      transitionConfig: () => ({ screenInterpolator: () => null }),
    }
  );
