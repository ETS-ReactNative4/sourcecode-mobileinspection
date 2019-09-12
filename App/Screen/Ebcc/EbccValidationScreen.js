import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import EbccTabNavigator from './EbccTabNavigator'

import { showInbox, syncDays, notifInbox } from '../../Lib/Utils';
import Header from '../../Component/Header'

export default class EbccValidationScreen extends Component {
  static router = EbccTabNavigator.router;

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
          title={'Sampling EBCC'}
          showInbox={showInbox()} />

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
