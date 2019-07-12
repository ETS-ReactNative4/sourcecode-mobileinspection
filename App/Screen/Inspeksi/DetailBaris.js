import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    Image, TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign'
import Size from '../../Constant/sizes'
import Colors from '../../Constant/Colors'
import Taskservices from '../../Database/TaskServices'
import R from 'ramda';
import Entypo from "react-native-vector-icons/Entypo";

class DetailBaris extends React.Component {

    constructor(props){
        super(props);
        let params = props.navigation.state.params;
        let baris = R.clone(params.baris);
        let idInspection = R.clone(params.idInspection);
        let BLOCK_INSPECTION_CODE = R.clone(params.BLOCK_INSPECTION_CODE);

        this.state = {
            nilaiJmlPokok: '',
            nilaiPokokPanen: '',
            nilaiBuahTinggal: '',
            nilaiBrondolPiring: '',
            nilaiBrondolTph: '',
            nilaiPokokTdkPupuk: '',
            nilaiPiringan: '',
            nilaiSarkul: '',
            nilaiTph: '',
            nilaiGwg: '',
            nilaiPrun: '',
            nilaiTipa: '',
            nilaiKastrasi: '',
            nilaiSanitasi: '',
            nilaiPupuk: '',
            nilaiPenabur: '',
            hideKriteria: false,
            barisPembagi:0,
            baris,
            idInspection,
            path: '',

            //genba
            userGenba: [],
            BLOCK_INSPECTION_CODE: BLOCK_INSPECTION_CODE,
            detailType: params.detailType
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.tintColorPrimary
            },
            headerTitleStyle: {
                textAlign: "left",
                flex: 1,
                fontSize: 18,
                fontWeight: '400',
                marginHorizontal: 12
            },
            title: params.detailType === "genba" ? 'Detail Baris Genba' : 'Detail Baris Inspeksi',
            headerTintColor: '#fff',
        }
    };

    componentWillMount(){
        this.props.navigation.setParams({
            detailType: this.state.detailType
        });
        this.loadData();
        this.loadGenbaUser();
    }

    loadData(){        
        var data = Taskservices.findByWithList('TR_BLOCK_INSPECTION_D', ['ID_INSPECTION', 'AREAL'], [this.state.idInspection, this.state.baris]); 
        for(var i=0; i < data.length; i++){
            this.getValuComponent({compCode: data[i].CONTENT_INSPECTION_CODE, value: data[i].VALUE})
            this.loadImage(data[i].BLOCK_INSPECTION_CODE)
        }
    }

    loadImage(trCode){
        let imgBaris = Taskservices.findByWithList('TR_IMAGE', ['TR_CODE', 'STATUS_IMAGE'], [trCode, 'BARIS']);
        let path = '';
        try {
            path = `file://${imgBaris[0].IMAGE_PATH_LOCAL}`;
        } catch (error) {
            path = '';
        }
        this.setState({path})
    }

    getValuComponent(data){
        let compCode = data.compCode;
        switch(compCode){
            case 'CC0001':       
                this.setState({nilaiJmlPokok: data.value})         
                break;
            case 'CC0002':            
                this.setState({nilaiPokokPanen: data.value})
                break;
            case 'CC0003':
                this.setState({nilaiBuahTinggal: data.value})
                break;
            case 'CC0004':
                this.setState({nilaiBrondolPiring: data.value})
                break;
            case 'CC0005':
                this.setState({nilaiBrondolTph: data.value})
                break;
            case 'CC0006':
                this.setState({nilaiPokokTdkPupuk: data.value})
                break;
            case 'CC0007':
                this.setState({nilaiPiringan: data.value})
                break;
            case 'CC0008':
                this.setState({nilaiSarkul: data.value})
                break;
            case 'CC0009':
                this.setState({nilaiTph: data.value})
                break;
            case 'CC0010':
                this.setState({nilaiGwg: data.value})
                break;
            case 'CC0011':
                this.setState({nilaiPrun: data.value})
                break;
            case 'CC0012':    
                this.setState({nilaiTipa: data.value})
                break;
            case 'CC0013':              
                this.setState({nilaiPenabur: data.value})
                break;
            case 'CC0014':
                this.setState({nilaiPupuk: data.value})
                break;
            case 'CC0015':
                this.setState({nilaiKastrasi: data.value})
                break;
            case 'CC0016':
                this.setState({nilaiSanitasi: data.value})
                break;
            default:
                break;
        }
    }

    loadGenbaUser(){
        if(this.state.detailType === "genba" && this.state.BLOCK_INSPECTION_CODE !== null){
            let getData = Taskservices.findBy2('TR_GENBA_INSPECTION', 'BLOCK_INSPECTION_CODE', this.state.BLOCK_INSPECTION_CODE);
            let genbaUser = Object.values(getData.GENBA_USER);
            let tempData = [];
            genbaUser.map((data)=>{
                tempData.push(data)
            });
            if(tempData.length > 0){
                this.setState({
                    genbaUser: tempData
                })
            }
        }
    }

    renderGenbaUser(){
            return(
                this.state.genbaUser.map((data)=>{
                    return(
                        <View style={{flex:1, flexDirectmion:'column', justifyContent:'center', paddingVertical: 5}}>
                            <Text style={{fontSize:14,fontWeight:'600'}}>{data.FULLNAME}</Text>
                            <Text style={{fontSize:11, color:'#bdbdbd', marginTop:4}}>{data.JOB}</Text>
                        </View>
                    )
                })
            )
    }

    render() {
        return (
            <ScrollView>
                < View style={styles.container} >
                    <StatusBar
                        hidden={false}
                        barStyle="light-content"
                        backgroundColor={Colors.tintColorPrimary}
                    />
                    <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                        <View style={{ flexDirection: 'row', height: 200 }} >
                            <Image style={{ width: '100%', height: '100%' }} source={{uri: this.state.path}}></Image>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.textLokasi, {marginTop:10}]}>Data Penilaian</Text>
                        <Text style={[styles.textLokasi,{marginTop:5}]}>Baris Ke {this.state.baris}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.textTitle}>Perawatan</Text>
                        <View style={styles.lineDivider} />
                        {this.state.nilaiPiringan !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Piringan</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPiringan}</Text>
                        </View>}
                        {this.state.nilaiSarkul !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Pasar Pikul</Text>
                            <Text style={styles.textContent}>{this.state.nilaiSarkul}</Text>
                        </View>}
                        {this.state.nilaiTph !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>TPH</Text>
                            <Text style={styles.textContent}>{this.state.nilaiTph}</Text>
                        </View>}
                        {this.state.nilaiGwg !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Gawangan</Text>
                            <Text style={styles.textContent}>{this.state.nilaiGwg}</Text>
                        </View>}
                        {this.state.nilaiPrun !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Prunning</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPrun}</Text>
                        </View>}
                        {this.state.nilaiTipa !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Titi Panen</Text>
                            <Text style={styles.textContent}>{this.state.nilaiTipa}</Text>
                        </View>}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.textTitle}>Panen</Text>
                        <View style={styles.lineDivider} />
                        {this.state.nilaiPokokPanen !== '0' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Pokok Panen</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPokokPanen}</Text>
                        </View>}
                        {this.state.nilaiBuahTinggal !== '0' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Buah Tinggal</Text>
                            <Text style={styles.textContent}>{this.state.nilaiBuahTinggal}</Text>
                        </View>}
                        {this.state.nilaiBrondolPiring !== '0' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Brondolan di Piringan</Text>
                            <Text style={styles.textContent}>{this.state.nilaiBrondolPiring}</Text>
                        </View>}
                        {this.state.nilaiBrondolTph !== '0' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Brondolan di TPH</Text>
                            <Text style={styles.textContent}>{this.state.nilaiBrondolTph}</Text>
                        </View> }                       
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.textTitle}>Pemupukan</Text>
                        <View style={styles.lineDivider} />
                        {this.state.nilaiPokokTdkPupuk !== '0' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Pokok Tidak diPupuk</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPokokTdkPupuk}</Text>
                        </View>}
                        {this.state.nilaiPenabur !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Sistem Penaburan</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPenabur}</Text>
                        </View>}
                        {this.state.nilaiPupuk !== '' &&
                        <View style={styles.sectionRow}>
                            <Text style={styles.textLabel}>Kondisi Pupuk</Text>
                            <Text style={styles.textContent}>{this.state.nilaiPupuk}</Text>
                        </View>}                 
                    </View>

                    {
                        this.state.detailType === 'genba' &&
                        <View style={styles.section}>
                            <Text style={styles.textTitle}>Peserta User</Text>
                            <View style={styles.lineDivider} />
                            {this.renderGenbaUser()}
                        </View>
                    }
                </View >
            </ScrollView>
        )
    }

}

export default DetailBaris; 

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F2F2F2',
        flex: 1
    },
    section: {
        backgroundColor: 'white',
        marginTop: 12,
        flexDirection: 'column',
        padding: 16
    },
    sectionRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textTitle: {
        fontWeight: '400',
        fontSize: 14,
        color: 'black'
    },
    textLokasi: {
        alignContent: 'center',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        color: 'black'
    },
    textLabel: {
        color: 'grey'
    },
    textContent: {
        color: 'black',
        fontSize: 14
    },
    lineDivider: {
        alignItems: 'stretch',
        height: 1,
        backgroundColor: '#D5D5D5',
        marginTop: 5,
        marginBottom: 10
    },
    bubble: {
        backgroundColor: Colors.brand,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 17,
        color: '#ffffff',
        textAlign: 'center'
    },
    button: {
        width: 200,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
    },    
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
        justifyContent:'center'
    },

});