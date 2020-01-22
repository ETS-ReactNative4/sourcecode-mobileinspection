//ref link
//https://github.com/nidhinkumar06/ReactNativeCharts/blob/master/src/components/Gauge.js

import React, { Component } from "react";
import PropTypes from 'prop-types'
import { View, Text } from "react-native";
import Svg, { G, Circle, Line, Polygon, Use, Defs } from "react-native-svg";
import {HeaderWithButton} from "../Header/HeaderWithButton";

export default class Gauge extends Component {
    renderDial = opts => {
        let offset = opts.circumference * (1 - 75 / 100);

        return (
            <Circle
                cx={opts.cX}
                cy={opts.cY}
                r={opts.radius}
                fill="none"
                stroke={opts.dialColor}
                strokeWidth={opts.dialWidth}
                strokeDasharray={opts.circumference}
                strokeDashoffset={offset}
                strokeLinecap={opts.progressRoundedEdge ? "round" : "butt"}
            />
        );
    };

    renderProgress = opts => {
        // let offset = opts.circumference * (1 - opts.currentValue / 100);
        let offset = opts.circumference * (1 - opts.currentValue / 100);
        return (
            <Circle
                cx={opts.cX}
                cy={opts.cY}
                r={opts.radius}
                fill="none"
                stroke={opts.progressColor}
                strokeWidth={opts.progressWidth}
                strokeDasharray={opts.circumference * 0.75}
                strokeDashoffset={offset * 0.75}
                strokeLinecap={opts.progressRoundedEdge ? "round" : "butt"}
            />
        );
    };

    render() {
        let opts = Object.assign({}, this.props);

        let { size, dialWidth } = opts;

        let cX = size / 2;
        let cY = size / 2;
        let radius = (size - 2 * dialWidth) / 2;
        let diameter = 2 * radius;
        let circumference = 2 * Math.PI * radius;
        opts = Object.assign(opts, {
            cX,
            cY,
            radius,
            diameter,
            circumference
        });

        return (
            <View style={[opts.containerStyle, {alignSelf:"center"}]}>
                <Svg
                    height={size}
                    width={size}
                    viewBox={`0 0 ${size} ${size}`}
                >
                    <G transform={`rotate(135 ${cX} ${cY})`}>
                        {this.renderDial(opts)}
                        {this.renderProgress(opts)}
                    </G>
                </Svg>
                <View style={{
                    position:"absolute",
                    alignItems:"center",
                    justifyContent:"center",
                    top:0,
                    bottom:0,
                    left:0,
                    right:0
                }}>
                    <Text style={opts.textStyle}>{opts.currentValue}%</Text>
                </View>
            </View>
        );
    }
}

Gauge.defaultProps = {
    size: 200,

    dialWidth: 15,
    dialColor: "#eee",

    maximumValue: 100,
    currentValue: 25,
    progressWidth: 10,
    progressColor: "#3d3d3d",
    progressRoundedEdge: false,

    textStyle: {},
    containerStyle: {}
};

Gauge.propTypes = {
    size: 200,
    maximumValue: 100,
    currentValue: 25,
    dialWidth: 15,
    dialColor: "#eee",
    progressWidth: 10,
    progressColor: "#3d3d3d",
    progressRoundedEdge: false,
    textStyle: {},
    containerStyle: {}
};
