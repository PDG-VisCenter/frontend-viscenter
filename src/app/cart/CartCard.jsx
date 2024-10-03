import { Button, Card, Col, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import pruebaimg from '../../assets/img/category/accessories.jpg';
import Title from 'antd/es/typography/Title';

function CartCard() {
  return (
    <Card
      style={{
        width: '100%',
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderRadius: 0,
        borderColor: '#cacaca',
      }}
    >
      <Row align='middle'>
        <Col>
          <Image
            alt='example'
            src={pruebaimg}
            width={150}
            height={150}
          />
        </Col>
        <Col style={{ paddingLeft: 32 }}>
          <Title level={3}>Nombre producto</Title>
          <p>Color</p>
          <p>SKU</p>
          <p>Subtotal: 56$</p>
        </Col>
        <Col offset={15}>
          <Button
            type='primary'
            icon={<DeleteOutlined />}
            danger
          >
            Eliminar
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default CartCard;
