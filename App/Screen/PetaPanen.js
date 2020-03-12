import React, {Component} from 'react';
import {AsyncStorage, Image, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, { Marker, Polygon, ProviderPropType, PROVIDER_GOOGLE } from 'react-native-maps';
import {VictoryArea, VictoryAxis, VictoryChart, VictoryScatter} from "victory-native";
import Svg, {G, Circle, Text as TextSVG, TSpan, Defs, LinearGradient, Stop} from "react-native-svg";
import moment from 'moment';

import {HeaderWithButton} from "../Component/Header/HeaderWithButton";
import GaugeChart from '../Component/SVG/GaugeBar';
import ModalLoading from "../Component/ModalLoading";
import ModalAlert from '../Component/ModalAlert';
import Colors from "../Constant/Colors";
import imgSrc from "../Images/Module/PetaPanen";
import Fonts from "../Themes/Fonts";

import TaskServices from "../Database/TaskServices";
import {getPetaPanenDetail, getPetaPanenHeader} from "./Sync/Download/PetaPanen/PetaPanen";
import VectorIcon from "../Component/VectorIcon";

import {PetaPanenHeader, PetaPanenDetail} from "../Data/Default/DefaultModel";

export default class PetaPanen extends Component {
    constructor(props) {
        super(props);
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            currentUser: currentUser,
            blockSelection: {
                listAvailableBlock: [],
                selectedBlock: {}
            },
            selectedPolygon: {

            },
            panenHeader: PetaPanenHeader,
            panenDetail: PetaPanenDetail,
            mapData: {
                selectedBlock: null,
                initialRegion: {
                    latitude: -2.1890660,
                    longitude: 111.3609873,
                    latitudeDelta: 0.0075,
                    longitudeDelta: 0.00721
                },
                polygons: [],
                //target or bbc
                compareWith: "target",
            },
            chartData: {
                area: [
                    { x: 0, y: 0, y0: 0 },
                    { x: 0, y: 0, y0: 0 }
                ],
                scatter: [
                    { x: 0, y: 0, y0: 0 },
                    { x: 0, y: 0, y0: 0 }
                ],
                maxValue: 0,
                chartLastValue: 0,
                dateLabel:[]
            },
            lastSyncTime: null,
            modalLoading: {
                showModal: true,
                title: "Sabar Ya..",
                message: "Sedang Melakukan sync data!"
            },
            modalAlert: {
                showModal: false,
                title: "",
                message: "",
                icon: null
            }
        }
    }

    // async componentWillMount(){}

    async componentDidMount(){
        await this.getAvailableBlock();
    }

    onMapReady(){
        this.getSyncTime()
            .then(()=>{
                this.getPanenHeader(this.state.blockSelection.selectedBlock);
                this.getCoordinate(this.state.blockSelection.selectedBlock);
            });
    }

    async getSyncTime(){
        let syncStatus = "Belum Sync";
        let panenHeaderSyncTime = null;
        let panenDetailSyncTime = null;

        await AsyncStorage.getItem('SYNCTIME-PetaPanenHeader')
            .then((SyncTime)=>{
                if(SyncTime){
                    let data = JSON.parse(SyncTime);
                    panenHeaderSyncTime = data.latestSyncTime;
                    syncStatus = data.latestSyncTime;
                }
            });

        await AsyncStorage.getItem('SYNCTIME-PetaPanenDetail')
            .then((SyncTime)=>{
                if(SyncTime){
                    let data = JSON.parse(SyncTime);
                    panenDetailSyncTime = data.latestSyncTime;
                }
            });

        let today = moment().format("DD MMM YYYY");

        if(!moment(today).isSame(panenHeaderSyncTime) || !moment(today).isSame(panenDetailSyncTime)){
            await this.updatePetaPanen()
                .then((response)=>{
                    if (response){
                        syncStatus = today
                    }
                })
        }

        this.setState({
            latestSyncTime: syncStatus,
            modalLoading:{
                ...this.state.modalLoading,
                showModal: false
            }
        })
    };

    async updatePetaPanen(){
        let fetchStatus = true;
        await NetInfo.isConnected.fetch()
            .then(async (isConnected) => {
                if (isConnected) {
                    await getPetaPanenHeader()
                        .then((response)=>{
                            if (!response.downloadStatus){
                                fetchStatus = false
                            }
                        });
                    await getPetaPanenDetail()
                        .then((response)=>{
                            if (!response.downloadStatus){
                                fetchStatus = false
                            }
                        })
                }
                else {
                    fetchStatus = false;
                    this.setState({
                        internetExist: false
                    });
                }
            });

        return fetchStatus;
    }

    async getAvailableBlock(){
        let listUserLocation = this.state.currentUser.LOCATION_CODE.split(",");
        let locationArray = [];
        await Promise.all(
            listUserLocation.map((location)=>{
                locationArray.push({
                    WERKS: location.slice(0,4),
                    AFD_CODE: location.slice(4)
                })
            })
        );
        await this.setState({
            blockSelection:{
                ...this.state.blockSelection,
                listAvailableBlock:locationArray,
                selectedBlock: locationArray[0],
                index: 0
            }
        });
    }

    //param ("+") OR ("-") according to which button arrow pressed.
    selectDifferentBlock(arithmeticOperator){
        function decreaseIndex(currentIndex, maxIndexLength){
            if(currentIndex === 0){
                return maxIndexLength;
            }
            return currentIndex - 1;
        }
        function increaseIndex(currentIndex, maxIndexLength){
            if(currentIndex === maxIndexLength){
                return 0;
            }
            return currentIndex + 1;
        }

        let maxIndexLength = this.state.blockSelection.listAvailableBlock.length - 1;
        if(maxIndexLength > 0){
            let finalIndex = null;
            let currentIndex = this.state.blockSelection.index;
            if(arithmeticOperator === "+"){
                finalIndex = increaseIndex(currentIndex, maxIndexLength);
            }
            else if(arithmeticOperator === "-"){
                finalIndex = decreaseIndex(currentIndex, maxIndexLength);
            }

            let selectedBlock = this.state.blockSelection.listAvailableBlock[finalIndex];
            this.setState({
                blockSelection:{
                    ...this.state.blockSelection,
                    selectedBlock: selectedBlock,
                    index: finalIndex
                }
            },()=>{
                //refresh data
                this.getCoordinate(this.state.blockSelection.selectedBlock);
                this.getPanenHeader(this.state.blockSelection.selectedBlock);
            })
        }
    }

    getPanenHeader(werksAfd){
        let panenHeaderData = TaskServices.query("TR_PETAPANEN_HEADER", `WERKS = "${werksAfd.WERKS}" AND AFD_CODE = "${werksAfd.AFD_CODE}"`);

        let lineChartData = [
            { x: 1, y: panenHeaderData[0].D_8, y0: -20 },
            { x: 2, y: panenHeaderData[0].D_7, y0: -20 },
            { x: 3, y: panenHeaderData[0].D_6, y0: -20 },
            { x: 4, y: panenHeaderData[0].D_5, y0: -20 },
            { x: 5, y: panenHeaderData[0].D_4, y0: -20 },
            { x: 6, y: panenHeaderData[0].D_3, y0: -20 },
            { x: 7, y: panenHeaderData[0].D_2, y0: -20 },
            { x: 8, y: panenHeaderData[0].D_1, y0: -20 },
            { x: 9, y: panenHeaderData[0].D_1, y0: -20 }
        ];

        let lineScatterData = [
            { x: 2, y: panenHeaderData[0].D_7, y0: 0 },
            { x: 3, y: panenHeaderData[0].D_6, y0: 0 },
            { x: 4, y: panenHeaderData[0].D_5, y0: 0 },
            { x: 5, y: panenHeaderData[0].D_4, y0: 0 },
            { x: 6, y: panenHeaderData[0].D_3, y0: 0 },
            { x: 7, y: panenHeaderData[0].D_2, y0: 0 },
            { x: 8, y: panenHeaderData[0].D_1, y0: 0 }
        ];

        let chartDate = [];
        for(let counter = 7; counter > 0; counter--) {
            chartDate.push(moment(this.state.latestSyncTime).subtract(counter, "days").format("DD MMM"));
        }

        if(panenHeaderData.length > 0){
            this.setState({
                panenHeader: panenHeaderData[0],
                chartData: {
                    ...this.state.chartData,
                    area: lineChartData,
                    scatter: lineScatterData,
                    maxValue: panenHeaderData[0].MAX_D + 25,
                    chartLastValue: panenHeaderData[0].D_1,
                    dateLabel: chartDate
                }
            });
        }
    }

    getPanenDetail(werksAfd){
        let panenDetailData = TaskServices.query("TR_PETAPANEN_DETAIL", `WERKS = "${werksAfd.WERKS}" AND AFD_CODE = "${werksAfd.afd_code}" AND BLOCK_NAME = "${werksAfd.blokname}"`);
        if(panenDetailData.length > 0){
            this.setState({
                selectedPolygon: {
                    afdCode : panenDetailData[0].AFD_CODE,
                    blockName: panenDetailData[0].BLOCK_NAME
                },
                panenDetail: panenDetailData[0]
            });
        }
    }

    getCoordinate(werksAfdLocation) {
        function centerCoordinate(coordinates) {
            let x = coordinates.map(c => c.latitude)
            let y = coordinates.map(c => c.longitude)

            let minX = Math.min.apply(null, x)
            let maxX = Math.max.apply(null, x)

            let minY = Math.min.apply(null, y)
            let maxY = Math.max.apply(null, y)

            return {
                latitude: (minX + maxX) / 2,
                longitude: (minY + maxY) / 2
            }
        }

        let currentUser = this.state.currentUser;
        if (currentUser.CURR_WERKS) {
            let polygons = TaskServices.query('TR_POLYGON', `WERKS = "${werksAfdLocation.WERKS}" AND afd_code = "${werksAfdLocation.AFD_CODE}"`);
            let polygonsArray = [];
            for(let index = 0; index < polygons.length; index++){
                let polygonTemp = polygons[index];
                let coordsTemp = Array.from(polygonTemp.coords);
                let markerCenteredCoordinate = centerCoordinate(coordsTemp);
                let polygon = {
                    ...polygonTemp,
                    coords: coordsTemp,
                    markerPosition: markerCenteredCoordinate
                };
                polygonsArray.push(polygon);
            }
            this.setState({
                mapData: {
                    ...this.state.mapData,
                    polygons: polygonsArray
                }
            }, ()=>{
                this.map.animateToRegion({
                    latitude: polygonsArray[0].coords[0].latitude,
                    longitude: polygonsArray[0].coords[0].longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025
                }, 1);
                this.getPanenDetail(polygonsArray[0])
            });
        }
        else {
            // belum pilih lokasi
            this.setState({
                modalLoading: {...this.state.modalLoading, showModal: false},
                modalAlert: {
                    showModal: true,
                    title: 'Tidak ada data',
                    message: "Kamu belum download data map",
                    icon: require('../Images/ic-blm-input-lokasi.png')
                }
            })
        }

        return null;
    }

    getPolygonFillColor(compareWith, werks, afd, blockName){
        let petaPanenDetail = TaskServices.query("TR_PETAPANEN_DETAIL", `WERKS = "${werks}" AND AFD_CODE = "${afd}" AND BLOCK_NAME = "${blockName}"`);
        if(petaPanenDetail[0]){
            let petaPanenDetailColor = compareWith === "target" ? petaPanenDetail[0].ACT_TAR_COLOR : petaPanenDetail[0].ACT_BBC_COLOR;
            switch (petaPanenDetailColor) {
                case "RED":
                    return Colors.polygonRed;
                case "YELLOW":
                    return Colors.polygonYellow;
                case "GREEN":
                    return Colors.polygonGreen;
                case "WHITE":
                    return Colors.polygonWhite;
                default:
                    return "transparent";
            }
        }
    }
    getPolygonStrokeColor(polygonAfdCode){
        if(polygonAfdCode.afd_code === this.state.selectedPolygon.afdCode && polygonAfdCode.blokname === this.state.selectedPolygon.blockName){
            return Colors.selectedPolygonStroke
        }
        return Colors.defaultPolygonStroke
    }

    //================ RENDER

    renderHeader(PetaPanen){
        //render header pilih afdeling
        function renderAfdeling(PetaPanen){
            return(
                <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", paddingVertical: 10, paddingHorizontal: 25}}>
                    <TouchableOpacity
                        onPress={()=>{PetaPanen.selectDifferentBlock("-")}}
                    >
                        <Image
                            style={{ width: 24, height: 24 }}
                            resizeMode={"contain"}
                            source={imgSrc.arrowLeft}
                        />
                    </TouchableOpacity>
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontSize: 25, fontFamily: Fonts.bold}}>{PetaPanen.state.panenHeader.AFD_NAME}</Text>
                        <Text style={{fontSize: 12, fontFamily: Fonts.bold}}>Panen terakhir tanggal : {PetaPanen.state.panenHeader.TGL_PANEN}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={()=>{PetaPanen.selectDifferentBlock("+")}}
                    >
                        <Image
                            style={{ width: 24, height: 24 }}
                            resizeMode={"contain"}
                            source={imgSrc.arrowRight}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        //render header detail (angka2 di bwh afdeling picker)
        function renderHeaderDetail(PetaPanen){
            return(
                <View style={{flexDirection:"row", margin: 10, height: 125}}>
                    <View style={styles.HeaderCard}>
                        <Text style={{fontFamily: Fonts.medium}}>Produktivitas</Text>
                        <Text style={{fontSize: 26, color:"rgba(60,179,1,1)", fontFamily: Fonts.medium}}>{`${PetaPanen.state.panenHeader.TON_PRODUKTIVITAS}`}</Text>
                        <Text style={{fontSize: 11, color:"rgba(60,179,1,1)", fontFamily: Fonts.medium}}>TON/HK</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <View style={{
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <View style={styles.HeaderCard}>
                                <Text>Luas Panen</Text>
                                <Text style={{color:"rgba(60,179,1,1)", fontFamily: Fonts.medium}}>{`${PetaPanen.state.panenHeader.LUAS_PANEN} HA`}</Text>
                            </View>
                            <View style={styles.HeaderCard}>
                                <Text style={{fontFamily: Fonts.medium}}>Pemanen</Text>
                                <Text style={{color:"rgba(60,179,1,1)", fontFamily: Fonts.medium}}>{`${PetaPanen.state.panenHeader.PEMANEN} HK`}</Text>
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <View style={styles.HeaderCard}>
                                <Text style={{fontFamily: Fonts.medium}}>BBC</Text>
                                <Text style={{color:"rgba(255,179,0,1)", fontFamily: Fonts.medium}}>{`${PetaPanen.state.panenHeader.BBC_LAST} TON`}</Text>
                            </View>
                            <View style={styles.HeaderCard}>
                                <Text style={{fontFamily: Fonts.medium}}>Target</Text>
                                <Text style={{color:"rgba(255,179,0,1)", fontFamily: Fonts.medium}}>{`${PetaPanen.state.panenHeader.TARGET_LAST} TON`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View>
               {renderAfdeling(PetaPanen)}
               {renderHeaderDetail(PetaPanen)}
            </View>
        )
    }

    renderAreaChart(){
        return(
            <View>
                <VictoryChart
                    maxDomain={{y:this.state.chartData.maxValue}}
                    minDomain={{y:-20}}
                    padding={{top: -20}}
                    // width={400}
                    height={175}
                    // animate={{
                    //     duration: 2000,
                    //     onLoad: { duration: 1000 }
                    // }}
                >
                    <Defs>
                        <LinearGradient id="gradientStroke"
                                        x1="0%"
                                        x2="0%"
                                        y1="0%"
                                        y2="100%"
                        >
                            <Stop offset="100%" stopColor="rgba(198,254,170,1)" stopOpacity="0" />
                            <Stop offset="50%" stopColor="rgba(198,254,170,1)" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <VictoryAxis
                        style={{
                            axis: { display: "none" },
                            ticks: { display: "none" },
                            tickLabels: { display: "none" }
                        }}
                    />
                    <VictoryArea
                        style={{
                            data: {
                                fill: "url(#gradientStroke)",
                                stroke: "rgba(105,198,59,1)",
                            },
                            labels: {
                                fontSize: 8
                            }
                        }}
                        data={this.state.chartData.area}
                        // labelComponent={<Text>Y</Text>}
                        labels={({ data, index }) => {
                            if(index != 0 && index != this.state.chartData.area.length-1){
                                if(index == this.state.chartData.area.length-2){
                                    return `${this.state.chartData.dateLabel[index-1]}`;
                                }
                                return `${this.state.chartData.dateLabel[index-1]}\n ${this.state.chartData.area[index].y} Ton`;
                            }
                            return null;
                        } }
                    />
                    <VictoryScatter
                        data={this.state.chartData.scatter}
                        // size={7.5}
                        size={({ datum }) => datum.x === 8 ? 7.5 : 5}
                        style={{
                            data: {
                                fill: ({ datum }) => datum.x === 8 ? "rgba(0,166,81,1)" : "rgba(230,230,230,1)",
                                strokeWidth: 1,
                                stroke: ({ datum }) => datum.x === 8 ? "transparent" : "rgba(192,192,192,1)",
                            }}
                        }
                        // IMPORTANT NOTE : untuk trigger events, harus di bungkus dengan Svg(REACT-NATIVE-SVG)
                        // events={[
                        //     {
                        //         target: 'data',
                        //         eventHandlers: {
                        //             onPress: props => alert('boom'),
                        //         },
                        //     },
                        // ]}
                    />
                </VictoryChart>
                <View style={{
                    position: "absolute",
                    justifySelf: "flex-end",
                    alignItems: "flex-end",
                    right: 10,
                    bottom: 10
                }}>
                    <Text>
                        <Text style={{fontSize: 25, color:"black", fontFamily: Fonts.bold}}>{`${this.state.chartData.chartLastValue} `}</Text>
                        <Text style={{fontSize: 12.5, color:"black"}}>TON</Text>
                    </Text>
                </View>
            </View>
        )
    }

    renderCircleTarget(PetaPanen){
        return(
            <View>
                <Text style={{textAlign:"center", paddingVertical: 10, fontSize: 20, color:Colors.BLACK, fontFamily: Fonts.bold}}>Bulan Ini</Text>
                <View style={{
                    flexDirection: "row"
                }}>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={PetaPanen.state.panenHeader.PERCENT_BBC}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={styles.GaugeHeaderText}>BBC</Text>
                            <Text style={styles.GaugeActualTonText}>{`${PetaPanen.state.panenHeader.BBC_BI} TON`}</Text>
                            <Text style={styles.GaugeTargetTonText}>{`${PetaPanen.state.panenHeader.BBC_TON_LAGI} TON LAGI`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <Svg
                            style={{alignSelf:"center"}}
                            height={125}
                            width={125}>
                            <G>
                                <Circle
                                    cx={125/2}
                                    cy={125/2}
                                    r={(125 - 2 * 15) / 2}
                                    fill={Colors.greenGauge}
                                />
                                <TextSVG
                                    fill="rgba(255,255,255,1)"
                                    stroke="none"
                                    fontWeight="bold"
                                    x="62.5"
                                    y="62.5"
                                    textAnchor="middle">
                                    <TSpan
                                        fontSize="18"
                                        x="62.5"
                                        y="55">
                                        {PetaPanen.state.panenHeader.INTER}
                                    </TSpan>
                                    <TSpan
                                        fontSize='14'
                                        x="62.5"
                                        dy="20">
                                        INTERVAL
                                    </TSpan>
                                </TextSVG>
                            </G>
                        </Svg>
                        <View style={{marginTop: -25, backgroundColor:"white", alignItems:"center"}}>
                            <Text style={{fontSize: 12, color:Colors.greyText}}>AKTUAL</Text>
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontFamily: Fonts.bold}}>{`${PetaPanen.state.panenHeader.AKTUAL_TON} TON`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={PetaPanen.state.panenHeader.PERCENT_TARGET}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={styles.GaugeHeaderText}>TARGET</Text>
                            <Text style={styles.GaugeActualTonText}>{`${PetaPanen.state.panenHeader.TARGET_BI} TON`}</Text>
                            <Text style={styles.GaugeTargetTonText}>{`${PetaPanen.state.panenHeader.TARGET_TON_LAGI} TON LAGI`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderDetails(PetaPanen){
        function headerDetails(PetaPanen){
            return(
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            paddingBottom: 5,
                            color:"rgba(0,0,0,1)",
                            fontFamily: Fonts.bold
                        }}>
                        {`Block ${PetaPanen.state.panenDetail.BLOCK_NAME} / ${PetaPanen.state.panenDetail.BLOCK_CODE}`}
                    </Text>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <View style={{alignItems:'center'}}>
                            <Text>Status</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>{PetaPanen.state.panenDetail.STATUS}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>Luas</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>{PetaPanen.state.panenDetail.LUAS}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>Pokok</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>{PetaPanen.state.panenDetail.POKOK}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>SPH</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>{PetaPanen.state.panenDetail.SPH}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return(
            <View style={{padding: 15}}>
                {headerDetails(PetaPanen)}
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 32, fontFamily: Fonts.bold, color:"rgba(60,179,1,1)"}}>
                        {PetaPanen.state.panenDetail.TON}
                        <Text style={{fontSize: 11, color:"rgba(60,179,1,1)"}}>TON</Text>
                    </Text>
                    <Text style={{paddingLeft: 5}}>Produksi Sampai Hari Ini</Text>
                </View>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 32, fontFamily: Fonts.bold, color:"rgba(60,179,1,1)"}}>
                        {PetaPanen.state.panenDetail.LUASAN_PANEN}
                        <Text style={{fontSize: 11, color:"rgba(60,179,1,1)"}}>HA</Text>
                    </Text>
                    <Text style={{paddingLeft: 5}}>Luasan Panen Sampai Hari Ini</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={PetaPanen.state.panenDetail.PERCENT_BCC}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={styles.GaugeHeaderText}>BBC</Text>
                            <Text style={styles.GaugeActualTonText}>{`${PetaPanen.state.panenDetail.BBC_TON} TON`}</Text>
                            <Text style={styles.GaugeTargetTonText}>{`${PetaPanen.state.panenDetail.BBC_TON_LAGI} TON LAGI`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={PetaPanen.state.panenDetail.PERCENT_TARGET}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={styles.GaugeHeaderText}>TARGET</Text>
                            <Text style={styles.GaugeActualTonText}>{`${PetaPanen.state.panenDetail.TARGET_TON} TON`}</Text>
                            <Text style={styles.GaugeTargetTonText}>{`${PetaPanen.state.panenDetail.TARGET_TON_LAGI} TON LAGI`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Svg
                            style={{alignSelf:"center"}}
                            height={125}
                            width={125}>
                            <G>
                                <Circle
                                    cx={125/2}
                                    cy={125/2}
                                    r={(125 - 2 * 15) / 2}
                                    fill={Colors.orangeTextCircle}
                                />
                                <TextSVG
                                    fill="rgba(255,255,255,1)"
                                    stroke="none"
                                    fontWeight="bold"
                                    x="62.5"
                                    y="62.5"
                                    textAnchor="middle">
                                    <TSpan
                                        fontSize="18"
                                        x="62.5"
                                        y="55">
                                        {PetaPanen.state.panenDetail.INTER}
                                    </TSpan>
                                    <TSpan
                                        fontSize='14'
                                        x="62.5"
                                        dy="20">
                                        INTERVAL
                                    </TSpan>
                                </TextSVG>
                            </G>
                        </Svg>
                    </View>
                    <View style={{flex: 1}}>
                        <Svg
                            style={{alignSelf:"center"}}
                            height={125}
                            width={125}>
                            <G>
                                <Circle
                                    cx={125/2}
                                    cy={125/2}
                                    r={(125 - 2 * 15) / 2}
                                    fill={Colors.orangeTextCircle}
                                />
                                <TextSVG
                                    fill="rgba(255,255,255,1)"
                                    stroke="none"
                                    fontWeight="bold"
                                    x="62.5"
                                    y="62.5"
                                    textAnchor="middle">
                                    <TSpan
                                        fontSize="18"
                                        x="62.5"
                                        y="55">
                                        {PetaPanen.state.panenDetail.ROTASI}
                                    </TSpan>
                                    <TSpan
                                        fontSize='14'
                                        x="62.5"
                                        dy="20">
                                        ROTASI
                                    </TSpan>
                                </TextSVG>
                            </G>
                        </Svg>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ModalLoading
                    visible={this.state.modalLoading.showModal}
                    title={this.state.modalLoading.title}
                    message={this.state.modalLoading.message} />
                <ModalAlert
                    icon={this.state.modalAlert.icon}
                    visible={this.state.modalAlert.showModal}
                    onPressCancel={() => this.setState({ modalAlert: { ...this.state.modalAlert, showModal: false } })}
                    title={this.state.modalAlert.title}
                    message={this.state.modalAlert.message} />
                <HeaderWithButton
                    title={"Peta Panen"}
                    iconLeft={require("../Images/icon/ic_arrow_left.png")}
                    rightVectorIcon={true}
                    iconRight={null}
                    onPressLeft={() => {
                        this.props.navigation.pop()
                    }}
                    onPressRight={null}
                />
                <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor:"white"}}>
                    {this.renderHeader(this)}
                    {this.renderAreaChart()}
                    {this.renderCircleTarget(this)}
                    <View style={{height: 300, marginVertical: 15, backgroundColor:"red"}}>
                        <MapView
                            ref={map => this.map = map}
                            style={{flex: 1}}
                            provider={PROVIDER_GOOGLE}
                            mapType={"satellite"}
                            showsUserLocation={true}
                            initialRegion={this.state.mapData.initialRegion}
                            zoomEnabled={true}
                            scrollEnabled={true}
                            onMapReady={() => {this.onMapReady()}}>
                            {
                                this.state.mapData.polygons.map((polygon, index) => {
                                    return(
                                        <View key={index}>
                                            <Polygon
                                                coordinates={polygon.coords}
                                                fillColor={this.getPolygonFillColor(this.state.mapData.compareWith, polygon.WERKS, polygon.afd_code, polygon.blokname)}
                                                strokeColor= {this.getPolygonStrokeColor(polygon)}
                                                strokeWidth={3}
                                                tappable={true}
                                                onPress={() => {this.getPanenDetail(polygon)}}
                                            />
                                            <Marker
                                                coordinate={polygon.markerPosition}
                                                tracksViewChanges={false}
                                                onPress={() => {this.getPanenDetail(polygon)}}>
                                                <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                                                    <View style={styles.marker}>
                                                        <Text style={{ color: this.getPolygonStrokeColor(polygon), fontSize: 15, fontWeight:'bold'}}>{polygon.blokname}</Text>
                                                    </View>
                                                </View>
                                            </Marker>
                                        </View>
                                    )
                                })
                            }
                        </MapView>
                        <View style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            alignItems:"flex-start",
                            left: 10,
                            top: 10
                        }}>
                            <TouchableOpacity
                                onPress={()=>{
                                    let getPolygon = TaskServices.query("TR_POLYGON", `afd_code = "${this.state.panenDetail.AFD_CODE}" AND blokname = "${this.state.panenDetail.BLOCK_NAME}" `);
                                    this.map.animateToRegion({
                                        latitude: getPolygon[0].coords[0].latitude,
                                        longitude: getPolygon[0].coords[0].longitude,
                                        latitudeDelta: 0.025,
                                        longitudeDelta: 0.025
                                    }, 1);
                                }}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "white",
                                    borderRadius: 15,
                                    padding: 5
                                }}>
                                <VectorIcon
                                    iconSize={25}
                                    iconName={"gps-fixed"}
                                />
                                {/*<Image source={imgSrc.switch} style={{width: 25, height:25, marginLeft: 5}} resizeMode={"contain"} />*/}
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            alignItems:"flex-end",
                            right: 10,
                            top: 10
                        }}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.setState({
                                        mapData: {
                                            ...this.state.mapData,
                                            compareWith: this.state.mapData.compareWith === "target" ? "bbc" : "target"
                                        }
                                    })
                                }}
                                style={{
                                    flexDirection:"row",
                                    backgroundColor:"white",
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 20,
                                    alignItems:"center",
                                    justifyContent:'center'
                                }}>
                                <Text>{this.state.mapData.compareWith === "target" ? "Aktual vs Target" : "Aktual vs BBC"}</Text>
                                <Image source={imgSrc.switch} style={{width: 25, height:25, marginLeft: 5}} resizeMode={"contain"} />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            justifyContent:"flex-end",
                            alignItems:"center",
                            bottom: 10
                        }}>
                            <View style={{
                                flexDirection:"row",
                                backgroundColor:"rgba(230,230,230,1)",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 5
                            }}>
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center",
                                }}>
                                    <View
                                        style={{width: 20, height: 20, borderRadius:10, backgroundColor:Colors.polygonGreen, marginRight: 5}}
                                    />
                                    <Text style={{paddingVertical: 5}}>{`>95%`}</Text>
                                </View>
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    paddingHorizontal: 5
                                }}>
                                    <View
                                        style={{width: 20, height: 20, borderRadius:10, backgroundColor:Colors.polygonYellow, marginRight: 5}}
                                    />
                                    <Text style={{paddingVertical: 5, fontFamily: Fonts.medium}}>{`85% - 95%`}</Text>
                                </View>
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    paddingHorizontal: 5
                                }}>
                                    <View
                                        style={{width: 20, height: 20, borderRadius:10, backgroundColor:Colors.polygonRed, marginRight: 5}}
                                    />
                                    <Text style={{paddingVertical: 5, fontFamily: Fonts.medium}}>{`1% - 75%`}</Text>
                                </View>
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}>
                                    <View
                                        style={{width: 20, height: 20, borderRadius:10, backgroundColor:Colors.polygonWhite, marginRight: 5}}
                                    />
                                    <Text style={{paddingVertical: 5, fontFamily: Fonts.medium}}>{`0%`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {this.renderDetails(this)}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    HeaderCard: {
        flex: 1,
        elevation: 1,
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        margin: 2.5
    },
    GaugeText:{
        color:"rgba(0,0,0,1)",
        fontSize: 20,
        fontFamily: Fonts.bold
    },
    GaugeHeaderText:{
        fontSize: 13,
        color:Colors.greyText,
        fontFamily: Fonts.medium
    },
    GaugeActualTonText:{
        fontSize: 15, color:"rgba(0,0,0,1)",
        fontFamily: Fonts.bold
    },
    GaugeTargetTonText:{
        fontSize: 13,
        color:Colors.redishText,
        fontFamily: Fonts.medium
    }
});
