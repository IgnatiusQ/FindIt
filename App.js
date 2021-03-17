import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './screens/Main';
import LockScreen from './screens/LockScreen';
import SetPin from './screens/SetPin';
import ReEnterPin from './screens/ReEnterPin';
import Test from './screens/Test';
import { StatusBar } from 'expo-status-bar';

const Stack=createStackNavigator();

function App(){
  useEffect(()=>{
    console.log("App running")
  })
    return(
      <View style={{flex:1, height:Dimensions.get('screen').height}}>
        <StatusBar
          backgroundColor='skyblue'
          translucent={true}
          animated={true}
        />
        <NavigationContainer style={styles.container}>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="LockScreen" component={LockScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
            <Stack.Screen name="SetPin" component={SetPin} options={{headerShown:false}}/>
            <Stack.Screen name="ReEnterPin" component={ReEnterPin} options={{headerShown:false}}/>
            <Stack.Screen name="Test" component={Test} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>

    )
}
export default App;

const styles=StyleSheet.create({
  container:{
    backgroundColor:'rgb(211,211,211)',
    marginHorizontal:5,
    marginTop:20,
  },
})