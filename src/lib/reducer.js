import { combineReducers } from 'redux';
import sellerAppSliceReducer from './features/sellerSlice';

const rootReducer = combineReducers({
  seller: sellerAppSliceReducer,
});

export default rootReducer;
