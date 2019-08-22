import React from 'react'
import Colors from '../../Constant/Colors'
import {Text, TouchableOpacity, View} from 'react-native';
import R from 'ramda';

class ReasonManualTPH extends React.Component{

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerStyle: {
            backgroundColor: Colors.tintColorPrimary
          },
          title: 'Input TPH',
          headerTintColor: '#fff',
          headerTitleStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
          },
        //   headerLeft: (
        //     <TouchableOpacity onPress={() => {params.handleBackButtonClick()}}>
        //         <Icon2 style={{marginLeft: 12}} name={'ios-arrow-round-back'} size={45} color={'white'} />
        //     </TouchableOpacity>
        //   )
        };
      }

    constructor(props){
        super(props)
        let params = props.navigation.state.params;
        let statusScan = R.clone(params.statusScan)

        this.state = {
            statusScan
        }
    }

    // componentDidMount(){
    //     // this.setParameter()
    //     // this.props.navigation.setParams({ handleBackButtonClick: this.handleBackButtonClick })
    //     // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    // }

    // componentWillUnmount(){
    // // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    // handleBackButtonClick() {
    //     // if(this.state.hasPhoto){
    //     //     this.deleteFoto()
    //     // }
    //     // const navigation = this.props.navigation;
    //     // let routeName = 'MainMenu';
    //     // Promise.all([navigation.dispatch(NavigationActions.navigate({ routeName : routeName}))]).
    //     //     then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('Riwayat'));
    //     this.props.navigation.goBack(null);
    //     return true;
    // }

    nextScreen(param){
        this.props.navigation.navigate('MapsEbcc', {statusScan: this.state.statusScan, reason: param})
    }

    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <Text style={{ fontSize: 15, fontWeight: '500'}}>Kamu tidak bisa scan TPH?</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 5 }}>Kenapa?</Text>

                    <View style={[styles.buttonContainer, {marginTop:35, paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } onPress={()=>{this.nextScreen('HILANG')}}>
                            <Text style={styles.buttonText}>QR Code TPH-nya Hilang</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.buttonContainer,{paddingLeft: 30, paddingRight: 30}]}>
                        <TouchableOpacity style={[styles.bubble, styles.button] } onPress={()=>{this.nextScreen('RUSAK')}} >
                            <Text style={styles.buttonText}>QR Code TPH-nya Rusak</Text>
                        </TouchableOpacity>
                    </View>

                </View>



            </View>
        )
    }
}

export default ReasonManualTPH

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    bubble: {
        borderWidth: 1,
        borderColor: '#989898',
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 14,
        color: '#808080',
        textAlign: 'center'
    },
    button: {
        flex:1,
        alignItems: 'center',
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
}
