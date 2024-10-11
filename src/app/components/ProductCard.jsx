import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

function ProductCard(props) {
  const { id, img, name, price } = props;

  return (
    <Link href={`/products/${id}`}>
      <Card
        hoverable
        style={{
          width: '100%',
          borderWidth: '5px',
          borderColor: '#D8D4D4',
          background: '#f5f5f5',
        }}
        cover={
          <Image
            alt={name}
            src={img}
            width={200}
            height={250}
          />
        }
      >
        <h5 className='pd-card__title'>{name}</h5>
        <div className='pd-card__price'>Bs. {price}</div>
      </Card>
    </Link>
  );
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  img: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

ProductCard.defaultProps = {
  img: 'https://res.cloudinary.com/dyrgwac0i/image/upload/v1728624039/61Ov6KHH4_L_w4htwj.jpg',
};

export default ProductCard;
