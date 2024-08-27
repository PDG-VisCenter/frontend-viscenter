'use client';

import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/img/logo-black.png';
import NavBar from './NavBar';
import NavBarSticky from './NavBarSticky';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

function Header() {
  //const [cartItems] = useContext(CartContext);

  const [searchInView, setSearchInView] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0,
  });

  const toggleSearchView = () => {
    setSearchInView(() => !searchInView);
  };

  return (
    <header className='header'>
      <div
        className='header__main'
        ref={ref}
      >
        <Link
          href='/'
          className='header__logo'
        >
          <div className='img-wrapper header__logo-img-wrapper'>
            <Image
              src={logo}
              alt='VisCenter logo'
              className='header__logo-img'
              height={200}
              priority
            />
          </div>
        </Link>
        <div className='header__icons-wrapper'>
          <button
            type='button'
            className='header__btn-icon icon__search material-symbols-outlined'
            onClick={toggleSearchView}
            data-testid='search-button'
          >
            <SearchOutlined />
          </button>
          <Link
            href='/cart'
            className='header__btn-icon icon__shopping-bag material-symbols-outlined'
          >
            <ShoppingCartOutlined />
          </Link>
        </div>
      </div>

      {inView ? <NavBar /> : <NavBarSticky toggleSearchView={toggleSearchView} />}
    </header>
  );
}

export default Header;
