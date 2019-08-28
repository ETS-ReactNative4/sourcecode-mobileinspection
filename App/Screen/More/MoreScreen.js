import React, { Component } from 'react';
import { Image, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { Thumbnail } from 'native-base';
import Colors from '../../Constant/Colors';
import Icon2 from 'react-native-vector-icons/AntDesign'
import TaskServices from '../../Database/TaskServices'
import { NavigationActions, StackActions } from 'react-navigation';
import ModalConfirmation from '../../Component/ModalAlertConfirmation'
import ModalAlert from '../../Component/ModalAlert'
import ServerName from '../../Constant/ServerName';
import DeviceInfo from 'react-native-device-info';
import CustomHeader from '../../Component/CustomHeader'
import IconHeader from '../../Component/IconHeader'
import { getPhoto, getThumnail } from '../../Lib/Utils';
import { Images } from '../../Themes'
import { dirDatabase } from '../../Lib/dirStorage';
import RNFS from 'react-native-fs'

export default class MoreScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.tintColorPrimary
    },
    headerTitleStyle: {
      textAlign: "center",
      flex: 1,
      fontSize: 18,
      fontWeight: '400',
      marginHorizontal: 12
    },
    title: 'Lainnya',
    headerTintColor: '#fff',
    headerRight: <IconHeader padding={{ paddingRight: 12 }} onPress={() => navigation.navigate('Inbox')} icon={Images.ic_inbox} show={navigation.getParam('inboxParam', true)} />,
    headerLeft: <IconHeader padding={{ paddingLeft: 12 }} onPress={() => navigation.navigate('Sync')} icon={Images.ic_sync} show={true} />,
    header: props => <CustomHeader {...props} />
  });

  constructor(props) {
    super(props);
    let user = TaskServices.getAllData('TR_LOGIN')[0];
    let serv = TaskServices.getAllData("TM_SERVICE").filtered('API_NAME="IMAGES-UPLOAD" AND MOBILE_VERSION="' + ServerName.verAPK + '"');
    let imageServerUrl = (serv.length > 0 ? serv[0].API_URL : "");
    this.state = {
      showConfirm: false,
      showModal: false,
      name: '',
      jabatan: '',
      estate: '',
      //Add Modal Alert by Aminju
      title: 'Title',
      message: 'Message',
      user,
      imageServer: imageServerUrl,
      userPhoto: null
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.loadData()
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  setInboxValue() {
    const data = TaskServices.getAllData('TR_LOGIN')
    if (data != undefined) {
      if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
        return false
      } else {
        return true
      }
    }
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.props.navigation.setParams({ inboxParam: this.setInboxValue() });
      let getPath = TaskServices.findBy2("TR_IMAGE_PROFILE", "USER_AUTH_CODE", this.state.user.USER_AUTH_CODE);
      let pathPhoto = getPhoto(typeof getPath === 'undefined' ? null : getPath.IMAGE_PATH_LOCAL);
      this.setState({
        userPhoto: pathPhoto
      })
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  loadData() {
    let dataUser = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', this.state.user.USER_AUTH_CODE);
    if (dataUser !== undefined) {
      let name = dataUser.FULLNAME;
      let jabatan = dataUser.USER_ROLE.replace(/_/g, " ");
      let estate = TaskServices.getEstateName();
      this.setState({ name, jabatan, estate })
    }
  }

  getEstateName(werks) {
    try {
      let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
      return data.EST_NAME;
    } catch (error) {
      return '';
    }
  }

  navigateScreen(screenName) {
    const navigation = this.props.navigation;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screenName })],
    });
    navigation.dispatch(resetAction);
  }

  logout() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      if (isConnected) {
        TaskServices.updateLogin('TR_LOGIN');
        this.setState({ showConfirm: false });
        this.props.navigation.navigate('Login', { exit: 'true' });
      } else {
        // alert('Tidak Ada Koneksi Internet');
        this.setState({
          showConfirm: false,
          showModal: true,
          title: 'Tidak Ada Koneksi',
          message: 'Opps, check koneksi internet mu dulu ya',
          icon: require('../../Images/ic-no-internet.png')
        })
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <ModalConfirmation
          icon={require('../../Images/ic-logout.png')}
          visible={this.state.showConfirm}
          onPressCancel={() =>
            this.setState({ showConfirm: false })}
          onPressSubmit={() => {
            this.logout();
          }}
          title={'Konfirmasi Logout'}
          message={`Yakin nih mau keluar dari aplikasi ini? Untuk login lagi, kamu harus terhubung ke WIFI dulu ya`}
        />

        <ModalAlert
          visible={this.state.showModal}
          icon={this.state.icon}
          onPressCancel={() => this.setState({ showModal: false })}
          title={this.state.title}
          message={this.state.message} />

        <View>

          <View style={[styles.containerProfile, { marginTop: 5 }]}>
            {/* <Image source={require('../../Images/icon/ic_walking.png')} style={styles.icon} /> */}
            <TouchableOpacity onPress={() => {
              if (this.state.name !== "") {
                this.props.navigation.navigate('FotoUser', {
                  setPhoto: (photoPath) => {
                    this.setState({ userPhoto: photoPath })
                    this.forceUpdate();
                  }
                });

              }
              else {
                this.setState({
                  showConfirm: false,
                  showModal: true,
                  title: 'Data kosong!',
                  message: 'Data tidak di temukan, Tolong sync terlebih dahulu sebulum merubah foto!',
                  icon: require('../../Images/ic-no-internet.png')
                })
              }
            }}>
              <Thumbnail
                style={{ borderColor: '#AAAAAA', height: 72, width: 72, marginLeft: 5, borderWidth: 2, borderRadius: 100 }}
                source={this.state.userPhoto === null ? getThumnail() : { uri: this.state.userPhoto + '?' + new Date() }} />
              <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <Image source={Images.ic_add_image} style={{ height: 24, width: 24 }} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>{this.state.name}</Text>
              <Text style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>{this.state.jabatan}</Text>
              {/*<Text style={{ fontSize: 12, color: 'grey' }}>{this.state.estate}</Text>*/}
            </View>
          </View>

          {/*Sign Out*/}
          {/* <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text>Versi: {DeviceInfo.getVersion()}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 10 }}>Server Data: {ServerName[this.state.user.SERVER_NAME_INDEX].data}</Text>
            <Text style={{ fontSize: 10 }} >Server Image: {this.state.imageServer}</Text>
          </View> */}

          {/* Menu Peta Lokasi  */}
          <FeatureLainnya
            sizeIcon={20}
            title={'Peta Lokasi'}
            icon={Images.ic_lainnya_peta}
            onPressDefault={() => this.onPressMenu('Maps')} />

          {/* Menu Export Database */}
          <FeatureLainnya
            sizeIcon={20}
            title={'Export Database'}
            icon={Images.ic_lainnya_database}
            onPressDefault={() => this.onPressMenu('Database')} />

          {/* Menu Sign Out */}
          <FeatureLainnya
            title={'Keluar'}
            signout={true}
            onPressSignOut={() => this.setState({ showConfirm: true })} />


          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text>Versi: {DeviceInfo.getVersion()}</Text>
          </View>
        </View>


      </ScrollView>
    )
  }

  //Function onPressMenu
  onPressMenu(menu) {
    switch (menu) {
      case 'Maps':
        return this.menuMaps()
      case 'Database':
        return this.menuDatabase()
      default:
        break;
    }
  }

  //Function Peta Lokasi
  menuMaps() {
    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.props.navigation.navigate('PilihPeta', { more: 'MoreScreen' })
    } else {
      this.props.navigation.navigate('Sync')
    }
  }

  // Function Export Database
  menuDatabase() {
    RNFS.copyFile(TaskServices.getPath(), `${dirDatabase}/${'data.realm'}`);

    setTimeout(() => {
      ToastAndroid.showWithGravity(
        'Database berhasil di export',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }, 2000)
  }
}


const FeatureLainnya = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, height: props.signout ? 10 : 1, backgroundColor: '#F5F5F5' }} />

      {/*SignOut Menu*/}
      {props.signout ? <TouchableOpacity style={[styles.containerLabel, { justifyContent: 'center' }]} onPress={props.onPressSignOut}>
        <Text style={{ fontSize: 14, color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{props.title}</Text>

        {/* Default Menu */}
      </TouchableOpacity> :
        <TouchableOpacity style={styles.containerLabel} onPress={props.onPressDefault}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={props.icon} style={[styles.icon, { height: props.sizeIcon, width: props.sizeIcon }]} />
            <Text style={{ fontSize: 14, color: 'black', textAlign: 'center' }}>{props.title}</Text>
          </View>
          <Icon2 name='right' color={'black'} size={14} style={{ marginRight: 15 }} />
        </TouchableOpacity>
      }

      <View style={{ flex: 1, height: props.signout ? 10 : 1, backgroundColor: '#F5F5F5' }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  textTitle: {
    fontSize: 18
  },
  icon: {
    marginLeft: 12,
    marginRight: 12
  },
  containerLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    padding: 12
  },
  containerProfile: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
});
