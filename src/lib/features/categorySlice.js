import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  category: {},
  status: 'idle',
  error: null,
};

export const fetchCategoryById = createAsyncThunk('category/fetchCategoryById', async (id) => {
  const response = await axios.get(`http://localhost:5203/api/Category/${id}`);
  return response.data;
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.status = 'success';
      state.category = action.payload;
    });
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default categorySlice.reducer;
