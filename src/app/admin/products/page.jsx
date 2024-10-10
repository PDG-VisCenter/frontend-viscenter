'use client';

import { Input, Layout, Skeleton, Space, Table, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from 'antd/es/layout/layout';
import { fetchAllProducts } from '@/lib/features/productsSlice';
import HeaderSeller from '../components/HeaderSeller';
import Image from 'next/image';
import imgprueba from '../../../assets/img/hero/hero-7.jpg';
import Link from 'next/link';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';
import { useEffect } from 'react';

const columns = [
  {
    title: 'Imagen',
    dataIndex: 'image',
    width: 110,
    align: 'center',
    render: (_) => (
      <Image
        src={imgprueba}
        alt='productimg'
        layout='responsive'
        width={80}
        height={60}
      />
    ),
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    width: 250,
    className: 'center-vertically',
  },
  {
    title: 'Precio',
    dataIndex: 'price',
    width: 80,
  },
  {
    title: 'SKU',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    width: 100,
  },
  {
    title: 'Accciones',
    key: 'action',
    width: 110,
    render: (_) => (
      <Space size='middle'>
        <Link href='/'>Edit</Link>
        <Link href='/'>Delete</Link>
      </Space>
    ),
  },
];

function Products() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();
  const productsItems = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <Skeleton.Node
        active
        style={{
          width: 160,
        }}
      />
    );
  }
  if (status === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='3' />
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: '88vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Title
              level={2}
              style={{
                textAlign: 'center',
              }}
            >
              Productos
            </Title>
            <Input.Search
              placeholder='Busca productos por nombre o SKU...'
              allowClear
              enterButton='Search'
              size='large'
              onSearch={onSearch}
              style={{
                marginBottom: 20,
              }}
            />
            <Table
              columns={columns}
              dataSource={productsItems}
              pagination={{ pageSize: 12 }}
              scroll={{ y: 380 }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Products;
