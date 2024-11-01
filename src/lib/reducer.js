import { combineReducers } from 'redux';

import cartSlice from './features/cartSlice';
import categorySlice from './features/categorySlice';
import categoriesSlice from './features/categoriesSlice';
import productSlice from './features/productSlice';
import productsSlice from './features/productsSlice';
import sellerAppSliceReducer from './features/sellerSlice';

const rootReducer = combineReducers({
  seller: sellerAppSliceReducer,
  products: productsSlice,
  product: productSlice,
  cart: cartSlice,
  category: categorySlice,
  categories: categoriesSlice,
});

export default rootReducer;
