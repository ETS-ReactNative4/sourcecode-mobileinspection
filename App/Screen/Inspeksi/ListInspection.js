import React, { Component } from 'react';
import { View, Image } from 'react-native';
import ActionButton from 'react-native-action-button';
import Colors from '../../Constant/Colors'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import InspeksiAction from '../../Redux/InspeksiRedux';
import Icon2 from 'react-native-vector-icons/MaterialIcons'

import { ProgressDialog } from 'react-native-simple-dialogs';
import { Container, Content } from 'native-base';

import styles from 'list-inspection-style/ListInspectionStyle';
import Function from 'list-inspection-function/ListInspectionFunction';

class ListInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false
    }
  }

  redirectToMapsInspeksi() {  
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MapsInspeksi' }));
  }

  redirectToGenba() {   
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Genba' }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Image  style={{ width:300, height: 300 }} 
                source={require('../../Images/icon/ic-no-inspeksi.png')} />

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          icon={<Icon2 color='white' name='add' size={25} />}>

            {/** FAB for Genba*/}
            <ActionButton.Item 
              size={40}
              buttonColor={Colors.tintColor}
              title="Genba" 
              textStyle={{flex:1}}
              onPress={this.redirectToGenba}>
              <Icon2 name="group" 
              style={{ fontSize: 20, height: 22, color: 'white' }} />
            </ActionButton.Item>

            {/** FAB for Inspection */}
            <ActionButton.Item 
              size={40}
              buttonColor={Colors.tintColor}
              title="Inspeksi" 
              textStyle={{flex:1}}
              onPress={this.redirectToMapsInspeksi}>
              <Icon2 name="find-replace" 
              style={{ fontSize: 20, height: 22, color: 'white' }} />
            </ActionButton.Item>
        </ActionButton>
      </View>
    )
  }
}

export default ListInspection;