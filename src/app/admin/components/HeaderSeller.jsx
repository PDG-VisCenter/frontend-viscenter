'use client';

import { Avatar, Button } from 'antd';
import { collapse, expand } from '@/lib/features/sellerSlice';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from 'antd/es/layout/layout';
import Link from 'next/link';
import Title from 'antd/es/typography/Title';

function HeaderSeller() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.seller.value.isCollapsed);

  const onClickMenu = () => {
    if (isCollapsed) {
      dispatch(expand());
      return;
    }
    dispatch(collapse());
  };

  return (
    <Header
      style={{
        paddingLeft: '0px',
        paddingRight: 16,
        background: '#ffc038',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        type='text'
        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onClickMenu()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <Title
        style={{
          margin: 0,
          fontSize: '28px',
          fontStyle: 'bold',
        }}
      >
        VisCenter
      </Title>
      <Link
        href='/profile'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 64,
          height: 64,
        }}
      >
        <Avatar
          icon={<UserOutlined />}
          size={36}
        />
      </Link>
    </Header>
  );
}

export default HeaderSeller;
