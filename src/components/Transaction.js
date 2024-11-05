import React, { useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import CalendarView from './Calendar';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction } from './transactionAction';

function Transaction() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!startDate || !endDate) return true; 
    const transactionDate = new Date(transaction.date);
    return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
  });

  const handleEditTransaction = (transaction) => {
    navigation.navigate('AddEntry', { transaction });
  };

  const handleDeleteTransaction = (id) => {
    dispatch(deleteTransaction(id));
  };

  return (
    <ScrollView style={{ backgroundColor: '#33691E' }}>
      <View style={styles.container}>
        <CalendarView onDateSelect={handleDateSelect} />
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <View style={styles.transactionDetails}>
                <Icon
                  name={item.isExpense ? "arrow-down-circle" : "arrow-up-circle"}
                  size={50}
                  color={item.isExpense ? "#FF6B6B" : "#4CAF50"}
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.categoryText}>
                    {item.category} <Text style={styles.amountText}> {item.isExpense ? ' - ' : ' + '}₹{item.amount}</Text></Text>
                  <Text style={styles.dateText}> {new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(item.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} </Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditTransaction(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 5,
    
  },
  calendarView: {
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    margin:5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    
  },
  icon: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dateText: {
    color: '#757575',
    fontSize: 14,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 6,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  deleteText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
});

export default Transaction;
