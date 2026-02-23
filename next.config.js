/** @type {import('next').NextConfig} */
console.log('--- APPLYING GLOBAL IMAGE WHITELIST ---');

// Allowed specific external domains for scripts, fonts, styles, and images.
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://checkout.razorpay.com https://api.sardine.ai https://*.fpjs.io;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.randomuser.me https://*.wikimedia.org https://www.google-analytics.com https://images.unsplash.com https://content.razorpay.com https://api.sardine.ai;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' wss://*.supabase.co https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com https://api.sardine.ai https://*.fpjs.io;
    frame-src 'self' https://api.razorpay.com https://api.sardine.ai;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
`

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
                hostname: '**.supabase.in', // Adding additional potential supabase domains
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
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
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    }
                ],
            },
        ];
    },
};

module.exports = nextConfig;
