'use client';

import { Avatar, Button, Layout, Menu, theme } from 'antd';
import {
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  PlusCircleOutlined,
  ProductOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Content, Header } from 'antd/es/layout/layout';
import Link from 'next/link';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Estadisticas', '1', <PieChartOutlined />),
  getItem('Añadir producto', '2', <PlusCircleOutlined />),
  getItem('Productos', '3', <ProductOutlined />),
  getItem('Pedidos', '4', <ShoppingOutlined />),
  getItem('Usuarios', '5', <TeamOutlined />),
  getItem('Citas', '', <CalendarOutlined />),
];

function HomeSeller() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className='demo-logo-vertical' />
        <Menu
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items}
          style={{
            height: '100%',
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            paddingLeft: '0px',
            paddingRight: 16,
            background: 'red',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Title style={{ margin: 0 }}>VisCenter</Title>
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
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Overview
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomeSeller;
