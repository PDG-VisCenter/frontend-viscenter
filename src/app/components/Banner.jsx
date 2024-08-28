import Image from 'next/image';
import Link from 'next/link';
import facialimage from '../../assets/img/home/facial-recognition.jpg';

const Banner = () => {
  return (
    <section className='hero-banner'>
      <div className='hero-banner__image-wrapper'>
        <Image
          src={facialimage}
          alt='Child wearing glasses'
          className='hero-banner__image'
          width={742}
          placeholder='blur'
        />
      </div>
      <div className='hero-banner__content'>
        <p className='hero-banner__text'>
          Encuentra tu estilo único. La tecnología de escaneo facial analiza la forma, el tamaño y los rasgos faciales
          de tu rostro para brindarle una selección personalizada de monturas.
        </p>
        <Link
          href='/shop'
          className='hero-banner__button'
        >
          Empezar
        </Link>
      </div>
    </section>
  );
};

export default Banner;
