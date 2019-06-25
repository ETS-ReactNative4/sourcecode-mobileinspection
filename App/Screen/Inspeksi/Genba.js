// CORE REACT NATIVE
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';

// PLUGIN
import { Form, Item, Input, Button } from 'native-base';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';

// STYLE GENBA
import styles from 'list-inspection-style/GenbaStyle';

// FUNCTION GENBA
import funct from 'list-inspection-function/GenbaFunction';

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
            choosenData     : false,
            total_selected  : null,

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
            this.setState({ choosenData : false });
        }else{
            this.setState({ choosenData : true });
        }
    }


    /**
     * FILTER LIST AFTER TYPING
     */
    filterList = ( value ) =>{
        if(value==''){
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
        let schema_contact_genba    = 'TR_CONTACT_GENBA';
        let schema_contact_selected = 'TR_GENBA_SELECTED';

        let contact_json_object     = funct.getAllContactFromDB(schema_contact_genba);
        let contact_json_selected   = funct.getAllContactFromDB(schema_contact_selected);

        let contact_json_array          = funct.convertDataFromRealmIntoJSONArray(contact_json_object);
        let contact_json_selected_array = funct.convertDataFromRealmIntoJSONArray(contact_json_selected);

        if(contact_json_selected_array.length==0)  {
            this.setState({
                dataSource      : contact_json_array,
                dataSourceOri   : contact_json_array
            });
        }
        else {
             
             let json_filtered  = [];

             contact_json_array.map(function(data){

                let USER_AUTH_CODE = data.USER_AUTH_CODE;
                let empty          = true;

                let chk = funct.getSpesificContactFromDB(schema_contact_selected, 'USER_AUTH_CODE', USER_AUTH_CODE);

                if( typeof chk!=='undefined'){
                    empty = false;
                }
                else{
                    json_filtered.push(data);
                }
             });

             this.setState({
                dataSource      : json_filtered,
                dataSourceOri   : json_filtered,
                choosenData     : true,
            });
        }
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


    /**
     * SELECTED NAME AND STORE IN REALM DB
     */
    selectedName = (data_auth_code)=> {
        let SCHEMA_GET_DATA     = 'TR_CONTACT_GENBA';
        let SCHEMA_STORE_DATA   = 'TR_GENBA_SELECTED';

        let COLUMN          = 'USER_AUTH_CODE';
        let USER_AUTH_CODE  = data_auth_code;
        
        let DATA_FULL       = funct.getSpesificContactFromDB(SCHEMA_GET_DATA, COLUMN, USER_AUTH_CODE);
        funct.storeDataChoosen(SCHEMA_STORE_DATA, DATA_FULL);

        this.getSelectedNameFromDB();
        this.loadContact();
    }


    /**
     * GET ALL NAMES FROM REALM DB
     */
    getSelectedNameFromDB = () => {
        let SCHEMA_DATA_SELECTED    = 'TR_GENBA_SELECTED';
        let total_selected          = 0;

        let data_selected_not_rearrage  = funct.getAllContactFromDB(SCHEMA_DATA_SELECTED);
        let data_selected_arraged       = funct.convertDataFromRealmIntoJSONArray(data_selected_not_rearrage);

        if(data_selected_arraged==0){
            this.setState({
                dataSelected    : [],
                total_selected  : "( " +  total_selected + " )",
                choosenData     : false
            });
        }
        else{
            total_selected = data_selected_arraged.length;

            this.setState({
                total_selected  : "( " +  total_selected + " )",
                dataSelected : data_selected_arraged
            })
        }
    }

    
    /**
     * WATCH STATE CHANGED
     */
    componentDidMount(){
        this.loadContact();
        this.getSelectedNameFromDB();
        console.log("genba:"+this.state.inspectionType)
        //this.deleteChoosen();
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={styles.container}>
                    <View style={styles.layoutImageText}>
                        <View style={styles.positionImageText}>
                            <View style={styles.positionImage}>
                                <Image source={image_genba} style={styles.imageGenba}/>
                            </View>
                            
                            <View style={styles.layoutTextTitle}>
                                <Text style={styles.textTitleLarge}>{titleLarge}</Text>
                                <Text style={styles.textTitleSmall}>{titleSmall}</Text>
                            </View>
                        </View>
                    </View>

                    {
                         this.state.choosenData ?  
                         ( <View style={{flex:2, flexDirection:'column', marginLeft:20, marginRight:20, marginTop : 20}}>
                                <View style={{flexDirection:"column", alignContent:'center'}}>
                                    <Text style={styles.selectedText}>Terpilih {this.state.total_selected}</Text> 
                                </View>
                                
                                <FlatList 
                                    data = { this.state.dataSelected }
                                    showsVerticalScrollIndicator = { false }
                                    keyExtractor = { ( item ) => item.USER_AUTH_CODE }
                                    renderItem = { ( { item } ) => { 
                                        return(
                                            <TouchableOpacity onPress={this.deleteChoosen.bind(this,item.USER_AUTH_CODE)}>
                                                <Text style={{borderColor:'#E0E0E0', borderWidth:1, borderRadius:10, fontSize:12, marginLeft:5, marginRight:5, padding:10, marginTop:10, color:'#9E9E9E'}}>
                                                    {item.FULLNAME}
                                                </Text>
                                            </TouchableOpacity>
                                            )                                    
                                    }}
                                />
                            </View>) : null
                    }
                    
                    {
                        this.state.showFilter ? 
                            (<View style={styles.layoutSelectedPeople}>
                                <Form>
                                    <Item inlineLabel>
                                        <Input  value={this.state.choosenName} 
                                                onChangeText={this.filterList} 
                                                placeholder="Ketik nama untuk menyaring daftar nama"
                                                placeholderTextColor={'#9E9E9E'}
                                                style={{fontSize:13}}/>
                                    </Item>
                                </Form>
                            </View>) : null
                    }
                    

                    <View style={styles.layoutSuggestionText}>
                        <View style={{flexDirection:"column", alignContent:'center'}}>
                            <View style={{flexDirection:"row", backgroundColor:"#fff", alignContent:'center'}}>
                                <View style={{flex:1, flexDirection:'column'}}>
                                    <TouchableOpacity>
                                        <Text style={styles.suggestionText}>Saran {this.state.totalSuggestion}</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={{flex:1, flexDirection:'column'}}>
                                    <TouchableOpacity onPress={this.showFilter}>
                                        <Text style={styles.filterText}>{ this.state.showFilter ? 'Hide Filter' : 'Show Filter' }</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                      
                        <View style={{flex:1, flexDirection:'column'}}>
                            <FlatList
                                data = { this.state.dataSource }
                                showsVerticalScrollIndicator = { false }
                                keyExtractor = { ( item ) => item.USER_AUTH_CODE }
                                renderItem = { ( { item } ) => {
                                    return (
                                        <TouchableOpacity style={{flex:1, flexDirection:'column'}} onPress={this.selectedName.bind(this, item.USER_AUTH_CODE)}>
                                            <View style={{flex:1, flexDirection:'column', marginTop:20, justifyContent:'center', borderBottomColor:'#EEEEEE', borderBottomWidth:1, marginLeft:20, marginRight:20}}>
                                                <View style={{flex:1, flexDirection:'row', marginBottom:10}}>
                                                    <View style={{flex:0.7, flexDirection:'column', justifyContent:'center', alignContent:'center'}}>
                                                        <Image source={image_genba} style={{width : 60, height:60, marginLeft:20}}/>
                                                    </View>
                        
                                                    <View style={{flex:1, flexDirectmion:'column', justifyContent:'center'}}>
                                                        <Text style={{fontSize:17,fontWeight:'600'}}>{item.FULLNAME}</Text>
                                                        <Text style={{fontSize:13, color:'#bdbdbd', marginTop:4}}>{item.JOB}</Text>
                                                    </View>

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>   
                        
                    </View> 

                    <View style={styles.layoutButton}>
                        <Button block style={styles.buttonInspectionStart} onPress={this.startInspection}>
                            <Text style={styles.textButtonInspection}>Mulai Inspeksi</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}