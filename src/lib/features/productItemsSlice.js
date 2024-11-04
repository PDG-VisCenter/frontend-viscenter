import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  productItems: [],
  status: 'idle',
  error: null,
};

export const fetchProductItemsByProduct = createAsyncThunk('products/fetchProductItemsByProduct', async (product) => {
  const response = await axios.get(`https://localhost:7235/api/ProductItem/product/${product}`);
  return response.data;
});

const productItemsSlice = createSlice({
  name: 'productItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductItemsByProduct.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchProductItemsByProduct.fulfilled, (state, action) => {
      state.status = 'success';
      state.productItems = action.payload;
    });
    builder.addCase(fetchProductItemsByProduct.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default productItemsSlice.reducer;
