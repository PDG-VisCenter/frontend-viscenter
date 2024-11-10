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
  productItemsUi: [],
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
    saveProductItemUi: (state, action) => {
      state.productItemsUi = [...state.productItemsUi, null];
    },
    resetProductItemData: () => initialState,
  },
});

export const {
  addProductItem,
  setProductItem,
  deleteProductItem,
  setProductId,
  saveProductItemUi,
  resetProductItemData,
} = addProductItemSlice.actions;

export default addProductItemSlice.reducer;
