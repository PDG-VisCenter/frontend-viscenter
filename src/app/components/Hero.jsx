'use client';

import Flickity from 'react-flickity-component';
// eslint-disable-next-line no-unused-vars
import flickityFade from 'flickity-fade';
import heroData from '../../data/heroData';
import Image from 'next/image';
import Link from 'next/link';

const flickityOptions = {
  fade: true,
  wrapAround: true,
  initialIndex: 0,
  autoPlay: 15000,
  pauseAutoPlayOnHover: false,
};

function Hero() {
  return (
    <Flickity
      options={flickityOptions}
      className='hero'
      elementType='section'
    >
      {heroData.map((item, index) => (
        <div
          className='hero-item'
          key={`${item.id}--hero-item`}
        >
          <Image
            src={item.img}
            alt={item.imgAlt}
            className={`hero-item__img img-${index + 1}`}
            width={1800}
            placeholder='blur'
          />
          <div className='hero-item__dynamic-content'>
            <div className='hero-item__text-wrapper'>
              <h3 className='hero-item__title'>{item.title}</h3>
              <p className='hero-item__details'>{item.details}</p>
            </div>
            <Link
              href='/products'
              className='hero-item__link'
            >
              Comprar
            </Link>
          </div>
        </div>
      ))}
    </Flickity>
  );
}

export default Hero;
