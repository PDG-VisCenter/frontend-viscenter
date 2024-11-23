import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  cart: {},
  status: 'idle',
  cartStatus: 'idle',
  totalPrice: 0,
  totalItems: 0,
};

export const fetchCartByUserId = createAsyncThunk('cart/fetchCartByUserId', async (userId) => {
  const response = await axios.get(`https://localhost:7235/api/Cart/user_id/${userId}`);
  return response.data;
});

export const addCart = createAsyncThunk('cart/addCart', async (userId) => {
  const response = await axios.post('https://localhost:7235/api/Cart', userId);
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;

      state.items.push({
        id: newItem.id,
        name: newItem.name,
        img: newItem.img,
        price: newItem.price,
        color: newItem.color,
        quantity: newItem.quantity,
      });

      state.totalItems += 1;
      state.totalPrice += newItem.price;
    },
    removeAllCartRedux: (state, action) => {
      state.items = [];
      state.totalItems = 0;
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== id);
        state.totalItems -= 1;
        state.totalPrice -= existingItem.price;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartByUserId.pending, (state) => {
      state.cartStatus = 'loading';
    });
    builder.addCase(fetchCartByUserId.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.cartStatus = 'success';
    });
    builder.addCase(fetchCartByUserId.rejected, (state) => {
      state.cartStatus = 'failed';
    });
    builder.addCase(addCart.pending, (state) => {
      state.cartStatus = 'loading';
    });
    builder.addCase(addCart.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.cartStatus = 'success';
    });
    builder.addCase(addCart.rejected, (state) => {
      state.cartStatus = 'failed';
    });
  },
});

export const { addItemToCart, removeAllCartRedux, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
