import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export default makeStore;
export { makeStore };
