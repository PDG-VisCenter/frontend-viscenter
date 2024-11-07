'use client';

import { brands, categories, colors, materials, shapes, sortByElements, subcategories } from '@/data/searchFilters';
import { Button, Checkbox, Collapse, Drawer, Input, Layout, Select, Skeleton, Space, Table, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import { fetchFilteredProducts } from '@/lib/features/productsSlice';
import HeaderSeller from '../components/HeaderSeller';
import Image from 'next/image';
import Link from 'next/link';
import SiderMenuSeller from '../components/SiderMenuSeller';

function Products() {
  const dispatch = useDispatch();
  const productsItems = useSelector((state) => state.products.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    materials: [],
    shapes: [],
    categories: [],
    subCategories: [],
    productName: '',
    sortOption: '',
  });

  useEffect(() => {
    dispatch(fetchFilteredProducts({ filters, page: currentPage }));
  }, [filters, currentPage, dispatch]);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const handleSortChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortOption: value,
    }));
  };

  const handleSearch = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      productName: value,
    }));
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handlePaginationOnChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, values) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: values,
    }));
  };

  const items = [
    {
      key: '1',
      label: 'Categorias',
      children: (
        <Checkbox.Group
          options={categories}
          onChange={(values) => handleFilterChange('categories', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
    {
      key: '2',
      label: 'Subcategoria',
      children: (
        <Checkbox.Group
          options={subcategories}
          onChange={(values) => handleFilterChange('subcategories', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
    {
      key: '3',
      label: 'Color del Marco',
      children: (
        <Checkbox.Group
          options={colors}
          onChange={(values) => handleFilterChange('colors', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
    {
      key: '4',
      label: 'Marca',
      children: (
        <Checkbox.Group
          options={brands}
          onChange={(values) => handleFilterChange('brands', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
    {
      key: '5',
      label: 'Forma del Marco',
      children: (
        <Checkbox.Group
          options={shapes}
          onChange={(values) => handleFilterChange('shapes', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
    {
      key: '6',
      label: 'Material del Marco',
      children: (
        <Checkbox.Group
          options={materials}
          onChange={(values) => handleFilterChange('materials', values)}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      ),
    },
  ];

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      width: 110,
      align: 'center',
      render: (image) => (
        <Image
          src={image}
          alt='productimg'
          width={100}
          height={90}
          style={{
            objectFit: 'contain',
          }}
        />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 250,
      className: 'center-vertically',
    },
    {
      title: 'Precio',
      dataIndex: 'salePrice',
      width: 80,
    },
    {
      title: 'Forma',
      dataIndex: 'shape',
      width: 150,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      width: 100,
    },
    {
      title: 'Accciones',
      key: 'action',
      width: 110,
      render: (_) => (
        <Space size='middle'>
          <Link href='/'>Edit</Link>
          <Link href='/'>Delete</Link>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='3' />
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: '88vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className='search__filter'>
              <Button
                type='primary'
                onClick={showDrawer}
                size='large'
                style={{
                  marginRight: '30px',
                }}
              >
                Añadir filtros
              </Button>
              <Input.Search
                placeholder='Busca productos...'
                allowClear
                enterButton='Search'
                size='large'
                onSearch={handleSearch}
                style={{
                  paddingRight: '30px',
                }}
              />
              <Select
                placeholder='Ordenar por:'
                style={{ width: 200 }}
                size='medium'
                onChange={handleSortChange}
                options={sortByElements}
              />
            </div>
            <Drawer
              title='Filtros'
              placement='left'
              onClose={closeDrawer}
              open={openDrawer}
            >
              <Collapse
                items={items}
                onChange={handleFilterChange}
              />
            </Drawer>
            <br />
            <br />
            <Table
              columns={columns}
              dataSource={productsItems.data}
              pagination={{
                defaultPageSize: 12,
                current: currentPage,
                onChange: handlePaginationOnChange,
                total: productsItems?.totalCount,
                showSizeChanger: false,
              }}
              scroll={{ y: 400 }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Products;
