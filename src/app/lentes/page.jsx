import { cardEyeglassesKids, cardEyeglassesMen, cardEyeglassesWomen } from '@/data/subcategoryData';
import { Col, Row } from 'antd';
import BannerCategory from '../components/BannerCategory';
import { bannerEyeglasses } from '@/data/categoryData';
import CardCategory from '../components/CardCategory';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';

function Lentes() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <HeaderSimple />
      <BannerCategory content={bannerEyeglasses} />
      <Layout
        style={{
          margin: 40,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
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
            <CardCategory content={cardEyeglassesMen} />
          </Col>
          <Col
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
            <CardCategory content={cardEyeglassesWomen} />
          </Col>
          <Col
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
            <CardCategory content={cardEyeglassesKids} />
          </Col>
        </Row>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Lentes;
