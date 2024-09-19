'use client';

import {
  CalendarOutlined,
  PieChartOutlined,
  PlusCircleOutlined,
  ProductOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { collapse, expand } from '@/lib/features/sellerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';

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
  getItem('Citas', '6', <CalendarOutlined />),
];

function SiderMenuSeller() {
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
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={() => onClickMenu()}
      width='15%'
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
  );
}

export default SiderMenuSeller;
