'use client';

import { Breadcrumb, Button, Carousel, Col, Layout, Row, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '@/lib/features/productSlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import { useEffect } from 'react';

const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

function Product({ params }) {
  const dispatch = useDispatch();
  const productItem = useSelector((state) => state.product.product);
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductById(params.product));
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <Skeleton.Node
        active
        style={{
          width: 160,
        }}
      />
    );
  }
  if (status === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div>
      <HeaderSimple />
      <Layout
        style={{
          padding: 40,
          background: 'white',
        }}
      >
        <Breadcrumb
          separator='>'
          style={{
            paddingBottom: 10,
          }}
          items={[
            {
              title: 'Home',
            },
            {
              title: 'Lentes de Sol',
              href: '',
            },
            {
              title: 'Hombres',
              href: '',
            },
            {
              title: `${productItem.name}`,
            },
          ]}
        />
        <Row gutter={16}>
          <Col
            style={{
              width: '50%',
              display: 'block',
              alignContent: 'center',
            }}
          >
            <Carousel
              arrows
              infinite={false}
            >
              <div>
                <h3 style={contentStyle}>1</h3>
              </div>
              <div>
                <h3 style={contentStyle}>2</h3>
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
              <div>
                <h3 style={contentStyle}>4</h3>
              </div>
            </Carousel>
          </Col>
          <Col
            style={{
              width: '50%',
              padding: 20,
            }}
          >
            <h1 className='pd-pg__title'>{productItem.name}</h1>
            <div className='pd-pg__price--wrapper'>
              <h3 className='pd-pg__price'>Bs. {productItem.price}</h3>
              {/* <h3 className='pd-pg__og-price'>Bs. 234</h3> */}
            </div>
            <div className='pd-pg__details'>
              <p className='pd-pg__description'>{productItem.description}</p>
              <ul className='pd-pg__tech-details'>
                {/* {product.technicalDetails.map((td) => (
                <li
                  className='pd-pg__tech-detail'
                  key={td}
                >
                  nose
                </li>))} */}
              </ul>
            </div>
            <div className='pd-pg__opt-details'>
              {/* {product.color && ( */}
              <div className='pd-pg__color--wrapper'>
                <span className=' pd-pg__opt-label pd-pg__color-label'>Color: </span>
                <span className='pd-pg__color'>Black</span>
              </div>
              {/* )} */}
            </div>
            <Button type='primary'>Añadir al carrito</Button>
          </Col>
        </Row>
      </Layout>
      <Footer />
    </div>
  );
}

export default Product;
