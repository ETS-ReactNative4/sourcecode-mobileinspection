// CORE REACT NATIVE
import React, { Component } from 'react';
import { View, Image } from 'react-native';

// CONTANT
import Colors from 'constant/Colors'

// NAVIGATION
import { NavigationActions } from 'react-navigation';

// PLUGIN
import ActionButton from 'react-native-action-button';
import Icon2 from 'react-native-vector-icons/MaterialIcons'

// STYLE
import styles from 'list-inspection-style/ListInspectionStyle';

// UNUSED
import { connect } from 'react-redux';
import InspeksiAction from '../../Redux/InspeksiRedux';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { Container, Content } from 'native-base';

export default class ListInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false
    }
  }

  // REDIRECT TO GENBA PAGE
  redirectToGenba = ()=> {
    this.props.navigation.dispatch(NavigationActions.navigate({
        routeName : 'Genba',
        params:{inspectionType: 'genba'}
    }));
  }

  // REDIRECT TO MAPS PAGE
  redirectToMapsInspeksi = ()=> {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName : 'MapsInspeksi'}))
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={{ width:300, height: 300 }} source={require('../../Images/icon/ic-no-inspeksi.png')} />

        <ActionButton style={{ marginEnd: -10, marginBottom: -10 }}
          buttonColor={Colors.tintColor}
          onPress={() => { }}
          icon={<Icon2 color='white' name='add' size={25} />}>
            {/*<ActionButton.Item */}
            {/*  size={40}*/}
            {/*  buttonColor={Colors.tintColor}*/}
            {/*  title="Genba " */}
            {/*  textStyle={{flex:1}}*/}
            {/*  onPress={this.redirectToGenba}>*/}
            {/*  <Icon2 name="group" */}
            {/*  style={{ fontSize: 20, height: 22, color: 'white' }} />*/}
            {/*</ActionButton.Item>*/}

            <ActionButton.Item 
              size={40}
              buttonColor={Colors.tintColor}
              title="Inspeksi " 
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