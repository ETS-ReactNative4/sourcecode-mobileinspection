import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import EbccTabNavigator from './EbccTabNavigator'
import Colors from '../../Constant/Colors'
import CustomHeader from '../../Component/CustomHeader'
import IconHeader from '../../Component/IconHeader'
import TaskServices from '../../Database/TaskServices'
import {Images} from '../../Themes'

export default class EbccValidationScreen extends Component {
  static router = EbccTabNavigator.router;

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
    title: 'Sampling EBCC',
    headerTintColor: '#fff',
    headerRight: <IconHeader padding={{ paddingRight: 12 }} onPress={() => navigation.navigate('Inbox')} icon={Images.ic_inbox} show={navigation.getParam('inboxParam', true)} />,
    headerLeft: <IconHeader padding={{ paddingLeft: 12 }} onPress={() => navigation.navigate('Sync')} icon={Images.ic_sync} show={true} />,
    header: props => <CustomHeader {...props} />
  });

  componentDidMount() {
    this.props.navigation.setParams({ inboxParam: this.setInboxValue() });
    console.log(this.setInboxValue())
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

  render() {
    return (
      <View style={styles.container}>
        <EbccTabNavigator navigation={this.props.navigation} />
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
});
