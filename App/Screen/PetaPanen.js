import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, { Marker, Polygon, ProviderPropType, PROVIDER_GOOGLE } from 'react-native-maps';
import {VictoryArea, VictoryAxis, VictoryChart, VictoryScatter} from "victory-native";
import Svg, {G, Circle, Text as TextSVG, TSpan} from "react-native-svg";

import {HeaderWithButton} from "../Component/Header/HeaderWithButton";
import GaugeChart from '../Component/SVG/GaugeBar';
import Colors from "../Constant/Colors";
import imgSrc from "../Images/Module/PetaPanen";

import TaskServices from "../Database/TaskServices";

export default class Leaderboard extends Component {
    constructor(props) {
        super(props);
        let currentUser = TaskServices.getAllData('TR_LOGIN')[0];
        this.state = {
            currentUser: currentUser,
            listBlock: [],
            mapData:{
                selectedBlock: null,
                initialRegion: {
                    latitude: -2.1890660,
                    longitude: 111.3609873,
                    latitudeDelta: 0.0075,
                    longitudeDelta: 0.00721
                },
                polygons:[]
            },
            chartData:{
                area:[
                    { x: 1, y: 5, y0: 0 },
                    { x: 2, y: 2, y0: 0 },
                    { x: 3, y: 3, y0: 0 },
                    { x: 4, y: 5, y0: 0 },
                    { x: 5, y: 8, y0: 0 },
                    { x: 6, y: 4, y0: 0 }
                ],
                scatter:[
                    { x: 2, y: 2, y0: 0 },
                    { x: 3, y: 3, y0: 0 },
                    { x: 4, y: 5, y0: 0 },
                    { x: 5, y: 8, y0: 0 },
                ]
            }
        }
    }

    async componentDidMount(){
        await this.getAvailableBlock();
    }

    onMapReady(){
        this.getCoordinate(this.state.listBlock[0]);
    }

