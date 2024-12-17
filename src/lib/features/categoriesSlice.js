import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchCategoriesByParentId = createAsyncThunk('categories/fetchCategories', async (id) => {
  const response = await axios.get(`http://localhost:5203/api/Category/parent_category_id/${id}`);
  return response.data;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategoriesByParentId.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCategoriesByParentId.fulfilled, (state, action) => {
      state.status = 'success';
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesByParentId.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default categoriesSlice.reducer;
