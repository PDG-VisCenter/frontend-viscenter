import Image from 'next/image';
import PropTypes from 'prop-types';

function BannerCategory(props) {
  const { content } = props;

  return (
    <section className='banner'>
      <div className='banner-main'>
        <h4 className='banner-main__title'>{content.title}</h4>
        <p className='banner-main__description'>{content.description}</p>
      </div>
      <Image
        src={content.img}
        alt={content.imgAlt}
        className='banner-img banner-img--wrapper'
        width={875}
        height={420}
      />
    </section>
  );
}

BannerCategory.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    img: PropTypes.node.isRequired,
    imgAlt: PropTypes.string,
  }),
};

BannerCategory.defaultProps = {
  content: {
    title: 'Shop',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    img: '',
    imgAlt: 'Placeholder banner image for collection',
  },
};

export default BannerCategory;
