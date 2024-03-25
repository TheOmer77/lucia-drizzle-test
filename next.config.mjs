import createJiti from 'jiti';
const jiti = createJiti(new URL(import.meta.url).pathname);

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./app/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
};

export default nextConfig;
