// CORE REACT NATIVE
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, NetInfo, ActivityIndicator } from 'react-native';

// NAVIGATION
import { NavigationActions } from 'react-navigation';

// STYLE
import TaskServices from "../../Database/TaskServices";
import EmptySuggestion from '../../Component/Suggestion/EmptySuggestion'
import Swiper from 'react-native-swiper'
import { Card } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ButtonSuggestion from '../../Component/Suggestion/ButtonSuggestion'
import colors from '../../Themes/Colors';
import { Images } from '../../Themes';
import { dirPhotoInspeksiSuggestion } from '../../Lib/dirStorage'
import { retrieveData, storeData } from '../../Database/Resources';
import { dateDisplayMobileWithoutHours } from '../../Lib/Utils';
import ActionButton from 'react-native-action-button';

const checkBlock = TaskServices.getAllData('TM_BLOCK');

var RNFS = require('react-native-fs');

const { width } = Dimensions.get('window')

const LOCAL_DATA = TaskServices.getAllData('TM_SUGGESTION_INSPECTION')

const AddInspection = (props) => {
  return (
    <ActionButton
      size={40}
      style={{ marginEnd: -10, marginBottom: -10 }}
      buttonColor={colors.colorPrimary}
      onPress={() => { }}
      icon={<Icon color='white' name='add' size={25} />}>

      {
        props.genbaGranted
        &&
        <ActionButton.Item
          size={32}
          buttonColor={colors.colorPrimary}
          title="Genba"
          textStyle={{ flex: 1 }}
          onPress={props.onPressGenba}>
          <Icon
            size={20}
            name="group"
            style={{ fontSize: 20, height: 22, color: 'white' }} />
        </ActionButton.Item>
      }

      <ActionButton.Item
        size={32}
        buttonColor={colors.colorPrimary}
        title="Inspeksi "
        textStyle={{ flex: 1 }}
        onPress={props.onPressInspeksi}>
        <Icon
          size={20}
          name="find-replace"
          style={{ fontSize: 20, height: 22, color: 'white' }} />
      </ActionButton.Item>
    </ActionButton>
  )
}

