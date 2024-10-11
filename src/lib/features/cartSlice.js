import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  nextId: 1,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = action.payload;

      const idItem = state.nextId;
      state.items.push({
        id: idItem,
        name: newItem.name,
        img: newItem.img,
        price: newItem.price,
        color: newItem.color,
        sku: newItem.sku,
      });

      state.totalItems += 1;
      state.totalPrice += newItem.price;
      state.nextId += 1;
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== id);
        state.totalItems -= 1;
        state.totalPrice -= existingItem.price;
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer;
