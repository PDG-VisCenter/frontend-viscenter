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
          href='/eyeglasses'
          className='nav__link'
        >
          Marcos
        </Link>
        <Link
          href='/sunglasses'
          className='nav__link'
        >
          Lentes de sol
        </Link>
        <Link
          href='/accessories'
          className='nav__link'
        >
          Accesorios
        </Link>
        <Link
          href='/pagina-citas'
          className='nav__link'
        >
          Reserva de citas
        </Link>
      </ul>
    </motion.nav>
  );
}

export default NavBar;
