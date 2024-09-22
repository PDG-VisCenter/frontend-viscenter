import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Meta from 'antd/es/card/Meta';
import PropTypes from 'prop-types';

function CardCategory(props) {
  const { content } = props;

  return (
    <Link href={content.link}>
      <Card
        hoverable
        style={{
          maxWidth: '100%',
          border: '2px solid gray',
        }}
        cover={
          <Image
            alt={content.imgAlt}
            src={content.img}
            width={450}
            height={300}
          />
        }
      >
        <Meta
          title={<span style={{ fontSize: '28px', textAlign: 'center', display: 'block' }}>{content.title}</span>}
        />
      </Card>
    </Link>
  );
}

CardCategory.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    img: PropTypes.node.isRequired,
    imgAlt: PropTypes.string,
  }),
};

CardCategory.defaultProps = {
  content: {
    title: 'Category name',
    link: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    img: '',
    imgAlt: 'Placeholder banner image for collection',
  },
};

export default CardCategory;
