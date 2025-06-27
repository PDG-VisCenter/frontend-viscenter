'use client';

import { addOrderLine, createOrder, fetchOrdersByUserId } from '@/lib/features/orderSlice';
import { Button, Layout, Result } from 'antd';
import { deleteCartItem, fetchCartItemsByUserId } from '@/lib/features/cartItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSimple from '@/components/HeaderSimple';
import { removeAllCartRedux } from '@/lib/features/cartSlice';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItem.cartItems);

  const onClickHome = () => {
    router.push('http://localhost:3000');
  };

  const onClickOrders = () => {
    router.push('http://localhost:3000/profile');
  };

  // const handleCreateOrder = (userId) => {
  //   const orderData = new FormData();
  //   orderData.append('userId', userId);
  //   orderData.append(
  //     'orderDate',
  //     new Date().toLocaleDateString('en-CA', {
  //       timeZone: 'America/La_Paz',
  //     })
  //   );

  //   dispatch(createOrder(orderData)).then(() =>
  //     dispatch(fetchOrdersByUserId(userId)).then((order) => {
  //       const orderId = order.payload?.id;
  //       cartItems.forEach((item) => {
  //         const orderLine = new FormData();
  //         orderLine.append('orderId', orderId);
  //         orderLine.append('productItemId', item.productItemId);
  //         orderLine.append('quantity', item.quantity);

  //         dispatch(addOrderLine(orderLine));
  //       });

  //       cartItems.forEach((item) => {
  //         dispatch(deleteCartItem(item.id));
  //       });
  //       dispatch(removeAllCartRedux());
  //     })
  //   );
  // };

  // useEffect(() => {
  //   const userId = localStorage.getItem('userId');
  //   dispatch(fetchCartItemsByUserId(userId));
  //   // handleCreateOrder(userId);
  // }, []);

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'white',
      }}
    >
      <HeaderSimple />
      <Result
        status='success'
        title='Compra realizada con exito!'
        subTitle='Puedes ingresar a tus pedidos para ver mas información.'
        extra={[
          <Button
            type='primary'
            key='console'
            onClick={onClickHome}
          >
            Seguir comprando
          </Button>,
          <Button
            key='buy'
            onClick={onClickOrders}
          >
            Ver pedido
          </Button>,
        ]}
      />
    </Layout>
  );
}

export default PaymentSuccess;
