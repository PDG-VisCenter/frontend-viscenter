import { Button, Col, Divider, Row, Space } from 'antd';
import CartCard from './CartCard';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';
import Link from 'next/link';

function Cart() {
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
        <CartCard />
        <CartCard />
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
              Continue Shopping
            </Link>
          </Col>
          <Col
            style={{
              width: '300px',
            }}
          >
            <p>Total</p>
            <br />
            <Button
              type='primary'
              size='large'
              block
            >
              Checkout
            </Button>
          </Col>
        </Row>
      </Space>
      <Footer />
    </Layout>
  );
}

export default Cart;
