import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, NetInfo } from 'react-native';

import Colors from '../../Constant/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import CardView from 'react-native-cardview';
import TaskServices from '../../Database/TaskServices'
import { NavigationActions, StackActions } from 'react-navigation';
import ModalConfirmation from '../../Component/ModalAlertConfirmation'
import ModalAlert from '../../Component/ModalAlert'
import DeviceInfo from 'react-native-device-info';

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
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      showConfirm: false,
      showModal: false,
      //Add Modal Alert by Aminju 
      title: 'Title',
      message: 'Message',

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
        <View style={{ padding: 6 }} >

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
          <TouchableOpacity style={styles.marginCard} onPress={() => { this.setState({ showConfirm: true }) }}>
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 4,
    paddingRight: 10,
    paddingLeft: 10,
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
  }
});