import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import { Colors, Images } from '../../Themes';
import { dateDisplayMobileWithoutHours } from '../../Lib/Utils';

const styles = StyleSheet.create({
    textLabel: {
        color: Colors.darkgrey,
        fontSize: 12,
        fontWeight: '400'
    },
    textLabelBold: {
        color: Colors.black,
        fontSize: 12,
        fontWeight: '500'
    },
    textLine: {
        height: 1,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.lightGrey,
        marginTop: 5
    }
})

const ItemDetailSuggestion = (props) => {

    let img;
    let desc;
    if (props.type == 'inspeksi') {
        img = Images.ic_suggestion_inspeksi;
        desc = 'Inpeksi oleh ' + props.desc;
    } else if (props.type == 'panen') {
        img = Images.ic_suggestion_panen;
        desc = props.desc;
    } else {
        img = Images.ic_suggestion_rawat;
        desc = props.desc;
    }

    return (
        <View key={props.index}>
            <View style={{ flexDirection: 'row', marginTop: 6 }}>
                <View style={{ alignItems: 'center', marginRight: 8 }}>
                    <Image
                        source={img}
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 36,
                            borderWidth: 1,
                            borderColor: Colors.colorPrimary
                        }} />
                    <View style={{
                        flex: 1,
                        width: 3,
                        backgroundColor: Colors.lightGrey,
                        marginTop: 8,
                        shadowColor: Colors.black
                    }} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: Colors.colorPrimary, fontWeight: '500' }}> {dateDisplayMobileWithoutHours(props.tanggal)}</Text>
                            <Text style={{ color: Colors.black, fontWeight: '500' }}> {desc}</Text>
                        </View>

                        {props.type == 'inspeksi' && <Text style={{ color: Colors.darkgrey, marginTop: 15, fontWeight: '500', marginRight: 6 }}>{props.data.INS_BARIS_1 != null || props.data.INS_BARIS_1 != '' ? '-' : "(" + "baris" + " " + props.data.INS_BARIS_1 + ")"}</Text>}
                    </View>

                    {props.type == 'inspeksi' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>
                        <View>
                            <Text style={styles.textLabelBold}>{props.data.INS_ROLE_2}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabel}>{props.data.INS_DATE_2 == null || props.data.INS_DATE_2 == '' ? '-' : props.data.INS_DATE_2}</Text>
                                <Text style={styles.textLabel}>{props.data.INS_BARIS_2 != '' && "(" + "baris" + " " + props.data.INS_BARIS_2 + ")"}</Text>
                            </View>
                            <View style={styles.textLine} />
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.textLabelBold}>{props.data.INS_ROLE_3}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabel}>{props.data.INS_DATE_3 == null || props.data.INS_DATE_3 == '' ? '-' : props.data.INS_DATE_3}</Text>
                                <Text style={styles.textLabel}>{props.data.INS_BARIS_3 != '' && "(" + "baris" + " " + props.data.INS_BARIS_3 + ")"}</Text>
                            </View>
                            <View style={styles.textLine} />
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.textLabelBold}>{props.data.INS_ROLE_4}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabel}>{props.data.INS_DATE_4 == null || props.data.INS_DATE_4 == '' ? '-' : props.data.INS_DATE_4}</Text>
                                <Text style={styles.textLabel}>{props.data.INS_BARIS_4 != '' && "(" + "baris" + " " + props.data.INS_BARIS_4 + ")"}</Text>
                            </View>
                            <View style={styles.textLine} />
                        </View>
                    </Card>}

                    {props.type == 'panen' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>

                        <View style={{ marginTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabelBold}>Total Janjang Panen</Text>
                                <Text style={styles.textLabel}>{props.data.TOTAL_JANJANG_PANEN} Janjang</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>BJR bulan lalu</Text>
                                <Text style={styles.textLabel}>{props.data.BJR_BULAN_LALU} kg</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>Total Restan TPH</Text>
                                <Text style={styles.textLabel}>{props.data.TOTAL_RESTAN_TPH} Janjang</Text>
                            </View>
                        </View>
                    </Card>}

                    {props.type == 'rawat' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>

                        <View style={{ marginTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabelBold}>CPT SPRAYING</Text>
                                <Text style={styles.textLabel}>{props.data.CPT_SPRAYING.charAt(0) == '-' ? '-' : props.data.CPT_SPRAYING}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>SPOT SPRAYING</Text>
                                <Text style={styles.textLabel}>{props.data.SPOT_SPRAYING.charAt(0) == '-' ? '-' : props.data.SPOT_SPRAYING}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>LALANG CTRL</Text>
                                <Text style={styles.textLabel}>{props.data.LALANG_CTRL.charAt(0) == '-' ? '-' : props.data.LALANG_CTRL}</Text>
                            </View>
                        </View>
                    </Card>}
                </View>
            </View>
        </View>
    )
}

export default ItemDetailSuggestion;