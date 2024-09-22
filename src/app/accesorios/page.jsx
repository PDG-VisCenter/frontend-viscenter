import { cardAccessories, cardClean } from '@/data/subcategoryData';
import { Col, Row } from 'antd';
import { bannerAccessories } from '@/data/categoryData';
import BannerCategory from '../components/BannerCategory';
import CardCategory from '../components/CardCategory';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Layout from 'antd/es/layout/layout';

function Accesorios() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <HeaderSimple />
      <BannerCategory content={bannerAccessories} />
      <Layout
        style={{
          margin: 40,
        }}
      >
        <Row
          gutter={[16, 16]}
          style={{ marginLeft: '10%', marginRight: '10%' }}
        >
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
          >
            <CardCategory content={cardAccessories} />
          </Col>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
          >
            <CardCategory content={cardClean} />
          </Col>
        </Row>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Accesorios;
