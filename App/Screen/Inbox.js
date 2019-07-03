import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Container, Content } from 'native-base'
import Colors from '../Constant/Colors';
import TaskServices from '../Database/TaskServices';
import moment from 'moment';

export default class Inbox extends React.Component {

	constructor(props) {
		super(props);
		let data = this.getNotif();
		this.state = {
		  data,

		  //Add Modal Alert by Aminju 
		  title: 'Title',
		  message: 'Message',
		  showModal: false,
		  icon: '',
		  isFilter: false
		}
	}
    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: Colors.tintColorPrimary
        },
        headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
        title: 'Inbox',
        headerTintColor: '#fff'
    })
	
	getNotif = () => {
		let notifData = TaskServices.getAllData('TR_NOTIFICATION').sorted('FINDING_UPDATE_TIME', true);
		return notifData;
	}

	onClickItem(id) {
		let notifData = TaskServices.findBy2('TR_NOTIFICATION','NOTIFICATION_ID',id);
		TaskServices.updateByPrimaryKey('TR_NOTIFICATION', Object.assign({}, notifData,{NOTIFICATION_STATUS:1}));
		let notifCount = TaskServices.getAllData('TR_NOTIFICATION').filtered('NOTIFICATION_STATUS=0').length;
		notifCount = (notifCount>=100)?"99+":notifCount+"";
		this.setState({data : this.getNotif()});
		this.props.navigation.setParams({notifCount: notifCount})
		this.props.navigation.navigate('DetailFinding', { ID: notifData.FINDING_CODE })
	}
	_renderItem = (item, index) => {
		let title;
		let sources;
		let desc;
		let notifColor;
		let notifCreateDate = item.NOTIFICATION_TIME;
		let today = new Date();
		if(notifCreateDate.getDate()==today.getDate()
			&&notifCreateDate.getMonth()==today.getMonth()
			&&notifCreateDate.getFullYear()==today.getFullYear()){
			notifCreateDate = "Hari ini,"+notifCreateDate.getHours()+":"+notifCreateDate.getMinutes();
		}
		else{
			notifCreateDate = notifCreateDate.getDate()+"-"+(notifCreateDate.getMonth()+1)+"-"+notifCreateDate.getFullYear()
								+","+notifCreateDate.getHours()+":"+notifCreateDate.getMinutes();
		}
		let findingData = TaskServices.findBy2('TR_FINDING','FINDING_CODE',item.FINDING_CODE);
		let contactAsign = TaskServices.findBy2('TR_CONTACT','USER_AUTH_CODE',findingData.ASSIGN_TO);
		let createTime = moment(findingData.INSERT_TIME,"YYYYMMDDHHmmss");
		let creator = TaskServices.findBy2('TR_CONTACT','USER_AUTH_CODE',findingData.INSERT_USER);
		let block = TaskServices.getAllData('TM_BLOCK')
						.filtered('BLOCK_CODE = "'+findingData.BLOCK_CODE+'" AND WERKS="'+findingData.WERKS+'"');
		if(block.length==0){
			return;
		}
		else{
			block = block[0]
		}
		let est = TaskServices.findBy2('TM_EST','EST_CODE',block.EST_CODE);
		if(item.NOTIFICATION_STATUS==0){
			notifColor="#AFAFAF";
		}
		else{
			notifColor="white";
		}
		if (item.NOTIFICATION_TYPE == 0) {
			sources = require('../Images/icon/ic_task_new.png');
			title = "TUGAS BARU";
			desc = "Kamu dapat tugas baru di "+est.EST_NAME+" Blok "+block.BLOCK_NAME+" dari "+creator.FULLNAME;
		} else if (item.NOTIFICATION_TYPE == 1) {
			sources = require('../Images/icon/ic_task_wip.png');
			title = "UPDATE PROGRESS";
			desc = contactAsign.FULLNAME+" baru melakukan update terhadap temuan yang ditugaskan tanggal "+createTime.format("DD MMM YYYY")+" di "+est.EST_NAME+" Blok "+block.BLOCK_NAME;
		}  else if (item.NOTIFICATION_TYPE == 2 ||  item.NOTIFICATION_TYPE == 3) {
			sources = require('../Images/icon/ic_task_no_response.png');
			title = "BELUM ADA RESPON";
			if(item.NOTIFICATION_TYPE == 3){
				desc = "Kamu menugaskan "+contactAsign.FULLNAME+" untuk mengerjakan temuan di "+est.EST_NAME+" Blok "+block.BLOCK_NAME+" tanggal "+createTime.format("DD MMM YYYY")+" tapi ybs belum memberikan respon sampai hari ini";
			}
			else if(item.NOTIFICATION_TYPE == 2){
				desc = "Kamu ditugaskan "+creator.FULLNAME+" untuk mengerjakan temuan di "+est.EST_NAME+" Blok "+block.BLOCK_NAME+" tanggal "+createTime.format("DD MMM YYYY")+" tapi belum memberikan respon sampai hari ini";
			}
		}
		return (
			<TouchableOpacity
				style={{ width: '100%',flex: 1, flexDirection: 'row',backgroundColor: notifColor,
						borderBottomColor: 'grey',borderBottomWidth: 2,paddingBottom: 10,paddingTop: 10}}
				onPress={() => { this.onClickItem(item.NOTIFICATION_ID) }}
				key={index}
			>
				<Image style={{alignItems: 'stretch', alignSelf: 'center', resizeMode: 'contain',width: '15%', height:40}} 
					source={sources}></Image>
				<View style={{width: '85%',paddingRight: 10 }} >
					<View style={{ flexDirection: 'row',justifyContent: 'space-between'}}>
						<Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>{title}</Text>
						<Text style={{ fontSize: 10, color: Colors.textSecondary,alignSelf: 'flex-end', fontWeight: 'bold' }}>
							{notifCreateDate}
						</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ fontSize: 12, color: 'black'}}>{desc}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	_renderData() {
		return (
			<View>
				<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}>
					<View style={{ marginBottom: 48 }}>
						{this.state.data.map((item, index) => this._renderItem(item, index))}
					</View>
				</ScrollView>
			</View>
		)
	}
    render() {
		let show;
		if (this.state.data.length > 0) {
		  show = this._renderData()
		}
        return (
            <Container>
                <Content>
					{show}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionRow: {
        flexDirection: 'row'
    },
    imageThumnail: {
        height: 64,
        width: 64,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 50,
        marginRight: 12,
    },
    name: {
        color: 'black',
        fontWeight: '400',
        fontSize: 18,
        marginRight: 8
    },
    dotNotif: {
        marginTop: 8,
        backgroundColor: 'red',
        height: 10,
        width: 10,
        borderRadius: 50
    },
	sectionCardView: {
		flex: 1, 
		flexDirection: 'row'
	},
	sectionDesc: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 80,
	}
});

