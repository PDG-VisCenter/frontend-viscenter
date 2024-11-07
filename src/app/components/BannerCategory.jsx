import Image from 'next/image';
import PropTypes from 'prop-types';

function BannerCategory({
  content: { title, description = '', img, imgAlt = 'Placeholder banner image for collection' },
}) {
  return (
    <section className='banner'>
      <div className='banner-main'>
        <h4 className='banner-main__title'>{title}</h4>
        <p className='banner-main__description'>{description}</p>
      </div>
      <Image
        src={img}
        alt={imgAlt}
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
  }).isRequired,
};

export default BannerCategory;
