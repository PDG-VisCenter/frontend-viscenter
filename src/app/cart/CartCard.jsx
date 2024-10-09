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
        <Col span={3}>
          <Image
            alt='example'
            src={pruebaimg}
            width={100}
            height={100}
          />
        </Col>
        <Col
          span={13}
          style={{ paddingLeft: 32 }}
        >
          <Title level={5}>Nombre producto</Title>
          <p>Color</p>
          <p>SKU</p>
          <p>Subtotal: 56$</p>
        </Col>
        <Col
          span={8}
          style={{
            display: 'flex',
            justifyContent: 'right',
          }}
        >
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
