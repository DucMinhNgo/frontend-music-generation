/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'example2.com', 'picsum.photos', 'localhost', '127.0.0.1'],
  },
}

module.exports = nextConfig
