import { allProductsData } from '../../data/productData';
import Flickity from 'react-flickity-component';
import getCategory from '../../utils/getCategory';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function FeaturedProducts() {
  const [featured] = useState([
    allProductsData[11],
    allProductsData[50],
    allProductsData[75],
    allProductsData[54],
    allProductsData[23],
    allProductsData[40],
  ]);

  const flickityOptions = {
    freeScroll: true,
    wrapAround: true,
    initialIndex: 0,
    autoPlay: 10000,
    pauseAutoPlayOnHover: false,
  };

  return (
    <section className='fp featured-products'>
      <h3 className='fp__title'>Nuevos Productos</h3>
      <Flickity
        options={flickityOptions}
        elementType='div'
        className='fp__products'
      >
        {featured.map((item) => (
          <Link
            href={`/products/${getCategory(item.type)}/${item.id}`}
            key={`${item.id}--featured-${item.type}`}
            className='fp-product'
          >
            <div className='fp-product__img-wrapper'>
              <Image
                src={item.images.main}
                alt={`${item.title} front profile`}
                className='fp-product__img'
                width={700}
                height={500}
              />
            </div>
            <span className='fp-product__title'>{item.title}</span>
            <span className='fp-product__price'>{item.price}</span>
          </Link>
        ))}
      </Flickity>
    </section>
  );
}

export default FeaturedProducts;