export default class ListInspection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      genbaGranted: false,
      dataSuggestions: [],
      dataLocal: [],
      isDisconnect: false,
      isLoading: true

    }
  }

  componentDidMount() {
    this._getDataLocal();
    this._initData();
  }

  componentWillMount() {
    this.roleAvailability();
  }

  _initData() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        retrieveData('isFirstHit').then(isFirst => {
          if (isFirst == null) {
            this._getApiSuggestionFromAsync();
          } else {
            retrieveData('SUGGESTION_TEMP').then(result => {
              if (result != null) {
                this.setState({
                  dataSuggestions: result,
                  isLoading: false
                })
              }
            });
          }
        })
      } else {
        this.setState({ isDisconnect: true, isLoading: false })
      }
    });
    function handleFirstConnectivityChange(isConnected) {
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      );
    }
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );
  }

  _getDataLocal() {
    retrieveData('SUGGESTION').then(result => {
      if (result != null) {
        this.setState({ dataLocal: result })
      }
    })
  }

  _getApiSuggestionFromAsync() {

    let user = TaskServices.getAllData('TR_LOGIN')[0];

    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.ACCESS_TOKEN
    }

    fetch('http://tap-ldapdev.tap-agri.com/mobile-inspection/inspection/data/suggestion', {
      method: 'GET',
      headers: headers
    }).then((response) => {
      console.log('Response', response);
      if (response.status) {
        return response.json();
      }
    }).then((data) => {
      console.log('Response Data : ', data)
      if (data.status) {
        this.setState({
          dataSuggestions: data.data,
          isLoading: false
        })
        storeData('SUGGESTION_TEMP', data.data);
        storeData('isFirstHit', true)
      }
    })
      .catch((err) => {
        console.error(err);
      });
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
      storeData('SUGGESTION_TEMP', array);
    }
  }

  renderContent() {
    const { dataSuggestions, dataLocal, isLoading } = this.state;

    if (!isLoading) {
      if (dataSuggestions.length > 0) {
        return <Swiper
          scrollEnabled={false}
          loop={false}
          showsPagination={false}
          showsButtons={false}
          width={width}
          height={320}
          pagingEnabled={false}>
          {
            dataSuggestions.map((item, idx) => {
              let date;
              if (item.DATA_ARRAY[0].DATE.charAt(0) == '9' || item.DATA_ARRAY[0].DATE.charAt(0) == '1') {
                date = '-'
              } else {
                date = dateDisplayMobileWithoutHours(item.DATA_ARRAY[0].DATE);
              }

              return (
                <View style={{ paddingHorizontal: 16 }}>
                  <Card key={idx} style={styles.containerFeature}>
                    <View style={styles.topContainer}>
                      <Image source={{ uri: item.IMAGE }} style={styles.image} />
                      <View style={styles.imageOpacity} />
                      <TouchableOpacity activeOpacity={0.8} onPress={() => this.removeItem()} style={styles.iconClose}>
                        <Icon name={'close'} size={20} color={'white'} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.bottomContainer}>
                      <Text style={{ fontSize: 14, fontWeight: '500' }}> {item.LOCATION_CODE}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '400' }}> {'Dikarenakan ' + item.DATA_ARRAY[0].DESC + ' Terakhir : ' + date}</Text>
                      <ButtonSuggestion title={'Lihat Info Blok'}
                        onPress={() => this.props.navigation.navigate('DetailSuggestion', {
                          arrData: item,
                          _getDataLocal: () => this._getDataLocal(),
                          isGenba: this.state.genbaGranted
                        })} />
                    </View>
                  </Card>
                </View>
              )
            })
          }
        </Swiper>
      }
      else {
        if (dataLocal.length > 0) {
          return <Swiper
            activeDotStyle={{ bottom: `${100 / 4}%`, width: 30, height: 11, borderRadius: 10 }}
            dotStyle={{ bottom: `${100 / 4}%`, width: 11, height: 11, borderRadius: 10 }}
            scrollEnabled={true}
            loop={false}
            showsPagination={true}
            showsButtons={false}
            width={width}
            height={320}
            activeDotColor={colors.orange}
            pagingEnabled={true}>
            {
              dataLocal.map((item, idx) => {
                return (
                  <DataLocalSuggetion
                    item={item}
                    idx={idx}
                    onPress={() => this.props.navigation.navigate('DetailSuggestion', {
                      arrData: item,
                      type: true,
                      _getDataLocal: () => this._getDataLocal()
                    })
                    } />
                )
              })
            }
          </Swiper>
        } else {
          return <EmptySuggestion
            isDisconnect={this.state.isDisconnect}
            isGenba={this.state.genbaGranted}
            onPressGenba={() => this.redirectNextScreen('genba')}
            onPressInspeksi={() => this.redirectNextScreen('inspeksi')} />
        }
      }
    } else {
      return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.colorPrimary} />
      </View>
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{ color: 'black', fontSize: 18, fontWeight: '500', paddingLeft: 3 }}>Rekomendasi Inspeksi</Text>
          <Text style={{ color: '#AAAAAA', fontSize: 14, marginBottom: 10, paddingLeft: 3 }}>Prioritas blok yang harus diinspeksi berdasarkan aktivitas inspeksi, panen, dan rawat.</Text>
        </View>
        {this.renderContent()}
        {this.state.dataLocal.length > 0 &&
          <AddInspection
            onPressGenba={() => this.redirectNextScreen('genba')}
            onPressInspeksi={() => this.redirectNextScreen('inspeksi')}
            genbaGranted={this.state.genbaGranted} />}
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

const DataLocalSuggetion = (props) => {

  let uri;
  let isExist = RNFS.exists(`${dirPhotoInspeksiSuggestion}/${props.item.IMAGE_NAME}`);

  console.log('Image : ', props.item.IMAGE);
  console.log('Image Exist: ', isExist);

  if (isExist) {
    uri = { uri: `file://${dirPhotoInspeksiSuggestion}/${props.item.IMAGE_NAME}` }
  } else {
    uri = Images.img_thumbnail
  }

  let date;
  if (props.item.DATA_ARRAY[0].DATE.charAt(0) == '9' || props.item.DATA_ARRAY[0].DATE.charAt(0) == '1') {
    date = '-'
  } else {
    date = dateDisplayMobileWithoutHours(props.item.DATA_ARRAY[0].DATE);
  }

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Card key={props.idx} style={styles.containerFeature}>
        <View style={styles.topContainer}>
          <Image source={uri} style={styles.image} />
          <View style={styles.imageOpacity} />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              height: 24,
              backgroundColor: 'rgba(255, 179, 0,0.75)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Text style={{ color: colors.white, fontSize: 12 }}>Di tandai untuk inspeksi nanti</Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{props.item.LOCATION_CODE}</Text>
          <Text style={{ fontSize: 12, fontWeight: '400' }}>{'Dikarenakan ' + props.item.DATA_ARRAY[0].DESC + ' Terakhir : ' + date}</Text>
          <ButtonSuggestion title={'Lihat Info Blok'}
            onPress={props.onPress} />
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    height: 180, width: '100%',
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
