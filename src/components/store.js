import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import transactionReducer from './transactionReducer';


const persistConfig = {
  key: 'root',  
  storage: AsyncStorage,  
};

const persistedReducer = persistReducer(persistConfig, transactionReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
