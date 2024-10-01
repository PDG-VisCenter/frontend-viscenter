'use client';

import { brands, frameColors, frameMaterial, frameShape, gender, sortByElements } from '@/data/searchFilters';
import { Button, Checkbox, Collapse, Dropdown, Input, Menu, Pagination } from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import { DownOutlined } from '@ant-design/icons';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';

const onSearch = (value, _e, info) => console.log(info?.source, value);

const onChange = (checkedValues) => {
  console.log('checked = ', checkedValues);
};

const items = [
  {
    key: '2',
    label: 'Color',
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

function EyeglassesKids() {
  return (
    <Layout className='search'>
      <HeaderSimple />
      <Layout>
        <Sider
          width='17%'
          className='search__sider'
        >
          <Collapse
            items={items}
            defaultActiveKey={['1', '2', '3']}
            onChange={onChange}
          />
        </Sider>
        <Content className='search__content'>
          <Title className='search__title'>Buscar</Title>
          <Input.Search
            placeholder='Busca productos...'
            allowClear
            enterButton='Search'
            size='large'
            onSearch={onSearch}
          />
          <br />
          <br />
          <Title
            level={3}
            className='search__subtitle'
          >
            Resultados para ...
          </Title>
          <Dropdown overlay={menu}>
            <Button>
              Ordenar por: <DownOutlined />
            </Button>
          </Dropdown>
          <Pagination
            align='center'
            defaultCurrent={1}
            defaultPageSize={20}
            total={50}
          />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default EyeglassesKids;
