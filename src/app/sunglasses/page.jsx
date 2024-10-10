import { cardSunglassesKids, cardSunglassesMen, cardSunglassesWomen } from '@/data/subcategoryData';
import { Col, Row } from 'antd';
import BannerCategory from '../components/BannerCategory';
import { bannerSunglasses } from '@/data/categoryData';
import CardCategory from '../components/CardCategory';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';

function LentesDeSol() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <HeaderSimple />
      <BannerCategory content={bannerSunglasses} />
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
            <CardCategory content={cardSunglassesMen} />
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
            <CardCategory content={cardSunglassesWomen} />
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
            <CardCategory content={cardSunglassesKids} />
          </Col>
        </Row>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default LentesDeSol;
