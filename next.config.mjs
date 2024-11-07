/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: '',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;
