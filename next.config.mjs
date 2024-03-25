import createJiti from 'jiti';
const jiti = createJiti(new URL(import.meta.url).pathname);

jiti('./src/config/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
};

export default nextConfig;
