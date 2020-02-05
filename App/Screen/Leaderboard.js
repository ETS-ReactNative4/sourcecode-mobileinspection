import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, ImageBackground, ActivityIndicator, NetInfo } from 'react-native';
import { HeaderWithButton } from "../Component/Header/HeaderWithButton";
import Colors from "../Constant/Colors";
import TaskServices from "../Database/TaskServices";
import { Fonts, Images } from '../Themes'
import { getPointLeaderBoard } from './Sync/Download/DownloadLeaderboard';

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            dataBA: [],
            dataPT: [],
            dataNational: [],
            isLoading: true,
            isDisconnect: false,
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
                    FULLNAME: 'Doni R.',
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
                    FULLNAME: 'Adam R.',
                    POINT: '102'
                }
            ],
            refRole: "BA"
        }
    }

    componentDidMount() {
        this._initData();
    }

    _initData() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                getPointLeaderBoard().then((data) => {
                    data.data.map(result => {
                        this.setState({
                            dataBA: array_move(result.BA, 0, 1),
                            dataPT: array_move(result.PT, 0, 1),
                            dataNational: array_move(result.NATIONAL, 0, 1),
                            isLoading: false
                        })
                    })
                });
            } else {
                this.setState({ isDisconnect: true, isLoading: false })
            }
        });
        function handleFirstConnectivityChange(isConnected) {
            NetInfo.isConnected.removeEventListener(
                'connectionChange',
                handleFirstConnectivityChange
            );
        }
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            handleFirstConnectivityChange
        );
    }


    renderRefRoleSelector(dataRank) {
        return (
            <ImageBackground resizeMode={'stretch'} source={Images.img_background_leaderboard_1} style={{ flex: 6 }}>
                {/* <Image source={Images.img_background_leaderboard} style={{ resizeMode: 'stretch', width: '100%', height: "100%", position: 'absolute', opacity: 1 }} /> */}

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
                                        fontFamily: Fonts.demi,
                                        paddingVertical: 5,
                                        color: this.state.refRole === "NATIONAL" ? "white" : "rgba(255,179,0,1)"
                                    }}>National</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    <View style={{ flex: 9, alignItems: "center", justifyContent: "center" }}>
                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            flex: 1
                        }}>
                            {dataRank.map((item, idx) => {
                                if (item != null) {

                                    let source;
                                    if (item.IMAGE_URL != null) {
                                        source = { uri: item.IMAGE_URL }
                                    } else {
                                        source = Images.ic_orang;
                                    }
                                    if (idx == 0) {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.bold,
                                                            color: 'white',
                                                            textAlign: "center",
                                                            width: 72,
                                                            fontSize: 16
                                                        }}>{item.FULLNAME}</Text>
                                                    <Image source={source} style={{ marginTop: 5, height: 72, width: 72, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                                                </View>

                                                <View style={{ height: 150, width: 72, justifyContent: 'flex-start' }}>
                                                    <ImageBackground resizeMode={'stretch'} source={Images.img_background_rank_2} style={{ height: 90, backgroundColor: 'orange', justifyContent: 'flex-end', paddingVertical: 12 }}>
                                                        <Text style={{ fontSize: 48, fontFamily: Fonts.demi, color: 'white', textAlign: "center", marginTop: 10 }}>{item.RANK}</Text>
                                                        <Text style={{ fontSize: 15, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.POINT}</Text>
                                                    </ImageBackground>
                                                </View>
                                            </View>
                                        )
                                    } else if (idx == 1) {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                                                    <Text style={{
                                                        fontSize: 18,
                                                        fontFamily: Fonts.bold, color: 'white', textAlign: "center", width: 90
                                                    }}>{item.FULLNAME}</Text>
                                                    <Image source={source} style={{ marginTop: 5, height: 90, width: 90, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                                                </View>

                                                <View style={{ height: 170, width: 90, justifyContent: 'flex-start' }}>
                                                    <View style={{ height: 110, backgroundColor: '#fb9214', justifyContent: 'flex-end', paddingVertical: 14 }}>
                                                        <Text style={{ fontSize: 60, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.RANK}</Text>
                                                        <Text style={{ fontSize: 20, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.POINT}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    } else if (idx == 2) {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
                                                    <Text style={{ fontSize: 16, fontFamily: Fonts.bold, color: 'white', textAlign: "center", width: 72 }}>{item.FULLNAME}</Text>
                                                    <Image source={source} style={{ marginTop: 5, height: 72, width: 72, borderRadius: 50, borderWidth: 2, borderColor: Colors.colorWhite }} />
                                                </View>

                                                <View style={{ height: 150, width: 72, justifyContent: 'flex-start' }}>
                                                    <ImageBackground resizeMode={'stretch'} source={Images.img_background_rank_3} style={{ height: 90, backgroundColor: 'orange', justifyContent: 'flex-end', paddingVertical: 12 }}>
                                                        <Text style={{ fontSize: 48, fontFamily: Fonts.demi, color: 'white', textAlign: "center", marginTop: 10 }}>{item.RANK}</Text>
                                                        <Text style={{ fontSize: 15, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.POINT}</Text>
                                                    </ImageBackground>
                                                </View>
                                            </View>
                                        )
                                    }
                                }
                            })}
                        </View>
                    </View>
                </View >
            </ImageBackground>

        )
    }

    renderRank(dataRank) {
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
            if (currentUserAuthCode.toString() === userAuthCode.toString()) {
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

        function profileImage(image) {
            if (image !== null) {
                return { uri: image }
            } else {
                return Images.ic_orang;
            }
        }

        function otherRank(userData, index) {

            let user = currentUserAuthCode !== userData.USER_AUTH_CODE ? userData.FULLNAME : "Peringkat Kamu";
            let color = currentUserAuthCode !== userData.USER_AUTH_CODE ? "rgba(195,187,187,1)" : "rgba(255,179,0,1)"

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
                            source={profileImage(userData.IMAGE_URL)}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3.5,
                            justifyContent:"center"
                        }}>
                        <Text style={{ fontFamily: Fonts.demi, paddingHorizontal: 10, fontSize: 17, color: color, }}>{user}</Text>
                        <View style={{ flexDirection: "row", backgroundColor: "white", borderRadius: 15, alignItems: 'center', alignSelf: "baseline", paddingHorizontal: 5, marginLeft: 5 }}>
                            <Image style={{ width: 15, height: 15 }} source={iconSelector(currentUserAuthCode, userData.USER_AUTH_CODE)} />
                            <Text style={{ fontFamily: Fonts.medium, fontSize: 12, paddingHorizontal: 5, color: color, }}>{userData.POINT} points</Text>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            dataRank.map((userData, index) => {
                if (userData != null) {
                    if (index > 2) {
                        return otherRank(userData, index)
                    }
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
                {this.renderByType()}

            </View>

        )
    }

    renderByType() {

        const { isLoading, isDisconnect } = this.state;

        if (!isLoading) {
            if (!isDisconnect) {
                if (this.state.refRole == 'BA') {
                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderRefRoleSelector(this.state.dataBA)}
                            <View style={{ flex: 4 }}>
                                <ScrollView
                                    style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 15,
                                    }}>
                                    {this.renderRank(this.state.dataBA)}
                                </ScrollView>
                            </View>
                        </View>
                    )
                } else if (this.state.refRole == 'PT') {
                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderRefRoleSelector(this.state.dataPT)}
                            <View style={{ flex: 4 }}>
                                <ScrollView
                                    style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 15,
                                    }}>
                                    {this.renderRank(this.state.dataPT)}
                                </ScrollView>
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderRefRoleSelector(this.state.dataNational)}
                            <View style={{ flex: 4 }}>
                                <ScrollView
                                    style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 15,
                                    }}>
                                    {this.renderRank(this.state.dataNational)}
                                </ScrollView>
                            </View>
                        </View>)
                }
            } else {
                return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Image source={Images.ic_no_wifi} style={{
                        height: 100,
                        width: 100,
                        opacity: 0.8
                    }} />
                    <Text style={{ fontFamily: Fonts.demi, marginTop: 16, fontSize: 16 }}>Tidak ada koneksi internet</Text>
                    <Text style={{ fontFamily: Fonts.book, marginTop: 2, fontSize: 14, textAlign: "center" }}>Pastikan device terhubung WIFI/Paket Data untuk melihat Peringkat Asisten</Text>
                </View>
            }
        } else {
            return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={Colors.tintColorPrimary} />
            </View>
        }
    }

}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};