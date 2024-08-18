'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function NavBar() {
  return (
    <motion.nav
      className='nav'
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ type: 'tween' }}
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
    </motion.nav>
  );
}

export default NavBar;
