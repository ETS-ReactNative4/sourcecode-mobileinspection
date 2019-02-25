import React from 'react';
import PropTypes from 'prop-types';

import { View, Text } from 'react-native';
import { Polygon, Polyline, Marker } from 'react-native-maps';
import PriceMarker from './MarkerBlock';

class XMarksTheSpot extends React.Component {
  // Prop type warnings

	// Defaults for props
	// static defaultProps = {
	// 	onBtnClick: () => {},
  // };
  
  onBtnClick(props){
    props.onBtnClick({
      // ...this.state
    });
  }  

  render() {
    return (
      <View>
        <Polygon
          coordinates={this.props.data.lokasi}
          strokeColor="rgba(0, 0, 0, 1)"
          fillColor="rgba(0, 200, 0, 0.5)"
          strokeWidth={1}
          tappable={true}
          onPress={()=>{this.onBtnClick(this.props)}}
        />
        {/* <Polyline
          coordinates={[this.props.coordinates[0], this.props.coordinates[2]]}
        />
        <Polyline
          coordinates={[this.props.coordinates[1], this.props.coordinates[3]]}
        /> */}
        <Marker coordinate={this.props.center}>
            <PriceMarker desc={'A'} />
          </Marker>
        {/* <Marker
          coordinate={this.props.center}
        /> */}
      </View>
    );
  }
}

XMarksTheSpot.propTypes = {
  coordinates: PropTypes.array,
  center: PropTypes.object,
  zIndex: PropTypes.number,
  data: PropTypes.object,
  onBtnClick: PropTypes.func,
};

export default XMarksTheSpot;
