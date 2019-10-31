import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import TaskServices from '../../Database/TaskServices';
import { getEstateName, getBlokName, getStatusBlok } from '../../Database/Resources';
import { getColor } from '../../Themes/Resources';
import { dirPhotoTemuan } from '../../Lib/dirStorage'
import { Images } from '../../Themes';

const ItemTemuan = (props) => {

    let image = TaskServices.findBy2('TR_IMAGE', 'TR_CODE', props.item.FINDING_CODE)

    let label = getColor(props.item.STATUS);

    let showImage;
    if (image == undefined) {
        showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={Images.img_thumbnail} />
    } else {
        if (image.IMAGE_NAME != undefined) {
            showImage = <Image style={{ alignItems: 'stretch', width: 120, height: 120, borderRadius: 10 }} source={{ uri: `file://${dirPhotoTemuan}/${image.IMAGE_NAME}` }} />
        }
    }

    let werkAfdBlokCode = `${props.item.WERKS}${props.item.AFD_CODE}${props.item.BLOCK_CODE}`;

    let detailLokasi = `${getBlokName(werkAfdBlokCode)}/${getStatusBlok(werkAfdBlokCode)}/${getEstateName(props.item.WERKS)}`

    return (
        < TouchableOpacity style={{ marginRight: 10 }} onPress={props.onPress} key={props.index}>
            <View style={{ height: 120, width: 120, }}>

                {showImage}

                <View style={{
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    width: 120,
                    padding: 5,
                    position: 'absolute',
                    bottom: 0,
                    justifyContent: 'center',
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: label
                }}>
                    <Text style={{ fontSize: 8, color: 'white', textAlignVertical: 'center' }}>{detailLokasi}</Text>
                </View>
            </View>
        </TouchableOpacity >
    )
}

export default ItemTemuan;