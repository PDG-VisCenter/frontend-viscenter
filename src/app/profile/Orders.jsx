import { Button, Result, Space, Table, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ShopOutlined, ShoppingOutlined, SyncOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

const contentStyle = {
  display: 'flex',
  marginTop: 30,
  justifyContent: 'start',
  alignItems: 'center',
  flexDirection: 'column',
  minHeight: '80vh',
};

function Orders() {
  const router = useRouter();
  const orders = useSelector((state) => state.order.orders);

  const columns = [
    {
      title: 'N° Pedido',
      dataIndex: 'order_number',
      key: 'order_number',
      width: 150,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      width: 200,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (_, record) => {
        let tagColor = 'default';
        let icon = null;

        switch (record.status) {
          case 'Pendiente':
            tagColor = 'warning';
            icon = <ClockCircleOutlined />;
            break;
          case 'En proceso':
            tagColor = 'blue';
            icon = <SyncOutlined spin/>;
            break;
          case 'Listo para recojo':
            tagColor = 'geekblue';
            icon = <ShopOutlined />;
            break;
          case 'Entregado':
            tagColor = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Cancelado':
            tagColor = 'error';
            icon = <CloseCircleOutlined />;
            break;
          default:
            break;
        }

        return (
          <Space size='middle'>
            <Tag
              icon={icon}
              color={tagColor}
            >
              {record.status}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Total',
      key: 'total',
      dataIndex: 'total',
      width: 150,
    },
    {
      title: 'Items',
      key: 'items',
      dataIndex: 'items',
      width: 100,
    },
  ];

  const data = orders.map((order, index) => ({
    key: String(index + 1),
    order_number: order.id,
    date: new Date(order.orderDate).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    status: order.orderStatus,
    total: `Bs. ${order.totalPrice}`,
    items: order.totalItems,
  }));

  const onClickProducts = () => {
    router.push('http://localhost:3000/products');
  };

  return (
    <Content style={contentStyle}>
      <Title>Historial de Pedidos</Title>
      <Table
        bordered
        size='large'
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      {/* <Result
        icon={<ShoppingOutlined />}
        title='Aún no has realizado ningún pedido'
        extra={
          <Button
            type='primary'
            onClick={onClickProducts}
          >
            Ver Productos
          </Button>
        }
      /> */}
    </Content>
  );
}

export default Orders;
