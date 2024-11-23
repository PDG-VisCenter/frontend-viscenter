import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: [],
  cartItem: {},
  status: 'idle',
  statusAdd: 'idle',
  error: null,
};

export const fetchCartItemsByUserId = createAsyncThunk('cartItems/fetchCartItemsByUserId', async (userId) => {
  const response = await axios.get(`https://localhost:7235/api/CartItem/user_id/${userId}`);
  return response.data;
});

export const addCartItem = createAsyncThunk('cartItem/addCartItem', async (cartItem) => {
  const response = await axios.post('https://localhost:7235/api/CartItem', cartItem);
  return response.data;
});

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartItemsByUserId.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCartItemsByUserId.fulfilled, (state, action) => {
      state.status = 'success';
      state.cartItems = action.payload;
    });
    builder.addCase(fetchCartItemsByUserId.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // add cart item
    builder.addCase(addCartItem.pending, (state) => {
      state.statusAdd = 'loading';
    });
    builder.addCase(addCartItem.fulfilled, (state, action) => {
      state.statusAdd = 'success';
      state.cartItem = action.payload;
    });
    builder.addCase(addCartItem.rejected, (state, action) => {
      state.statusAdd = 'failed';
      state.error = action.error.message;
    });
  },
});

export default cartItemsSlice.reducer;
