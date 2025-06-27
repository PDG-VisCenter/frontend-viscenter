'use client';

import { Input, Layout, Select, Space, Table, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';
import { orderStatus } from '@/data/statusOrders';

const columns = [
  {
    title: 'N° Pedido',
    dataIndex: 'order_number',
    key: 'order_number',
    width: 60,
    className: 'center-vertically',
  },
  {
    title: 'Fecha',
    dataIndex: 'date',
    width: 100,
  },
  {
    title: 'Nombre Cliente',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    width: 80,
    render: (_, record) => (
      <Space size='middle'>
        <Select
          options={orderStatus}
          defaultValue={record.status}
          style={{
            width: 170,
          }}
        />
      </Space>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: 60,
  },
  {
    title: 'Items',
    key: 'items',
    dataIndex: 'items',
    width: 40,
  },
];

const data = [
  {
    key: '1',
    order_number: '#9844',
    date: '24 de Noviembre, 2024',
    name: 'Sofía Rodríguez',
    status: 'Pendiente',
    total: 'Bs. 1200',
    items: 3,
  },
  {
    key: '2',
    order_number: '#5652',
    date: '11 de Noviembre, 2024',
    name: 'Sofía Rodríguez',
    status: 'En proceso',
    total: 'Bs. 150',
    items: 1,
  },
  {
    key: '3',
    order_number: '#4567',
    date: '1 de Octubre, 2024',
    name: 'Sofía Rodríguez',
    status: 'Listo para recojo',
    total: 'Bs. 380',
    items: 1,
  },
  {
    key: '4',
    order_number: '#1111',
    date: '25 de Junio, 2024',
    name: 'Sofía Rodríguez',
    status: 'Entregado',
    total: 'Bs. 530',
    items: 2,
  },
  {
    key: '5',
    order_number: '#560',
    date: '3 de Abril, 2024',
    name: 'Sofía Rodríguez',
    status: 'Cancelado',
    total: 'Bs. 200',
    items: 1,
  },
  {
    key: '6',
    order_number: '#423',
    date: '29 de Marzo, 2024',
    name: 'Carla López',
    status: 'Pendiente',
    total: 'Bs. 1200',
    items: 1,
  },
  {
    key: '7',
    order_number: '#321',
    date: '9 de Marzo, 2024',
    name: 'Fernando Rojas',
    status: 'En proceso',
    total: 'Bs. 150',
    items: 2,
  },
  {
    key: '8',
    order_number: '#121',
    date: '22 de Febrero, 2024',
    name: 'Ricardo Salinas Chávez',
    status: 'Listo para recojo',
    total: 'Bs. 380',
    items: 1,
  },
  {
    key: '9',
    order_number: '#20',
    date: '30 de Enero, 2024',
    name: 'Carlos Soria Lima',
    status: 'Entregado',
    total: 'Bs. 530',
    items: 2,
  },
  {
    key: '10',
    order_number: '#1',
    date: '17 de Diciembre, 2024',
    name: 'Carlos Fuentes',
    status: 'Pendiente',
    total: 'Bs. 2860',
    items: 3,
  },
];

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
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
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
