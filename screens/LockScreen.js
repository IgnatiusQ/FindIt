import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StatusBar, BackHandler } from 'react-native';
import ReactNativePinView from "react-native-pin-view";
import Icon from "react-native-vector-icons/Ionicons";
import 'react-native-gesture-handler';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function LockScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(true);
  const [cameraRef, setCameraRef] = useState(null);
  const pinView = useRef(null)
  const [showRemoveButton, setShowRemoveButton] = useState(false)
  const [enteredPin, setEnteredPin] = useState("")
  const [showCompletedButton, setShowCompletedButton] = useState(false)
  const [incorrectPin, incorrectPinMessage] = useState(false);

  
  //START CAMERA
  useEffect((props) => {
    (async () => {
      BackHandler.addEventListener('hardwareBackPress', ()=>{
        return true
      });
      BackHandler.removeEventListener('hardwareBackPress', ()=>{
        return true
      });
      //CAMERA PERMISSION
      const rollPermission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (rollPermission.status !== 'granted') {
         await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
      const { status } = await Camera.requestPermissionsAsync();
      //LOCATION PERMISSION
      let { LocationStatus } = await Permissions.askAsync(Permissions.LOCATION);
      setHasPermission(LocationStatus === 'granted')
      //VALIDATE PERMISION
      setHasPermission(status === 'granted');
      //RETRIEVE LOCATION
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      let region={
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        latitudeDelta:0.5,
        longitudeDelta:0.5
      };
      //USING ASYNC STORAGE
      //SAVE
      const save = async() => {
        try{
          await AsyncStorage.setItem("locationDetails", JSON.stringify(region));
        } catch(e){
          console.error(e.message);
        }
      }
      //LOAD
      const load = async() => {
        try{
          let jsonDetails = await AsyncStorage.getItem("locationDetails",(jsonDetails));
          if(jsonDetails!=null){
            console.log(JSON.parse(jsonDetails));
          }
        } catch(e){
          console.error(e.message);
        }
      }
      //CALLING SAVE() & LOAD()
      save();
      load();
      
    })();
  }, []);


  //BUTTON CONTROLS 
  useEffect(() => {
      if (enteredPin.length > 0) {
      setShowRemoveButton(true)
      incorrectPinMessage(false)
      } else {
        setShowRemoveButton(false)
      }
      if (enteredPin.length === 6) {
        setShowCompletedButton(true)
      } else {
        setShowCompletedButton(false)
      }
  }, [enteredPin])
  
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  //INCORRECT PIN TEXT

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        hidden={true}
      />
      {/* LOAD CAMERA */}
      <Camera style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        ref={ref => {
          setCameraRef(ref);
        }}
      >
      <>
      <StatusBar barStyle="light-content" />
      <View
        style={{ flex:2, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
      >
        <Text
          style={{
            paddingTop: 24,
            paddingBottom: 30,
            color: "rgba(255,255,255,0.7)",
            fontSize: 48,
          }}
        >
          Enter Pin
        </Text>
        {incorrectPin ? <Text
          style={{
            color:'rgba(255,255,255,0.4)',
            fontSize:15
          }}
        >
          INCORRECT PIN
        </Text>:null}
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
        //TAKE PICTURE(BACKGROUND)  
        onPress={async()=>{
          let pin = await AsyncStorage.getItem("devicePin");
            if(cameraRef && pin!==enteredPin){
              let source = await cameraRef.takePictureAsync()
              //STORE PICTURE URI AND DATE TO ASYNCSTORAGE
              let status = "logged";
              let pictureUri = source.uri;
              let pictureStringName = pictureUri.toString().substr(136)
              await AsyncStorage.setItem('pictureName', pictureStringName).then(()=>{
                console.log('Picture uri stored to Asyncstorage')
              })
              await AsyncStorage.setItem('status', status).then(()=>{
                console.log('Application status logged');
              })
              const datetime = new Date();
              console.log(datetime);
              //STORE PICTURE TO DEVICE STORAGE
              const image = await MediaLibrary.createAssetAsync(source.uri)
              MediaLibrary.createAlbumAsync('FindIt', image).then(()=>{
                console.log("Picture stored to device storage");
              }).catch(err=>{
                console.log('an error', err);
              })
              
              // loadPicture();
              pinView.current.clearAll();
            }
            //NAVIGATE TO MAIN
            if(cameraRef && pin===enteredPin){
              navigation.navigate("Main");
              BackHandler.exitApp();
            }
            if(cameraRef && pin!==enteredPin){
              incorrectPinMessage(true)
            }
          }}
          /> : undefined}
      />
      </View>
      </>
      </Camera>
    </View>
  )
}
