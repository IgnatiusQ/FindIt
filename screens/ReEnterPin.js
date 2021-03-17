import React, { useEffect, useRef, useState } from "react"
import { ImageBackground, Alert, Text, View, BackHandler, Dimensions } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativePinView from "react-native-pin-view"
import Icon from "react-native-vector-icons/Ionicons"
import 'react-native-gesture-handler'


export default function ReEnterPin({navigation}){
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)
    //SUCCESSFULL PIN ALERT
    const successfullPinAlert = () =>
        Alert.alert(
            "FindIt",
            "Your device pin has been successfully set to: "+enteredPin+"\n"+"The screen-lock will function when the device screen locks. Tap the 'Home' to test it.",
            [
                {
                    text: "Cancel",
                    onPress: () =>  
                    async()=>{
                        try{
                            await AsyncStorage.removeItem("newPin");
                            await AsyncStorage.removeItem("devicePin");
                            navigation.navigate("SetPin")
                        } catch(err){
                            console.message(err.message);
                        }
                    }
                },
                {
                    text: "OK",
                    onPress: ()=>
                    navigation.navigate("Main")
                }
            ],
            { cancelable: false }
    );
    //FAILED PIN ALERT
    const failPinAlert = () =>
        Alert.alert(
            "FindIt",
            "The entered pin-codes do not match",
            [
                {
                    text: "Cancel",
                    onPress: () =>
                    async()=>{
                        try{
                            await AsyncStorage.removeItem("newPin");
                            await AsyncStorage.removeItem("devicePin");
                            navigation.navigate("SetPin");
                        } catch(err){
                            console.message(err.message);
                        }
                    },
                },
                {
                    text: "Retry",
                    onPress: () =>
                        async()=>{
                            await AsyncStorage.removeItem("newPin");
                        },
                        style:'cancel'
                    
                }
            ],
            { cancelable: false }
    );

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', ()=>{
            return true
        });
            BackHandler.removeEventListener('hardwareBackPress', ()=>{
            return true
        });

        if (enteredPin.length > 0) {
        setShowRemoveButton(true)
        } else {
            setShowRemoveButton(false)
        }
        if (enteredPin.length === 6) {
            setShowCompletedButton(true)
        } else {
        setShowCompletedButton(false)
        }
    }, [enteredPin])

    return (
        <>
            <View style={{
                marginTop:15,
                justifyContent:'space-around',
                borderBottomColor:'black',
                borderBottomWidth:1,
                backgroundColor:'rgba(37, 45, 63, 8)',
            }}>
                    {/* LOGO */}
                    <Text style={{
                        textAlign:'center',
                        color:'white',
                        fontSize:70,
                        paddingRight:10
                    }}>
                        FindIt
                    </Text>
                </View>
            <View
                style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            ></View>
            <View
                style={{ backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
            >   
                <ImageBackground
                    source={require('./imgs/findItLogo.jpg')}
                    style={{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height,}}
                >
                <Text
                    style={{
                        textAlign:'center',
                        paddingTop: 5,
                        paddingBottom: 48,
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 48,
                    }}
                >
                    Set Pin
                </Text>
                <Text
                    style={{
                        textAlign:'center',
                        paddingTop: 10,
                        paddingBottom: 8,
                        color: "rgba(255,255,255,0.3)"
                    }}
                >
                    RE-ENTER PIN
                </Text>
                <ReactNativePinView
                    inputSize={22}
                    ref={pinView}
                    pinLength={6}
                    buttonSize={60}
                    onValueChange={value => setEnteredPin(value)}
                    buttonAreaStyle={{
                        marginTop: 24,
                    }}
                    inputAreaStyle={{
                        marginBottom: 24,
                    }}
                    inputViewEmptyStyle={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: "#FFF",
                    }}
                    inputViewFilledStyle={{
                        backgroundColor: "#FFF",
                    }}
                    buttonViewStyle={{
                        borderWidth: 1,
                        borderColor: "#FFF",
                    }}
                    buttonTextStyle={{
                        color: "#FFF",
                    }}
                    onButtonPress={key => {
                        if (key === "custom_left") {
                            pinView.current.clear()
                        }
                        if (key === "custom_right") {
                            null
                            }   
                        }
                    }
                    customLeftButton={showRemoveButton ? <Icon name={"ios-backspace"} size={40} color={"#FFF"} /> : undefined}
                    customRightButton={showCompletedButton ? <Icon name={"ios-checkmark-circle"} size={40} color={"#FFF"} 
                    onPress={
                        async()=>{
                        //LOAD ASYNCSTORAGE STORED NEW PIN
                        const loadNewPin = async()=>{
                            try{
                            let savedPin = await AsyncStorage.getItem("newPin");
                            //COMPARE PIN
                                if(enteredPin===savedPin){
                                    //SAVE OFFICIAL PIN
                                    const savePin = async() => {
                                        try{
                                            await AsyncStorage.removeItem("devicePin");
                                            await AsyncStorage.setItem("devicePin", enteredPin);
                                        } catch(e){
                                            console.error(e.message);
                                        }
                                    }
                                    savePin();
                                    successfullPinAlert();
                                }
                                if(enteredPin!==savedPin){
                                    failPinAlert();
                                    pinView.current.clearAll();
                                }
                            } catch(e){
                                console.error(e.message);
                            }
                        }
                        loadNewPin();
                        
                    }}
                    /> : undefined}
                />
                </ImageBackground>
            </View>
        </>
    )
}