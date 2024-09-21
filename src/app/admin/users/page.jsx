'use client';

import { Input, Layout, Table, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';

const columns = [
  {
    title: 'Nombres',
    dataIndex: 'name',
    width: 120,
    className: 'center-vertically',
  },
  {
    title: 'Apellidos',
    dataIndex: 'lastname',
    width: 120,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: 'Fecha de creación',
    dataIndex: 'date',
    width: 90,
  },
];

const data = [];
for (let i = 0; i < 50; i++) {
  data.push({
    key: i,
    name: 'Cristiano Ronaldo',
    lastname: 'Dos Santos Aveiro',
    email: `London, Park Lane no. ${i}`,
    date: `Dec ${i}, 2024`,
  });
}

function Users() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='5' />
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
              Clientes
            </Title>
            <Input.Search
              placeholder='Busca clientes por su nombre, apellido o email...'
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

export default Users;
