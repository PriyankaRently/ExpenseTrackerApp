// store.js
import { createStore, combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
  
const store = createStore(transactionReducer);

export default store;
