import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productId: null,
  addProductItems: [
    {
      color: null,
      productCode: null,
      stock: null,
      images: [],
    },
  ],
};

const addProductItemSlice = createSlice({
  name: 'addProductItem',
  initialState,
  reducers: {
    addProductItem: (state, action) => {
      state.addProductItems.push({
        color: null,
        productCode: null,
        stock: null,
        images: [],
      });
    },
    setProductItem: (state, action) => {
      const { index, item } = action.payload;

      if (index >= 0 && index < state.addProductItems.length) {
        state.addProductItems[index] = {
          ...state.addProductItems[index],
          ...item,
        };
      }
    },
    deleteProductItem: (state, action) => {
      const index = action.payload;
      if (index >= 0 && index < state.addProductItems.length) {
        state.addProductItems.splice(index, 1);
      }
    },
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    resetProductItemData: () => initialState,
  },
});

export const { addProductItem, setProductItem, deleteProductItem, setProductId, resetProductItemData } = addProductItemSlice.actions;

export default addProductItemSlice.reducer;
