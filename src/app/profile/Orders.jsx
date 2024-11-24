import { Button, Result, Space, Table, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ShopOutlined, ShoppingOutlined, SyncOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { useRouter } from 'next/navigation';

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

  const data = [
    {
      key: '1',
      order_number: '#9844',
      date: '24 de Noviembre, 2024',
      status: 'Pendiente',
      total: 'Bs. 1200',
      items: 3,
    },
    {
      key: '2',
      order_number: '#5652',
      date: '11 de Noviembre, 2024',
      status: 'En proceso',
      total: 'Bs. 150',
      items: 1,
    },
    {
      key: '3',
      order_number: '#4567',
      date: '1 de Octubre, 2024',
      status: 'Listo para recojo',
      total: 'Bs. 380',
      items: 1,
    },
    {
      key: '4',
      order_number: '#1111',
      date: '25 de Junio, 2024',
      status: 'Entregado',
      total: 'Bs. 530',
      items: 2,
    },
    {
      key: '5',
      order_number: '#560',
      date: '3 de Abril, 2024',
      status: 'Cancelado',
      total: 'Bs. 200',
      items: 1,
    },
  ];

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
