// CORE REACT NATIVE
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// NAVIGATION
import { NavigationActions } from 'react-navigation';

// STYLE
import TaskServices from "../../Database/TaskServices";
import FeatureSuggestion from '../../Component/Suggestion/FeatureSuggestion'
import DummyData from '../../Constant/DummyData';
import EmptySuggestion from '../../Component/Suggestion/EmptySuggestion'
import Swiper from 'react-native-swiper'
import { Card } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ButtonSuggestion from '../../Component/Suggestion/ButtonSuggestion'

const checkBlock = TaskServices.getAllData('TM_BLOCK');
const suggestionDummy = DummyData.suggestion

export default class ListInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      genbaGranted: false,
      dataSuggestions: []
    }
  }

  componentDidMount() {
    this.setState({ dataSuggestions: suggestionDummy })
  }

  componentWillMount() {
    this.roleAvailability();
  }

  // REDIRECT TO GENBA/INSPEKSI PAGE
  redirectNextScreen(routeName) {
    if (checkBlock.length > 0) {
      if (routeName == 'genba') {
        this.props.navigation.dispatch(NavigationActions.navigate({
          routeName: 'Genba',
          params: { inspectionType: 'genba' }
        }));
      } else if (routeName == 'inspeksi') {
        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MapsInspeksi' }))
      }
    } else {
      this.props.navigation.navigate('Sync')
    }
  }


  removeItem() {
    var array = this.state.dataSuggestions; // make a separate copy of the array
    var index = array.pop

    this.setState({ dataSuggestions: array });
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ dataSuggestions: array });
    }
  }

  renderContent() {
    const { dataSuggestions } = this.state;

    if (dataSuggestions.length > 0) {
      return <Swiper
        scrollEnabled={false}
        loop={false}
        showsPagination={false}
        showsButtons={false}
        height={320}
        width={'100%'}
        pagingEnabled={false}>
        {
          dataSuggestions.map((item, idx) => {
            return (<Card key={idx} style={styles.containerFeature}>
              <View style={styles.topContainer}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.imageOpacity} />
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.removeItem()} style={styles.iconClose}>
                  <Icon name={'close'} size={20} color={'white'} />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomContainer}>
                <Text style={{ fontSize: 14, fontWeight: '500' }}> {item.title}</Text>
                <Text style={{ fontSize: 12, fontWeight: '400' }}> {item.desc}</Text>
                <ButtonSuggestion title={'Inspeksi Blok Ini'} onPress={() => this.removeItem()} />
              </View>
            </Card>
            )
          })
        }
      </Swiper>
    } else {
      return <EmptySuggestion
        isGenba={this.state.genbaGranted}
        onPressGenba={() => this.redirectNextScreen('genba')}
        onPressInspeksi={() => this.redirectNextScreen('inspeksi')} />
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', paddingLeft: 3 }}>Rekomendasi Inspeksi</Text>
        <Text style={{ color: '#AAAAAA', fontSize: 14, marginBottom: 10, paddingLeft: 3 }}>Prioritas blok yang harus diinspeksi berdasarkan aktivitas inspeksi, panen, dan rawat.</Text>
        {this.renderContent()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    // justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'white'
  },
  imageOpacity: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.030,
  },
  containerFeature: {
    borderRadius: 10
  },
  topContainer: {
    position: 'relative',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  image: {
    height: 230, width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  iconClose: {
    width: 30,
    height: 30,
    backgroundColor: '#707070',
    opacity: 0.70,
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3
  },
  bottomContainer: {
    height: 120,
    padding: 12,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center'
  }
})
