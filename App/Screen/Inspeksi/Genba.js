// CORE REACT NATIVE
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';

// PLUGIN
import { Form, Item, Input, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import Icon1 from '../../Component/Icon1';

// STYLE GENBA
import styles from 'list-inspection-style/GenbaStyle';

// FUNCTION GENBA
import funct from 'list-inspection-function/GenbaFunction';
import TaskServices from "../../Database/TaskServices";
import Colors from "../../Constant/Colors";

// IMPORT ASSETS
let image_genba = require('../../Images/ic-orang.png');

// VARIABLE
let choosenNames        = [];
let contact_from_db     = null;

// STATIC STRING
const titleLarge = 'Peserta Genba';
const titleSmall = 'Siapa saja yang ikut Genba bersamamu ?';

export default class Genba extends Component {
    constructor(props){
        super(props);

        this.state = {
            dataSource      : [],
            dataSelected    : [],
            dataSourceOri   : [],
            totalSuggestion : null,
            showFilter      : false,
            choosenData     : true,
            total_selected  : null,
            listSelectedUserCode: [],

            inspectionType  : this.props.navigation.getParam('inspectionType', 'normal')
        }

        this.loadContact();

        this.startInspection    = this.startInspection.bind(this);
        this.showFilter         = this.showFilter.bind(this);
    }

    /**
     * GO TO MAPS INSPEKSI LAYOUT
     */
    startInspection = () =>{
        this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'MapsInspeksi',
                params:{
                    inspectionType: this.state.inspectionType === 'genba'? 'genba' : 'normal'
                }}
            ));
    }


    /** 
     * TRIGGER FILTER TEXT 
     */
    showFilter = () => {
        this.setState({
            showFilter  : !this.state.showFilter
        });

        if(this.state.total_selected===null || this.state.total_selected===0 || this.state.total_selected === "( " + 0 +" )" ) {
            this.setState({ choosenData : true });
        }else{
            this.setState({ choosenData : true });
        }
    }


    /**
     * FILTER LIST AFTER TYPING
     */
    filterList(value){
        if(value === ""){
            this.loadContact();
            this.setState({
                totalSuggestion : null,
                choosenData     : false
            })
        }
        else{
            let getvalue    = value;
            let dataSource  = this.state.dataSourceOri;

            let dataFiltered = funct.filterData(dataSource,getvalue);
            let total_suggestion_name = String(dataFiltered.length);

            this.setState({
                dataSource      : dataFiltered,
                totalSuggestion : "( " +  total_suggestion_name + " )"
            });
        }
    }

    /**
     * LOAD DATA FROM BEGINNING
     */
    loadContact = () => {
        let contactGenba = Object.values(TaskServices.getAllData("TR_CONTACT_GENBA"));
        let selectedGenba = Object.values(TaskServices.getAllData("TR_GENBA_SELECTED"));

        //ambil smua userauthcode, buat check ui icon check
        let listSelectedUserCode = [];
        if(selectedGenba.length > 0){
            selectedGenba.map((data)=>{
                listSelectedUserCode.push(data.USER_AUTH_CODE);
            })
        }

        if(contactGenba.length > 0)  {
            this.setState({
                listSelectedUserCode: listSelectedUserCode,
                dataSource      : contactGenba,
                dataSourceOri   : contactGenba,
            });
        }

        // if(contactSelected.length === 0)  {
        //     this.setState({
        //         dataSource      : contactGenba,
        //         dataSourceOri   : contactGenba
        //     });
        // }
        // else {
        //      let listGenbaContact  = [];
        //      contactGenba.map((data)=>{
        //          //check if user already exist in genba selected. if exist dont push it.
        //         let checkUser = TaskServices.findBy2("TR_GENBA_SELECTED", 'USER_AUTH_CODE', data.USER_AUTH_CODE);
        //         if( typeof checkUser === 'undefined'){
        //             listGenbaContact.push(data);
        //         }
        //      });
        //
        //      this.setState({
        //         dataSource      : listGenbaContact,
        //         dataSourceOri   : listGenbaContact,
        //         choosenData     : true,
        //     });
        // }
    }


    /**
     *  DELETE CHOOSEN DATA
     */
    deleteChoosen = (data_auth_code) => {
        let SCHEMA_STORE_DATA   = 'TR_GENBA_SELECTED';
        let VALUES              = data_auth_code;
        let PRIMARY_KEY         = 'USER_AUTH_CODE';
        funct.deleteDataChoosen( SCHEMA_STORE_DATA, PRIMARY_KEY, VALUES );

        this.getSelectedNameFromDB();
        this.loadContact();
    }

    deleteSelectedAll(){
        TaskServices.deleteAllData("TR_GENBA_SELECTED")
        this.getSelectedNameFromDB();
        this.loadContact();
    }


    /**
     * SELECTED NAME AND STORE IN REALM DB
     */
    selectedName(data_auth_code) {
        let isUserExist = TaskServices.findBy2("TR_GENBA_SELECTED", "USER_AUTH_CODE", data_auth_code);
        if(typeof isUserExist === 'undefined'){
            let selectedUser = TaskServices.findBy2('TR_CONTACT_GENBA', 'USER_AUTH_CODE', data_auth_code);
            if(typeof selectedUser !== 'undefined'){
                TaskServices.saveData('TR_GENBA_SELECTED', selectedUser);
                this.getSelectedNameFromDB();
                this.loadContact();
            }
        }
        else {
            this.deleteChoosen(data_auth_code)
        }
    };

    /**
     * GET ALL NAMES FROM REALM DB
     */
    getSelectedNameFromDB = () => {
        let total_selected          = 0;

        let getSelectedUser  = TaskServices.getAllData('TR_GENBA_SELECTED');
        let selectedUser       = funct.convertDataFromRealmIntoJSONArray(getSelectedUser);

        if(selectedUser.length === 0){
            this.setState({
                dataSelected    : [],
                total_selected  : "( " +  total_selected + " )",
                choosenData     : true
            });
        }
        else{
            total_selected = selectedUser.length;

            this.setState({
                total_selected  : "( " +  total_selected + " )",
                dataSelected : selectedUser
            })
        }
    }

    
    /**
     * WATCH STATE CHANGED
     */
    componentDidMount(){
        this.loadContact();
        this.getSelectedNameFromDB();
        //this.deleteChoosen();
    }

    render(){
        return(
            <KeyboardAvoidingView
                style={{
                    flex : 1,
                    paddingHorizontal: 15,
                    backgroundColor : '#ffff'
                }}
                behavior="padding"
                enabled
            >
                <View style={{
                    flex:1,
                    marginTop:10
                }}>
                    <View style={{
                        width: "100%",
                        flexDirection:'row',
                        marginVertical: 10
                    }}>
                        {this.renderSelectedUser()}
                        <TouchableOpacity
                            onPress={()=>{
                                this.deleteSelectedAll()
                            }}
                        >
                            <Icon1
                                style={{
                                    padding: 10
                                }}
                                iconName={'close'}
                                iconSize={10}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1}}>
                        <View style={{
                            paddingVertical: 5,
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            alignItems:"center"
                        }}>
                            <Text style={{
                                fontSize:25,
                                fontWeight:'600',
                                marginBottom:10,
                                marginTop:5
                            }}>Saran {this.state.totalSuggestion}</Text>

                            <View style={{
                                width: "50%",
                                height: 35,
                                flexDirection:'row',
                                borderWidth: 1,
                                borderColor: '#008BAC',
                                borderRadius: 10
                            }}>
                                <Icon1
                                    style={{
                                        paddingHorizontal: 5,
                                        alignSelf: "center"
                                    }}
                                    iconColor={'#008BAC'}
                                    iconSize={15}
                                    iconName={'search'}
                                />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 11
                                    }}
                                    value={this.state.filterValue}
                                    onChangeText={(value)=>{
                                        this.setState({
                                            filterValue: value
                                        },()=>{
                                            this.filterList(this.state.filterValue)
                                        })
                                    }}
                                    placeholder={"Cari user ..."}
                                />
                                <TouchableOpacity
                                    style={{
                                        paddingHorizontal: 5,
                                        alignSelf: "center"
                                    }}
                                    onPress={()=>{
                                        this.setState({
                                            filterValue: ""
                                        },()=>{
                                            this.filterList(this.state.filterValue)
                                        })
                                    }}
                                >
                                    <Icon1
                                        iconColor={'#008BAC'}
                                        iconSize={15}
                                        iconName={'close'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.renderListUser()}
                    </View>
                </View>

                <View style={{
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Button
                        style={{
                            alignSelf:"center",
                            paddingHorizontal: 15,
                            marginVertical: 10,
                            backgroundColor:'#64DD17',
                            borderRadius:20,
                            borderColor:'transparent',
                            borderWidth:1,
                            height:40,
                        }}
                        onPress={this.startInspection}
                    >
                        <Text style={{
                            color:'#fff',
                            textAlign:'center',
                            fontSize:15
                        }}>
                            Mulai Inspeksi
                        </Text>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }

    renderListUser(){
        return(
            <FlatList
                data = { this.state.dataSource }
                style={{flex: 1}}
                showsVerticalScrollIndicator = { false }
                extraData={this.state}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem = { ( { item } ) => {
                    let selectStatus = this.state.listSelectedUserCode.includes(item.USER_AUTH_CODE);
                    return (
                        <TouchableOpacity
                            style={{
                                flex:1,
                                paddingBottom: 10
                            }}
                            onPress={()=>{
                                this.selectedName(item.USER_AUTH_CODE)
                            }}>
                            <View style={{
                                flex:1,
                                flexDirection:'row'
                            }}>
                                <View>
                                    <Image source={image_genba} style={{width : 60, height:60, marginRight: 15}}/>
                                </View>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={{fontSize:14, fontWeight:'600', color: selectStatus ? '#008BAC' : 'black'}}>{item.FULLNAME}</Text>
                                    <Text style={{fontSize:11, color: selectStatus ? '#1EA6C6' : '#bdbdbd', marginTop:4}}>{item.JOB}</Text>
                                </View>
                                {
                                    selectStatus &&
                                    <Icon1
                                        style={{
                                            alignSelf: "center"
                                        }}
                                        iconColor={'#008BAC'}
                                        iconSize={32}
                                        iconName={'check'}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }

    renderSelectedUser(){
        return(
            <FlatList
                data = { this.state.dataSelected }
                stlye={{
                    flex: 1
                }}
                horizontal={true}
                showsVerticalScrollIndicator = { false }
                keyExtractor = { ( item ) => item.USER_AUTH_CODE }
                renderItem = { ( { item } ) => {
                    return(
                        <TouchableOpacity onPress={this.deleteChoosen.bind(this,item.USER_AUTH_CODE)}>
                            <View style={{
                                borderColor:'#E0E0E0',
                                backgroundColor:'white',
                                borderWidth:1,
                                borderRadius:5,
                                padding: 5,
                                marginHorizontal: 3
                            }}>
                                <Text style={{
                                    fontSize:12,
                                    color:'black'
                                }}>
                                    {item.FULLNAME}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
}