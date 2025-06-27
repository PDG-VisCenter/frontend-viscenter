'use client';

import { Input, Layout, message, Select, Space, Table, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';
import { orderStatus } from '@/data/statusOrders';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, fetchOrdersByUserId, updateOrder } from '@/lib/features/orderSlice';
import { useEffect } from 'react';

function Orders() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const data = orders.map((order, index) => ({
    key: String(index + 1),
    order_number: order.id,
    date: new Date(order.orderDate).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    name: order.userId,
    status: order.orderStatus,
    total: `Bs. ${order.totalPrice}`,
    items: order.totalItems,
  }));

  const handleStatusChange = async (newStatus, orderId) => {
    const formData = new FormData();
    formData.append('orderStatus', newStatus);
  
    try {
      await dispatch(updateOrder({ id: orderId, newOrder: formData })).unwrap();
      message.success('Estado actualizado');
    } catch (error) {
      console.error(error);
      message.error('No se pudo actualizar el estado');
    }
  };

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
      title: 'ID Cliente',
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
            onChange={(value) => handleStatusChange(value, record.order_number)}
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
            {/* <Input.Search
              placeholder='Busca pedidos por número o email del cliente...'
              allowClear
              enterButton='Search'
              size='large'
              onSearch={onSearch}
              style={{
                marginBottom: 20,
              }}
            /> */}
            <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: 500,
              }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Orders;
