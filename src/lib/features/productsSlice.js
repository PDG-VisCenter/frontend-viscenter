import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
};

export const fetchAllProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get('http://localhost:5203/api/Product');
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.products = action.payload;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default productsSlice.reducer;
