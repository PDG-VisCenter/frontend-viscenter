import { Breadcrumb, Carousel, Col, Layout, Row } from 'antd';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';

const contentStyle = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

function Producto() {
  return (
    <div>
      <HeaderSimple />
      <Layout
        style={{
          padding: 40,
          background: 'white',
        }}
      >
        <Breadcrumb
          separator='>'
          style={{
            paddingBottom: 10,
          }}
          items={[
            {
              title: 'Home',
            },
            {
              title: 'Lentes de Sol',
              href: '',
            },
            {
              title: 'Hombres',
              href: '',
            },
            {
              title: 'Nombre producto',
            },
          ]}
        />
        <Row gutter={16}>
          <Col
            style={{
              width: '50%',
              display: 'block',
              alignContent: 'center',
            }}
          >
            <Carousel
              arrows
              infinite={false}
            >
              <div>
                <h3 style={contentStyle}>1</h3>
              </div>
              <div>
                <h3 style={contentStyle}>2</h3>
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
              <div>
                <h3 style={contentStyle}>4</h3>
              </div>
            </Carousel>
          </Col>
          <Col
            style={{
              width: '50%',
              padding: 20,
            }}
          >
            <h1 className='pd-pg__title'>Product name</h1>
            <div className='pd-pg__price--wrapper'>
              <h3 className='pd-pg__price'>Bs. 8984</h3>
              <h3 className='pd-pg__og-price'>Bs. 234</h3>
            </div>
            <div className='pd-pg__details'>
              <p className='pd-pg__description'>Description</p>
              <ul className='pd-pg__tech-details'>
                {/* {product.technicalDetails.map((td) => ( */}
                <li
                  className='pd-pg__tech-detail'
                  // key={td}
                >
                  nose
                </li>
                {/* ))} */}
              </ul>
            </div>
            <div className='pd-pg__opt-details'>
              {/* {product.color && ( */}
              <div className='pd-pg__color--wrapper'>
                <span className=' pd-pg__opt-label pd-pg__color-label'>Color: </span>
                <span className='pd-pg__color'>black</span>
              </div>
              {/* )} */}
            </div>
          </Col>
        </Row>
      </Layout>
      <Footer />
    </div>
  );
}

export default Producto;
