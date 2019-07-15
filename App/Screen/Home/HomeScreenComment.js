import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, TextInput, Keyboard} from 'react-native';
import Colors from "../../Constant/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from '../../Component/Icon1'
import TaskServices from "../../Database/TaskServices";
import moment from 'moment'
let ic_org_placeholder = require('../../Images/ic-orang.png');

export default class HomeScreenComment extends Component{
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
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Icon style={{marginLeft: 12}} name={'ios-arrow-round-back'} size={45} color={'white'} />
                </TouchableOpacity>
            )
        };
    }

    constructor(props){
        super();

        this.state={
            FINDING_CODE:props.navigation.getParam("findingCode", null),
            commentData: [],
            commentValue:  null,

            listUserData: [],
        }
    }

    componentDidMount(){
        this.getComment();
        this.getListUser();
    }

    renderTagList(){
        return(
            <View style={{
                width: "100%",
                height: "100%",
                position: 'absolute'
            }}>
                <FlatList
                    ref={component => this._flatlistCatalog = component}
                    style={{flex: 1}}
                    data={this.state.listUserData}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                        return(
                            <TouchableOpacity
                                style={{
                                    flex:1,
                                    paddingBottom: 10
                                }}
                                onPress={()=>{

                                }}>
                                <View style={{
                                    flex:1,
                                    flexDirection:'row'
                                }}>
                                    <View>
                                        <Image source={require('../../Images/ic-orang.png')} style={{width : 40, height:40, marginRight: 15}}/>
                                    </View>
                                    <View style={{flex:1, justifyContent:'center'}}>
                                        <Text style={{fontSize:14, fontWeight:'600', color: 'black'}}>{item.FULLNAME}</Text>
                                        <Text style={{fontSize:11, color: '#bdbdbd', marginTop:4}}>{item.JOB}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }

    getListUser(){
        let listUser = Object.values(TaskServices.getAllData("TR_CONTACT"));

        if(listUser !== null){
            this.setState({
                listUserData: listUser
            },()=>{
                alert(JSON.stringify(this.state.listUserData))
            })
        }
    }

    getComment(){
        let commentData = Object.values(TaskServices.findBy("TR_FINDING_COMMENT", "FINDING_CODE", this.state.FINDING_CODE));
        if(commentData !== null){
            this.setState({
                commentData: commentData,
                commentValue: null
            }, ()=>{
                Keyboard.dismiss()
            })
        }
    }

    insertComment(){
        let dataLogin = TaskServices.getAllData('TR_LOGIN')[0];
        let dateTime = moment().format('YYMMDDHHmmss');
        let tempComment = {
            FINDING_COMMENT_ID: "FC"+dataLogin.USER_AUTH_CODE+dateTime,
            FINDING_CODE: this.state.FINDING_CODE,
            USER_AUTH_CODE: dataLogin.USER_AUTH_CODE,
            MESSAGE: this.state.commentValue,
            INSERT_TIME: dateTime,
            TAG_USER: [],
            //LOCAL PARAM
            USERNAME: dataLogin.USERNAME
        };
        TaskServices.saveData('TR_FINDING_COMMENT', tempComment);
        this.getComment();
    }

    timeConverter(insertTime){
        if(typeof insertTime !== undefined && insertTime !== null){
            let finalTime = moment(insertTime, 'YYMMDDHHmmss').format('DD MMM YYYY, HH:mm:ss');
            return finalTime.toString()
        }
        return null;
    }

    render(){
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor:Colors.background
                }}>
                <View style={{
                    flex: 1
                }}>
                    {
                        // this.renderTagList()
                        this.renderFlatlist()
                    }
                </View>
                <View
                style={{
                    flexDirection:'row',
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
                            width: 50,
                            height: 50,
                            borderRadius: 25
                        }}
                        resizeMode={"stretch"}
                        source={ic_org_placeholder}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection:'row',
                            borderWidth: 1,
                            borderColor: Colors.abu1,
                            borderRadius: 5,
                            alignItems:"center",
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
                            style={{flex: 1}}
                            multiline={true}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder="Ketik di sini ..."
                            secureTextEntry={this.state.secure}
                            placeholderTextColor={Colors.abu1}
                            onChangeText={(value) => {
                                this.setState({
                                    commentValue: value
                                })
                            }}
                            value={this.state.commentValue}
                        />
                        <TouchableOpacity onPress={()=>{
                            this.insertComment()
                        }}>
                            <Icon1
                                style={{marginLeft: 12}}
                                iconName={'keyboard-arrow-right'}
                                iconSize={25}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderFlatlist(){
        if(this.state.commentData.length > 0){
            return(
                <FlatList
                    ref={component => this._flatlistCatalog = component}
                    style={{flex: 1}}
                    data={this.state.commentData}
                    extraData={this.state}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection:"row",
                                    marginTop: 5,
                                    marginHorizontal: 5
                                }}
                            >
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
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
                                        <Text
                                            numberOfLines={3}
                                        >
                                            {item.MESSAGE}
                                        </Text>
                                    </Text>
                                    <Text style={{fontSize: 12}}>
                                        {this.timeConverter(item.INSERT_TIME)}
                                    </Text>
                                </View>
                            </View>
                        )}}
                />
            )
        }
        return null
    }
}