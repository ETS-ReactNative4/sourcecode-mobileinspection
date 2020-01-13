import React, {Component} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {HeaderWithButton} from "../Component/Header/HeaderWithButton";
import Colors from "../Constant/Colors";

export default class Leaderboard extends Component {
    static navigationOptions = () => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            refRole: "BA",
        }
    }

    render() {
        return (

            <View>
                {/* HEADER */}
                <HeaderWithButton
                    title={"Peringkat Asisten"}
                    iconLeft={require("../Images/icon/ic_arrow_left.png")}
                    rightVectorIcon={true}
                    iconRight={null}
                    onPressLeft={() => {
                        this.props.navigation.pop()
                    }}
                    onPressRight={null}
                />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 20
                }}>
                    <TouchableOpacity
                    style={{
                        minWidth: "20%",
                        alignItems: "center",
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15,
                        backgroundColor: this.state.refRole === "BA" ? "rgba(255,179,0,1)" : "white",
                        borderWidth: 1,
                        borderColor: Colors.tintColorPrimary
                    }}
                    onPress={()=>{
                          this.setState({
                              refRole: "BA"
                          })
                    }}>
                        <Text style={{
                            paddingVertical: 5,
                            color: this.state.refRole === "BA" ? "white" : "rgba(195,187,187,1)"
                        }}>BA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        minWidth: "20%",
                        alignItems: "center",
                        backgroundColor: this.state.refRole === "PT" ? "rgba(255,179,0,1)" : "white",
                        borderWidth: 1,
                        borderColor: Colors.tintColorPrimary
                    }}
                    onPress={()=>{
                      this.setState({
                          refRole: "PT"
                      })
                    }}>
                        <Text style={{
                            paddingVertical: 5,
                            color: this.state.refRole === "PT" ? "white" : "rgba(195,187,187,1)"
                        }}>PT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{
                        minWidth: "20%",
                        alignItems: "center",
                        borderTopRightRadius: 15,
                        borderBottomRightRadius: 15,
                        backgroundColor: this.state.refRole === "NATIONAL" ? "rgba(255,179,0,1)" : "white",
                        borderWidth: 1,
                        borderColor: Colors.tintColorPrimary
                    }}
                    onPress={()=>{
                        this.setState({
                            refRole: "NATIONAL"
                        })
                    }}>
                        <Text style={{
                            paddingVertical: 5,
                            color: this.state.refRole === "NATIONAL" ? "white" : "rgba(195,187,187,1)"
                        }}>National</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
