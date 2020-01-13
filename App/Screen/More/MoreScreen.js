import React, { Component } from 'react';
import { Image, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Thumbnail } from 'native-base';
import RNFetchBlob from "rn-fetch-blob";
import TaskServices from '../../Database/TaskServices'
import { NavigationActions, StackActions } from 'react-navigation';
import ModalConfirmation from '../../Component/ModalAlertConfirmation'
import ModalAlert from '../../Component/ModalAlert'
import ServerName from '../../Constant/ServerName';
import DeviceInfo from 'react-native-device-info';
import { zip } from 'react-native-zip-archive';
import Mailer from 'react-native-mail';
import moment from 'moment';

import Header from '../../Component/Header'
import FeatureLainnya from '../../Component/FeatureLainnya'

import { getPhoto, getThumnail, syncDays, notifInbox, isNotUserMill } from '../../Lib/Utils';
import { Images } from '../../Themes'
import {
  dirDatabase,
  dirSummary,
  dirLocal,
  dirsHome
} from '../../Lib/dirStorage';
import RNFS from 'react-native-fs';
import { retrieveData } from '../../Database/Resources';
import {HeaderWithButton} from "../../Component/Header/HeaderWithButton";

export default class MoreScreen extends Component {

  static navigationOptions = () => ({
    header: null
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

      /* ADD MODAL ALERT BY AMINJU */
      title: 'Title',
      message: 'Message',
      user,
      imageServer: imageServerUrl,
      userPhoto: null
    }
  }

