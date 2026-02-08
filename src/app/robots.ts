import { MetadataRoute } from 'next'
import { CONFERENCE_CONFIG } from '@/config/conference'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'],
        },
        sitemap: `${CONFERENCE_CONFIG.urls.canonical}/sitemap.xml`,
    }
}
