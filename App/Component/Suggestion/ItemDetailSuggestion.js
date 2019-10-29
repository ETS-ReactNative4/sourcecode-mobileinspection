import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Card } from 'native-base';
import { Colors, Images } from '../../Themes';

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
    if (props.item.type == 'inspeksi') {
        img = Images.ic_suggestion_inspeksi;
    } else if (props.item.type == 'panen') {
        img = Images.ic_suggestion_panen;
    } else {
        img = Images.ic_suggestion_rawat;
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
                            <Text style={{ color: Colors.colorPrimary, fontWeight: '500' }}> {props.item.tanggal}</Text>
                            <Text style={{ color: Colors.black, fontWeight: '500' }}> {props.item.title}</Text>
                        </View>

                        {props.type == 'inspeksi' && <Text style={{ color: Colors.darkgrey, marginTop: 15, fontWeight: '500' }}> {"(" + "baris" + " " + props.item.data_item.jumlah_baris + ")"}</Text>}
                    </View>

                    {props.item.type == 'inspeksi' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>
                        <View>
                            <Text style={styles.textLabelBold}>Kepala Kebun</Text>
                            <Text style={styles.textLabelBold}>-</Text>
                            <View style={styles.textLine} />
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.textLabelBold}>EM</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabel}>{props.item.data_item.tgl_inspeksi_terakhir}</Text>
                                <Text style={styles.textLabel}>{"(" + "baris" + " " + props.item.data_item.jumlah_baris + ")"}</Text>
                            </View>
                            <View style={styles.textLine} />
                        </View>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.textLabelBold}>SEM / GM</Text>
                            <Text style={styles.textLabelBold}>-</Text>
                            <View style={styles.textLine} />
                        </View>
                    </Card>}

                    {props.item.type == 'panen' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>

                        <View style={{ marginTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabelBold}>Total Janjang Panen</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.total_janjang_panen} Janjang</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>BJR bulan lalu</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.bjr_bulan_lalu} kg</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>Total Restan TPH</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.total_restan_tph} Janjang</Text>
                            </View>
                        </View>
                    </Card>}

                    {props.item.type == 'rawat' && <Card style={{ padding: 14, borderRadius: 10, backgroundColor: Colors.white, marginTop: 10, marginBottom: 20 }}>

                        <View style={{ marginTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.textLabelBold}>CPT SPRAYING</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.cpt_spraying}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>SPOT SPRAYING</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.spot_spraying}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                <Text style={styles.textLabelBold}>LALANG CTRL</Text>
                                <Text style={styles.textLabel}>{props.item.data_item.lalang_ctrl}</Text>
                            </View>
                        </View>
                    </Card>}
                </View>
            </View>
        </View>
    )
}

export default ItemDetailSuggestion;