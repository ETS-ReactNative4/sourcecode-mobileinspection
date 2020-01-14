import React, {Component} from 'react';
import {ScrollView, Text, View, TouchableOpacity, Image} from 'react-native';
import {HeaderWithButton} from "../Component/Header/HeaderWithButton";
import Colors from "../Constant/Colors";
import {clipString} from '../Constant/Functions/StringManipulator';

export default class Leaderboard extends Component {
    static navigationOptions = () => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            rankData: [
                {
                    USER_AUTH_CODE: '1',
                    EMPLOYEE_NIK: '123',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERzxasd AJUzxasdUUzxasd.'
                },
                {
                    USER_AUTH_CODE: '2',
                    EMPLOYEE_NIK: '234',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'zxasd HUTAJULUUERVAN HUTAJULUU'
                },
                {
                    USER_AUTH_CODE: '3',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERVAN HUTAJULUU...'
                },
                {
                    USER_AUTH_CODE: '3',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERVAN HUTAJULUU...'
                },
                {
                    USER_AUTH_CODE: '3',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERVAN HUTAJULUU...'
                },
                {
                    USER_AUTH_CODE: '3',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERVAN HUTAJULUU...'
                }
            ],
            refRole: "BA",
        }
    }

    renderRefRoleSelector(){
        return(
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
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
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
        )
    }
    renderRank(){
        function rankIcon(index){
            switch (index) {
                case 0:
                    return require(`../Images/icon/rank1.png`);
                case 1:
                    return require(`../Images/icon/rank2.png`);
                case 2:
                    return require(`../Images/icon/rank3.png`);
                default:
                    return (index + 1).toString();
            }
        }

        function firstRank(userData, index){
            return(
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderColor: "yellow",
                        paddingVertical: 10,
                        flexDirection: "row"
                    }}>
                    <View style={{
                        flex: 1,
                        flexDirection: "row"
                    }}>
                        <Image
                            style={{ flex: 1 , maxWidth: 36, maxHeight: 36, borderRadius: 36/2, marginTop: 72/2 }}
                            resizeMode={"contain"}
                            source={rankIcon(index)}
                        />
                    </View>
                    <View
                        style={{
                            flex: 4,
                            alignItems:"center"
                        }}>
                        <Image
                            style={{ width: 72, height: 72, borderRadius: 72/2}}
                            resizeMode={"contain"}
                            source={require('../Images/icon/ic-orang-1.png')}
                        />
                        <Text style={{paddingVertical: 10, fontSize: 20}}>{userData.FULLNAME}</Text>
                        <View style={{ flexDirection: "row", backgroundColor:"white", borderRadius: 15, alignItems:'center', alignSelf:"center", paddingHorizontal: 10, paddingVertical: 5}}>
                            <Image style={{ width: 15, height: 15}} source={require('../Images/icon/HomeScreen/icon_points_black.png')} />
                            <Text style={{ fontSize: 12, paddingHorizontal: 10 }}>100000 Point</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
            )
        }
        function otherRank(userData, index){
            return(
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderColor: "yellow",
                        paddingVertical: 10,
                        flexDirection: "row"
                    }}>
                    <View
                        style={{
                            flex: 1.5,
                            flexDirection: "row"
                        }}>
                        {
                            index < 3 ?
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 30,
                                        height: 30,
                                        borderRadius: 30 / 2,
                                        marginRight: 10,
                                        alignSelf: 'center'
                                    }}
                                    resizeMode={"contain"}
                                    source={rankIcon(index)}
                                />
                                :
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                    <Text alignText={"center"}>{rankIcon(index)}</Text>
                                </View>
                        }
                        <Image
                            style={{ flex: 1 , maxWidth: 50, maxHeight: 50, borderRadius: 50/2 }}
                            resizeMode={"contain"}
                            source={require('../Images/icon/ic-orang-1.png')}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3.5
                        }}>
                        <Text style={{paddingHorizontal: 10, paddingBottom: 5, fontSize: 16}}>{userData.FULLNAME}</Text>
                        <View style={{ flexDirection: "row", backgroundColor:"white", borderRadius: 15, alignItems:'center', alignSelf:"baseline", paddingHorizontal: 10, paddingVertical: 5, marginLeft: 5}}>
                            <Image style={{ width: 15, height: 15}} source={require('../Images/icon/HomeScreen/icon_points_black.png')} />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5 }}>100000 Point</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return(
            this.state.rankData.map((userData, index)=>{
                userData.FULLNAME = clipString(userData.FULLNAME, 15);
                if(index === 0){
                    return firstRank(userData, index)
                }
                else {
                    return otherRank(userData, index)
                }
            })
        )
    }

    render() {
        return (

            <View style={{flex: 1}}>
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
                {this.renderRefRoleSelector()}
                <View
                    style={{
                        flex: 1,
                        justifyContent:"space-between",
                        paddingVertical: 15,
                        paddingHorizontal: 15,
                    }}>
                    {this.renderRank()}
                </View>
            </View>

        )
    }
}
