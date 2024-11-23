'use client';

import { Button, Col, Divider, Empty, Row, Space } from 'antd';
import CartCard from './CartCard';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
  const cartTotalItems = useSelector((state) => state.cart.totalItems);
  const router = useRouter();

  const onClickCheckout = () => {
    router.push('https://buy.stripe.com/test_4gw2bw7AL6hI760fYY');
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'white',
      }}
    >
      <HeaderSimple />
      <h1 className='cart__title'>TU CARRITO</h1>
      <Space
        direction='vertical'
        size={0}
        style={{
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingTop: '30px',
          paddingBottom: '50px',
          display: 'flex',
        }}
      >
        {cartTotalItems > 0 ? (
          <>
            {cartItems.map((item) => (
              <CartCard
                key={item.id}
                img={item.img}
                name={item.name}
                price={item.price}
                color={item.color}
                quantity={item.quantity}
              />
            ))}
            <Divider
              style={{
                borderColor: 'black',
              }}
            />
            <Row
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Col
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                <Link
                  href='/'
                  style={{
                    fontSize: '16px',
                  }}
                >
                  Continuar Comprando
                </Link>
              </Col>
              <Col
                style={{
                  width: '300px',
                }}
              >
                <p>Total: {cartTotalPrice}</p>
                <br />
                <Button
                  type='primary'
                  size='large'
                  onClick={onClickCheckout}
                  block
                >
                  Checkout
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <div>
            <Empty />
            <Link
              href='/'
              style={{
                fontSize: '16px',
              }}
            >
              Continuar Comprando
            </Link>
          </div>
        )}
      </Space>
      <Footer />
    </Layout>
  );
}

export default Cart;
