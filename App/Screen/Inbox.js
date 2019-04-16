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
		let notifData = TaskServices.getAllData('TR_NOTIFICATION');
		return notifData;
	}

	onClickItem(id) {
		let notifData = TaskServices.findBy2('TR_NOTIFICATION','NOTIFICATION_ID',id);
		TaskServices.updateByPrimaryKey('TR_NOTIFICATION', Object.assign({}, notifData,{NOTIFICATION_STATUS:1}));
		this.props.navigation.navigate('DetailFinding', { ID: notifData.FINDING_CODE })
	}
	_renderItem = (item, index) => {
		let title;
		let sources;
		let desc;
		let findingData = TaskServices.findBy2('TR_FINDING','FINDING_CODE',item.FINDING_CODE);
		console.log("render item",findingData);
		let contactAsign = TaskServices.findBy2('TR_CONTACT','USER_AUTH_CODE',findingData.ASSIGN_TO);
		let createTime = moment(findingData.INSERT_TIME,"YYYYMMDDHHmmss");
		if (item.NOTIFICATION_TYPE == 0) {
			sources = require('../Images/icon/ic_task_new.png');
			title = "TUGAS BARU";
			desc = "";
		} else if (item.NOTIFICATION_TYPE == 1) {
			sources = require('../Images/icon/ic_task_wip.png');
			title = "UPDATE PROGRESS";
			desc = contactAsign.FULLNAME+" baru melakukan update terhadap temuan yang ditugaskan tanggal "+createTime.format("DD MMM YYYY")+" di GAWI INTI - 2 Blok A10";
		}  else if (item.NOTIFICATION_TYPE == 2 ||  item.NOTIFICATION_TYPE == 3) {
			sources = require('../Images/icon/ic_task_no_response.png');
			title = "BELUM ADA RESPON";
			desc = "";
		}
		return (
			<TouchableOpacity
				style={styles.sectionCardView}
				onPress={() => { this.onClickItem(item.NOTIFICATION_ID) }}
				key={index}
			>
				<Image style={{alignItems: 'stretch', alignSelf: 'center', resizeMode: 'contain',width: '30%', height:80}} 
					source={sources}></Image>
				<View style={{width: '60%' }} >
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{title}</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ fontSize: 10, color: 'black'}}>{desc}</Text>
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
            <Container style={{ flex: 1, padding: 16 }}>
                <Content>
                    <View style={styles.container}>
						{show}
                    </View>
                    {/* <TouchableOpacity>
                        <View style={styles.container}>
                            <View style={{ flex: 2 }}>
                                <Image style={styles.imageThumnail} source={require('../Images/dummy_image.png')} />
                            </View>
                            <View style={{ flex: 6, flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.name}>Jurgen Kloop</Text>
                                    <View style={styles.dotNotif} />
                                </View>
                                <Text style={{ color: 'grey' }}>Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'flex-end', alignContent: 'center' }}>
                                <Text style={{ color: 'green', fontWeight: '500', fontSize: 16, alignItems: 'center', marginTop: 18, marginRight: 8 }}> 13:40</Text>
                            </View>
                        </View>
                    </TouchableOpacity> */}
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

