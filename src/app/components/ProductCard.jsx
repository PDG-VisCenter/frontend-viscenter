import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import pruebaimg from '../../assets/img/category/accessories.jpg';

function ProductCard(props) {
  const { name, price } = props;

  return (
    <Link href='/producto'>
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
            alt='example'
            src={pruebaimg}
            layout='responsive'
            width={150}
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
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProductCard;
