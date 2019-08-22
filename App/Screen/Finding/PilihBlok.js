import React, {Component} from 'react';
import {BackHandler, Keyboard, ListView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from '../../Constant/Colors'
import IconLoc from 'react-native-vector-icons/FontAwesome5';
import MapView, {Marker} from 'react-native-maps';
import TaskService from '../../Database/TaskServices';
import {ProgressDialog} from 'react-native-simple-dialogs';
import Geojson from 'react-native-geojson';


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const alcatraz = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [-6.2292229, 106.8253967],
          latitudeDelta:0.015,
          longitudeDelta:0.0121 //[-122.42305755615234, 37.82687023785448],
        }
      }
    ]
};

class PilihBlok extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state = {
            latitude: 0.0,
            longitude: 0.0,
            error: null,
            blok: '',
            fetchLocation: false,
            werksAfdBlokCode: '',
            afdCode: '',
            arrBlok : [],
            arrBlokSearched : [],
            showList: false,
            user: null
        };
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
    // alert('Keyboard Shown');
    }

    _keyboardDidHide () {
    // alert('Keyboard Hidden');
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
        let data = TaskService.getAllData('TM_BLOCK');
        let arr = [];
        for(var i=0; i<data.length; i++){
            let statusBlok= this.getStatusBlok(data[i].WERKS_AFD_BLOCK_CODE);
            let estateName = this.getEstateName(data[i].WERKS);
            arr.push({
                blokCode: data[i].BLOCK_CODE,
                blokName: data[i].BLOCK_NAME,
                afdCode: data[i].AFD_CODE,
                werks: data[i].WERKS,
                estateName: estateName,
                werksAfdBlokCode: data[i].WERKS_AFD_BLOCK_CODE,
                statusBlok: statusBlok,
                compCode: data[i].COMP_CODE,
                allShow: `${data[i].BLOCK_NAME}/${statusBlok}/${estateName}`
            });
            this.setState({arrBlok: arr, arrBlokSearched: arr})
        }
        this.getLocation();
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    getStatusBlok(werk_afd_blok_code){
        try {
            let data = TaskService.findBy2('TM_LAND_USE', 'WERKS_AFD_BLOCK_CODE', werk_afd_blok_code);
            return data.MATURITY_STATUS;
        } catch (error) {
            return ''
        }
    }

    getEstateName(werks){
        try {
            let data = TaskService.findBy2('TM_EST', 'WERKS', werks);
            return data.EST_NAME;
        } catch (error) {
            return '';
        }
    }

    searchedBloks = (searchedText) => {
        this.setState({showList:true})
        var searchedAdresses = this.state.arrBlok.filter(function(bloks) {
          return bloks.allShow.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
        this.setState({arrBlokSearched: searchedAdresses});
      };

    renderBloks = (blok) => {
        return (
            <View style={{flex:1, padding:5}}>
            <TouchableOpacity onPress = {()=>{this.onSelect(blok)}}>
                <Text style={{ fontSize: 15, color: 'grey' }}>{blok.allShow}</Text>
            </TouchableOpacity>
            </View>
        );
    };

    onSelect(user){
        this.setState({showList: false, blok: user.allShow, user})
    };

    setLokasi(){
        this.props.navigation.state.params.changeBlok(this.state.user);
        this.props.navigation.goBack();
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var lon = parseFloat(position.coords.longitude);
                this.setState({latitude:lat, longitude:lon, fetchLocation: false});

            },
            (error) => {
                // this.setState({ error: error.message, fetchingLocation: false })
                let message = error && error.message ? error.message : 'Terjadi kesalahan ketika mencari lokasi anda !';
                if (error && error.message == "No location provider available.") {
                    message = "Mohon nyalakan GPS anda terlebih dahulu.";
                }
                this.setState({fetchLocation:false})
                // alert('Informasi', message);
                // console.log(message);
            }, // go here if error while fetch location
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, //enableHighAccuracy : aktif highaccuration , timeout : max time to getCurrentLocation, maximumAge : using last cache if not get real position
        );
    }

    render() {
        return (
            <View style={[styles.containerSlidingUpPanel]}>

                <View style={{ width: '100%', height: 20 }} onPress={() => this.setState({ isMapsVisible: false })}>
                    <View style={{
                            backgroundColor: '#CCC', alignSelf: 'center',
                            height: 4, width: 80, marginTop: 10
                        }}
                    />
                </View>
                 <View style={{margin:10}}>
                    <View style={{margin:10 }}>
                        <Text style={{ color: '#696969' }}>Blok</Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[styles.searchInput]}
                            onChangeText={this.searchedBloks}
                            defaultValue={this.state.blok}
                            onSubmitEditing={Keyboard.dismiss}
                            placeholder="Cari nama blok" />
                    </View>
                    {this.state.showList && <View>
                    <ListView
                        dataSource={ds.cloneWithRows(this.state.arrBlokSearched)}
                        renderRow={this.renderBloks}
                        renderSeparator={(sectionId, rowId)=><View key={rowId} style={styles.separator} />}
                        />
                    </View>}
                </View>

                <View style={styles.line} />

                <Text style={{ color: Colors.brand, textAlign: 'center', paddingHorizontal: 25, marginBottom: 10, fontSize: 16, fontWeight: 'bold', alignSelf: 'center' }}>Pastikan kamu telah berada di lokasi yang benar</Text>
                <View style={styles.containerMap}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude:this.state.latitude,
                            longitude:this.state.longitude,
                            latitudeDelta:0.015,
                            longitudeDelta:0.0121
                        }}>
                        <Geojson geojson={alcatraz} />
                        <Marker
                            coordinate={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                            }}
                            centerOffset={{ x: -42, y: -60 }}
                            anchor={{ x: 0.84, y: 1 }}
                        >
                        </Marker>
                    </MapView>

                    {!this.state.showList &&
                    <IconLoc
                        onPress={() => { this.setState({fetchLocation: true}), this.getLocation() }}
                        name="location-arrow"
                        size={24}
                        style={{ alignSelf: 'flex-end', marginBottom: 280, marginRight: 10 }} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } onPress={()=>{this.setLokasi()}}>
                            <Text style={styles.buttonText}>Set Lokasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {<ProgressDialog
                        visible={this.state.fetchLocation}
                        activityIndicatorSize="large"
                        message="Mencari Lokasi..."
                />}
            </View>
        )
    }
}

export default PilihBlok;

const styles = {
    searchInput: {
        height: 40,
        paddingLeft: 5,
        paddingRight: 5,
        marginRight: 5,
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        color: '#808080',
    },
    containerMap: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    bubble: {
        backgroundColor: '#ff8080',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    // buttonText: {
    //     fontSize: 17,
    //     color: '#ffffff',
    //     textAlign: 'center'
    // },
    button: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    containerSlidingUpPanel: {
        marginTop: 5,
        flex: 1,
        zIndex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white'
    },
    line: {
        marginTop: 16,
        marginBottom: 16,
        borderBottomColor: "#CCC",
        borderBottomWidth: 1
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center'
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
}
