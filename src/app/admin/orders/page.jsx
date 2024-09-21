'use client';

import { Input, Layout, Space, Table, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'N° Pedido',
    dataIndex: 'number',
    width: 90,
    className: 'center-vertically',
  },
  {
    title: 'Fecha',
    dataIndex: 'date',
    width: 90,
  },
  {
    title: 'Email Cliente',
    dataIndex: 'email',
    width: 170,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 90,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: 90,
  },
  {
    title: 'Acccion',
    key: 'action',
    width: 110,
    render: (_, record) => (
      <Space size='middle'>
        <Link href='/'>
          <EditOutlined /> Edit
        </Link>
      </Space>
    ),
  },
];

const data = [];
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    number: 32,
    email: `London, Park Lane no. ${i}`,
    date: `Dec ${i}, 2024`,
  });
}

function Orders() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='4' />
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
              Pedidos
            </Title>
            <Input.Search
              placeholder='Busca pedidos por número o email del cliente...'
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

export default Orders;
