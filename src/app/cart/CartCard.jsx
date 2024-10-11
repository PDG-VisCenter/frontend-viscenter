import { Button, Card, Col, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { removeItemFromCart } from '@/lib/features/cartSlice';
import Title from 'antd/es/typography/Title';
import { useDispatch } from 'react-redux';

function CartCard(props) {
  const dispatch = useDispatch();
  const { id, img, name, price, color, sku } = props;

  const handleRemoveFromCart = (idItem) => {
    dispatch(removeItemFromCart(idItem));
  };

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
            src={img}
            width={100}
            height={100}
          />
        </Col>
        <Col
          span={13}
          style={{ paddingLeft: 32 }}
        >
          <Title level={5}>{name}</Title>
          <p>Color: {color}</p>
          <p>SKU: {sku}</p>
          <p>Subtotal: Bs. {price}</p>
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
            onClick={handleRemoveFromCart(id)}
            danger
          >
            Eliminar
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

CartCard.propTypes = {
  id: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  sku: PropTypes.number.isRequired,
};

export default CartCard;
