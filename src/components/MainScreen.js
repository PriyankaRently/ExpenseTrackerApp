import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home';
import Transaction from './Transaction';
import TransactionGraph from './TransactionGraph';
import Icon from 'react-native-vector-icons/Ionicons'
import AddEntry from './AddEntry';


function MainScreen() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator 
         screenOption = {{
          tabBarActiveTintColor : "#0163d2",
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: {
            fontSize :14,
            paddingBottom : 5,
            fontWeight : 600,
          }
         }}>
          <Tab.Screen name='Home' component={Home} 
          options = {{
            tabBarIcon: ({focused}) => 
            (<Icon name  = 'home' size = {28}  color = {focused ? '#0163d2' :'black' } /> ),
            headerShown: false,
          }}
          
          />
          <Tab.Screen name='Transaction' component={Transaction}
          options={{
            tabBarIcon : ({focused}) =>
            (<Icon name = 'book' size = {28} color  = {focused?'#0163d2' :'black'} />)
            }} />
            <Tab.Screen name='Analysis' component={TransactionGraph}
          options={{
            tabBarIcon : ({focused}) =>
            (<Icon name = 'analytics' size = {28} color  = {focused?'#0163d2' :'black'} />)
            }} />
        </Tab.Navigator>
    )
  }
  

export default MainScreen
