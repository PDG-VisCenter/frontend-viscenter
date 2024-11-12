import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  product: {},
  status: 'idle',
  error: null,
};

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
  const response = await axios.get(`https://localhost:7235/api/Product/${id}`);
  return response.data;
});

export const addProduct = createAsyncThunk('product/addProduct', async (newProduct) => {
  const response = await axios.post('https://localhost:7235/api/Product', newProduct);
  return response.data;
});

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ id, newProduct }) => {
  const response = await axios.put(`https://localhost:7235/api/Product/${id}`, newProduct);
  return response.data;
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductById.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.status = 'success';
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Add a new product
    builder.addCase(addProduct.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.status = 'success';
      state.product = action.payload;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Update a product
    builder.addCase(updateProduct.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.status = 'success';
      state.product = action.payload;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default productSlice.reducer;
