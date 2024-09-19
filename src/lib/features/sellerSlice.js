import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    isCollapsed: false,
  },
};

const sellerAppSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    collapse: () => {
      return {
        value: {
          isCollapsed: true,
        },
      };
    },
    expand: () => {
      return {
        value: {
          isCollapsed: false,
        },
      };
    },
  },
});

export const { collapse, expand } = sellerAppSlice.actions;

export default sellerAppSlice.reducer;
