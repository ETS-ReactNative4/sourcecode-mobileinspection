import React, { Component } from 'react';
import { Image, Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../../Constant/Colors'
// import R from 'ramda';
// import TaskServices from '../../Database/TaskServices'
import { Fonts } from '../../Themes';
import { scale } from 'react-native-size-matters'
import ModalEbccConfirm from '../../Component/ModalEbccConfirm'



class PreviewEbcc extends Component {
    state = {
        fotoJanjang: this.props.navigation.state.params.fotoJanjang,
        tphAfdWerksBlockCode: this.props.navigation.state.params.tphAfdWerksBlockCode,
        ebccValCode: this.props.navigation.state.params.ebccValCode,
        totalJanjang: this.props.navigation.state.params.totalJanjang,
        kriteriaBuah: this.props.navigation.state.params.kriteriaBuah,
        dataHeader: this.props.navigation.state.params.dataHeader
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
                <Text style={{ color: Colors.tintColorPrimary, fontSize: scale(13), fontFamily: Fonts.demi }}>Pastikan seluruh data yang kamu input sudah benar</Text>
                <TouchableOpacity style={{
                    justifyContent: 'center',
                    backgroundColor: Colors.tintColorPrimary,
                    width: '100%',
                    height: scale(50),
                    borderRadius: scale(10)
                }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Selesai</Text>
                </TouchableOpacity>
            </View>
        )

    }

    renderAlasBrondolan() {
        return (
            <View style={{ padding: scale(10) }}>
                <Text style={{ fontSize: 14, color: 'black' }}>Alas Brondolan (TPH)</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10, marginBottom: 10
                }}>
                    <View style={style.brondolAda}>
                        <Text style={{ textAlign: 'center', color: 'black' }} >ADA</Text>
                    </View>
                    <View style={style.brondolTidakAda}>
                        <Text style={{ textAlign: 'center', color: 'black' }}>TIDAK ADA</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        console.log(this.props.navigation.state.params);
        const { IMAGE_PATH_LOCAL } = this.state.fotoJanjang;
        const { WERKS, AFD_CODE, BLOCK_CODE, NO_TPH, DELIVERY_CODE } = this.state.dataHeader
        return (
            <>
                <ModalEbccConfirm />
                <ScrollView>
                    <View style={style.janjang}>
                        <Image style={style.janjangImg} source={{ uri: `file:///${IMAGE_PATH_LOCAL}` }}></Image>
                    </View>
                    <View style={style.main}>
                        <View style={style.blok}>
                            <Image style={style.round} source={require('../../Images/ic-orang.png')}></Image>
                            <View>
                                <Text style={{ fontFamily: Fonts.black, fontSize: 17, color: 'black' }}>{`Blok ${BLOCK_CODE}/${WERKS} - TPH ${NO_TPH}`}</Text>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 14 }}>{`EBL ESTATE - AFDELING ${AFD_CODE}`}</Text>
                            </View>
                        </View>
                        <View style={style.hr}></View>
                        <View style={style.user}>
                            <View>
                                <Text style={{ fontFamily: Fonts.black, fontSize: 17 }}>Nama Pemanen</Text>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 14, fontWeight: 'bold', color: 'black' }}>SLAMET RIYADI</Text>
                                <Text style={{ fontFamily: Fonts.demi, fontSize: 14 }}>51/5121/0510/112</Text>
                            </View>
                            <View style={style.detic}>
                                <Text style={style.deticTitle}>Delivery Ticket</Text>
                                <Text style={style.deticVal}>{`${DELIVERY_CODE}`}</Text>
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
        padding: scale(10)
    },
    ebccTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
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
        color: 'black',
        fontSize: 14
    },
    brondolAda: {
        width: '47%',
        height: scale(50),
        borderRadius: scale(15),
        justifyContent: 'center',
        borderWidth: 1.5,
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


