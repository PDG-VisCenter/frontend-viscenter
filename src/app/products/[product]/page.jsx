'use client';

import { addItemToCart } from '@/lib/features/cartSlice';
import { Breadcrumb, Empty, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '@/lib/features/productSlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Image from 'next/image';
import { useEffect } from 'react';

function Product({ params }) {
  const dispatch = useDispatch();
  const productItem = useSelector((state) => state.product.product);
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        img: productItem.images[0],
        name: productItem.name,
        price: productItem.price,
        color: productItem.color,
        sku: productItem.code,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchProductById(params.product));
  }, [dispatch, params.product]);

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
      <main className='pd-pg'>
        <section className='pd-pg__img--container'>
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
          {productItem.images && productItem.images.length > 0 ? (
            <div className='pd-pg__img--wrapper'>
              <Image
                src={productItem.images[0]}
                alt={`${productItem.name} front view`}
                className='pd-pg__active-img'
                width={200}
                height={500}
              />
              <div className='pd-pg__img-thumbs'>
                {productItem.images.map((image, index) => (
                  <button
                    key={index}
                    className='pd-pg__img-thumbnail--wrapper'
                    type='button'
                  >
                    <Image
                      src={image}
                      alt={`${productItem.name} thumbnail ${index + 1}`}
                      className='pd-pg__img-thumbnail--wrapper'
                      width={80}
                      height={70}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Empty description='No images available' />
            </div>
          )}
        </section>
        <section className='pd-pg__details--container'>
          <h1 className='pd-pg__title'>{productItem.name}</h1>
          <div className='pd-pg__price--wrapper'>
            <h3 className='pd-pg__price'>Bs. {productItem.price}</h3>
            {/* <h3 className='pd-pg__og-price'>Bs. 234</h3> */}
          </div>
          <div className='pd-pg__details'>
            <p className='pd-pg__description'>{productItem.description}</p>
          </div>
          <div className='pd-pg__opt-details'>
            {/* {product.color && ( */}
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Color: </span>
              <span className='pd-pg__color'>{productItem.color}</span>
            </div>
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Forma: </span>
              <span className='pd-pg__color'>{productItem.forma}</span>
            </div>
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Material: </span>
              <span className='pd-pg__color'>{productItem.material}</span>
            </div>
            {/* )} */}
          </div>
          <button
            className='pd-pg__btn-cart pd-pg__btn-add-cart'
            type='submit'
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Product;
