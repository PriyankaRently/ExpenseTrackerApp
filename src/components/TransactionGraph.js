import React, { useState } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import DateCalendarView from './DateCalendar';

const getIncomeAndExpensesByDateRange = (transactions, startDate, endDate) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
    if (transactionDate >= startDate && transactionDate <= endDate) {
      if (transaction.isExpense) {
        totalExpenses += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    }
  });

  return { totalIncome, totalExpenses };
};

function TransactionGraph() {
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const transactions = useSelector((state) => state.transactions);
  const { totalIncome, totalExpenses } = getIncomeAndExpensesByDateRange(
    transactions,
    dateRange.startDate,
    dateRange.endDate
  );

  const data = {
    labels: ['Total Income', 'Total Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        label: 'Amount',
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>
          Income vs Expenses from {dateRange.startDate} to {dateRange.endDate}
        </Text>
        
        <BarChart
          data={data}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#4caf50',
            backgroundGradientTo: '#81c784',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
          }}
          style={styles.chartStyle}
        />
        
        {totalIncome === 0 && totalExpenses === 0 && (
          <Text style={styles.noTransactionsText}>No transactions for the selected date range.</Text>
        )}
      </View>
      <DateCalendarView onDateRangeSelect={setDateRange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#33691E',
    padding: 10,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartStyle: {
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: -4,
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default TransactionGraph;
