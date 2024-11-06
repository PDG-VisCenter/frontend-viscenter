'use client';

import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import BannerCategory from '../components/BannerCategory';
import CardCategory from '../components/CardCategory';
import { fetchCategoriesByParentId } from '@/lib/features/categoriesSlice';
import { fetchCategoryById } from '@/lib/features/categorySlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';
import { useEffect } from 'react';

function Sunglasses() {
  const dispatch = useDispatch();
  const categoryItem = useSelector((state) => state.category.category);
  const categoriesItem = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategoryById(2));
    dispatch(fetchCategoriesByParentId(2));
  }, [dispatch]);

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <HeaderSimple />
      <BannerCategory
        content={{
          title: categoryItem.name,
          description: categoryItem.description,
          img: categoryItem.image,
          imgAlt: categoryItem.name,
        }}
      />
      <Layout
        style={{
          margin: 40,
        }}
      >
        <Row gutter={[16, 16]}>
          {categoriesItem.map((category, index) => (
            <Col
              key={category.id}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={8}
              xxl={8}
            >
              <CardCategory
                content={{
                  title: categoriesItem[index]?.name,
                  link: '/products',
                  img: categoriesItem[index]?.image,
                  imgAlt: categoriesItem[index]?.name,
                }}
              />
            </Col>
          ))}
        </Row>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Sunglasses;
