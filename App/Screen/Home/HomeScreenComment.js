import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, FlatList, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';
import Colors from "../../Constant/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from '../../Component/Icon1'
import TaskServices from "../../Database/TaskServices";
import moment from 'moment'
let ic_org_placeholder = require('../../Images/ic-orang.png');

export default class HomeScreenComment extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
                backgroundColor: Colors.tintColor
            },
            title: 'Komentar',
            headerTintColor: '#fff',
            headerTitleStyle: {
                flex: 1,
                fontSize: 18,
                fontWeight: '400'
            },
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Icon style={{ marginLeft: 12 }} name={'ios-arrow-round-back'} size={45} color={'white'} />
                </TouchableOpacity>
            )
        };
    }

    constructor(props) {
        super();

        this.state = {
            FINDING_CODE: props.navigation.getParam("findingCode", null),
            commentData: [],
            commentValue: "",

            listUser: [],
            filteredUser: [],
            filterShow: false,

            taggedUser: [],
        }
    }

    componentDidMount() {
        this.getComment();
        this.getListUser();
    }

    getListUser() {
        let listUser = TaskServices.getAllData("TR_CONTACT").sorted('FULLNAME', false);

        if (listUser !== null) {
            this.setState({
                listUser: listUser
            })
        }
    }

    getComment() {
        let commentData = TaskServices.findBy("TR_FINDING_COMMENT", "FINDING_CODE", this.state.FINDING_CODE);
        console.log(commentData);
        if (commentData !== null) {
            this.setState({
                commentData: commentData,
                commentValue: ""
            }, () => {
                Keyboard.dismiss()
            })
        }
    }

    insertComment() {
        let dataLogin = TaskServices.getAllData('TR_LOGIN')[0];
        let getUserName = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', dataLogin.USER_AUTH_CODE);
        let dateTime = moment().format('YYYYMMDDHHmmss');
        let saveTaggedUser = [];
        this.state.taggedUser.map((taggedUser) => {
            if (this.state.commentValue.length > 0 && this.state.commentValue.includes(taggedUser.FULLNAME)) {
                saveTaggedUser.push(taggedUser);
            }
        });

        let tempComment = {
            FINDING_COMMENT_ID: "FC" + dataLogin.USER_AUTH_CODE + dateTime,
            FINDING_CODE: this.state.FINDING_CODE,
            USER_AUTH_CODE: dataLogin.USER_AUTH_CODE,
            MESSAGE: this.state.commentValue,
            INSERT_TIME: dateTime,
            TAGS: saveTaggedUser,
            //LOCAL PARAM
            STATUS_SYNC: 'N',
            USERNAME: getUserName.FULLNAME
        };
        TaskServices.saveData('TR_FINDING_COMMENT', tempComment);

        this.setState({
            filterShow: false
        }, () => {
            this.getComment();
        })
    }

    timeConverter(insertTime) {
        if (typeof insertTime !== undefined && insertTime !== null) {
            let finalTime = moment(insertTime, 'YYYYMMDDHHmmss').format('DD MMM YYYY kk:mm');
            return finalTime.toString()
        }
        return null;
    }

    filterData(keyword) {
        let tempArray = [];
        this.state.listUser.filter((item) => {
            if (item.FULLNAME.toLowerCase().includes(keyword.toLowerCase())) {
                tempArray.push(item)
            }
        });
        return tempArray;
    }

    renderTagList() {
        return (
            <View style={{
                width: "100%",
                height: "100%",
                position: 'absolute'
            }}>
                <FlatList
                    ref={component => this._flatlistCatalog = component}
                    style={{ flex: 1, padding: 5 }}
                    data={this.state.filteredUser}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingBottom: 10
                                }}
                                onPress={() => {
                                    //update input text label + tagged user
                                    let tempTaggedUser = this.state.taggedUser;
                                    tempTaggedUser.push(item);
                                    let splitText = this.state.commentValue.lastIndexOf("@");
                                    this.setState({
                                        commentValue: this.state.commentValue.slice(0, splitText) + "@" + item.FULLNAME + " ",
                                        filterShow: false,
                                        taggedUser: tempTaggedUser
                                    })
                                }}>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row'
                                }}>
                                    <View>
                                        <Image source={require('../../Images/ic-orang.png')} style={{ width: 30, height: 30, marginRight: 15 }} />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: 'black' }}>{item.FULLNAME}</Text>
                                        <Text style={{ fontSize: 11, color: '#bdbdbd', marginTop: 4 }}>{item.USER_ROLE.replace(/_/g," ")}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }

    processText(commentValue, listTaggedUser) {
        if (listTaggedUser.length > 0) {
            let tempComment = [commentValue];
            listTaggedUser.map((userTagged) => {
                tempComment.map((comment, index) => {
                    if (comment.includes("@" + userTagged.FULLNAME)) {
                        let tempSplit = comment.split("@" + userTagged.FULLNAME);
                        tempSplit.splice(1,0, "@"+userTagged.FULLNAME);
                        if(tempComment.length === 1){
                            tempComment = tempSplit;
                        }
                        else {
                            tempComment.splice(index,1,...tempSplit);
                        }
                    }
                });
            });
            let finalText = <Text>{
                tempComment.map((data)=>{
                    if(data.charAt(0) === "@"){
                        return <Text style={{color:Colors.taggedUser}}>{data}</Text>
                    }
                    else {
                        return <Text>{data}</Text>
                    }
                })
                }</Text>

            return finalText
        }
        else {
            return commentValue;
        }
        return null;
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.background
                }}>
                <View
                    style={{
                        flex: 1
                    }}
                >
                    {this.state.filterShow ? this.renderTagList() : this.renderFlatlist()}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: 'black',
                        height: 65,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 10
                    }}
                >
                    <Image
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 25
                        }}
                        resizeMode={"stretch"}
                        source={ic_org_placeholder}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: Colors.abu1,
                            borderRadius: 5,
                            alignItems: "center",
                            margin: 10,
                            paddingLeft: 10
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginHorizontal: 5
                            }}
                            resizeMode={"stretch"}
                            source={require('../../Images/icon/ic_writing.png')}
                        />
                        <TextInput
                            style={{ flex: 1 }}
                            multiline={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Ketik di sini ..."
                            placeholderTextColor={Colors.abu1}
                            blurOnSubmit={true}
                            maxLength={100}
                            onChangeText={(value) => {
                                let showFilter = false;
                                let tagValue = value.split(" ");
                                let filteredUser = [];
                                if (tagValue.length > 0) {
                                    let tempWord = tagValue[tagValue.length - 1];
                                    if (tempWord.charAt(0) === "@") {
                                        filteredUser = this.filterData(tempWord.replace("@", ""))
                                        showFilter = filteredUser.length > 0;
                                    }
                                    else {
                                        showFilter = false
                                    }
                                    // alert(tagValue[tagValue.length - 1])
                                }
                                this.setState({
                                    filteredUser: filteredUser,
                                    filterShow: showFilter,
                                    commentValue: value
                                })
                            }}
                        >
                            {this.state.commentValue}
                        </TextInput>
                        <TouchableOpacity onPress={() => {
                            if(this.state.commentValue.length > 0){
                                this.insertComment()
                            }
                        }}>
                            <Icon1
                                style={{ marginLeft: 12 }}
                                iconName={'keyboard-arrow-right'}
                                iconSize={25} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderFlatlist() {
        if (this.state.commentData.length > 0) {
            return (
                <FlatList
                    ref={component => this._flatlistCatalog = component}
                    style={{ flex: 1 }}
                    data={this.state.commentData}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        let finalMessage = this.processText(item.MESSAGE, item.TAGS);
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    marginTop: 5,
                                    marginHorizontal: 5
                                }}
                            >
                                <Image
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 25
                                    }}
                                    resizeMode={"stretch"}
                                    source={ic_org_placeholder}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        marginLeft: 5
                                    }}
                                >
                                    <Text>
                                        <Text style={{
                                            fontWeight: 'bold'
                                        }}>
                                            {item.USERNAME}{" "}
                                        </Text>
                                        <Text>
                                            {finalMessage}
                                            {/*{item.MESSAGE}*/}
                                        </Text>
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>
                                        {this.timeConverter(item.INSERT_TIME)}
                                    </Text>
                                </View>
                            </View>
                        )
                    }}
                />
            )
        }
        return null
    }
}
