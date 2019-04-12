import { StyleSheet } from 'react-native';
import Colors from 'constant/Colors'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16
      },

      ActionButtonStyle: {
        color: Colors.tintColor,
        backgroundColor: Colors.tintColor
      },

      FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
      },
      
      actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      }
});

export default styles;