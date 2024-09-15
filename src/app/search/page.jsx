'use client';

import { brands, frameColors, frameMaterial, frameShape, gender } from '@/data/searchFilters';
import { Checkbox, Collapse, Input } from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
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
    key: '1',
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
    key: '2',
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
    key: '3',
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
    key: '4',
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
    key: '5',
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

function Search() {
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
          <Title>Search</Title>
          <Input.Search
            placeholder='Escribe...'
            allowClear
            enterButton='Search'
            size='large'
            onSearch={onSearch}
          />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Search;
