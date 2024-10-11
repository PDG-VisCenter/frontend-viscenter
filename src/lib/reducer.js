import { combineReducers } from 'redux';

import cartSlice from './features/cartSlice';
import productSlice from './features/productSlice';
import productsSlice from './features/productsSlice';
import sellerAppSliceReducer from './features/sellerSlice';

const rootReducer = combineReducers({
  seller: sellerAppSliceReducer,
  products: productsSlice,
  product: productSlice,
  cart: cartSlice,
});

export default rootReducer;
