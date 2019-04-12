import React, { Component } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView} from 'react-native';
import { Form, Item, Input, Button } from 'native-base';
import styles from 'list-inspection-style/GenbaStyle';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation';

let image_genba = require('../../Images/ic-orang.png');
let choosenNames = [];
let newData = [];
const titleLarge = 'Peserta Genba';
const titleSmall = 'Siapa saja yang ikut Genba bersamamu ?';

let dataDummy = [
    {
        "name" : "Bejo",
        "position" : "Estate Manager",
        "pict"  : require('../../Images/icon/ic-orang-1.png'),
        "id"    : 1
    },
    {
        "name" : "Paijo",
        "position" : "Asisten Lapangan",
        "pict"  : require('../../Images/icon/ic-orang-2.png'),
        "id"    : 2
    },
    {
        "name" : "Parman",
        "position" : "Asisten Lapangan",
        "pict"  : require('../../Images/icon/ic-orang-3.png'),
        "id"    : 3
    },
    {
        "name" : "Parmin",
        "position" : "Asisten Lapangan",
        "pict"  : require('../../Images/icon/ic-orang-4.png'),
        "id"    : 4
    }
];

export default class Genba extends Component {

    state = {
        choosenName : [],
        stateChoosen : false,
        dataSource : []
    }

    constructor(props){
        super(props);

       this.loadData();
    }

    loadData = () => {
        this.setState({
            dataSource : dataDummy
        })
    }

    reloadData = () =>{
        let oldData = this.state.dataSource;

        //compare choosenNames with old data
        choosenNames.forEach((item)=>{
            let id_data = item;

            console.log('check data terpilih : '+ id_dat);

            oldData.map((data) => {
                
                if(id_data != data.id){
                    alert(id_data + ' != ' + data.id)
                    let name = data.name;
                    let position = data.position;
                    let pict = data.pict;
                    let id = data.id;

                    let parseData = { "name" : name, "pos" : position, "pict" : pict, "id":id };
                   
                    newData.push(parseData);
                }
            });

            // alert(JSON.stringify("new data : "+newData));
            // this.setState({
            //     dataSource : newData
            // });

        });
    }

    startInspection = () =>{
        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MapsInspeksi' }));
    }

    selectPeople = (id='')=> {
        choosenNames.push(id);
        this.reloadData();
    }


    componentDidMount(){
        this.loadData();
        this.reloadData();
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

                    <View style={styles.layoutSelectedPeople}>
                        <Form>
                            <Item inlineLabel>
                                <Input  value={this.state.choosenName}/>
                            </Item>
                        </Form>
                    </View>

                    <View style={styles.layoutSuggestionText}>
                        <Text style={styles.suggestionText}>Saran</Text>

                        <FlatList
                            data = { this.state.dataSource }
                            showsVerticalScrollIndicator = { false }
                            keyExtractor = { ( item ) => item.id }
                            renderItem = { ( { item } ) => {
                                return (
                                    <TouchableOpacity style={{flex:1, flexDirection:'column'}} onPress={this.selectPeople.bind(this, item.id)}>
                                        <View style={{flex:1, flexDirection:'column', marginTop:20, justifyContent:'center', borderBottomColor:'#EEEEEE', borderBottomWidth:1, marginLeft:20, marginRight:20}}>
                                            <View style={{flex:1, flexDirection:'row', marginBottom:10}}>
                                                <View style={{flex:0.7, flexDirection:'column', justifyContent:'center', alignContent:'center'}}>
                                                    <Image source={item.pict} style={{width : 60, height:60, marginLeft:20}}/>
                                                </View>
                    
                                                <View style={{flex:1, flexDirectmion:'column', justifyContent:'center'}}>
                                                    <Text style={{fontSize:17,fontWeight:'600'}}>{item.name}</Text>
                                                    <Text style={{fontSize:13, color:'#bdbdbd', marginTop:4}}>{item.position}</Text>
                                                </View>
    
                                                <View style={{flex:0.4, flexDirection:'column', justifyContent:'center'}}>
                                                    <Icon2 name="check" style={{ fontSize: 20, height: 22, color: 'blue' }} />
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View> 

                    <View style={styles.layoutButton}>
                        <Button block style={styles.buttonInspectionStart} onPress={this.startInspection}>
                            <Text style={styles.textButtonInspection}>Mulai Inspecsi</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}