    async getAvailableBlock(){
        let listUserLocation = this.state.currentUser.LOCATION_CODE.split(",");
        alert(JSON.stringify(listUserLocation));
        let locationArray = [];
        await Promise.all(
            listUserLocation.map((location)=>{
                locationArray.push({
                    WERKS: location.slice(0,4),
                    AFD_CODE: location.slice(4)
                })
            })
        );

        this.setState({
            listBlock: locationArray
        });
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
            // let polygons = TaskServices.findBy('TR_POLYGON', 'WERKS', currentUser.CURR_WERKS);
            let polygons = TaskServices.query('TR_POLYGON', `WERKS = "${werksAfdLocation.WERKS}" AND afd_code = "${werksAfdLocation.AFD_CODE}"`);
            // let polygonsTempArray = Array.from(polygons);
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
            });
        }
        else {
            alert("belum pilih lokasi");
            // belum pilih lokasi
            // this.setState({
            //     modalLoading: {...this.state.modalLoading, showModal: false},
            //     modalAlert: {...AlertContent.no_location}
            // })
        }

        return null;
    }

    //================ RENDER

    renderHeader(){
        function renderAfdeling(){
            return(
                <View style={{flexDirection: "row", justifyContent:"space-between", alignItems:"center", paddingVertical: 10, paddingHorizontal: 25}}>
                    <TouchableOpacity>
                        <Image
                            style={{ width: 24, height: 24 }}
                            resizeMode={"contain"}
                            source={imgSrc.arrowLeft}
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>Afdeling - A</Text>
                    <TouchableOpacity>
                        <Image
                            style={{ width: 24, height: 24 }}
                            resizeMode={"contain"}
                            source={imgSrc.arrowRight}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        function renderHeaderDetail(){
            return(
                <View style={{flexDirection:"row", margin: 10, height: 125}}>
                    <View style={styles.HeaderCard}>
                        <Text>
                            <Text style={{fontSize: 26, color:"rgba(60,179,1,1)"}}>{`1.31`}</Text>
                            <Text style={{fontSize: 11, color:"rgba(60,179,1,1)"}}>TON</Text>
                        </Text>
                        <Text>Produktivitas</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <View style={{
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <View style={styles.HeaderCard}>
                                <Text>Luas Panen</Text>
                                <Text style={{color:"rgba(60,179,1,1)"}}>100.32 HA</Text>
                            </View>
                            <View style={styles.HeaderCard}>
                                <Text>Pemanen</Text>
                                <Text style={{color:"rgba(60,179,1,1)"}}>100.32 HA</Text>
                            </View>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <View style={styles.HeaderCard}>
                                <Text>BBC</Text>
                                <Text style={{color:"rgba(255,179,0,1)"}}>100.32 HA</Text>
                            </View>
                            <View style={styles.HeaderCard}>
                                <Text>Target</Text>
                                <Text style={{color:"rgba(255,179,0,1)"}}>100.32 HA</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View>
               {renderAfdeling()}
               {renderHeaderDetail()}
            </View>
        )
    }

    renderAreaChart(){
        return(
            <VictoryChart
                maxDomain={{y:10}}
                minDomain={{y:1}}
                padding={{top: 20}}
                // width={400}
                height={200}
                style={{ display: "block" }}
                // animate={{
                //     duration: 2000,
                //     onLoad: { duration: 1000 }
                // }}
            >
                <VictoryAxis
                    style={{
                        axis: { display: "none" },
                        ticks: { display: "none" },
                        tickLabels: { display: "none" }
                    }}
                />
                <VictoryArea
                    style={{ data: { fill: "rgba(255,255,0,1)" } }}
                    data={this.state.chartData.area}
                    // labelComponent={<Text>Y</Text>}
                    labels={({ data, index }) => {
                        return (index == 0) || (index == this.state.chartData.area.length-1) ? null : data[index].y
                    } }
                />
                <VictoryScatter
                    data={this.state.chartData.scatter}
                    size={7.5}
                    style={{ data: { fill: "#c43a31" } }}
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
        )
    }

    renderCircleTarget(){
        return(
            <View>
                <Text style={{textAlign:"center", paddingVertical: 10, fontSize: 20, color:Colors.BLACK, fontWeight:"bold"}}>Sampai Hari Ini</Text>
                <View style={{
                    flexDirection: "row"
                }}>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={100}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={{fontSize: 12, color:Colors.greyText}}>TARGET</Text>
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontWeight:"bold"}}>{`${462} TON`}</Text>
                            <Text style={{fontSize: 12, color:Colors.redishText}}>{`${206} TON LAGI`}</Text>
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
                                        7
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
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontWeight:"bold"}}>{`${462} TON`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={100}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={{fontSize: 12, color:Colors.greyText}}>TARGET</Text>
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontWeight:"bold"}}>{`${462} TON`}</Text>
                            <Text style={{fontSize: 12, color:Colors.redishText}}>{`${206} TON LAGI`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderDetails(){
        function headerDetails(){
            return(
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            color:"rgba(0,0,0,1)",
                            fontWeight: "bold"
                        }}
                    >
                        Blok E38
                    </Text>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <View style={{alignItems:'center'}}>
                            <Text>Status</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>${"TM-6"}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>Status</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>${"TM-6"}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>Status</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>${"TM-6"}</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text>Status</Text>
                            <Text style={{color:"rgba(60,179,1,1)"}}>${"TM-6"}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return(
            <View style={{padding: 15}}>
                {headerDetails()}
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 32, fontWeight:"bold", color:"rgba(60,179,1,1)"}}>1.31 <Text style={{fontSize: 11, color:"rgba(60,179,1,1)"}}>TON</Text></Text>
                    <Text>Hasil Produksi Sampai Hari Ini</Text>
                </View>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 32, fontWeight:"bold", color:"rgba(60,179,1,1)"}}>1.31 <Text style={{fontSize: 11, color:"rgba(60,179,1,1)"}}>HA</Text></Text>
                    <Text>Luasan Panen Sampai Hari Ini</Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={100}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={{fontSize: 12, color:Colors.greyText}}>TARGET</Text>
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontWeight:"bold"}}>{`${462} TON`}</Text>
                            <Text style={{fontSize: 12, color:Colors.redishText}}>{`${206} TON LAGI`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems:'center'}}>
                        <GaugeChart
                            textStyle={styles.GaugeText}
                            size={125}
                            currentValue={100}
                            progressColor={Colors.greenGauge}
                            dialColor={"rgba(221,221,221,1)"}
                            progressRoundedEdge
                        />
                        <View style={{alignItems:'center', justifyContent:'center', marginTop: -25}}>
                            <Text style={{fontSize: 12, color:Colors.greyText}}>TARGET</Text>
                            <Text style={{fontSize: 14, color:"rgba(0,0,0,1)", fontWeight:"bold"}}>{`462 TON`}</Text>
                            <Text style={{fontSize: 12, color:Colors.redishText}}>{`${206} TON LAGI`}</Text>
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
                                        7
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
                                        7
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
                    {this.renderHeader()}
                    {this.renderAreaChart()}
                    {this.renderCircleTarget()}
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
                                                fillColor="rgba(0, 200, 0, 0.5)"
                                                strokeColor="rgba(255,255,255,1)"
                                                strokeWidth={3}
                                                tappable={true}
                                                onPress={() => alert("Ha")}
                                            />
                                            <Marker
                                                coordinate={polygon.markerPosition}
                                                tracksViewChanges={false}
                                                onPress={() => alert("Ha")}>
                                                <View style={{ flexDirection: 'column', alignSelf: 'flex-start' }}>
                                                    <View style={styles.marker}>
                                                        <Text style={{ color: 'rgba(255,255,255,1)', fontSize: 25, fontWeight:'900'}}>{polygon.blokname}</Text>
                                                    </View>
                                                </View>
                                            </Marker>
                                        </View>
                                    )
                                })
                            }
                        </MapView>
                    </View>
                    {this.renderDetails()}
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
        fontWeight: "bold"
    }
});
