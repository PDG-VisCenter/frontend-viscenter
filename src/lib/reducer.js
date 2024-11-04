import { combineReducers } from 'redux';

import cartSlice from './features/cartSlice';
import categoriesSlice from './features/categoriesSlice';
import categorySlice from './features/categorySlice';
import colorsSlice from './features/colorsSlice';
import productItemsSlice from './features/productItemsSlice';
import productSlice from './features/productSlice';
import productsSlice from './features/productsSlice';
import sellerAppSliceReducer from './features/sellerSlice';

const rootReducer = combineReducers({
  seller: sellerAppSliceReducer,
  products: productsSlice,
  product: productSlice,
  productItems: productItemsSlice,
  colors: colorsSlice,
  cart: cartSlice,
  category: categorySlice,
  categories: categoriesSlice,
});

export default rootReducer;
