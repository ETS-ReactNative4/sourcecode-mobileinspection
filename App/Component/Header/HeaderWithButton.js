import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import PropTypes from 'prop-types'
import Colors from '../../Constant/Colors';
import VectorIcon from "../VectorIcon";

export const HeaderWithButton = (props) => {
    return (
        <View style={{
            backgroundColor: Colors.tintColorPrimary,
            flexDirection: 'row',
            height: 56
        }}>
            {/* ICON LEFT HEADER */}
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12
                }}
                onPress={props.onPressLeft}>
                {
                    props.leftVectorIcon ?
                    <VectorIcon
                        style={{
                            height: 28,
                            width: 28
                        }}
                        iconSize={25}
                        iconName={props.iconLeft}
                    />
                    :
                    <Image
                        style={{
                            height: 28,
                            width: 28
                        }}
                        source={props.iconLeft} />
                }
            </TouchableOpacity>

            {/* TITLE HEADER */}
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '400',
                }}>
                    {props.title}
                </Text>
            </View>

            {/* ICON RIGHT HEADER */}
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                }}
                onPress={props.onPressRight}>
                {
                    props.rightVectorIcon ?
                        <VectorIcon
                            style={{
                                height: 28,
                                width: 28,
                                alignSelf:"center"
                            }}
                            iconSize={25}
                            iconColor={"white"}
                            iconName={props.iconRight}
                            iconType={"fontawesome"}
                        />
                        :
                        <Image
                            style={{
                                height: 28,
                                width: 28
                            }}
                            source={props.iconRight} />
                }
            </TouchableOpacity>
        </View>
    )
};

HeaderWithButton.defaultProps = {
    title: "Title",
    iconLeft: null,
    iconRight: null,
    onPressLeft: ()=>{},
    onPressRight: ()=>{},
    leftVectorIcon: false,
    rightVectorIcon: false
};

HeaderWithButton.propTypes = {
    title: PropTypes.string,
    iconLeft: PropTypes.oneOf([String, null]),
    iconRight: PropTypes.oneOf([String, null]),
    onPressLeft: PropTypes.func,
    onPressRight: PropTypes.func,
    leftVectorIcon: PropTypes.bool,
    rightVectorIcon: PropTypes.bool
};
