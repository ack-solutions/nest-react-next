/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@libs/react-shared', '@libs/utils', '@libs/types'],
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
