import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import AddEntry from './src/components/AddEntry';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './src/components/Home';
import Transaction from './src/components/Transaction';
import Icon from 'react-native-vector-icons/Ionicons'
import MainScreen from './src/components/MainScreen';
import { TransactionContext, TransactionProvider } from './src/components/TransactionContext';
import store from './src/components/store';
import SpendFrequencyGraph from './src/components/TransactionGraph';
import { Provider } from 'react-redux';
function App() {
  const stack = createStackNavigator();
  console.log("1");
  return (
    <Provider store={store}>
  <NavigationContainer>
        <stack.Navigator>
      <stack.Screen name='Main' component={MainScreen}
       options = {{
        headerShown: false,
       }}
      />        
      <stack.Screen name= 'AddEntry' component={AddEntry}></stack.Screen>
      </stack.Navigator>

  </NavigationContainer>
  </Provider>
  )
}

export default App
