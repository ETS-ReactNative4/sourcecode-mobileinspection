import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';

const styles  = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : '#ffff',
        flexDirection : 'column'
    },

    layoutTextTitle : {
        flex:1, 
        flexDirection:'column', 
        justifyContent:'center'
    },

    layoutImageText : {
        flex:1, 
        flexDirection:'column', 
        marginTop:30, 
        justifyContent:'center', 
        borderBottomColor:'#EEEEEE', 
        borderBottomWidth:10
    },

    positionImageText : {
        flex:1, 
        flexDirection:'row', 
        marginBottom:40
    },

    positionImage : {
        flex:0.4, 
        flexDirection:'column', 
        justifyContent:'center',
         alignContent:'center'},


    imageGenba : {
        width : 60, 
        height:60, 
        alignSelf:'center'
    },

    layoutSuggestionText : {
        flex:5, 
        flexDirection:'column', 
        marginTop:30
    },

    suggestionText : {
        fontSize:15,
        fontWeight:'600',
        marginBottom:10, 
        marginLeft:20, 
        marginTop:0
    },

    layoutButton : {
        flex:1, 
        flexDirection:'column', 
        marginTop:20
    },

    buttonInspectionStart : {
        backgroundColor:'#64DD17', 
        marginLeft:30, 
        marginRight:30, 
        borderRadius:10, 
        borderColor:'transparent', 
        borderWidth:1, 
        height:40, 
        elevation:0
    },

    textButtonInspection : {
        color:'#fff', 
        textAlign:'center', 
        fontSize:15
    },

    layoutButtonSelected : {
        flex:1, 
        flexDirection:'column'
    },

    buttonSelected : {
        backgroundColor:'transparent',
        elevation:0, 
        borderColor:'#E0E0E0', 
        borderWidth:1, 
        borderRadius:10
    },

    iconClose : {
        fontSize: 5, 
        height: 5, 
        color: '#FF5252'
    },

    layoutSelectedPeople : {
        flex:1, 
        flexDirection:'column', 
        marginLeft:20, 
        marginRight:20, 
        width: wp('85%'),
        height: hp('6.7%') 
    }

});


export default styles;