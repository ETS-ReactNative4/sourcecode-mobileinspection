
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

import BuatInspeksi from '../BuatInspeksi';
import KondisiBaris1 from '../KondisiBaris1';
import KondisiBaris2 from '../KondisiBaris2';
import TakeFotoBaris from '../TakePhotoBaris';
import TakeFotoSelfie from '../TakePhotoSelfie';
import KondisiBarisAkhir from '../KondisiBarisAkhir';
import SelesaiInspeksi from '../SelesaiInspeksi';

export default createStackNavigator({
  BuatInspeksi: {screen: BuatInspeksi},
  TakeFotoBaris: {screen: TakeFotoBaris},
  KondisiBaris1: {screen: KondisiBaris1},
  KondisiBaris2: {screen: KondisiBaris2},
  TakeFotoSelfie: {screen: TakeFotoSelfie},
  KondisiBarisAkhir: {screen: KondisiBarisAkhir},
  SelesaiInspeksi: {screen: SelesaiInspeksi}
}, {
    headerMode: 'screen',
    initialRouteName: 'BuatInspeksi',
    transitionConfig: () => ({ screenInterpolator: () => null }),
  }
);
