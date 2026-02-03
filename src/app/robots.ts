import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'],
        },
        sitemap: 'https://wars2026.iaisr.info/sitemap.xml',
    }
}
