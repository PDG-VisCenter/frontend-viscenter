'use client';

import { brands, categories, colors, materials, shapes, sortByElements, subcategories } from '@/data/searchFilters';
import { Checkbox, Col, Collapse, Input, Layout, Pagination, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import { fetchFilteredProducts } from '@/lib/features/productsSlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import ProductCard from '../components/ProductCard';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';

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

function Search() {
  const dispatch = useDispatch();
  const productsItems = useSelector((state) => state.products.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchWord, setSearchWord] = useState('');
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

  const handlePaginationOnChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortOption: value,
    }));
  };

  const handleSearch = (value) => {
    setSearchWord(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      productName: value,
    }));
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
            onChange={handleFilterChange}
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
                onSearch={handleSearch}
                style={{
                  paddingRight: '50px',
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
            <br />
            <br />
            {searchWord.trim() === '' ? (
              <br />
            ) : (
              <Title
                level={4}
                className='search__subtitle'
              >
                Resultados para &ldquo;{searchWord}&ldquo;
              </Title>
            )}
            {productsItems?.data && productsItems.data.length > 0 ? (
              <Row gutter={[16, 16]}>
                {productsItems.data?.map((product) => (
                  <Col
                    key={product.id}
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={8}
                    xxl={8}
                  >
                    <ProductCard
                      id={product.id}
                      img={product.image}
                      name={product.name}
                      price={product.salePrice}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Title
                level={3}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                No hay productos relacionados a la búsqueda.
              </Title>
            )}
            <br />
            <br />
            <Pagination
              align='center'
              defaultCurrent={1}
              current={currentPage}
              defaultPageSize={12}
              total={productsItems?.totalCount}
              onChange={handlePaginationOnChange}
              showSizeChanger={false}
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

export default Search;
