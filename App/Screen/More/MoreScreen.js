import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, NetInfo } from 'react-native';
import { Thumbnail } from 'native-base';
import Colors from '../../Constant/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign'
import CardView from 'react-native-cardview';
import TaskServices from '../../Database/TaskServices'
import { NavigationActions, StackActions } from 'react-navigation';
import ModalConfirmation from '../../Component/ModalAlertConfirmation'
import ModalAlert from '../../Component/ModalAlert'
import ServerName from '../../Constant/ServerName';
import DeviceInfo from 'react-native-device-info';
import CustomHeader from '../../Component/CustomHeader'
import { getThumnail } from '../../Lib/Utils';

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
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 12 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_inbox.png')} />
        </View>
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.navigate('Sync')}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 12 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../Images/icon/ic_sync.png')} />
        </View>
      </TouchableOpacity>
    ),
	header: props => <CustomHeader {...props} />
  });

  constructor(props) {
    super(props);
	let user = TaskServices.getAllData('TR_LOGIN')[0];
	let serv = TaskServices.getAllData("TM_SERVICE").filtered('API_NAME="IMAGES-UPLOAD" AND MOBILE_VERSION="'+ServerName.verAPK+'"');
	let imageServerUrl = (serv.length>0?serv[0].API_URL:"");
    this.state = {
      showConfirm: false,
      showModal: false,
      name: '',
      jabatan:'',
      estate: '',
      //Add Modal Alert by Aminju 
      title: 'Title',
      message: 'Message',
	    user,
		imageServer:imageServerUrl
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

  loadData(){
    let dataUser = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', this.state.user.USER_AUTH_CODE);
    if(dataUser !== undefined){
      let name = dataUser.FULLNAME
      let jabatan = dataUser.JOB
      let estate = ''//TaskServices.getEstateName()
      this.setState({name, jabatan, estate})
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
            icon={this.state.Icon}
            onPressCancel={() => this.setState({ showModal: false })}
            title={this.state.title}
            message={this.state.message} />

            <View style={[styles.containerLabel, {marginTop: 10}]}>
                <View style={{ flex: 2 }}>
                    {/* <Image source={require('../../Images/icon/ic_walking.png')} style={styles.icon} /> */}
                    <Thumbnail style={{ borderColor: 'grey', height: 60, width: 60, marginRight: 5, marginLeft: 10 }} source={getThumnail()} />
                </View>
                <View style={{ flex: 7 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>{this.state.name}</Text>
                    <Text style={{ fontSize: 12, color: 'grey', marginTop: 10 }}>{this.state.jabatan}</Text>
                    <Text style={{ fontSize: 12, color: 'grey' }}>{this.state.estate}</Text>
                </View>
            </View>

            <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

            <TouchableOpacity style={styles.containerLabel}
              onPress={()=> {this.props.navigation.navigate('PilihPeta')}}>
                <Image source={require('../../Images/icon/ic_maps.png')} style={[styles.icon,{marginLeft:10, flex: 2}]} />
                <Text style={{ fontSize: 14, color: 'grey', flex: 7, marginLeft: 10, marginTop: 5 }}>Peta Lokasi</Text>
                <Icon2 name='right' size={18} style={{marginRight: 15}} />
            </TouchableOpacity>

            <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

            <TouchableOpacity style={styles.containerLabel} 
              onPress={() => { this.setState({ showConfirm: true }) }}>
                <Text style={{ fontSize: 14, color: 'red', flex: 1, padding: 5, textAlign: 'center' }}>Keluar</Text>
            </TouchableOpacity>

            <View style={{ height: 10, backgroundColor: '#F5F5F5', marginTop: 10 }} />

          {/*Profile*/}
          {/* <TouchableOpacity style={styles.marginCard}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_profile_menu.png')}></Image>
                  <Text style={styles.textTitle}>Profile</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/*Games*/}
          {/* <TouchableOpacity style={styles.marginCard}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_games_menu.png')}></Image>
                  <Text style={styles.textTitle}>Games</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/*Rangking*/}
          {/* <TouchableOpacity style={styles.marginCard}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_ranking_menu.png')}></Image>
                  <Text style={styles.textTitle}>Ranking</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/*Mini Dashboard*/}
          {/* <TouchableOpacity style={styles.marginCard}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_minidashboard_menu.png')}></Image>
                  <Text style={styles.textTitle}>Mini Dashboard</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/*Help*/}
          {/* <TouchableOpacity style={styles.marginCard}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_help_menu.png')}></Image>
                  <Text style={styles.textTitle}>Help</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/* Contact Center */}
          {/* <TouchableOpacity style={styles.marginCard} onPress={() => { this.setState({ showModal: true }) }}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_contactcenter_menu.png')}></Image>
                  <Text style={styles.textTitle}>Contact Center</Text>
                </View>
                <View style={{ marginRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}

          {/*Sign Out*/}
          <View style={{flex: 1, flexDirection: 'column', justifyContent:'center', alignItems: 'center', padding: 10}}>
            <Text>Versi: {DeviceInfo.getVersion()}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column', justifyContent:'center', alignItems: 'center', padding: 10}}>
            <Text style={{fontSize: 10}}>Server Data: {ServerName[this.state.user.SERVER_NAME_INDEX].data}</Text>
            <Text style={{fontSize: 10}} >Server Image: {this.state.imageServer}</Text>
          </View>
          {/* <TouchableOpacity style={styles.marginCard} onPress={() => { this.setState({ showConfirm: true }) }}>
            <CardView cardElevation={2} cardMaxElevation={2} cornerRadius={10}>
              <View style={styles.sectionCardView}>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }} >
                  <Image style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 24, marginRight: 16 }} source={require('../../Images/icon/menu/ic_signout_menu.png')}></Image>
                  <Text style={styles.textTitle}>Sign Out</Text>
                </View>
                <View style={{ backgroundColor: 'white', paddingRight: 24 }}>
                  <Icon size={32} name='ios-arrow-round-forward' color='grey' />
                </View>
              </View>
            </CardView>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    )
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
    alignItems: 'center',
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