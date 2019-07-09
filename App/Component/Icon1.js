import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonicIcon from 'react-native-vector-icons/Ionicons';

const iconSource = ['material','fontawesome','ionic'];

RNIcon.defaultProps = {
    iconColor: 'grey',
    iconName: "",
    iconSize: null,
    style: {},
    iconType: "material",
};
RNIcon.propTypes = {
    iconColor: PropTypes.any,
    iconName: PropTypes.any,
    iconSize: PropTypes.any,
    style: PropTypes.any,
    iconType: PropTypes.oneOf(iconSource),
};

export default function RNIcon(props) {
    const {
        iconColor,
        iconName,
        iconSize,
        style,
        iconType,
    } = props;

    const styles = [];
    styles.push({
        color: iconColor,
        fontSize: iconSize
    });
    styles.push(style);

    switch (iconType) {
        case "fontawesome":
            return (
                <FontAwesomeIcon
                    name={iconName}
                    style={styles}
                />
            );
        case "material":
            return (
                <MaterialIcon
                    name={iconName}
                    style={styles}
                />
            );
        case "ionic":
            return (
                <IonicIcon
                    name={iconName}
                    style={styles}
                />
            );
    }

}