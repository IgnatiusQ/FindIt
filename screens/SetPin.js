import React, { useEffect, useRef, useState } from "react"
import { ImageBackground, Text, View, BackHandler, Dimensions } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativePinView from "react-native-pin-view"
import Icon from "react-native-vector-icons/Ionicons"
import 'react-native-gesture-handler'


export default function SetPin({navigation}){
    const pinView = useRef(null)
    const [showRemoveButton, setShowRemoveButton] = useState(false)
    const [enteredPin, setEnteredPin] = useState("")
    const [showCompletedButton, setShowCompletedButton] = useState(false)

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
            >
                <ImageBackground
                    source={require('./imgs/findItLogo.jpg')}
                    style={{
                        width:Dimensions.get('screen').width,
                        height:Dimensions.get('screen').height,
                    }}
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
                        ENTER NEW PIN
                    </Text>
                    <ReactNativePinView
                        inputSize={22}
                        ref={pinView}
                        pinLength={6}
                        buttonSize={60}
                        onValueChange={value => setEnteredPin(value)}
                        buttonAreaStyle={{
                            marginTop: 14,
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
                        customLeftButton={showRemoveButton ? <Icon name={"ios-backspace"} size={36} color={"#FFF"} /> : undefined}
                        customRightButton={showCompletedButton ? <Icon name={"ios-unlock"} size={36} color={"#FFF"} 
                        onPress={
                            async()=>{
                            const saveNewPin = async() => {
                                try{
                                    let savePin = await AsyncStorage.setItem("newPin", enteredPin);
                                    navigation.navigate('ReEnterPin');
                                } catch(e){
                                    console.error(e.message);
                                }
                            }
                            const loadNewPin = async()=>{
                                try{
                                let savedPin = await AsyncStorage.getItem("newPin");
                                    console.log(savedPin);
                                } catch(e){
                                    console.error(e.message);
                                }
                            }
                            saveNewPin();
                            loadNewPin();
                            
                        }}
                        /> : undefined}
                    />
                </ImageBackground>
            </View>
        </>
    )
}