import { combineReducers } from 'redux';

import productsSlice from './features/productsSlice';
import sellerAppSliceReducer from './features/sellerSlice';

const rootReducer = combineReducers({
  seller: sellerAppSliceReducer,
  products: productsSlice,
});

export default rootReducer;
