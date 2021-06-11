import React, { Component } from 'react';
import { Image, Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import Colors from '../../Constant/Colors'
// import R from 'ramda';
import TaskServices from '../../Database/TaskServices'
import { Fonts } from '../../Themes';
import { scale } from 'react-native-size-matters';
import { NavigationActions, StackActions } from 'react-navigation';

import { dirPhotoEbccSelfie } from '../../Lib/dirStorage'
import { getTodayDate } from '../../Lib/Utils'
import ModalAlertBack from '../../Component/ModalAlert';
import ModalAlertConf from '../../Component/ModalAlertConfirmation'

import saveIcon from '../../Images/ic-save-berhasil.png'


var RNFS = require('react-native-fs');

class PreviewEbcc extends Component {
    state = {
        fotoJanjang: this.props.navigation.state.params.fotoJanjang,
        tphAfdWerksBlockCode: this.props.navigation.state.params.tphAfdWerksBlockCode,
        ebccValCode: this.props.navigation.state.params.ebccValCode,
        totalJanjang: this.props.navigation.state.params.totalJanjang,
        kriteriaBuah: this.props.navigation.state.params.kriteriaBuah,
        dataHeader: this.props.navigation.state.params.dataHeader,
        statusBlock: this.props.navigation.state.params.statusBlock,
        dataModel: this.props.navigation.state.params.dataModel,
        brondolTPH: this.props.navigation.state.params.brondolTPH,
        werks: this.props.navigation.state.params.werks,

        timestamp: getTodayDate('YYMMDDkkmmss'),
        title: 'Title',
        message: 'Message',
        showModalBack: false,
        showModalConfirm: false,
        icon: ''
    }


    renderHasilPanen() {
        const hp = this.state.kriteriaBuah.filter(data => {
            return data.GROUP_KUALITAS === 'HASIL PANEN'
        })
        return (
            hp.map((dt, i) => {
                return (
                    <View style={style.listEbbc} key={i}>
                        <Text style={style.ebccName}>{dt.NAMA_KUALITAS}</Text>
                        <TextInput value={dt.JUMLAH} editable={false} style={style.ebccValue}></TextInput>
                    </View>
                )
            })

        )
    }

    renderKondisiBuah() {
        const hp = this.state.kriteriaBuah.filter(data => {
            return data.GROUP_KUALITAS === 'KONDISI BUAH'
        })
        return (
            hp.map((dt, i) => {
                return (
                    <View style={style.listEbbc} key={i}>
                        <Text style={style.ebccName}>{dt.NAMA_KUALITAS}</Text>
                        <TextInput value={dt.JUMLAH} editable={false} style={style.ebccValue}></TextInput>
                    </View>
                )
            })
        )
    }

    renderButton() {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: scale(100) }}>
                <Text style={{ color: Colors.tintColorPrimary, fontSize: scale(13.5), fontFamily: Fonts.demi }}>Pastikan seluruh data yang kamu input sudah benar</Text>
                <TouchableOpacity onPress={() => this.setState({ showModalConfirm: true })} style={{
                    justifyContent: 'center',
                    backgroundColor: Colors.tintColorPrimary,
                    width: '100%',
                    height: scale(50),
                    borderRadius: scale(10)
                }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Simpan</Text>
                </TouchableOpacity>
            </View>
        )

    }

    renderAlasBrondolan() {
        return (
            <View style={{ padding: scale(10) }}>
                <Text style={{ fontSize: 15, color: 'grey', fontFamily: Fonts.book}}>Alas Brondolan (TPH)</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10, marginBottom: 10
                }}>
                    <View style={this.state.brondolTPH ? style.brondolAda : style.brondolTidakAda}>
                        <Text style={{ textAlign: 'center', color: 'black' }} >ADA</Text>
                    </View>
                    <View style={!this.state.brondolTPH ? style.brondolAda : style.brondolTidakAda}>
                        <Text style={{ textAlign: 'center', color: 'black' }}>TIDAK ADA</Text>
                    </View>
                </View>
            </View>
        )
    }

    async insertDB() {
        // RNFS.unlink(this.state.pathCache);
        let isImageContain = await RNFS.exists(`file://${dirPhotoEbccSelfie}/${this.state.dataModel.IMAGE_NAME}`);
        if (isImageContain) {

            // this.resize(this.state.path);

            let tempHeader = this.state.dataHeader;
            tempHeader = {
                ...tempHeader,
                syncImage: 'N',
                syncDetail: 'N'
            }
            //insert TR_H_EBCC_VALIDATION
            TaskServices.saveData('TR_H_EBCC_VALIDATION', tempHeader);

            // insert TR_D_EBCC_VALIDATION
            if (this.state.kriteriaBuah !== null) {
                this.state.kriteriaBuah.map(item => {

                    /* CONDITION IF JUMLAH STRING KOSONG / NULL */
                    if (item.JUMLAH == '' || item.JUMLAH == null) {
                        itemJumlah = 0
                    } else {
                        itemJumlah = parseInt(item.JUMLAH)
                    }

                    let newItem = { ...item, JUMLAH: itemJumlah }

                    TaskServices.saveData('TR_D_EBCC_VALIDATION', newItem);
                })
            }

            //insert TR_IMAGE
            TaskServices.saveData('TR_IMAGE', this.state.fotoJanjang);
            TaskServices.saveData('TR_IMAGE', this.state.dataModel);

            this.setState({ showModalBack: true, title: 'Berhasil Disimpan', message: 'Yeaay! Data kamu berhasil disimpan', icon: require('../../Images/ic-save-berhasil.png') });
        } else {
            alert('Ada kesalahan, Ulangi ambil gambar baris')
        }
    }

    selesai = () => {
        const navigation = this.props.navigation;
        let data = TaskServices.getAllData('TR_LOGIN')
        if (data != undefined) {
            let routeName = ''
            if (data[0].USER_ROLE == 'FFB_GRADING_MILL') {
                routeName = 'MainMenuMil'
            } else {
                routeName = 'MainMenu';
            }
            Promise.all([
                navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: routeName })]
                    })
                )]).then(() => navigation.navigate('EbccValidation')).then(() => navigation.navigate('Riwayat'))
            this.setState({ showModalBack: false })
        }
    }

    getEstateName(werks) {
        try {
            let data = TaskServices.findBy2('TM_EST', 'WERKS', werks);
            return data.EST_NAME;
        } catch (error) {
            return '';
        }
    }





    render() {
        console.log(this.props.navigation.state.params.brondolTPH, '===> brondolTPH');
        const { IMAGE_PATH_LOCAL } = this.state.fotoJanjang;
        const { WERKS, AFD_CODE, BLOCK_CODE, NO_TPH, DELIVERY_CODE } = this.state.dataHeader
        return (
            <>
                <ModalAlertBack
                    visible={this.state.showModalBack}
                    icon={this.state.icon}
                    onPressCancel={() => this.selesai()}
                    title={this.state.title}
                    message={this.state.message} />
            
                <ModalAlertConf
                    visible={this.state.showModalConfirm}
                    onPressCancel={() => this.setState({ showModalConfirm: false })}
                    onPressSubmit={() => { this.insertDB() }}
                    btnSubmitText={'Simpan'}
                    btnCancelText={'Tidak'}
                    title={'Konfirmasi'}
                    message={'Apakah Anda yakin akan menyimpan data ini?'}
                    icon ={saveIcon} />
                <ScrollView>
                    <View style={style.janjang}>
                        <Image style={style.janjangImg} source={{ uri: `file:///${IMAGE_PATH_LOCAL}` }}></Image>
                    </View>
                    <View style={style.main}>
                        <View style={style.blok}>
                            <View>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 17}}>{`${BLOCK_CODE}/${this.state.statusBlock}/${this.getEstateName(WERKS)}`}</Text>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 14 }}>{`TPH - ${NO_TPH}`}</Text>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 14 }}>{`Delivery Ticket - ${DELIVERY_CODE}`}</Text>
                                {/* <Text style={{ fontFamily: Fonts.demi, fontSize: 14, color: 'black' }}>{`${DELIVERY_CODE}`}</Text> */}
                            </View>
                        </View>
                        <View style={style.hr}></View>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={style.ebccTitle}>Hasil Panen</Text>
                                <Image></Image>
                            </View>
                            {this.renderHasilPanen()}
                        </View>
                        <View>
                            <Text style={style.ebccTitle}>Kondisi Buah</Text>
                            {this.renderKondisiBuah()}
                            {this.renderAlasBrondolan()}
                        </View>
                        <View style={style.hr}></View>
                        {this.renderButton()}
                    </View>
                </ScrollView>
            </>
        )
    }
}


