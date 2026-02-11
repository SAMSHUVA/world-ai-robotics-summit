/** @type {import('next').NextConfig} */
console.log('--- APPLYING GLOBAL IMAGE WHITELIST ---');

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.randomuser.me',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me', // Exact match for the one in your error
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.wikimedia.org',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
