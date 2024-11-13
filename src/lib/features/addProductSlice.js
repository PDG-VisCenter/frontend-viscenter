import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stripeId: null,
  category: null,
  brand: null,
  name: null,
  shape: null,
  material: null,
  description: null,
  image: null,
  price: null,
};

const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetProductData: () => initialState,
  },
});

export const { setProduct, resetProductData } = addProductSlice.actions;

export default addProductSlice.reducer;
