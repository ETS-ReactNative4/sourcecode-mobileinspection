import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Component/CustomHeader'
import Colors from '../../Constant/Colors'
import FindingTabNavigator from './FindingTabNavigator'
import IconHeader from '../../Component/IconHeader'
import { Images } from '../../Themes'

export default class FindingScreen extends Component {
  static router = FindingTabNavigator.router;

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
    title: 'Temuan',
    headerTintColor: '#fff',
    headerRight: <IconHeader padding={{ paddingRight: 12 }} onPress={() => navigation.navigate('Inbox')} icon={Images.ic_inbox} show={true} />,
    headerLeft: <IconHeader padding={{ paddingLeft: 12 }} onPress={() => navigation.navigate('Sync')} icon={Images.ic_sync} show={true} />,
    header: props => <CustomHeader {...props} />
  });

  render() {
    return (
      <View style={styles.container}>
        <FindingTabNavigator navigation={this.props.navigation} />
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