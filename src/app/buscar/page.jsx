'use client';

import {
  brands,
  categories,
  frameColors,
  frameMaterial,
  frameShape,
  gender,
  sortByElements,
} from '@/data/searchFilters';
import { Button, Checkbox, Col, Collapse, Dropdown, Input, Layout, Menu, Pagination, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { DownOutlined } from '@ant-design/icons';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import ProductCard from '../components/ProductCard';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';

const onSearch = (value, _e, info) => console.log(info?.source, value);

const onChange = (checkedValues) => {
  console.log('checked = ', checkedValues);
};

const items = [
  {
    key: '1',
    label: 'Categorias',
    children: (
      <Checkbox.Group
        options={categories}
        onChange={onChange}
        defaultValue={['Lentes', 'LentesSol', 'Accesorios']}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
  {
    key: '2',
    label: 'Color del Marco',
    children: (
      <Checkbox.Group
        options={frameColors}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
  {
    key: '3',
    label: 'Marca',
    children: (
      <Checkbox.Group
        options={brands}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
  {
    key: '4',
    label: 'Forma del Marco',
    children: (
      <Checkbox.Group
        options={frameShape}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
  {
    key: '5',
    label: 'Material del Marco',
    children: (
      <Checkbox.Group
        options={frameMaterial}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
  {
    key: '6',
    label: 'Genero',
    children: (
      <Checkbox.Group
        options={gender}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      />
    ),
  },
];

const handleMenuClick = (e) => {
  console.log('click', e);
};

const menu = (
  <Menu onClick={handleMenuClick}>
    {sortByElements.map((item) => (
      <Menu.Item key={item.key}>{item.label}</Menu.Item>
    ))}
  </Menu>
);

const siderStyle = {
  overflow: 'auto',
  height: '100%',
  maxHeight: 'calc(100vh - 90px)',
  position: 'fixed',
  insetInlineStart: 0,
  top: 90,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
  background: 'white',
};

function App() {
  return (
    <div>
      <HeaderSimple />
      <Layout>
        <Sider
          width={200}
          style={siderStyle}
        >
          <Collapse
            items={items}
            defaultActiveKey={['1', '2', '3']}
            onChange={onChange}
          />
        </Sider>
        <Layout
          style={{
            height: '100%',
            marginInlineStart: '200px',
          }}
        >
          <Content
            style={{
              background: 'white',
              overflow: 'initial',
              padding: '20px',
            }}
          >
            <div className='search__filter'>
              <Input.Search
                placeholder='Busca productos...'
                allowClear
                enterButton='Search'
                size='large'
                onSearch={onSearch}
                style={{
                  paddingRight: '50px',
                }}
              />
              <Dropdown overlay={menu}>
                <Button>
                  Ordenar por: <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <br />
            <br />
            <Title
              level={4}
              className='search__subtitle'
            >
              Resultados para ...
            </Title>
            <Row gutter={[16, 16]}>
              {[...Array(12)].map((_, index) => (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={8}
                  xxl={8}
                >
                  <ProductCard />
                </Col>
              ))}
            </Row>
            <br />
            <br />
            <Pagination
              align='center'
              defaultCurrent={1}
              defaultPageSize={20}
              total={50}
            />
            <br />
            <br />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
