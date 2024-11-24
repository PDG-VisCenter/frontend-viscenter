'use client';

import { Button, Col, Divider, Empty, Row, Space } from 'antd';
import { removeAllCartRedux, updateCartItem } from '@/lib/features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CartCard from './CartCard';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsFetched = useSelector((state) => state.cart.itemsFetched);
  const cartTotalPrice = useSelector((state) => state.cart.totalPrice);
  const cartTotalItems = useSelector((state) => state.cart.totalItems);
  const router = useRouter();

  const updateCartItems = async () => {
    if (cartItemsFetched.length > 0) {
      try {
        const updatedItems = await Promise.all(
          cartItemsFetched.map(async (item) => {
            if (!item.name || !item.img || !item.color) {
              const productItem = await axios.get(`https://localhost:7235/api/ProductItem/${item.productItemId}`);
              const product = await axios.get(`https://localhost:7235/api/Product/${productItem.data.productId}`);
              const color = await axios.get(`https://localhost:7235/api/Color/${productItem.data.colorId}`);

              return {
                id: item.id,
                img: productItem.data.images[0],
                name: product.data.name,
                price: item.price,
                quantity: item.quantity,
                color: color.data.name,
              };
            }
            return item;
          })
        );

        return updatedItems;
      } catch (error) {
        console.error('Error loading cart items:', error);
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    const updateAndDispatch = async () => {
      const updatedItems = await updateCartItems();
      if (updatedItems.length > 0) {
        dispatch(removeAllCartRedux());
        dispatch(updateCartItem(updatedItems));
      }
    };

    updateAndDispatch();
  }, [cartItemsFetched]);

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
