import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction, deleteTransaction, editTransaction } from './transactionAction'
import { ScrollView } from 'react-native-gesture-handler';

function Home({ route }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const transactions = useSelector(state => state.transactions);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const accountBalance = income - expenses;
    const [containerHeight, setContainerHeight] = useState(null);
    console.log(transactions);
    useFocusEffect(() => {
        if (route.params?.transaction) {
            const { amount, isExpense, category, date, id } = route.params.transaction;
    
            if (route.params.transaction.isEdit) {
                dispatch(editTransaction(route.params.transaction));
            } else {
                const existingTransaction = transactions.find((t) => t.id === id);
                if (!existingTransaction) {
                    dispatch(addTransaction(route.params.transaction));
                }
            }
            navigation.setParams({ transaction: null });
        }
    }, [route.params?.transaction]);
    useEffect(() => {
        const totalIncome = transactions
            .filter(transaction => !transaction.isExpense)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    
        const totalExpenses = transactions
            .filter(transaction => transaction.isExpense)
            .reduce((sum, transaction) => sum + transaction.amount, 0);
            setIncome(totalIncome);
            setExpenses(totalExpenses);
         }, [transactions]);
    
    
    const handleDeleteTransaction = (id) => {
        dispatch(deleteTransaction(id));
    };

    const handleEditTransaction = (transaction) => {
        navigation.navigate('AddEntry', { transaction });
    };

    return (
        <ImageBackground source={require('../../assets/images/AppBg.png')} style={styles.background}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.balanceText}>Account Balance</Text>
                    <Text style={styles.balanceAmount}>₹ {accountBalance}</Text>
        <View style={[styles.incomeContainer, { height: containerHeight }]}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                if (!containerHeight) {
                                    setContainerHeight(height);
                                }
                            }}
                        >
                            <Text style={styles.incomeExpenseText}>Income</Text>
                            <Text style={styles.amountText}>₹{income}</Text>
                        </View>
                        <View style={[styles.expenseContainer, { height: containerHeight }]}>
                            <Text style={styles.incomeExpenseText}>Expenses</Text>
                            <Text style={styles.amountText}>₹{expenses}</Text>
                        </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 22, marginTop: 20, marginRight: 180 }}>Recent Transaction</Text>
                    <TouchableOpacity
                        style={{ borderColor: 'black', width: 70, height: 35, justifyContent: 'center', padding: 8, borderRadius: 10, marginLeft: 300, marginTop: -30, backgroundColor: '#EEE5FE' }}
                        onPress={() => navigation.navigate('Transaction')}
                    >
                        <Text>See All</Text>
                    </TouchableOpacity>
                    <View>
                        {transactions.slice(-5).reverse().map(item => (
                            <View key={item.id} style = {styles.trasactionList}>
                              <View style={styles.transactionDetails}>

                                <Icon 
                                    name={item.isExpense ? "arrow-down-circle" : "arrow-up-circle"} 
                                    size={50} 
                                    color={item.isExpense ? "red" : "green"} 
                                    style={styles.icon}
                                />
                                <View>
                                <Text style={{ color: item.isExpense ? 'red' : 'green', fontSize: 18 }}>
                                {item.category} on {new Date(item.date).toLocaleDateString('en-IN')}      <Text style = {{fontWeight:'bold'}}>{item.isExpense ? '-' : '+'}  ₹ {item.amount} </Text> 
                                </Text>
                                <Text>{new Date(item.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} </Text>
                                <Text style={{ marginStart: 60, fontSize: 15 }}>{item.description}</Text>
                                <View style={styles.transactionContainer}>
                                    <TouchableOpacity style={styles.EditButtonContainer} onPress={() => handleEditTransaction(item)}>
                                        <Text style={styles.editText}>Edit</Text>
                                    </TouchableOpacity> 
                                    <TouchableOpacity style={styles.DeleteButtonContainer} onPress={() => handleDeleteTransaction(item.id)}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                                </View>
                            </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEntry')}>
                <Icon name="add-circle-outline" size={60} color="green" />
            </TouchableOpacity>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'top',
    padding: 5,
    borderWidth:0,   
  },

  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    flex : 1,
    justifyContent:'flex-end',
    position:'relative'
},

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
},

  pickerContainer: {
  borderWidth: 1, 
  borderColor: '#ccc', 
  borderRadius: 25, 
  overflow: 'hidden', 
  width: 150,
  height: 40,
  justifyContent: 'center', 
},

  picker: {
    height: 20,
    width: 150,
    backgroundColor:'#FFF6E5',
},

  monthText: {
  marginTop: 10,
  fontSize: 18,   
},

  balanceText: {
  marginTop: 20, 
  fontSize: 18,
  fontWeight: 'bold',
  color: '#4CAF50', 
  alignSelf:'center',
},

  balanceAmount :{
   fontSize: 55,
   fontWeight: 'bold',
   color: 'black', 
   marginBottom: 10,
   marginLeft : -7,
},

  incomeContainer :{
   width: 164,
   backgroundColor: 'green',
   borderRadius: 20,
   justifyContent: 'center',
   paddingLeft:40,
   marginLeft: -200,
   marginTop: 10,
},
  expenseContainer :{
    width: 164,
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft:40,
    marginRight: -200,
    marginTop: -60,

  },
  incomeExpenseText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
},

amountText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
},

  addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: 'transparent',
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF6E5',
    borderRadius: 5,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'grey',
  
},
trasactionList: {
    borderColor: 'grey',
    borderRadius: 25,
    borderWidth: 1,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#FFF6E5',
    width : 390
},
DeleteButtonContainer: {
    height: 30,
    width: 80,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#F8D7DA',  
    justifyContent: 'center',
    alignItems: 'center',
},
EditButtonContainer: {
    height: 30,
    width: 80,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#D1E7DD',  
    justifyContent: 'center',
    alignItems: 'center',
},
editText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
},
deleteText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
}, 

icon: {
  marginRight: 10,
},

transactionDetails: {
  flexDirection: 'row',
  alignItems: 'center',
},
});

export default Home
