'use client';

import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

function Banner(props) {
  const { img, title, description } = props;

  return (
    <section className='hero-banner'>
      <div className='hero-banner__image-wrapper'>
        <Image
          src={img}
          alt='banner info'
          className='hero-banner__image'
          height={300}
          placeholder='blur'
        />
      </div>
      <div className='hero-banner__content'>
        <h3 className='hero-banner__title'>{title}</h3>
        <p className='hero-banner__description'>{description}</p>
        <Link
          href='/shop'
          className='hero-banner__button'
        >
          Empezar
        </Link>
      </div>
    </section>
  );
}

Banner.propTypes = {
  img: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Banner;
