import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from './transactionAction';

function AddEntry({ route, navigation }) {
  const dispatch = useDispatch();
  const [isExpense, setIsExpense] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [categories, setCategories] = useState(['Food', 'Rent', 'Utilities', 'Add Category']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');

  const { transaction } = route.params || {}; // Safely accessing transaction

  useEffect(() => {
    if (transaction) {
      setIsExpense(transaction.isExpense ?? true); // Use default if undefined
      setSelectedCategory(transaction.category ?? 'Food'); // Default category
      setAmount(transaction.amount?.toString() ?? ''); // Safely convert to string
      setSelectedDescription(transaction.description ?? ''); // Default to empty string
      setSelectedDate(new Date(transaction.date ?? Date.now())); // Default to now
    }
  }, [transaction]);

  const toggleEntryType = (type) => {
    setIsExpense(type === 'expense');
  };

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory('');
      setIsAddingCategory(false);
      Keyboard.dismiss();
    }
  };

  const handleCategoryChange = (itemValue) => {
    if (itemValue === 'Add Category') {
      setIsAddingCategory(true);
    } else {
      setSelectedCategory(itemValue);
      setIsAddingCategory(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleAddTransaction = () => {
    if (!amount.trim()) {
      alert('Please enter an amount');
      return;
    }
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    const transactionData = {
      id: transaction ? transaction.id : generateId(),
      isExpense,
      amount: parseFloat(amount),
      category: selectedCategory,
      date: selectedDate.toISOString(),
      description: selectedDescription,
      isEdit: !!transaction,
    };

    if (transaction) {
      dispatch(updateTransaction(transactionData));
      alert('Transaction updated successfully');
    } else {
      dispatch(addTransaction(transactionData));
      alert('Transaction added successfully');
    }
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: isExpense ? 'red' : 'green' }]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, isExpense ? styles.activeButton : styles.inactiveButton]}
          onPress={() => toggleEntryType('expense')}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, !isExpense ? styles.activeButton : styles.inactiveButton]}
          onPress={() => toggleEntryType('income')}>
          <Text style={styles.buttonText}>Add Income</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{isExpense ? 'Add Expense' : 'Add Income'}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.amountLabel}>How much? ₹</Text>
        <TextInput
          placeholder="₹ 0"
          placeholderTextColor="white"
          style={[styles.amountInput, { fontSize: 80, fontWeight: 'bold' }]}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={handleCategoryChange}
              style={styles.picker}>
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>
          {isAddingCategory && (
            <View>
              <Text>Add New Category</Text>
              <TextInput
                placeholder="Enter new category"
                placeholderTextColor="gray"
                style={styles.input}
                value={newCategory}
                onChangeText={setNewCategory}
                onSubmitEditing={handleAddCategory}
              />
              <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
                <Text style={styles.addCategoryText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Date: {selectedDate ? selectedDate.toDateString() : 'Not selected'}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name="calendar-today" size={20} color="gray"  />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            placeholder="Description"
            keyboardType="default"
            value={selectedDescription}
            onChangeText={setSelectedDescription}
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.customButton, { backgroundColor: isExpense ? 'red' : 'green' }]}
            onPress={handleAddTransaction}>
            <Text style={styles.customButtonText}>
              {transaction ? 'Update Transaction' : isExpense ? 'Add Expense' : 'Add Income'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: 'blue', 
  },
  inactiveButton: {
    backgroundColor: 'gray', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
  },
  amountInput : {
    height: 100,
    borderColor: 'gray',
    color:'white',
    marginBottom: 20,
    paddingHorizontal: 10,   
  },
  amountLabel: {
  fontSize:30,
  color:'white',
  fontWeight: 'bold',
  fontStyle:'italic',
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderColor: '#ccc', 
    borderRadius: 5,
    color:'black'
  },
  inputContainer : {
    backgroundColor: 'white',
    borderRadius: 20,
    padding:20,
    marginStart:-40,
    marginEnd: -40,
    justifyContent:'flex-start',
    height:500,
    marginTop:5,
  },
  pickerContainer: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  dateButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    marginVertical: 10,
    borderWidth:1,
    height:60,
    borderColor:'#ccc',
  },
  dateButtonText: {
    color: 'black',
    fontSize: 14,
    
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:0,
    borderWidth:1,
    height:60,
    borderColor:'#ccc',
    borderRadius:5,
    padding:5,
    
  },
  dateLabel: {
    fontSize: 15,
    color: 'black',
    marginRight: 180,
  },
  calendarIcon: {
    marginRight:-30,
  },
  customButton: {
    height: 60, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  customButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default AddEntry;

