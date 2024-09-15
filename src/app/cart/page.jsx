import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';
import React from 'react';

function Cart() {
  return (
    <Layout>
      <HeaderSimple />
      <h1 className='cart__title'>TU CARRITO</h1>
    </Layout>
  );
}

export default Cart;
