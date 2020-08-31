import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, ImageBackground, ActivityIndicator, NetInfo } from 'react-native';
import { HeaderWithButton } from "../Component/Header/HeaderWithButton";
import Colors from "../Constant/Colors";
import TaskServices from "../Database/TaskServices";
import { Fonts, Images } from '../Themes'
import { getPointLeaderBoard } from './Sync/Download/DownloadLeaderboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            dataBA: [],
            indexBA: 0,
            indexPT: 0,
            dataPT: [],
            dataNational: [],
            isLoading: true,
            isDisconnect: false,
            currentUser: currentUser,
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
                    console.log('Data Peringkat : ', data)
                    data.data.map(result => {
                        this.setState({
                            dataBA: result.BA,
                            dataPT: result.PT,
                            dataNational: result.NATIONAL,
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


    renderRefRoleSelector(data) {

        let dataRank;

        if (this.state.refRole == 'BA' || this.state.refRole == 'PT') {
            if (data.USERS.length > 0) {
                dataRank = data.USERS
            } else {
                dataRank = data.USERS
            }
        } else {
            dataRank = data
        }

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

                        {this.state.refRole == 'BA' && <View style={{ justifyContent: 'space-around', flexDirection: 'row', width: '100%', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                let finalIndex = null;
                                finalIndex = this.decreaseIndex(this.state.indexBA)
                                if (finalIndex !== null) {
                                    this.setState({
                                        indexBA: finalIndex
                                    })
                                }
                            }} style={{ height: 30, width: 30, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                                <Icon size={24} color={'white'} name={'chevron-left'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: Fonts.demi, fontSize: 18, marginHorizontal: 10, color: 'white', alignSelf: 'center', textAlign: 'center' }}>{data.EST_NAME}</Text>
                            <TouchableOpacity onPress={() => {
                                let finalIndex = null;
                                finalIndex = this.increaseIndex(this.state.indexBA, this.state.dataBA.length - 1);
                                if (finalIndex !== null) {
                                    this.setState({
                                        indexBA: finalIndex
                                    })
                                }

                            }}
                                style={{ height: 30, width: 30, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                                <Icon size={24} color={'white'} name={'chevron-right'} />
                            </TouchableOpacity>
                        </View>}

                        {this.state.refRole == 'PT' && <View style={{ justifyContent: 'space-around', flexDirection: 'row', width: '100%', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                let finalIndex = null;
                                finalIndex = this.decreaseIndex(this.state.indexPT)
                                if (finalIndex !== null) {
                                    this.setState({
                                        indexPT: finalIndex
                                    })
                                }
                            }} style={{ height: 30, width: 30, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                                <Icon size={24} color={'white'} name={'chevron-left'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: Fonts.demi, fontSize: 18, marginHorizontal: 10, color: 'white', alignSelf: 'center', textAlign: 'center' }}>{data.COMP_NAME}</Text>
                            <TouchableOpacity onPress={() => {
                                let finalIndex = null;
                                finalIndex = this.increaseIndex(this.state.indexPT, this.state.dataPT.length - 1);
                                if (finalIndex !== null) {
                                    this.setState({
                                        indexPT: finalIndex
                                    })
                                }

                            }}
                                style={{ height: 30, width: 30, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                                <Icon size={24} color={'white'} name={'chevron-right'} />
                            </TouchableOpacity>
                        </View>}

                        <View style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                            flex: 1
                        }}>
                            {dataRank.map((item, idx) => {
                                if (item != null && idx < 3) {

                                    let source;
                                    if (item.IMAGE_URL != null) {
                                        source = { uri: `${item.IMAGE_URL}?random=${Math.random().toString(36).substring(7)}` }
                                    } else {
                                        source = Images.ic_orang;
                                    }
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

                                            {item.RANK == 1 ?
                                                <View style={{ height: 170, width: 90, justifyContent: 'flex-start' }}>
                                                    <View style={{ height: 110, backgroundColor: '#fb9214', justifyContent: 'flex-end', paddingVertical: 14 }}>
                                                        <Text style={{ fontSize: 60, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.RANK}</Text>
                                                        <Text style={{ fontSize: 20, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.POINT}</Text>
                                                    </View>
                                                </View> :
                                                <View style={{ height: 150, width: 72, justifyContent: 'flex-start' }}>
                                                    <ImageBackground resizeMode={'stretch'} source={Images.img_background_rank_2} style={{ height: 90, backgroundColor: 'orange', justifyContent: 'flex-end', paddingVertical: 12 }}>
                                                        <Text style={{ fontSize: 48, fontFamily: Fonts.demi, color: 'white', textAlign: "center", marginTop: 10 }}>{item.RANK}</Text>
                                                        <Text style={{ fontSize: 15, fontFamily: Fonts.demi, color: 'white', textAlign: "center" }}>{item.POINT}</Text>
                                                    </ImageBackground>
                                                </View>}
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    </View>
                </View >
            </ImageBackground >

        )
    }

    decreaseIndex(currentIndex) {
        if (currentIndex === 0) {
            return null;
        }
        return currentIndex - 1;
    }

    increaseIndex(currentIndex, maxIndexLength) {
        if (currentIndex === maxIndexLength) {
            return null;
        }
        return currentIndex + 1;
    }

    renderRank(dataRank) {
        let currentUserAuthCode = this.state.currentUser.USER_AUTH_CODE;

        function iconSelector(currentUserAuthCode, userAuthCode) {
            if (currentUserAuthCode.toString() === userAuthCode.toString()) {
                return require('../Images/icon/Leaderboard/icon_points-orange.png')
            }
            else {
                return require('../Images/icon/Leaderboard/icon_points.png')
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
                                    alignText={"center"}>{userData.RANK}</Text>
                            </View>
                        }
                        <Image
                            style={{ flex: 1, maxWidth: 50, maxHeight: 50, borderRadius: 150 }}
                            resizeMode={'center'}
                            source={profileImage(userData.IMAGE_URL)}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3.5,
                            justifyContent: "center"
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
                        this.props.navigation.goBack(null);
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
                            {this.renderRefRoleSelector(this.state.dataBA[this.state.indexBA])}
                            <View style={{ flex: 2.5 }}>
                                {this.state.dataBA[this.state.indexBA].USERS.length > 0 && <ScrollView
                                    style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 15,
                                    }}>
                                    {this.renderRank(this.state.dataBA[this.state.indexBA].USERS)}
                                </ScrollView>}

                            </View>
                        </View>
                    )
                } else if (this.state.refRole == 'PT') {
                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderRefRoleSelector(this.state.dataPT[this.state.indexPT])}
                            <View style={{ flex: 2.5 }}>
                                {this.state.dataPT[this.state.indexPT].USERS.length > 0 && <ScrollView
                                    style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 15,
                                    }}>
                                    {this.renderRank(this.state.dataPT[this.state.indexPT].USERS)}
                                </ScrollView>
                                }
                            </View>
                        </View>
                    )
                } else {
                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderRefRoleSelector(this.state.dataNational)}
                            <View style={{ flex: 2.5 }}>
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