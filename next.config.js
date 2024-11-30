const withPWA = require('next-pwa')({
  dest: 'public'
})
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    runtimeCaching,
  },
  images: {
    domains: ["fakestoreapi.com"],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_API_BASE_URL:process.env.NEXT_PUBLIC_API_BASE_URL
  },
});
