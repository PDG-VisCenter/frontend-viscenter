import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
};

export const fetchFilteredProducts = createAsyncThunk('products/fetchFilteredProducts', async ({ filters, page }) => {
  const response = await axios.post(`http://localhost:5203/api/Product/filter?page=${page}&size=12`, filters);
  return response.data;
});

export const fetchAllProducts = createAsyncThunk('products/fetchProducts', async (page) => {
  const response = await axios.get(`http://localhost:5203/api/Product?page=${page}&pageSize=12`);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFilteredProducts.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchFilteredProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.products = action.payload;
    });
    builder.addCase(fetchFilteredProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default productsSlice.reducer;
