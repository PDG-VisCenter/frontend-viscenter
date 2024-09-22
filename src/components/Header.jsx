'use client';

import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useSession, signIn } from 'next-auth/react';
import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/img/logo-black.png';
import NavBar from './NavBar';
import NavBarSticky from './NavBarSticky';
import { useInView } from 'react-intersection-observer';

function Header() {
  const { data: session, status } = useSession();
  //const [cartItems] = useContext(CartContext);

  const [ref, inView] = useInView({
    threshold: 0,
  });

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
          <Link
            href='/buscar'
            className='header__btn-icon icon__search material-symbols-outlined'
            data-testid='search-button'
          >
            <SearchOutlined className='header__icon' />
          </Link>
          {session ? (
            <Link
              href='/profile'
              className='header__btn-icon icon__search material-symbols-outlined'
            >
              <UserOutlined
                className='header__icon'
                style={{
                  color: 'black',
                }}
              />
            </Link>
          ) : (
            <Button
              className='header__btn-signin'
              onClick={() => signIn('keycloak')}
            >
              Iniciar sesión
            </Button>
          )}
          <Link
            href='/cart'
            className='header__btn-icon icon__shopping-bag material-symbols-outlined'
            style={{
              color: 'black',
            }}
          >
            <ShoppingCartOutlined className='header__icon' />
          </Link>
        </div>
      </div>

      {inView ? <NavBar /> : <NavBarSticky />}
    </header>
  );
}

export default Header;
