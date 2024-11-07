import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  colors: [],
  status: 'idle',
  error: null,
};

export const fetchColorsByProduct = createAsyncThunk('products/fetchColorsByProduct', async (product) => {
  const response = await axios.get(`https://localhost:7235/api/Color/product_id/${product}`);
  return response.data;
});

const colorsSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchColorsByProduct.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchColorsByProduct.fulfilled, (state, action) => {
      state.status = 'success';
      state.colors = action.payload;
    });
    builder.addCase(fetchColorsByProduct.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default colorsSlice.reducer;
