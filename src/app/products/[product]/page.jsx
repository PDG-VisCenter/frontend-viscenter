'use client';

import { Breadcrumb, Button, Collapse, Empty, Rate, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addItemToCart } from '@/lib/features/cartSlice';
import { fetchColorsByProduct } from '@/lib/features/colorsSlice';
import { fetchProductById } from '@/lib/features/productSlice';
import { fetchProductItemsByProduct } from '@/lib/features/productItemsSlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Image from 'next/image';

function generatePath(category, subCategory = '') {
  const categoryPath = {
    'Marcos de lentes': 'eyeglasses',
    'Lentes de sol': 'sunglasses',
    Accesorios: 'accessories',
  };

  const subCategoryPath = {
    Hombres: 'men',
    Mujeres: 'women',
    Niños: 'kids',
    Extras: 'extras',
    Limpieza: 'cleaning',
  };

  const categorySlug = categoryPath[category] || '';
  const subCategorySlug = subCategoryPath[subCategory] || '';

  return `/${categorySlug}/${subCategorySlug}`;
}

function Product({ params }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeColorItem, setActiveColorItem] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const productItem = useSelector((state) => state.product.product);
  const productSpecifications = useSelector((state) => state.productItems.productItems);
  const colorItems = useSelector((state) => state.colors.colors);
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

  const incrementQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity < productSpecifications[activeColorItem]?.stock ? prevQuantity + 1 : prevQuantity
    );
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  useEffect(() => {
    dispatch(fetchProductById(params.product));
    dispatch(fetchProductItemsByProduct(params.product));
    dispatch(fetchColorsByProduct(params.product));
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
                title: `${productItem.category}`,
                href: generatePath(productItem.category),
              },
              {
                title: `${productItem.subCategory}`,
                href: generatePath(productItem.category, productItem.subCategory),
              },
              {
                title: `${productItem.name}`,
              },
            ]}
          />
          {productSpecifications[activeColorItem]?.images &&
          productSpecifications[activeColorItem]?.images.length > 0 ? (
            <div className='pd-pg__img--wrapper'>
              <Image
                src={productSpecifications[activeColorItem]?.images[activeImage]}
                alt={`${productItem.name} front view`}
                className='pd-pg__active-img'
                width={800}
                height={500}
              />
              <div className='pd-pg__img-thumbs'>
                {productSpecifications[activeColorItem].images?.map((image, index) => (
                  <button
                    key={`${productSpecifications[activeColorItem]?.id}-${index}`}
                    className={`pd-pg__img-thumbnail--wrapper ${activeImage === index ? 'active' : ''}`}
                    type='button'
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${productItem.name} thumbnail ${index + 1}`}
                      className='pd-pg__img-thumbnail'
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
            <h3 className='pd-pg__price'>Bs. {productItem.salePrice}</h3>
            {/* <h3 className='pd-pg__og-price'>Bs. 234</h3> */}
          </div>
          <div className='pd-pg__code'>
            <p className='pd-pg__product-code'>Code: {productSpecifications[activeColorItem]?.productCode}</p>
          </div>
          <div className='pd-pg__rating'>
            <p className='pd-pg__description'>4</p>
            <Rate
              disabled
              defaultValue={3}
              style={{
                marginLeft: 10,
              }}
            />
          </div>
          <div className='pd-pg__opt-details'>
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Marca: </span>
              <span className='pd-pg__color'>{productItem.brand}</span>
            </div>
            {colorItems && colorItems.length > 0 && (
              <div className='pd-pg__color--wrapper'>
                <span className='pd-pg__opt-label pd-pg__color-label'>Color: </span>
                <span className='pd-pg__color'>{colorItems[activeColorItem]?.name}</span>
                <br />
                <br />
                {colorItems.map((color, index) => (
                  <Button
                    key={color.id}
                    type='primary'
                    shape='circle'
                    style={{
                      backgroundColor: `${color.hexCode}`,
                      marginRight: '10px',
                    }}
                    onClick={() => setActiveColorItem(index)}
                  />
                ))}
              </div>
            )}
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Forma: </span>
              <span className='pd-pg__color'>{productItem.shape}</span>
            </div>
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Material: </span>
              <span className='pd-pg__color'>{productItem.material}</span>
            </div>
            <div className='pd-pg__color--wrapper'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Stock: </span>
              <span className='pd-pg__color'>{productSpecifications[activeColorItem]?.stock}</span>
            </div>
            <div className='pd-pg__quantity-container'>
              <span className=' pd-pg__opt-label pd-pg__color-label'>Cantidad:</span>
              <div className='pd-pg__btn-quantity'>
                <Button
                  type='text'
                  onClick={decrementQuantity}
                  style={{ marginRight: '10px', fontSize: 30 }}
                >
                  -
                </Button>
                <span style={{ fontSize: 20 }}>{quantity}</span>
                <Button
                  type='text'
                  onClick={incrementQuantity}
                  style={{ marginLeft: '10px', fontSize: 30 }}
                >
                  +
                </Button>
              </div>
            </div>
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
      <Collapse
        size='large'
        items={[
          {
            key: '1',
            label: 'Descripción',
            children: <p>{productItem.description}</p>,
          },
        ]}
        style={{
          marginRight: 100,
          marginLeft: 100,
        }}
      />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default Product;
