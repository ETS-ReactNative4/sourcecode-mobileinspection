// CORE REACT NATIVE
import React, { Component } from 'react';
import { Image, View } from 'react-native';
// CONTANT
import Colors from 'constant/Colors'
// NAVIGATION
import { NavigationActions } from 'react-navigation';
// PLUGIN
import ActionButton from 'react-native-action-button';
import Icon2 from 'react-native-vector-icons/MaterialIcons'
// STYLE
import styles from 'list-inspection-style/ListInspectionStyle';

import TaskServices from "../../Database/TaskServices";

const checkBlock = TaskServices.getAllData('TM_BLOCK');

export default class ListInspection extends Component {


  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      genbaGranted: false
    }
  }

  componentWillMount() {
    this.roleAvailability();
  }

  // REDIRECT TO GENBA PAGE
  redirectToGenba = () => {
    if (checkBlock.length > 0) {
      this.props.navigation.dispatch(NavigationActions.navigate({
        routeName: 'Genba',
        params: { inspectionType: 'genba' }
      }));
    } else {
      this.props.navigation.navigate('Sync')
    }
  }

  // REDIRECT TO MAPS PAGE
  redirectToMapsInspeksi = () => {
    // ADD BY AMINJU 0608 10:10AM
    if (checkBlock.length > 0) {
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MapsInspeksi' }))
    } else {
      this.props.navigation.navigate('Sync')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width: 300, height: 300 }} source={require('../../Images/icon/ic-no-inspeksi.png')} />

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { }}
          icon={<Icon2 color='white' name='add' size={25} />}>

          {
            this.state.genbaGranted
            &&
            <ActionButton.Item
              size={40}
              buttonColor={Colors.tintColor}
              title="Genba"
              textStyle={{ flex: 1 }}
              onPress={this.redirectToGenba}>
              <Icon2 name="group"
                style={{ fontSize: 20, height: 22, color: 'white' }} />
            </ActionButton.Item>
          }

          <ActionButton.Item
            size={40}
            buttonColor={Colors.tintColor}
            title="Inspeksi "
            textStyle={{ flex: 1 }}
            onPress={this.redirectToMapsInspeksi}>
            <Icon2 name="find-replace"
              style={{ fontSize: 20, height: 22, color: 'white' }} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }

  roleAvailability() {
    let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
    //low->high
    let genbaRanking = ['KEPALA_KEBUN', 'EM', 'SEM_GM', 'CEO_REG', 'CEO', 'ADMIN'];

    if (currentUser !== null && currentUser !== undefined) {
      this.setState({
        genbaGranted: genbaRanking.includes(currentUser.USER_ROLE)
      })
    }
  }
}
