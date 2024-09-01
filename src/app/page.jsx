'use client';

import Banner from './components/Banner';
import bannerData from '../data/homeBannerData';
import BlogContent from './components/BlogContent';
import blogData from '../data/homePageBlogData';
// import FeaturedProducts from './components/FeaturedProducts';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from './components/Hero';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      {/* <FeaturedProducts /> */}
      <Banner
        img={bannerData[0].img}
        title={bannerData[0].title}
        description={bannerData[0].description}
      />
      {/* <FeaturedProducts /> */}
      <Banner
        img={bannerData[1].img}
        title={bannerData[1].title}
        description={bannerData[1].description}
      />
      {/* <FeaturedProducts /> */}
      <BlogContent
        content={blogData}
        headerTitle='Conoce a los profesionales'
      />
      <Footer />
    </>
  );
}

export default Home;
