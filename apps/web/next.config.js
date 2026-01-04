/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/react-shared', '@repo/common', '@repo/utils', '@repo/types'],
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
