import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productId: null,
  addProductItems: [
    {
      id: 0,
      color: null,
      productCode: null,
      stock: null,
      images: [],
    },
  ],
  productItemsUi: [],
  nextId: 1,
};

const addProductItemSlice = createSlice({
  name: 'addProductItem',
  initialState,
  reducers: {
    addProductItem: (state, action) => {
      state.addProductItems.push({
        id: state.nextId,
        color: null,
        productCode: null,
        stock: null,
        images: [],
      });
      state.nextId += 1;
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
    deleteProductItemUi: (state, action) => {
      state.productItemsUi = state.productItemsUi.slice(0, -2);
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
  deleteProductItemUi,
  resetProductItemData,
} = addProductItemSlice.actions;

export default addProductItemSlice.reducer;
