'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import logo from '../assets/img/logo-white.png';
import Image from 'next/image';

function NavBarSticky(props) {
  const { toggleSearchView } = props;

  const [menuVisible, setMenuVisibility] = useState(false);
  //const [cartItems] = useContext(CartContext);

  const toggleMenuVisibility = () => {
    setMenuVisibility(() => !menuVisible);
  };

  const hideMenu = () => {
    setMenuVisibility(false);
  };

  useEffect(() => {
    const windowHideMenuClick = (e) => {
      if (!e.target.closest('.nav')) hideMenu();
    };

    const windowHideMenuEsc = (e) => {
      if (e.key === 'Escape') hideMenu();
    };

    window.addEventListener('click', windowHideMenuClick);
    window.addEventListener('keydown', windowHideMenuEsc);

    return () => {
      window.removeEventListener('click', windowHideMenuClick);
      window.removeEventListener('keydown', windowHideMenuEsc);
    };
  }, []);

  return (
    <motion.nav
      className='nav nav--sticky'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'tween' }}
    >
      <button
        type='button'
        className='material-symbols-outlined nav__btn-menu'
        onClick={toggleMenuVisibility}
        data-testid='menu-btn'
      >
        menu
      </button>

      <Link
        href='/'
        className='nav__logo'
      >
        <Image
          src={logo}
          alt='VisCenter logo'
          className='nav__logo-img'
          width={150}
          height={60}
          priority
        />
      </Link>
      <ul className='nav__links'>
        <Link
          href='/lentes'
          className='nav__link'
        >
          Lentes
        </Link>
        <Link
          href='/lentesdesol'
          className='nav__link'
        >
          Lentes de Sol
        </Link>
        <Link
          href='/accesorios'
          className='nav__link'
        >
          Accesorios
        </Link>
        <Link
          href='/reservacita'
          className='nav__link'
        >
          Reserva de citas
        </Link>
      </ul>
      <div className='nav__icons-wrapper'>
        <button
          type='button'
          className='nav__btn-icon icon__search material-symbols-outlined'
          onClick={toggleSearchView}
        >
          <SearchOutlined />
        </button>
        <Link
          href='/cart'
          className='nav__btn-icon icon__shopping-bag material-symbols-outlined'
        >
          <ShoppingCartOutlined />
        </Link>
      </div>
      <AnimatePresence>
        {menuVisible && (
          <motion.nav
            className='nav-menu'
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1, originY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ type: 'tween' }}
            data-testid='menu-dropdown'
          >
            <ul className='nav__links'>
              <Link
                href='/lentes'
                className='nav__link'
              >
                Lentes
              </Link>
              <Link
                href='/lentesdesol'
                className='nav__link'
              >
                Lentes de sol
              </Link>
              <Link
                href='/accesorios'
                className='nav__link'
              >
                Accesorios
              </Link>
              <Link
                href='/reservacita'
                className='nav__link'
              >
                Reserva de citas
              </Link>
            </ul>
            <button
              type='button'
              className='material-symbols-outlined nav-menu__btn-collapse'
              onClick={hideMenu}
              data-testid='hide-menu-btn'
            >
              arrow_back_ios_new
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default NavBarSticky;