  componentWillUnmount() {
    this.willFocus.remove()
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      RNFS.copyFile(TaskServices.getPath(), `${dirDatabase}/${'data.realm'}`);
    }
  );

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
      if (isConnected) {
        TaskServices.updateLogin('LOGOUT');
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

      <View style={styles.container}>

        {/* HEADER */}
          <HeaderWithButton
              title={"Menu Lainnya"}
              iconLeft={require("../../Images/icon/ic_arrow_left.png")}
              rightVectorIcon={true}
              iconRight={null}
              onPressLeft={()=>{this.props.navigation.pop()}}
              onPressRight={null}
          />

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

            {/* Menu Peta Lokasi  */}
            <FeatureLainnya
              lineTop={true}
              sizeIcon={20}
              title={'Peta Lokasi'}
              icon={Images.ic_lainnya_peta}
              onPressDefault={() => this.onPressMenu('Maps')} />

            {/* Menu Export Database */}
            <FeatureLainnya
              lineTop={true}
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
      </View>

    )
  }

  /* Function onPressMenu */
  onPressMenu(menu) {
    switch (menu) {
      case 'Maps':
        return this.menuMaps();
      case 'DashboardKebun':
        return this.menuDashboardKebun();
      case 'Dashboard':
        return this.menuDashboard();
      case 'Database':
        return this.exportDatabase();
      default:
        break;
    }
  }

  /* Function Peta Lokasi */
  menuMaps() {
    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.props.navigation.navigate('PilihPeta', { more: 'MoreScreen' })
    } else {
      this.props.navigation.navigate('Sync')
    }
  }

  /* Function Dashboard Mingguan */
  menuDashboard = async () => {

    await retrieveData('FindingSummary').then((result) => {
      if (result != null) {
        this.setState({ dataFindingSummary: result })
      }
    })

    await retrieveData('EbccSummary').then((result) => {
      if (result != null) {
        this.setState({ dataEbccSummary: result })
      }
    })

    await retrieveData('InspectionSummary').then((result) => {
      if (result != null) {
        this.setState({ dataInspectionSummary: result })
      }
    })

    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.setState({ isVisibleSummary: true });
    } else {
      this.props.navigation.navigate('Sync')
    }

  }

  /* Function Dashboard Kebun */
  menuDashboardKebun = async () => {

    const checkBlock = TaskServices.getAllData('TM_BLOCK');
    if (checkBlock.length > 0) {
      this.props.navigation.navigate('DashboardKebun')
    } else {
      this.props.navigation.navigate('Sync')
    }

  }

  async exportDatabase() {
    await this.realmToJson();
    //create zip file
    await RNFS.copyFile(TaskServices.getPath(), `${dirDatabase}/${'data.realm'}`);

    let currentTime = moment().format("YYYYMMDDHHmmss");
    let zipPath = `${dirLocal}`;
    let zipDestination = `${dirSummary}/${this.state.user.USERNAME}_${currentTime}.zip`;
    this.zipFile(zipPath.toString(), zipDestination.toString())
      .then((response) => {
        if (response.status) {
          let dirs = RNFetchBlob.fs.dirs;
          RNFetchBlob.fs.cp(response.filePath, dirs.SDCardDir + "/" + "MobileInspection/" + `${this.state.user.USERNAME}_${currentTime}.zip`)
            .then((res) => {
              this.sendEmail(response.filePath, this.state.user.USERNAME, currentTime);
            })
            .catch((err) => {
              alert(err)
            })
        }
      })
  }

  async realmToJson() {
    let TR_H_EBCC_VALIDATION = TaskServices.getAllData("TR_H_EBCC_VALIDATION");
    let TR_D_EBCC_VALIDATION = TaskServices.getAllData("TR_D_EBCC_VALIDATION");
    let TR_BLOCK_INSPECTION_H = TaskServices.getAllData("TR_BLOCK_INSPECTION_H");
    let TR_BLOCK_INSPECTION_D = TaskServices.getAllData("TR_BLOCK_INSPECTION_D");
    let TM_INSPECTION_TRACK = TaskServices.getAllData("TM_INSPECTION_TRACK");
    let TR_GENBA_INSPECTION = TaskServices.getAllData("TR_GENBA_INSPECTION");
    let TR_FINDING = TaskServices.getAllData("TR_FINDING");
    let TR_IMAGE = TaskServices.getAllData("TR_IMAGE");
    let TR_LOG = TaskServices.getAllData("TR_LOG");

    let finalString = [
      { "TABLE_NAME": "TR_H_EBCC_VALIDATION", "DATA": TR_H_EBCC_VALIDATION },
      { "TABLE_NAME": "TR_D_EBCC_VALIDATION", "DATA": TR_D_EBCC_VALIDATION },
      { "TABLE_NAME": "TR_BLOCK_INSPECTION_H", "DATA": TR_BLOCK_INSPECTION_H },
      { "TABLE_NAME": "TR_BLOCK_INSPECTION_D", "DATA": TR_BLOCK_INSPECTION_D },
      { "TABLE_NAME": "TM_INSPECTION_TRACK", "DATA": TM_INSPECTION_TRACK },
      { "TABLE_NAME": "TR_GENBA_INSPECTION", "DATA": TR_GENBA_INSPECTION },
      { "TABLE_NAME": "TR_FINDING", "DATA": TR_FINDING },
      { "TABLE_NAME": "TR_IMAGE", "DATA": TR_IMAGE },
      { "TABLE_NAME": "TR_LOG", "DATA": TR_LOG },
    ];
    let path = dirDatabase + "/realmdatabase.json";
    await RNFS.writeFile(path, JSON.stringify(finalString), 'utf8')
  }

  async zipFile(zipPath, zipDestination) {
    let zipStatus = {
      status: false,
      filePath: null
    };

    await zip(zipPath.toString(), zipDestination.toString())
      .then((path) => {
        zipStatus = {
          status: true,
          filePath: path
        };
      })
      .catch((error) => {
        console.log("ZIP ERR:", error)
      });


    return zipStatus;
  }

  sendEmail(filePath, Username, FileTime) {
    let formatDate = moment(FileTime, "YYYYMMDDHHmmss").format("DD MMM YY, HH:mm");
    try {
      Mailer.mail({
        subject: `Database - ${Username} - ${formatDate}`,
        recipients: ['TAP.callcenter.helpdesk@tap-agri.com'],
        ccRecipients: [''],
        bccRecipients: [''],
        body: `Berikut terlampir database Aplikasi Mobile Inspection saya ${Username} per ${formatDate}.`,
        isHTML: false,
        attachment: {
          path: filePath,  // The absolute path of the file from which to read data.
          type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
          name: null   // Optional: Custom filename for attachment
        }
      }, (error, event) => {
        return false
      });
      return true
    }
    catch (e) {
      return false
    }
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  textTitle: {
    fontSize: 18
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
