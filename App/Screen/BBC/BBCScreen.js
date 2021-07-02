import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import BBCTabNavigator from './BBCTabNavigator'

import { isNotUserMill, syncDays, notifInbox } from '../../Lib/Utils';
import Header from '../../Component/Header'

export default class BBCScreen extends Component {
  static router = BBCTabNavigator.router;

  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);

    this.state = {
      divDays: 0,
      notifCount: 0
    }
  }


  willFocus = this.props.navigation.addListener(
    'willFocus',
    () => {
      this.setState({
        /* SET JUMLAH HARI BELUM SYNC */
        divDays: syncDays(),

        /* SET JUMLAH NOTIF  */
        notifCount: notifInbox()
      })
    }
  )

  componentWillUnmount() {
    this.willFocus.remove()
  }

  render() {
    return (
      <View style={styles.container}>

        {/* HEADER */}
        <Header
          notif={this.state.notifCount}
          divDays={this.state.divDays}
          onPressLeft={() => this.props.navigation.navigate('Sync')}
          onPressRight={() => this.props.navigation.navigate('Inbox')}
          title={'BBC'}
          isNotUserMill={isNotUserMill()} />

        <BBCTabNavigator navigation={this.props.navigation} />
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
