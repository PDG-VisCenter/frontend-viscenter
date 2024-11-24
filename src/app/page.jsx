'use client';

import { addCart, addItemToCart, fetchCartByUserId, removeAllCartRedux } from '@/lib/features/cartSlice';
import { fetchCartItemsByUserId } from '@/lib/features/cartItemSlice';
import HomeClient from './home/page';
import { Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

function Home() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const getCart = async () => {
      if (status === 'unauthenticated') {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        dispatch(removeAllCartRedux());
        savedCart.forEach((item) => {
          dispatch(addItemToCart(item));
        });
      } else if (status === 'authenticated') {
        try {
          localStorage.setItem('userId', session?.userId);
          await dispatch(fetchCartByUserId(session?.userId)).unwrap();
          const cartItems = await dispatch(fetchCartItemsByUserId(session?.userId)).unwrap();
          if (cartItems.length > 0) {
            dispatch(removeAllCartRedux());
            cartItems.forEach((item) => {
              dispatch(addItemToCart(item));
            });
          }
        } catch (error) {
          const cartFormData = new FormData();
          cartFormData.append('userId', session?.userId);
          await dispatch(addCart(cartFormData)).unwrap();
        }
      }
    };
    getCart();
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Skeleton active />;
  }

  return <HomeClient />;
}

export default Home;
