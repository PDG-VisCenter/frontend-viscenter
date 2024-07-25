const { createSlice } = require('@reduxjs/toolkit');

const initialState = [{ id: 'test' }];

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {},
});

export default testsSlice.reducer;
