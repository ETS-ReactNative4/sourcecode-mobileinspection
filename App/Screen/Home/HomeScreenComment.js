import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, TextInput} from 'react-native';
import Colors from "../../Constant/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from '../../Component/Icon1'
import TaskServices from "../../Database/TaskServices";
import moment from 'moment'

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
            commentData: [1,2,3],

            commentValue:  null,
        }
    }

    componentDidMount(){
        this.getComment();
    }

    getComment(){
        let commentData = Object.values(TaskServices.findBy("TR_FINDING_COMMENT", "FINDING_CODE", this.state.FINDING_CODE));
        if(commentData !== null){
            this.setState({
                commentData: commentData,
                commentValue: null
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
                    {this.renderFlatlist()}
                </View>
                <View style={{
                    flexDirection:'row',
                    borderTopWidth: 1,
                    borderTopColor: 'black',
                    height: 65,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor:'red'
                        }}
                        resizeMode={"stretch"}
                        source={require('../../Images/icon/ic_inbox.png')}
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
                            paddingHorizontal: 10
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
                                        borderRadius: 25,
                                        backgroundColor:'red'
                                    }}
                                    resizeMode={"stretch"}
                                    source={require('../../Images/icon/ic_inbox.png')}
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