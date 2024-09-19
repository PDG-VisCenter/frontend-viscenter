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
import { useRouter } from 'next/navigation';

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

const keyToPath = {
  1: '/admin/home',
  2: '/admin/addproduct',
  3: '/admin/products',
  4: '/admin/orders',
  5: '/admin/users',
  6: '/admin/appointments',
};

function SiderMenuSeller({ selectedItem }) {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.seller.value.isCollapsed);
  const router = useRouter();

  const onClickMenu = () => {
    if (isCollapsed) {
      dispatch(expand());
      return;
    }
    dispatch(collapse());
  };

  const onClickItemMenu = (e) => {
    const path = keyToPath[e.key];
    if (path) {
      router.push(path);
    }
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
        defaultSelectedKeys={[selectedItem]}
        onClick={(e) => onClickItemMenu(e)}
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
