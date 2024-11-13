import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  productItems: [],
  productItem: {},
  status: 'idle',
  statusAdd: 'idle',
  error: null,
};

export const fetchProductItemsByProduct = createAsyncThunk('products/fetchProductItemsByProduct', async (product) => {
  const response = await axios.get(`https://localhost:7235/api/ProductItem/product/${product}`);
  return response.data;
});

export const addProductItem = createAsyncThunk('productItem/addProductItem', async (newProductItem) => {
  const response = await axios.post('https://localhost:7235/api/ProductItem', newProductItem);
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

    // add product item
    builder.addCase(addProductItem.pending, (state) => {
      state.statusAdd = 'loading';
    });
    builder.addCase(addProductItem.fulfilled, (state, action) => {
      state.statusAdd = 'success';
      state.productItem = action.payload;
    });
    builder.addCase(addProductItem.rejected, (state, action) => {
      state.statusAdd = 'failed';
      state.error = action.error.message;
    });
  },
});

export default productItemsSlice.reducer;
