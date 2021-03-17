import { Title } from 'native-base'
import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import * as SMS from 'expo-sms';
import sms from 'react-native-sms-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Test(){
    const sendSMS=async()=>{
        await AsyncStorage.removeItem('locationDetails');
        await AsyncStorage.removeItem('status');
    }

    return (
        <View>
            <Button
                title="SMS"
                onPress={
                    sendSMS
                }
            />
        </View>
    )
}

//EXPO SMS MODULE ALREADY INSTALLED, GO TO "https://docs.expo.io/versions/latest/sdk/sms/" TO CONTINUE SETTING UP
