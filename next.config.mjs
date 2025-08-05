/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the redirects function here
  async redirects() {
    return [
      {
        source: '/',
        destination: '/customer',
        permanent: true, // This tells browsers it's a permanent move (HTTP 308)
      },
    ]
  },
};

export default nextConfig;