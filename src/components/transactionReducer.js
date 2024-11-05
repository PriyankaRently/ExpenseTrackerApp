import { ADD_TRANSACTION, DELETE_TRANSACTION,UPDATE_TRANSACTION }  from './transactionAction'

const initialState = {
    transactions: [],
};

const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TRANSACTION:
            let newExpense = action.payload;
      let sortedExpenses = [...state.transactions, newExpense].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      console.log("New Date Check:", new Date(newExpense.date));
      console.log("sortedexpense",sortedExpenses);
      return {
        ...state,
        transactions: sortedExpenses,  
      };

        case DELETE_TRANSACTION:
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
            };

        case UPDATE_TRANSACTION:
              return {
                ...state,
                transactions: state.transactions.map(transaction =>
                  transaction.id === action.payload.id ? action.payload : transaction
                ),
              };   

        default:
          console.log('Unrecognized action type:', action.type);
            return state;
    }
};

export default transactionReducer;
