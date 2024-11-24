import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  order: {},
  orders: [],
  orderLines: [],
  orderLine: {},
  status: 'idle',
  statusAdd: 'idle',
  statusUpdate: 'idle',
  error: null,
};

export const createOrder = createAsyncThunk('order/createOrder', async (order) => {
  const response = await axios.post('https://localhost:7235/api/Order', order);
  return response.data;
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id) => {
  const response = await axios.get(`https://localhost:7235/api/Order/user_id/${id}`);
  return response.data;
});

export const fetchOrdersByUserId = createAsyncThunk('orders/fetchOrdersByUserId', async (userId) => {
  const response = await axios.get(`https://localhost:7235/api/Order/user_id/${userId}`);
  return response.data;
});

export const updateOrder = createAsyncThunk('orders/updateOrderStatus', async (orderId) => {
  const response = await axios.put(`https://localhost:7235/api/Order/${orderId}`);
  return response.data;
});

export const addOrderLine = createAsyncThunk('orderItem/addOrderLine', async (orderLine) => {
  const response = await axios.post('https://localhost:7235/api/OrderLine', orderLine);
  return response.data;
});

export const fetchOrderLinesByOrderId = createAsyncThunk('orderItems/fetchOrderLinesByOrderId', async (orderId) => {
  const response = await axios.get(`https://localhost:7235/api/OrderLine/order_id/${orderId}`);
  return response.data;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.statusAdd = 'loading';
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.statusAdd = 'success';
      state.order = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.statusAdd = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(fetchOrderById.pending, (state) => {
      state.statusAdd = 'loading';
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.statusAdd = 'success';
      state.order = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.statusAdd = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(addOrderLine.pending, (state) => {
      state.statusAdd = 'loading';
    });
    builder.addCase(addOrderLine.fulfilled, (state, action) => {
      state.statusAdd = 'success';
      state.orderLine = action.payload;
    });
    builder.addCase(addOrderLine.rejected, (state, action) => {
      state.statusAdd = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(updateOrder.pending, (state) => {
      state.statusUpdate = 'loading';
    });
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.statusUpdate = 'success';
      state.orderLine = action.payload;
    });
    builder.addCase(updateOrder.rejected, (state, action) => {
      state.statusUpdate = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(fetchOrdersByUserId.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
      state.status = 'success';
      const element = action.payload;
      if (Array.isArray(element)) {
        state.orders.push(...element);
      } else {
        state.orders.push(element);
      }
    });
    builder.addCase(fetchOrdersByUserId.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    builder.addCase(fetchOrderLinesByOrderId.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchOrderLinesByOrderId.fulfilled, (state, action) => {
      state.status = 'success';
      state.orderLines = action.payload;
    });
    builder.addCase(fetchOrderLinesByOrderId.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default orderSlice.reducer;
