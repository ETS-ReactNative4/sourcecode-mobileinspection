
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, Text, TextInput } from 'react-native'
import { Container, Content, Card } from 'native-base'
import Colors from '../../Constant/Colors'
import FastImage from 'react-native-fast-image'
import TaskServices from '../../Database/TaskServices'
import Slider from 'react-native-slider'
import R, { isEmpty } from 'ramda'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'
import ImageSlider from 'react-native-image-slider';
import { changeFormatDate, getTodayDate, dateDisplayMobile, dateDisplayMobileWithoutHours } from '../../Lib/Utils';

import ModalAlert from '../../Component/ModalAlert';
import ModalAlertBack from '../../Component/ModalAlert';
import { Images, AlertContent } from '../../Themes';
import { getIconProgress, getRating, getStatusImage, getColor, getStatusTemuan } from '../../Themes/Resources';
import { getContactName, getEstateName, getStatusBlok, getBlokName } from '../../Database/Resources';

const IconRating = (props) => {
    const styImage = {
        alignItems: 'stretch', width: 50, height: 50
    }
    return (
        <TouchableOpacity
            onPress={props.onPress}>
            {props.activeRating ?
                <Image style={styImage}
                    source={props.iconActive}>
                </Image> :
                <Image style={styImage}
                    source={props.iconNonActive}>
                </Image>}
        </TouchableOpacity>
    )
}

class DetailFindingScreenRedesign extends Component {

