'use client';

import { Input, Layout, Space, Table, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import Image from 'next/image';
import imgprueba from '../../../assets/img/hero/hero-7.jpg';
import Link from 'next/link';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';

const columns = [
  {
    title: 'Imagen',
    dataIndex: 'image',
    width: 110,
    align: 'center',
    render: (_, record) => (
      <Image
        src={imgprueba}
        alt='productimg'
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
    dataIndex: 'sku',
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
    render: (_, record) => (
      <Space size='middle'>
        <Link href='/'>Edit</Link>
        <Link href='/'>Delete</Link>
      </Space>
    ),
  },
];

const data = [];
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    image: `London, Park Lane no. ${i}`,
    name: `Edward King ${i}`,
    price: 32,
  });
}

function Products() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
              placeholder='Busca productos...'
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
              dataSource={data}
              pagination={{
                pageSize: 20,
              }}
              scroll={{
                y: 380,
              }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Products;
