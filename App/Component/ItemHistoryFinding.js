import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import moment from 'moment';
import { getCategoryName, getBlokName, getStatusBlok, getEstateName } from '../Database/Resources';
import TaskServices from '../Database/TaskServices';
import { Images, Fonts } from '../Themes';
import { dirPhotoTemuan } from '../Lib/dirStorage';
import { dateDisplayMobile, changeFormatDate } from '../Lib/Utils';
import Colors from '../Constant/Colors';
import {clipString} from "../Constant/Functions/StringManipulator";

const Field = (props) => {
    return (
        <View style={{ flexDirection: 'row', marginRight: 12 }}>
            <Text style={{ fontSize: 12, color: 'grey', width: 92.5, fontFamily: Fonts.demi }}>{props.label} </Text>
            <Text style={{ fontSize: 12, color: 'grey', fontFamily: Fonts.book }}>:  {props.content}</Text>
        </View>
    )
}

const ItemHistoryFinding = (props) => {

    let item = props.item;
    let idx = props.idx;

    const image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', item.FINDING_CODE);
    let INSERT_TIME = "" + item.INSERT_TIME;

    moment.locale();

    let sourceImage;
    if (image == undefined) {
        sourceImage = Images.img_thumbnail;
    } else {
        if (image.IMAGE_NAME != undefined) {
            sourceImage = { uri: `file://${dirPhotoTemuan}/${image.IMAGE_NAME}` }
        }
    }

    let assignTo = item.ASSIGN_TO;
    let contact = TaskServices.query('TR_CONTACT', `USER_AUTH_CODE = "${assignTo}"`);
    if (contact.length > 0) {
        assignTo = contact[0].FULLNAME;
    }

    let createdTime = dateDisplayMobile(changeFormatDate(INSERT_TIME.toString(), "YYYY-MM-DD hh-mm-ss"));
    let werkAfdBlokCode = `${item.WERKS}${item.AFD_CODE}${item.BLOCK_CODE}`;
    let lokasi = `${getBlokName(werkAfdBlokCode)}/${getStatusBlok(werkAfdBlokCode)}/${getEstateName(item.WERKS)}`
    let status = '', colorStatus = '';
    if (item.STATUS_SYNC == 'N') {
        status = 'Data Belum Dikirim'
        colorStatus = 'red';
    } else {
        status = 'Data Sudah Terkirim'
        colorStatus = Colors.brand;
    }

    return (
        <TouchableOpacity
            style={styles.sectionCardView}
            onPress={props.onPress}
            key={idx} >
            <Image style={{ alignItems: 'stretch', width: 90, height: 100, borderRadius: 10 }} source={sourceImage} />
            <View style={styles.sectionDesc} >
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12, color: 'black', fontFamily: Fonts.demi }}>{lokasi}</Text>
                </View>
                <Field label={'Dibuat'} content={createdTime} />
                <Field label={'Kategori'} content={clipString(getCategoryName(props.item.FINDING_CATEGORY), 18)} />
                <Field label={'Ditugaskan Ke'} content={clipString(assignTo, 18)} />
                <Field label={'Status'} content={item.STATUS} />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12, color: colorStatus, fontFamily: Fonts.demiItalic }}>{status}</Text>
                </View>

            </View>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    sectionCardView: {
        alignItems: 'stretch',
        height: 130,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionDesc: {
        justifyContent: 'space-between',
        height: 130,
        padding: 10,
    }
});

export default ItemHistoryFinding;
