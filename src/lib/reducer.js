import { combineReducers } from 'redux';
import testsSlice from './features/testsSlice';

const rootReducer = combineReducers({
  tests: testsSlice,
});

export default rootReducer;
