import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { HeaderWithButton } from "../Component/Header/HeaderWithButton";
import Colors from "../Constant/Colors";
import { clipString } from '../Constant/Functions/StringManipulator';
import TaskServices from "../Database/TaskServices";
import images from '../Themes/Images';


const LeaderboardRank = (userData, index) => {
    return (
        <View style={{
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1
        }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: "center",
                            width: 72,
                        }}>Rizki P.</Text>
                    <Image source={images.ic_orang} style={{ marginTop: 5, height: 72, width: 72, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                </View>


                <View style={{ height: 150, width: 72, justifyContent: 'flex-start' }}>
                    <ImageBackground resizeMode={'stretch'} source={images.img_background_rank_2} style={{ height: 90, backgroundColor: 'orange', justifyContent: 'flex-end', paddingVertical: 12 }}>
                        <Text style={{ fontSize: 48, fontWeight: '800', color: 'white', textAlign: "center", marginTop: 10 }}>2</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: "center" }}>1,180</Text>
                    </ImageBackground>
                </View>
            </View>


            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: "center", width: 90 }}>Mega B.</Text>
                    <Image source={images.ic_orang} style={{ marginTop: 5, height: 90, width: 90, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                </View>

                <View style={{ height: 170, width: 90, justifyContent: 'flex-start' }}>
                    <View style={{ height: 110, backgroundColor: '#fb9214', justifyContent: 'flex-end', paddingVertical: 14 }}>
                        <Text style={{ fontSize: 54, fontWeight: '900', color: 'white', textAlign: "center" }}>1</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: "center" }}>1,401</Text>
                    </View>
                </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: "center", width: 67 }}>Sentot S.</Text>
                    <Image source={images.ic_orang} style={{ marginTop: 5, height: 72, width: 72, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                </View>

                <View style={{ height: 150, width: 72, justifyContent: 'flex-start' }}>
                    <ImageBackground resizeMode={'stretch'} source={images.img_background_rank_3} style={{ height: 90, backgroundColor: 'orange', justifyContent: 'flex-end', paddingVertical: 12 }}>
                        <Text style={{ fontSize: 48, fontWeight: '900', color: 'white', textAlign: "center", marginTop: 10 }}>3</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', textAlign: "center" }}>1,180</Text>
                    </ImageBackground>
                </View>
            </View>
        </View>

    )
}

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            currentUser: currentUser,
            rankData: [
                {
                    USER_AUTH_CODE: '1',
                    EMPLOYEE_NIK: '123',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERzxasd AJUzxasdUUzxasd.',
                    POINT: '503'
                },
                {
                    USER_AUTH_CODE: '2',
                    EMPLOYEE_NIK: '234',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'zxasd HUTAJULUUERVAN HUTAJULUU',
                    POINT: '503'
                },
                {
                    USER_AUTH_CODE: '3',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ERVAN HUTAJULUU...',
                    POINT: '503'
                },
                {
                    USER_AUTH_CODE: '4',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'DONI ROMDONI',
                    POINT: '503'
                },
                {
                    USER_AUTH_CODE: '5',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'RIZKY OCTARINA PUSPITASARI',
                    POINT: '208'
                },
                {
                    USER_AUTH_CODE: '6',
                    EMPLOYEE_NIK: '345',
                    USER_ROLE: 'haha',
                    LOCATION_CODE: "123",
                    REF_ROLE: 'string',
                    JOB: 'string',
                    FULLNAME: 'ADAM RAHMAT',
                    POINT: '102'
                }
            ],
            refRole: "BA"
        }
    }

    renderRefRoleSelector() {
        return (
            <ImageBackground resizeMode={'stretch'} source={images.img_background_leaderboard_1} style={{ flex: 6 }}>
                {/* <Image source={images.img_background_leaderboard} style={{ resizeMode: 'stretch', width: '100%', height: "100%", position: 'absolute', opacity: 1 }} /> */}

                <View style={{
                    flex: 6,
                    padding: 16
                }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: "center",
                        flex: 1
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}>
                                <TouchableOpacity
                                    style={{
                                        minWidth: "20%",
                                        alignItems: "center",
                                        borderTopLeftRadius: 15,
                                        borderBottomLeftRadius: 15,
                                        backgroundColor: this.state.refRole === "BA" ? "rgba(255,179,0,1)" : "white",
                                        borderWidth: 1,
                                        borderColor: "rgba(255,179,0,1)"
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            refRole: "BA"
                                        })
                                    }}>
                                    <Text style={{
                                        fontWeight: '500',
                                        paddingVertical: 5,
                                        color: this.state.refRole === "BA" ? "white" : "rgba(255,179,0,1)"
                                    }}>BA</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    minWidth: "20%",
                                    alignItems: "center",
                                    backgroundColor: this.state.refRole === "PT" ? "rgba(255,179,0,1)" : "white",
                                    borderTopWidth: 1,
                                    borderBottomWidth: 1,
                                    borderColor: "rgba(255,179,0,1)"
                                }}
                                    onPress={() => {
                                        this.setState({
                                            refRole: "PT"
                                        })
                                    }}>
                                    <Text style={{
                                        fontWeight: '500',
                                        paddingVertical: 5,
                                        color: this.state.refRole === "PT" ? "white" : "rgba(255,179,0,1)"
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
                                        borderColor: "rgba(255,179,0,1)"
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            refRole: "NATIONAL"
                                        })
                                    }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        paddingVertical: 5,
                                        color: this.state.refRole === "NATIONAL" ? "white" : "rgba(255,179,0,1)"
                                    }}>National</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 9, alignItems: "center", justifyContent: "center" }}>
                        <LeaderboardRank />
                    </View>
                </View >
            </ImageBackground>

        )
    }
    renderRank() {
        let currentUserAuthCode = this.state.currentUser.USER_AUTH_CODE;
        function colorSelector(currentUserAuthCode, userAuthCode) {
            if (currentUserAuthCode.toString() === userAuthCode.toString()) {
                return "rgba(255,179,0,1)"
            }
            else {
                return "rgba(195,187,187,1)"
            }
        }
        function iconSelector(currentUserAuthCode, userAuthCode) {
            if ('5' === userAuthCode.toString()) {
                return require('../Images/icon/Leaderboard/icon_points-orange.png')
            }
            else {
                return require('../Images/icon/Leaderboard/icon_points.png')
            }
        }

        function rankIcon(index) {
            switch (index) {
                default:
                    return (index + 1).toString();
            }
        }

        function firstRank(userData, index) {
            return (
                <View
                    key={index}
                    style={{
                        borderBottomWidth: 1,
                        borderColor: "rgba(195,187,187,1)",
                        paddingVertical: 10,
                        flexDirection: "row"
                    }}>
                    <View style={{
                        flex: 1,
                        flexDirection: "row"
                    }}>
                        <Image
                            style={{ flex: 1, maxWidth: 36, maxHeight: 36, borderRadius: 36 / 2, marginTop: 36 / 2 }}
                            resizeMode={"contain"}
                            source={rankIcon(index)}
                        />
                    </View>
                    <View
                        style={{
                            flex: 4,
                            alignItems: "center"
                        }}>
                        <Image
                            style={{ width: 72, height: 72, borderRadius: 72 / 2 }}
                            resizeMode={"contain"}
                            source={require('../Images/icon/ic-orang-1.png')}
                        />
                        <Text style={{ paddingVertical: 10, fontSize: 20, color: colorSelector(currentUserAuthCode, userData.USER_AUTH_CODE) }}>{userData.FULLNAME}</Text>
                        <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: "center", paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image style={{ width: 15, height: 15 }} source={iconSelector(currentUserAuthCode, userData.USER_AUTH_CODE)} />
                            <Text style={{ fontSize: 12, paddingHorizontal: 10, color: colorSelector(currentUserAuthCode, userData.USER_AUTH_CODE) }}>{userData.POINT} points</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            )
        }
        function otherRank(userData, index) {

            let user = "5" !== userData.USER_AUTH_CODE ? userData.FULLNAME : "Peringkat Kamu";
            let color = "5" !== userData.USER_AUTH_CODE ? "rgba(195,187,187,1)" : "rgba(255,179,0,1)"

            return (
                index > 2 &&
                <View
                    key={index}
                    style={{
                        //index 5 last, kalo last ilangin border bwh
                        borderBottomWidth: index === 5 ? 0 : 0.5,
                        borderColor: "rgba(195,187,187,1)",
                        paddingVertical: 10,
                        flexDirection: "row"
                    }}>
                    <View
                        style={{
                            flex: 1.5,
                            flexDirection: "row"
                        }}>
                        {
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: color
                                }}
                                    alignText={"center"}>{rankIcon(index)}</Text>
                            </View>
                        }
                        <Image
                            style={{ flex: 1, maxWidth: 50, maxHeight: 50, borderRadius: 50 / 2 }}
                            resizeMode={"contain"}
                            source={require('../Images/icon/ic-orang-1.png')}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3.5
                        }}>
                        <Text style={{ paddingHorizontal: 10, paddingBottom: 5, fontSize: 18, color: color, fontWeight: '500' }}>{user}</Text>
                        <View style={{ flexDirection: "row", backgroundColor: "white", borderRadius: 15, alignItems: 'center', alignSelf: "baseline", paddingHorizontal: 10, paddingVertical: 5, marginLeft: 5 }}>
                            <Image style={{ width: 15, height: 15 }} source={iconSelector(currentUserAuthCode, userData.USER_AUTH_CODE)} />
                            <Text style={{ fontSize: 12, paddingHorizontal: 5, color: color, fontWeight: '500' }}>{userData.POINT} points</Text>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            this.state.rankData.map((userData, index) => {
                userData.FULLNAME = clipString(userData.FULLNAME, 15);
                if (index === 0) {
                    // return firstRank(userData, index)
                    return null
                }
                else {
                    return otherRank(userData, index)
                }
            })
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                {/* HEADER */}
                <HeaderWithButton
                    titlePosition={'left'}
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
                <View style={{ flex: 4 }}>
                    <ScrollView
                        style={{
                            paddingVertical: 15,
                            paddingHorizontal: 15,
                        }}>
                        {this.renderRank()}
                    </ScrollView>
                </View>
            </View>

        )
    }
}
