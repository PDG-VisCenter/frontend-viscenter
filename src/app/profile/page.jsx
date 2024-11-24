'use client';

import { Avatar, Button, Flex, Layout, Menu, Modal } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { Content } from 'antd/es/layout/layout';
import Footer from '../../components/Footer';
import HeaderSimple from '../../components/HeaderSimple';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Orders from './Orders';

const items = [
  {
    key: 'account',
    label: 'Cuenta',
  },
  {
    key: 'orders',
    label: 'Pedidos',
  },
];

async function keycloakSessionLogOut() {
  try {
    await fetch('/api/auth/logout', { method: 'GET' });
  } catch (err) {
    console.error(err);
  }
}

const siderStyle = {
  lineHeight: '120px',
};

const contentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  minHeight: '80vh',
};

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('account');
  const { data: session, status } = useSession();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = (e) => {
    setSelectedMenu(e.key);
  };

  return (
    <Layout>
      <HeaderSimple />
      <Layout>
        <Sider
          width='17%'
          style={siderStyle}
        >
          <Menu
            onClick={handleMenuClick}
            style={{
              height: '100%',
              flex: 'auto',
            }}
            defaultSelectedKeys={['account']}
            mode='inline'
            items={items}
          />
        </Sider>

        {selectedMenu === 'account' && (
          <Content style={contentStyle}>
            <Title
              style={{
                paddingBottom: 20,
              }}
            >
              Mi cuenta
            </Title>
            <Flex
              style={{
                paddingBottom: 20,
              }}
            >
              <Avatar
                size={{
                  xs: 150,
                  sm: 170,
                  md: 190,
                  lg: 210,
                  xl: 230,
                  xxl: 250,
                }}
                icon={<UserOutlined />}
              />
              <Flex
                vertical
                style={{
                  paddingLeft: 70,
                  justifyContent: 'center',
                }}
              >
                <p>Name: {session?.user?.name}</p>
                <br />
                <p>Email: {session?.user?.email}</p>
                <br />
                <Button
                  type='primary'
                  onClick={showModal}
                >
                  Cerrar sesión
                </Button>
                <Modal
                  title='Cerrar sesión'
                  open={isModalOpen}
                  onOk={handleLogout}
                  onCancel={handleCancel}
                >
                  <p>¿Estás seguro de que quieres cerrar sesión?</p>
                </Modal>
              </Flex>
            </Flex>
          </Content>
        )}
        {selectedMenu === 'orders' && <Orders />}
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Profile;
