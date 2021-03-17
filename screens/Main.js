import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Main({navigation}) {
        //FETCH REGION DATA FROM ASYNCSTORAGE
        
        const [warningSafe, showWarningSafe] = useState(false);
        const activity = "";
        const [status, showStatus] = useState(true);
        const [deviceInformation, showDeviceInformation] = useState(false);
        const [locateDevice, showLocateDevice] = useState(true);
        const [warning, showWarning] = useState(false);
        const [loadLatitude, updateLatitude] = useState(-26);;
        const [loadLongitude, updateLongitude] = useState(28);
        const [showMarker, showMarkerOnMap] = useState(false);
        
        const testLock = () =>
            Alert.alert(
                "FindIt",
                "The Device-Pin has been set, do you wish to test the Screen-Lock?",
                [
                    {
                        text: "No",
                        onPress: () =>
                        Alert.alert(
                            "FindIt",
                            "Do you wish to set a new pin?",
                            [
                                {
                                    text: "No",
                                    onPress: () =>
                                    null,
                                    style:"cancel"
                                },
                                {
                                    text: "Yes",
                                    onPress: () =>
                                    navigation.navigate("SetPin")
                                },
                                {cancelable : true}
                            ]
                        ),
                        style:'cancel'
                    },
                    {
                        text: "Yes",
                        onPress: () =>
                            navigation.navigate("LockScreen")
                    }
                ],
                { cancelable: false }
            );
        
        const resetPin = () =>
            Alert.alert(
                "FindIt",
                "Are you sure you want to set a new pin?",
                [
                    {
                        text: "No",
                        onPress: () =>
                        null,
                        style:'cancel'
                    },
                    {
                        text: "Yes",
                        onPress: () =>
                            navigation.navigate("SetPin")
                    }
                ],
                { cancelable: false }
            );
    
    const homeClick =() =>{
        if(AsyncStorage.getItem("devicePin")) {
            testLock()
        }
    }

    const loadLocationFunc=async()=>{
        const loadLocationVar = await AsyncStorage.getItem('locationDetails');
        const loadObjectLocation = JSON.parse(loadLocationVar);
        
        if(loadLocationVar){    
            console.log("Location:")       
            console.log(loadObjectLocation)
        }
    }
    const loadMap=async()=>{
        const newLocation = await AsyncStorage.getItem('locationDetails');
        if(newLocation!=null){
            const newParseLocation = JSON.parse(newLocation);
            let newLatitude = newParseLocation.latitude;
            let newLongitude = newParseLocation.longitude;
            updateLatitude(newLatitude),
            updateLongitude(newLongitude),
            showMarkerOnMap(true);
        }
    }
    const statusWarn = () =>{
        
            if( AsyncStorage.getItem('status')!=null){
                showWarning(true);
                loadLocationFunc()
            }
            else{
                showWarningSafe(true)
            
        }
    }

    useEffect(()=>{
        (async()=>{
            loadLocationFunc()
        })    
    });

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.row1}>
                    {/* HOME BUTTON */}
                    <TouchableOpacity
                        style={styles.homeIconButton}
                        onPress={
                            homeClick
                        }
                    >
                        <Image
                            style={styles.homeIcon}
                            source={require('./imgs/homeIcon.png')}
                        />
                        <Text style={{color:'white', textAlign:'center', fontSize:10,}}>
                            Test Lock
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.finditLogo}>
                        FindIt
                    </Text>
                    <TouchableOpacity
                        style={styles.optionsIconButton}
                    >
                        <Icon
                            style={styles.optionsIcon}
                            name={"ios-lock"}
                            size={54}
                            onPress={
                                resetPin
                            }
                        />
                        <Text style={{color:'white', textAlign:'center', fontSize:10,}}>Set Pin</Text>
                        </TouchableOpacity>
                    
                </View>
                {/* MAP FIELD */}
                <View style={styles.row2}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude:loadLatitude,
                            longitude:loadLongitude,
                            latitudeDelta:0.8,
                            longitudeDelta:0.8
                        }}
                        customMapStyle={mapStyle}
                        rotateEnabled={true}
                    >
                        {showMarker ? <MapView.Marker
                            coordinate={{
                                latitude:loadLatitude,
                                longitude:loadLongitude,
                            }}
                            title={"Last Captured Location"}
                            description={"Location of last unauthorized pin attempt."}
                        />:undefined}
                    </MapView>
                    {status ?
                        <Text style={styles.logs}>
                            LOGS
                            {activity}
                        </Text>:null
                    }
                    {deviceInformation ?
                        <Text style={styles.deviceInfo}>
                            Name : {Device.productName+"\n"}
                            OS Manufacturer : {Device.brand+"\n"}
                            Model :{Device.modelName+"\n"}
                            Manufacturer : {Device.manufacturer+"\n"}
                            Version : {Device.osVersion}
                        </Text> : null
                    }
                    {locateDevice ?<Text style={styles.deviceInfo}>
                            The location of the last unauthorised attempt.
                        </Text> : null
                    }
                    {warning ?
                        <Text style={styles.deviceInfo}>
                            Unauthorized Attempt Detected:{"\n"}
                            Please Navigate to The 'FindIt' folder on your device for further  details.
                        </Text> : undefined
                    }
                    {warningSafe ?
                        <Text style={styles.deviceInfo}>
                            No Recent Activity Detected.
                        </Text> : undefined
                    }

                </View>

                <View style={styles.row3}>
                    {/* DEVICE INFO BUTTON */}
                    <TouchableOpacity 
                        style={styles.deviceInfoIconButton}
                        onPress={()=>
                            showDeviceInformation(true)
                        }
                    >
                        <Text
                            style={styles.deviceInfoIconHead}
                        >
                            Device{"\n"}Info
                        </Text> 
                        <ImageBackground
                            style={styles.deviceInfoIcon}
                            source={require('./imgs/deviceIcon.png')}
                        >
                        </ImageBackground>
                    </TouchableOpacity>
                    {/* LOCATE BUTTON */}
                    <TouchableOpacity
                        style={styles.locateIconButton}
                        onPress={
                            loadMap
                        }
                    >
                        <Text
                            style={styles.locateIconHead}
                        >
                            Last{"\n"}Location
                        </Text>
                        <ImageBackground
                            style={styles.locateIcon}
                            source={require('./imgs/locateIcon.png')}
                        >
                        </ImageBackground>
                    </TouchableOpacity>
                    {/* WARNING ICON */}
                    <TouchableOpacity 
                        style={styles.warnIconButton}
                        onPress={
                            statusWarn
                        }
                    >
                        <Text
                            style={styles.warnIconHead}                                    
                        >
                            Recent{"\n"}Activity
                        </Text>
                        <ImageBackground
                            style={styles.warnIcon}
                            source={require('./imgs/warnIcon.png')}
                        >
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const mapStyle = [{
    elementType:'geometry',
    stylers:[{
        color:'rgb(29,44,77)'
    }]
},
{
    elementType:'labels.text.fill',
    stylers:[{
        color:'rgb(142,195,185)'
    }]
}];