export default PreviewEbcc;





const style = StyleSheet.create({
    janjang: {
        flex: 1
    },
    janjangImg: {
        height: scale(160),
        width: '100%',
        resizeMode: 'cover'
    },
    main: {
        flex: 1,
        padding: scale(15),
        backgroundColor: '#FFFFFF',
    },
    blok: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    round: {
        width: scale(70),
        height: scale(70),
        backgroundColor: 'black',
        marginRight: scale(10),
        borderRadius: scale(50)
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#C4C1C1',
        marginBottom: scale(12),
        marginTop: scale(12)
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detic: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    deticTitle: {
        fontFamily: Fonts.black,
        fontSize: 17
    },
    deticVal: {
        fontFamily: Fonts.demi,
        fontSize: 14, color: 'black',
        fontWeight: 'bold'
    },
    edit: {
        width: scale(25),
        height: scale(25)
    },
    listEbbc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(7)
    },
    ebccTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.demi,
        marginTop: 10,
        marginBottom: 10
    },
    ebccValue: {
        color: 'black',
        backgroundColor: '#DFDFDF',
        padding: scale(1),
        textAlign: 'center',
        width: scale(60),
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 1,
        shadowRadius: 4.65,

        elevation: 5
    },
    ebccName: {
        color: 'grey',
        fontSize: 15,
        fontFamily: Fonts.book
    },
    brondolAda: {
        width: '47%',
        height: scale(50),
        borderRadius: scale(15),
        justifyContent: 'center',
        borderWidth: 1.8,
        borderColor: Colors.tintColorPrimary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 1,
    },
    brondolTidakAda: {
        width: '47%',
        height: 50,
        borderRadius: scale(15),
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 1,
    }
})


