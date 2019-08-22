import React, {Component} from 'react';
import {
    AsyncStorage,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import Icon1 from '../../Component/Icon1';

import TaskServices from "../../Database/TaskServices";
import ModalAlert from "../../Component/ModalAlert";
import moment from 'moment';

export default class Genba extends Component {
    constructor(props){
        super(props);

        this.state = {
            listGenbaUser      : [],
            dataSelected    : [],
            showFilter      : false,
            total_selected  : null,
            listSelectedUserCode: [],

            inspectionType  : this.props.navigation.getParam('inspectionType', 'normal'),

            //modal
            icon: "",
            title: "",
            message: "",
            showModal: false,
        };

        this.loadContact();
    }

    startInspection(){
        if(this.state.dataSelected.length > 0){
            this.props.navigation.dispatch(NavigationActions.navigate({
                routeName: 'MapsInspeksi',
                params:{
                    inspectionType: this.state.inspectionType === 'genba'? 'genba' : 'normal'
                }}
            ));
        }
        else {
            this.setState({
                icon: require('../../Images/icon/ic_no_user.png'),
                title: "Pilih Peserta Genba",
                message: "Kamu harus memilih peserta genba dulu.",
                showModal: true,
            })
        }
    }

    filterList(value){
        if(value === ""){
            this.loadContact();
        }
        else{
            let listGenbaUser = this.state.listGenbaUser;
            let dataFiltered = this.filterData(listGenbaUser,getvalue);
            this.setState({
                listGenbaUser: dataFiltered
            });
        }
    }

    filterData(data, name){
        let search_name = name.toLowerCase() ;
        let data_filtered = data.filter(function(key){
            let name = key.FULLNAME;
            return !(name.toLowerCase().indexOf(search_name) === -1)
        });
        return data_filtered;
    }

    loadContact(){
        let contactGenba = TaskServices.getAllData("TR_CONTACT").sorted('FULLNAME', false);
        let selectedGenba = TaskServices.getAllData("TR_GENBA_SELECTED");

        //ambil smua userauthcode, buat check ui icon check
        let listSelectedUserCode = [];
        if(selectedGenba.length > 0){
            selectedGenba.map((data)=>{
                listSelectedUserCode.push(data.USER_AUTH_CODE);
            })
        }

        let filteredContactGenba = [];
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        contactGenba.map((data)=>{
            if(this.rankChecker(data.USER_AUTH_CODE, currentUser) && this.BAChecker(data, currentUser)){
                filteredContactGenba.push(data);
            }
        });

        if(filteredContactGenba.length > 0)  {
            this.setState({
                listSelectedUserCode: listSelectedUserCode,
                listGenbaUser: filteredContactGenba,
            });
        }
    }

    deleteSelected(data_auth_code){
        TaskServices.deleteRecordByPK('TR_GENBA_SELECTED', 'USER_AUTH_CODE', data_auth_code);
        this.getSelectedCount();
        this.loadContact();
    };

    deleteSelectedAll(){
        TaskServices.deleteAllData("TR_GENBA_SELECTED");
        this.getSelectedCount();
        this.loadContact();
    }

    selectUser(data_auth_code) {
        let selectedUser = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', data_auth_code);
        if(selectedUser !== undefined){
            TaskServices.saveData('TR_GENBA_SELECTED', selectedUser);
            this.getSelectedCount();
            this.loadContact();
        }
    };

    rankChecker(selectedAuthCode, currentUser){
        //low->high
        let genbaRanking = ['KEPALA_KEBUN', 'EM', 'SEM_GM', 'CEO_REG', 'CEO', 'ADMIN'];

        if(genbaRanking.indexOf(currentUser.USER_ROLE) > 3){
            return true
        }
        else {
            let selectedUser = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', selectedAuthCode)
            if(genbaRanking.indexOf(currentUser.USER_ROLE) >= genbaRanking.indexOf(selectedUser.USER_ROLE)){
                return true
            }
        }
        return false;
    }

    BAChecker(listContact, currentUser){
        let sameBAStatus = false;
        if(listContact.LOCATION_CODE === "ALL" || currentUser.USER_ROLE === "ADMIN" || currentUser.USER_ROLE === "CEO"){
            sameBAStatus = true;
        }
        else {
            let selectedUserBA = listContact.LOCATION_CODE.split(",");
            let currentUserBA = currentUser.LOCATION_CODE.split(",");

            if(currentUser.USER_ROLE === "CEO_REG"){
                let tempBA = [];
                let tmEST = TaskServices.getAllData('TM_EST');
                if(tmEST.length > 0){
                    tmEST.map((data)=>{
                        tempBA.push(data.WERKS);
                        currentUserBA = tempBA
                    })
                }
            }

            else{
                //REF_ROLE COMP_CODE FILTER BEDA
                if(listContact.REF_ROLE === "COMP_CODE"){
                    let tmComp = TaskServices.getAllData('TM_COMP');
                    if(tmComp !== undefined && tmComp.length > 0){
                        tmComp.map((tmComp)=>{
                            selectedUserBA.map((selectedUserBA)=>{
                                if(selectedUserBA === tmComp.COMP_CODE){
                                    sameBAStatus = true;
                                }
                            })
                        })
                    }
                }
                else {
                    const intersection = currentUserBA.filter(element => listContact.LOCATION_CODE.includes(element));
                    if(intersection.length > 0){
                        sameBAStatus = true;
                    }
                }
            }
        }
        return sameBAStatus;
    }

    getSelectedCount(){
        let totalSelected = 0;
        let selectedUser  = TaskServices.getAllData('TR_GENBA_SELECTED');
        if(selectedUser.length === 0){
            this.setState({
                dataSelected    : [],
                total_selected  : "( " +  totalSelected + " )",
            });
        }
        else{
            totalSelected = selectedUser.length;
            this.setState({
                total_selected  : "( " +  totalSelected + " )",
                dataSelected : selectedUser
            })
        }
    }


    componentWillMount(): void {
        this.loadContact();
        this.getTimeLastAccess()
            .then((value)=>{
                if(value){
                    let currentDate = moment().format("YYYY-MM-DD");
                    if(moment(value, "YYYY-MM-DD").isSame(currentDate)){
                        this.getSelectedCount();
                        this.loadContact();
                    }
                    else {
                        this.deleteSelectedAll()
                    }
                }
                else{
                    this.setTimeLastAccess();
                    this.getSelectedCount();
                    this.loadContact();
                }
            })
    }

    componentDidMount(){
        if(this.state.listGenbaUser.length < 1){
            this.setState({
                icon: require('../../Images/icon/ic_inbox.png'),
                title: "Peserta Genba Kosong",
                message: "Kamu harus sync terlebih dahulu!",
                showModal: true,
            })
        }
    }

    setTimeLastAccess(){
        let currentDate = moment().format("YYYY-MM-DD");
        try {
            AsyncStorage.setItem('LastGenbaAccessTime', currentDate.toString());
            return true
        } catch (error) {
            alert("ASYNC SET GENBA:"+error);
            return false;
        }
    }

    async getTimeLastAccess(){
        try {
            let value = await AsyncStorage.getItem('LastGenbaAccessTime');
            if (value !== null) {
                return value
            }
            return false;
        } catch (error) {
            return false;
        }
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
                keyboardVerticalOffset={Platform.OS === "ios"? 0 : -550}
            >
                <ScrollView style={{
                    flex:1,
                    marginTop:10
                }}>
                    <View style={{
                        width: "100%",
                        flexDirection:'row',
                        marginVertical: 10,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <ScrollView style={{flex: 1, maxHeight: 100}}>
                            {this.renderSelectedUser()}
                        </ScrollView>
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
                            }}>Terpilih {"("+this.state.dataSelected.length+")"}</Text>

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
                </ScrollView>

                <View style={{
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <TouchableOpacity
                        style={{
                            alignItems:"center",
                            justifyContent:"center",
                            height:40,
                            borderRadius:20,
                            paddingHorizontal: 15,
                            marginVertical: 10,
                            backgroundColor:'#64DD17',
                            borderColor:'transparent',
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
                    </TouchableOpacity>
                </View>
                <ModalAlert
                    icon={this.state.icon}
                    visible={this.state.showModal}
                    onPressCancel={() => this.setState({ showModal: false })}
                    title={this.state.title}
                    message={this.state.message} />
            </KeyboardAvoidingView>
        );
    }

    renderListUser(){
        return(
            <FlatList
                data = { this.state.listGenbaUser }
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
                                this.selectUser(item.USER_AUTH_CODE)
                            }}>
                            <View style={{
                                flex:1,
                                flexDirection:'row'
                            }}>
                                <View>
                                    <Image
                                        style={{width : 40, height:40, borderRadius: 20, marginRight: 15}}
                                        source={TaskServices.getImagePath(item.USER_AUTH_CODE)}/>
                                </View>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text style={{fontSize:14, fontWeight:'600', color: selectStatus ? '#008BAC' : 'black'}}>{item.FULLNAME}</Text>
                                    <Text style={{fontSize:11, color: selectStatus ? '#1EA6C6' : '#bdbdbd', marginTop:4}}>{item.USER_ROLE.replace(/_/g," ")}</Text>
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
            <View style={{
                flexWrap: 'wrap',
                flexDirection:'row',
            }}>
                {
                    this.state.dataSelected.map((data)=>{
                        return(
                            <View style={{
                                borderColor:'#E0E0E0',
                                backgroundColor:'white',
                                borderWidth:1,
                                borderRadius:5,
                                padding: 5,
                                margin: 3
                            }}>
                                <TouchableOpacity
                                    onPress={this.deleteSelected.bind(this, data.USER_AUTH_CODE)}>
                                    <Text style={{
                                        fontSize:12,
                                        color:'black'
                                    }}>
                                        {data.FULLNAME}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        )
        // return(
        //     <FlatList
        //         data = { this.state.dataSelected }
        //         stlye={{
        //             flex: 1
        //         }}
        //         // horizontal={true}
        //         showsVerticalScrollIndicator = { false }
        //         keyExtractor = { ( item ) => item.USER_AUTH_CODE }
        //         renderItem = { ( { item } ) => {
        //             return(
        //                 <TouchableOpacity onPress={this.deleteSelected.bind(this,item.USER_AUTH_CODE)}>
        //                     <View style={{
        //                         borderColor:'#E0E0E0',
        //                         backgroundColor:'white',
        //                         borderWidth:1,
        //                         borderRadius:5,
        //                         padding: 5,
        //                         marginHorizontal: 3
        //                     }}>
        //                         <Text style={{
        //                             fontSize:12,
        //                             color:'black'
        //                         }}>
        //                             {item.FULLNAME}
        //                         </Text>
        //                     </View>
        //                 </TouchableOpacity>
        //             )
        //         }}
        //     />
        // )
    }
}
