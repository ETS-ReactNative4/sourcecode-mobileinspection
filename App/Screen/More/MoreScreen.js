import React, {Component} from 'react';
import {Image, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Thumbnail} from 'native-base';
import Colors from '../../Constant/Colors';
import Icon2 from 'react-native-vector-icons/AntDesign'
import TaskServices from '../../Database/TaskServices'
import {NavigationActions, StackActions} from 'react-navigation';
import ModalConfirmation from '../../Component/ModalAlertConfirmation'
import ModalAlert from '../../Component/ModalAlert'
import ServerName from '../../Constant/ServerName';
import DeviceInfo from 'react-native-device-info';
import CustomHeader from '../../Component/CustomHeader'
import IconHeader from '../../Component/IconHeader'
import {getPhoto, getThumnail} from '../../Lib/Utils';
import {Images} from '../../Themes'

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

  componentDidMount() {
    this.props.navigation.setParams({ inboxParam: this.setInboxValue() });
    let getPath = TaskServices.findBy2("TR_IMAGE_PROFILE", "USER_AUTH_CODE", this.state.user.USER_AUTH_CODE);
    let pathPhoto = getPhoto(typeof getPath === 'undefined' ? null : getPath.IMAGE_PATH_LOCAL);
    this.setState({
      userPhoto: pathPhoto
    })
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
        <View>

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

          <View style={[styles.containerLabel, { marginTop: 10 }]}>
            <View style={{ flex: 2 }}>
              {/* <Image source={require('../../Images/icon/ic_walking.png')} style={styles.icon} /> */}
              <TouchableOpacity onPress={() => {
                if (this.state.name !== "") {
                  this.props.navigation.navigate('FotoUser', { setPhoto: (photoPath) => { this.setState({ userPhoto: photoPath }) } });
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
                <Thumbnail style={{ borderColor: 'grey', height: 60, width: 60, marginRight: 5, marginLeft: 10 }} source={this.state.userPhoto === null ? getThumnail() : { uri: this.state.userPhoto }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 7 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>{this.state.name}</Text>
              <Text style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>{this.state.jabatan}</Text>
              {/*<Text style={{ fontSize: 12, color: 'grey' }}>{this.state.estate}</Text>*/}
            </View>
          </View>

          <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

          <TouchableOpacity style={styles.containerLabel}
            onPress={this.onPressPeta}>
            <Image source={require('../../Images/icon/ic_maps.png')} style={[styles.icon, { marginLeft: 10, flex: 2 }]} />
            <Text style={{ fontSize: 14, color: 'grey', flex: 7, marginLeft: 10, marginTop: 5 }}>Peta Lokasi</Text>
            <Icon2 name='right' size={18} style={{ marginRight: 15 }} />
          </TouchableOpacity>

          <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

          <TouchableOpacity style={styles.containerLabel}
            onPress={() => { this.setState({ showConfirm: true }) }}>
            <Text style={{ fontSize: 14, color: 'red', flex: 1, padding: 5, textAlign: 'center' }}>Keluar</Text>
          </TouchableOpacity>

          <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

          {/*Sign Out*/}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text>Versi: {DeviceInfo.getVersion()}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 10 }}>Server Data: {ServerName[this.state.user.SERVER_NAME_INDEX].data}</Text>
            <Text style={{ fontSize: 10 }} >Server Image: {this.state.imageServer}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  onPressPeta = () => {
    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.props.navigation.navigate('PilihPeta', { more: 'MoreScreen' })
    } else {
      this.props.navigation.navigate('Sync')
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 4,
    paddingBottom: 10,
    flex: 1
  },
  sectionCardView: {
    alignItems: 'stretch',
    height: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textTitle: {
    fontSize: 18
  },
  marginCard: {
    marginTop: 12
  },
  icon: {
    alignContent: 'flex-end',
    height: 64,
    width: 64,
    resizeMode: 'stretch',
    alignItems: 'center'
  },
  containerLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