    constructor(props) {
        super(props)

        var ID = this.props.navigation.state.params.ID
        var data = TaskServices.findBy2('TR_FINDING', 'FINDING_CODE', ID);
        console.log('data.DUE_DATE : ', data.DUE_DATE)
        this.state = {
            user: TaskServices.getAllData('TR_LOGIN')[0],
            id: ID,
            images: [],
            totalImages: TaskServices.query('TR_IMAGE', `TR_CODE='${ID}' AND STATUS_IMAGE='SEBELUM'`),
            totalImagesSesudah: TaskServices.query('TR_IMAGE', `TR_CODE='${ID}' AND STATUS_IMAGE='SESUDAH'`),
            data,
            progress: parseInt(data.PROGRESS),
            isDateTimePickerVisible: false,
            updatedDueDate: R.isEmpty(data.DUE_DATE) ? "Select Calendar" : data.DUE_DATE,
            imgBukti: [],
            disabledProgress: true,
            showImage: false,
            insertTime: '',
            fullName: '',
            lokasiBlok: '',
            ratingMsg: data.RATING_MESSAGE,
            rating: data.RATING_VALUE,//0 default,1 bad,2 ok,3 good,4 great
            newRating: 0,
            //Add Modal Alert by Aminju
            title: 'Title',
            message: 'Message',
            showModal: false,
            showModalBack: false,
            icon: '',
            activeRatingBad: false,
            activeRatingGood: false,
            activeRatingOk: false,
            activeRatingGreat: false
        }
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: Colors.tintColorPrimary
        },
        headerTitleStyle: {
            textAlign: "left",
            flex: 1,
            fontSize: 18,
            fontWeight: '400'
        },
        title: 'Detail Temuan',
        headerTintColor: '#fff'
    };

    componentWillMount() {

        this.state.totalImages.map(item => {
            this.state.images.push(item);
        });

        this.state.totalImagesSesudah.map(item => {
            this.state.images.push(item);
        });

    }

    componentDidMount() {
        let isSameUser = this.state.data.ASSIGN_TO == this.state.user.USER_AUTH_CODE ? true : false
        if (!isSameUser) {
            this.setState({ disabledProgress: true });
        } else if (this.state.progress == 100) {
            this.setState({ disabledProgress: true });
        } else if (this.state.disabledProgress < 100 && isSameUser) {
            this.setState({ disabledProgress: false });
        }

        moment.locale();
        let insertTime = dateDisplayMobile(changeFormatDate("" + this.state.data.INSERT_TIME, "YYYY-MM-DD hh-mm-ss"));
        let contact = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', this.state.data.INSERT_USER);
        let werkAfdBlokCode = `${this.state.data.WERKS}${this.state.data.AFD_CODE}${this.state.data.BLOCK_CODE}`;
        let lokasiBlok = `${getBlokName(werkAfdBlokCode)}/${getStatusBlok(werkAfdBlokCode)}/${getEstateName(this.state.data.WERKS)}`;

        this.setState({ insertTime, fullName: contact.FULLNAME, lokasiBlok })
    }

    showDate() {
        let isSameUser = this.state.data.ASSIGN_TO == this.state.user.USER_AUTH_CODE ? true : false
        if (isSameUser) {
            this._showDateTimePicker()
        } else {
            this.setState(AlertContent.temuan);
        }
    }

    onLoadImage = data => {
        data.map(item => {
            this.state.images.push(item);
            this.state.imgBukti.push(item);
        })
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ updatedDueDate: dateDisplayMobileWithoutHours(date) })
        this._hideDateTimePicker();
    };

    _takePicture() {
        if (this.state.progress == 100) {
            this.props.navigation.navigate('BuktiKerja', { onLoadImage: this.onLoadImage, findingCode: this.state.id });
        } else {
            this.setState(AlertContent.temuan1);
        }
    }

    validation() {
        if (this.state.imgBukti.length < 1 && this.state.progress == 100) {
            this.setState(AlertContent.ambil_photo);
        } else if (this.state.disabledProgress) {
            this.setState(AlertContent.temuan);
        } else if (this.state.updatedDueDate == 'Select Calendar') {
            this.setState(AlertContent.batas_waktu);
        } else {
            this._updateFinding()
        }
    }

    _updateFinding() {

        let status = getStatusTemuan(this.state.progress);
        var updateTime = getTodayDate('YYYYMMDDkkmmss');
        TaskServices.updateByPrimaryKey('TR_FINDING', {
            "FINDING_CODE": this.state.data.FINDING_CODE,
            "STATUS": status,
            "PROGRESS": this.state.progress,
            "STATUS_SYNC": "N",
            "DUE_DATE": this.state.updatedDueDate == "Select Calendar" ? this.state.data.DUE_DATE : moment(this.state.updatedDueDate).format('YYYY-MM-DD'),
            "UPDATE_USER": this.state.user.USER_AUTH_CODE,
            "UPDATE_TIME": updateTime
        });
        if (this.state.progress == 100) {
            this._saveImageUpdate();
        }

        this.setState(AlertContent.update_temuan);
    }

    _saveImageUpdate() {
        this.state.imgBukti.map(item => {
            TaskServices.saveData('TR_IMAGE', item);
        });
    }

    inputRating() {
        try {
            this.setState({
                rating: this.state.newRating
            })
            TaskServices.updateByPrimaryKey('TR_FINDING', {
                "FINDING_CODE": this.state.id,
                "STATUS_SYNC": "N",
                "RATING_VALUE": this.state.newRating,
                "RATING_MESSAGE": this.state.ratingMsg
            });
        } catch (error) {
            console.log("masuk input rating", error)
        }
    }

    render() {
        const category = TaskServices.findBy2('TR_CATEGORY', 'CATEGORY_CODE', this.state.data.FINDING_CATEGORY);
        let batasWaktu = '';

        if (this.state.updatedDueDate == 'Select Calendar') {
            batasWaktu = 'Batas waktu belum ditentukan'
        } else {
            batasWaktu = moment(this.state.updatedDueDate).format('DD MMM YYYY')
        }
        let sources = getIconProgress(this.state.data.STATUS);

        if (this.state.images.length == 0) {
            //Edited by Gani
            this.state.images.push("NO IMAGES")
        }
        let contactAsign = TaskServices.findBy2('TR_CONTACT', 'USER_AUTH_CODE', this.state.data.ASSIGN_TO);
        let iconRating = "";
        if (this.state.rating != 0) {
            iconRating = getRating(this.state.rating)
        }

        return (
            <Container style={{ flex: 1, backgroundColor: 'white' }}>
                <Content style={{ flex: 1 }}>

                    <ModalAlert
                        visible={this.state.showModal}
                        icon={this.state.icon}
                        onPressCancel={() => this.setState({ showModal: false })}
                        title={this.state.title}
                        message={this.state.message} />

                    <ModalAlertBack
                        visible={this.state.showModalBack}
                        icon={this.state.icon}
                        onPressCancel={() => this.props.navigation.goBack(null)}
                        title={this.state.title}
                        message={this.state.message} />


                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                        <Image style={{ marginRight: 16, width: 40, height: 40, borderRadius: 10 }}
                            source={Images.ic_orang}></Image>
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>{this.state.fullName}</Text>
                            <Text style={{ fontSize: 12, color: 'grey', marginTop: 3 }}>
                                {this.state.insertTime}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16
                        }}>
                            <View style={{ height: 300 }}>
                                <ImageSlider
                                    images={this.state.images}
                                    customSlide={({ index, item, style, width }) => (
                                        // It's important to put style here because it's got offset inside
                                        <View key={index} style={[style, { backgroundColor: 'yellow', flex: 1 }]}>
                                            {this.state.data.STATUS == 'SELESAI' && <View style={{
                                                backgroundColor: 'rgba(91, 90, 90, 0.7)', width: 80,
                                                padding: 5, position: 'absolute', top: 0, right: 10, zIndex: 1, justifyContent: 'center', alignItems: 'center',
                                                margin: 10, borderRadius: 25,
                                            }}>
                                                <Text style={{ fontSize: 10, color: 'white' }}>{getStatusImage(item.STATUS_IMAGE)}</Text>
                                            </View>}

                                            {/*Gani*/}
                                            {this.state.images[0] == "NO IMAGES" &&
                                                <Image style={{ width: '100%', height: '100%' }}
                                                    source={Images.img_no_picture}>
                                                </Image>
                                            }
                                            {this.state.images[0] != "NO IMAGES" &&
                                                <FastImage style={{ alignItems: 'center', width: '100%', height: '100%' }}
                                                    source={{
                                                        uri: 'file://' + item.IMAGE_PATH_LOCAL,
                                                        priority: FastImage.priority.normal,
                                                    }} />
                                            }
                                            {/*End Gani*/}
                                            <View style={{
                                                flexDirection: 'row',
                                                backgroundColor: getColor(this.state.data.STATUS),
                                                width: '100%', height: 35,
                                                position: 'absolute', bottom: 0,
                                                paddingLeft: 15
                                            }}>
                                                <Image style={{ marginTop: 2, height: 28, width: 28 }} source={sources}></Image>
                                                <Text style={{ marginLeft: 10, color: 'white', fontSize: 14, marginTop: 8 }}>{this.state.data.STATUS}</Text>
                                            </View>
                                        </View>
                                    )}
                                    customButtons={this.state.images > 1 ? (position, move) => (
                                        <View style={{ flex: 1, flexDirection: 'row', }}>
                                            {this.state.images.map((image, index) => {
                                            })}
                                        </View>
                                    ) : null}
                                />
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            paddingVertical: 5,
                            marginVertical: 15,
                            marginHorizontal: 20,
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: 'rgba(242,242,242,1)'
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate("HomeScreenComment", { findingCode: this.state.data.FINDING_CODE })
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image style={{ width: 30, height: 30 }}
                                    source={Images.ic_comment}>
                                </Image>
                                <Text
                                    style={{
                                        paddingHorizontal: 5
                                    }}>
                                    Komentar
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 15, paddingRight: 15 }}>
                        <Image style={{ alignItems: 'stretch', width: 16, height: 22 }}
                            source={Images.ic_map}>
                        </Image>

                        <View style={{ flex: 2, marginLeft: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.lokasiBlok}</Text>

                            <View style={styles.column}>
                                <Text style={styles.label}>Kategori </Text>
                                <Text style={styles.item}>: {category ? category.CATEGORY_NAME : 'not defined'} </Text>
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.label}>Priority </Text>
                                <Text style={styles.item}>: {this.state.data.FINDING_PRIORITY} </Text>
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.label}>Ditugaskan Kepada </Text>
                                <Text style={styles.item}>: {getContactName(this.state.data.ASSIGN_TO)}</Text>
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.label}>Batas Waktu </Text>
                                {isEmpty(this.state.data.DUE_DATE) && (
                                    <Text style={styles.item} onPress={() => { this.showDate() }} style={{ fontSize: 13, color: 'red' }}>: {batasWaktu} </Text>)}
                                {!isEmpty(this.state.data.DUE_DATE) && (
                                    <Text style={styles.item}>: {dateDisplayMobileWithoutHours(this.state.data.DUE_DATE)} </Text>)}
                            </View>

                            <DateTimePicker
                                minimumDate={new Date()}
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker} />
                        </View>
                    </View>

                    <Text style={[styles.title, { paddingLeft: 15, paddingRight: 15 }]}>Deskripsi:</Text>
                    <Text style={{ fontSize: 14, paddingLeft: 15, paddingRight: 15 }}> {this.state.data.FINDING_DESC}</Text>

                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={[styles.title, { marginBottom: 5 }]}>Progress:</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Slider
                                ref='sliderProgress'
                                step={25}
                                style={{ flex: 1 }}
                                maximumValue={100}
                                thumbStyle={
                                    [this.state.data.PROGRESS < 100 && this.state.data.ASSIGN_TO == this.state.user.USER_AUTH_CODE ? styles.noThumb : styles.thumb]
                                }
                                trackStyle={styles.track}
                                value={this.state.progress}
                                disabled={this.state.disabledProgress}
                                minimumTrackTintColor={Colors.brandSecondary}
                                // maximumTrackTintColor={this.state.disabledProgress ? Colors.abuabu : Colors.brand}
                                onSlidingComplete={(value) => {
                                    if (parseInt(value) < parseInt(this.state.PROGRESS)) {
                                        var progress = R.clone(parseInt(this.state.PROGRESS))
                                        this.refs['sliderProgress']._setCurrentValue(progress)

                                        this.setState({
                                            progress
                                        })

                                        this.setState({ showModalBack: true, title: 'Progress Temuan', message: 'Opps.. Progress tidak boleh dimundurin yaaaa..', icon: Images.ic_batas_waktu });

                                    } else {
                                        this.setState({
                                            progress: parseInt(value),
                                            showImage: value == '100' ? true : false
                                        })
                                    }
                                }}
                            />
                            <Text style={{
                                height: 20,
                                textAlignVertical: 'center',
                                marginLeft: 10, color: 'black'
                            }}>{this.state.progress}%</Text>
                        </View>
                    </View>

                    {/* foto */}
                    {(this.state.showImage && this.state.data.ASSIGN_TO == this.state.user.USER_AUTH_CODE) && <View style={{ flexDirection: 'row', marginTop: 20, paddingLeft: 15, paddingRight: 15 }}>
                        <Text style={styles.title}>Bukti Kerja:</Text>
                        <Card style={[styles.cardContainer, { marginLeft: 15 }]}>
                            <TouchableOpacity style={{ padding: 40 }}
                                onPress={() => { this._takePicture() }}
                                disabled={this.state.disabledView}>
                                <Image style={{
                                    alignSelf: 'center', alignItems: 'stretch',
                                    width: 30, height: 30
                                }}
                                    source={Images.ic_camera_big}></Image>
                            </TouchableOpacity>
                        </Card>
                    </View>}

                    {(this.state.data.PROGRESS < 100 && this.state.data.ASSIGN_TO == this.state.user.USER_AUTH_CODE) &&
                        <TouchableOpacity style={[styles.button, { marginTop: 25, marginBottom: 30 }]}
                            onPress={() => { this.validation() }}>
                            <Text style={styles.buttonText}>Simpan</Text>
                        </TouchableOpacity>}

                    {this.state.data.PROGRESS == 100 &&
                        this.state.data.INSERT_USER == this.state.user.USER_AUTH_CODE &&
                        this.state.data.ASSIGN_TO !== this.state.user.USER_AUTH_CODE &&
                        this.state.rating == 0 &&
                        <View style={{ flex: 1, width: '90%', borderTopWidth: 1, alignSelf: 'center', }}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 15,
                                marginBottom: 15,
                                width: '100%',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>Berikan rating untuk tugas ini?</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <IconRating onPress={() => this.onPressRating(1)} activeRating={this.state.activeRatingBad} iconActive={Images.ic_rating_bad} iconNonActive={Images.ic_rating_bad_noactive} />
                                    <IconRating onPress={() => this.onPressRating(2)} activeRating={this.state.activeRatingOk} iconActive={Images.ic_rating_ok} iconNonActive={Images.ic_rating_ok_noactive} />
                                    <IconRating onPress={() => this.onPressRating(3)} activeRating={this.state.activeRatingGood} iconActive={Images.ic_rating_good} iconNonActive={Images.ic_rating_good_noactive} />
                                    <IconRating onPress={() => this.onPressRating(4)} activeRating={this.state.activeRatingGreat} iconActive={Images.ic_rating_great} iconNonActive={Images.ic_rating_great_noactive} />
                                </View>
                            </View>
                            <Text style={{ fontWeight: 'bold' }}>Ada pesan untuk {contactAsign.FULLNAME}?</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'rgba(0,0,0,0.3)'
                                }}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder="Ketik di sini..."
                                placeholderTextColor="rgba(0,0,0,0.3)"
                                selectionColor="#51a977"
                                keyboardType="email-address"
                                onChangeText={(str) => { this.setState({ ratingMsg: str }) }}
                                value={this.state.ratingMsg} />
                            <TouchableOpacity style={[styles.button, { marginTop: 25, marginBottom: 30 }]}
                                onPress={() => this.inputRating()}>
                                <Text style={styles.buttonText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>}

                    {(this.state.data.PROGRESS == 100) &&
                        this.state.rating != 0 &&
                        <View style={{ flex: 1, width: '90%', borderTopWidth: 1, alignSelf: 'center', marginBottom: 30 }}>
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                marginTop: 15,
                                marginBottom: 15,
                                width: '100%',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>Rating untuk tugas ini</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Image style={{ alignItems: 'stretch', width: 50, height: 50 }}
                                        source={iconRating}>
                                    </Image>
                                </View>
                            </View>
                            <Text style={{ fontWeight: 'bold' }}>Pesan untuk {contactAsign.FULLNAME}</Text>
                            <Text>{this.state.ratingMsg}</Text>
                        </View>
                    }

                </Content>
            </Container>
        )
    }


    //HANDLE PRESS RATING
    onPressRating(index) {
        switch (index) {
            case 1:
                this.setState({ activeRatingBad: true, activeRatingOk: false, activeRatingGood: false, activeRatingGreat: false, newRating: 1 })
                return;
            case 2:
                this.setState({ activeRatingBad: false, activeRatingOk: true, activeRatingGood: false, activeRatingGreat: false, newRating: 2 })
                return;
            case 3:
                this.setState({ activeRatingBad: false, activeRatingOk: false, activeRatingGood: true, activeRatingGreat: false, newRating: 3 })
                return;
            case 4:
                this.setState({ activeRatingBad: false, activeRatingOk: false, activeRatingGood: false, activeRatingGreat: true, newRating: 4 })
                return;
            default:
                return;
        }
    }

}

export default DetailFindingScreenRedesign

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 16
    },
    label: {
        width: '40%',
        fontSize: 14
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 3
    },
    item: {
        width: '60%',
        color: "#999",
        fontSize: 14
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 16
    },
    cardContainer: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#eee',
        borderColor: '#ddd'
    },
    statusImg: {
        position: 'absolute',
        top: 10,
        right: 15,
        backgroundColor: Colors.brand,
        borderRadius: 25,
        padding: 15,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        backgroundColor: Colors.brand,
        borderRadius: 25,
        padding: 15,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    btnStatus: {
        width: 200,
        backgroundColor: '#686868',
        borderRadius: 25,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center'
    },
    track: {
        height: 12,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: '#9a9a9a',
        borderWidth: 1
    },
    noThumb: {
        width: 28,
        height: 28,
        borderRadius: 100,
        backgroundColor: '#eaeaea',
        borderColor: '#9a9a9a',
        borderWidth: 1
    },
    thumb: {
        width: 0,
        height: 0,
        borderWidth: 0
    }
})