const styles=StyleSheet.create({
    container:{
        marginTop:10,
        height:Dimensions.get('screen').height,
        color:'white',
        backgroundColor:'skyblue'
    },
    row1:{
        flex:1,
        justifyContent:'space-between',
        flexDirection:'row',
        borderBottomColor:'black',
        borderBottomWidth:1,
        backgroundColor:'rgba(37, 45, 63, 0.5)',
    },
    // HOME BUTTON
    homeIconButton:{
        marginTop:15
    },
    //FINDIT LOGO
    finditLogo:{
        color:'white',
        fontSize:70,
        paddingRight:10
    },
    //OPTIONS BUTTON
    optionsIcon:{
        marginTop:15,
        color:'white',
        marginRight:5
    },

    row2:{
        backgroundColor:'rgba(37, 45, 63, 0.5)',
        borderBottomWidth:2,
        borderBottomColor:'skyblue',
        borderColor:'black',
        borderBottomWidth:1,
        paddingBottom:10,
        borderBottomRightRadius:45
    },
    //MAP FIELD
    map:{
        width:Dimensions.get('screen').width,
        height:300,
    },
    //INFO FIELD
    activityInfo:{
        color:'white',
        fontSize:20,
        marginLeft:20,
        marginTop:5,
    },
    deviceInfo:{
        color:'white',
        fontSize:20,
        marginLeft:20,
        marginTop:5,
    },
    logs:{
        fontSize:10,
        color:'white',
        marginLeft:20,
        fontWeight:'bold'

    },

    row3:{
        flex:1,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        fontFamily:'Serif',
        borderTopWidth:1,
        borderTopColor:'black',
        marginTop:2,
        marginHorizontal:5,
        paddingBottom:5,
    },
    //ROW-3 ICON HEADINGS
    deviceInfoIconHead:{
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:20,
        marginVertical:3
    },
    locateIconHead:{
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:20,
        marginVertical:3
    },
    warnIconHead:{
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:20,
        marginVertical:3
    },
    //ROW-3 ICON BUTTONS
    deviceInfoIconButton:{
        borderRadius:20,
        marginTop:7,
        backgroundColor:'rgba(37, 45, 63, 0.2)',
        borderWidth:1,
        borderColor:'black',
        alignItems:'center',
        width:100
    },
    locateIconButton:{
        borderRadius:20,
        marginTop:7,
        backgroundColor:'rgba(37, 45, 63, 0.2)',
        borderWidth:1,
        borderColor:'black',
        alignItems:'center',
        width:100
    },
    warnIconButton:{
        borderRadius:20,
        marginTop:7,
        backgroundColor:'rgba(37, 45, 63, 0.2)',
        borderWidth:1,
        borderColor:'black',
        alignItems:'center',
        width:100
    },
    //ROW-3 ICONS
    deviceInfoIcon:{
        marginBottom:10,
        width:70,
        height:70
    },
    locateIcon:{
        marginBottom:10,
        width:70,
        height:70
    },
    warnIcon:{
        marginBottom:10,
        width:70,
        height:70
    },
})
