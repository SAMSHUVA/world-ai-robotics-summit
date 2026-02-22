import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Calendar, Clock, User, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import './blog-post.css';
import BlogSidebar from './BlogSidebar';
import { CONFERENCE_CONFIG } from '@/config/conference';

interface Props {
    params: { slug: string };
}

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

const sanitizeHeadingText = (rawText: string) =>
    rawText
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();

const makeHeadingSlug = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);

// Dynamic Metadata & JSON-LD
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await (prisma as any).blogPost.findUnique({
        where: { slug: params.slug }
    });

    if (!post) return { title: 'Post Not Found' };

    const canonicalUrl = `${CONFERENCE_CONFIG.urls.canonical}/blog/${post.slug}`;
    return {
        title: `${post.title} | IAISR Agri-Knowledge`,
        description: post.excerpt,
        alternates: {
            canonical: canonicalUrl
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.image ? [{ url: post.image }] : [],
            type: 'article',
            url: canonicalUrl,
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author]
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.image ? [post.image] : []
        }
    };
}

const BlogPostPage = async ({ params }: Props) => {
    const post = await (prisma as any).blogPost.findUnique({
        where: { slug: params.slug }
    });

    if (!post) notFound();

    // Structured Data (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.createdAt.toISOString(),
        author: {
            '@type': 'Person',
            name: post.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'World AI Robotics Summit',
            logo: {
                '@type': 'ImageObject',
                url: 'https://conference.com/logo.png'
            }
        }
    };

    // Strip out duplicate AI-generated headings at the start of the content
    let cleanContent = post.content;
    const firstHeadingMatch = cleanContent.match(/<h[123]>[^<]*<\/h[123]>/i);
    if (firstHeadingMatch) {
        const headingText = firstHeadingMatch[0].replace(/<[^>]+>/g, '').trim().toLowerCase();
        const titleText = post.title.trim().toLowerCase();
        if (headingText && titleText && (headingText.includes(titleText.substring(0, 10)) || titleText.includes(headingText.substring(0, 10)))) {
            cleanContent = cleanContent.replace(firstHeadingMatch[0], '');
        }
    }

    const headingUsageMap = new Map<string, number>();
    const tocItems: TocItem[] = [];
    const contentWithHeadingIds = cleanContent.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (fullMatch: string, levelRaw: string, attributes: string, innerMarkup: string) => {
        const level = Number(levelRaw) as 2 | 3;
        const headingText = sanitizeHeadingText(innerMarkup);
        if (!headingText) return fullMatch;
        if (/id\s*=/.test(attributes)) {
            const existingIdMatch = attributes.match(/id\s*=\s*["']([^"']+)["']/i);
            if (existingIdMatch) {
                tocItems.push({ id: existingIdMatch[1], text: headingText, level });
            }
            return fullMatch;
        }
        const baseSlug = makeHeadingSlug(headingText) || `section-${tocItems.length + 1}`;
        const seenCount = headingUsageMap.get(baseSlug) || 0;
        const nextCount = seenCount + 1;
        headingUsageMap.set(baseSlug, nextCount);
        const headingId = nextCount === 1 ? `section-${baseSlug}` : `section-${baseSlug}-${nextCount}`;
        tocItems.push({ id: headingId, text: headingText, level });
        return `<h${level}${attributes} id="${headingId}">${innerMarkup}</h${level}>`;
    });

    let relatedPosts = await (prisma as any).blogPost.findMany({
        where: {
            isPublished: true,
            slug: { not: post.slug },
            category: post.category
        },
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    if (!relatedPosts.length) {
        relatedPosts = await (prisma as any).blogPost.findMany({
            where: {
                isPublished: true,
                slug: { not: post.slug }
            },
            orderBy: { createdAt: 'desc' },
            take: 3
        });
    }

    return (
        <div className="post-page">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Post Header */}
            <div className="post-header-top">
                <div className="content-inner">
                    <Link href="/blog" className="back-link">
                        <ChevronLeft size={20} /> Back to Insights
                    </Link>
                    <div className="category-tag">
                        {post.category}
                    </div>
                    <h1 className="post-title">
                        {post.title}
                    </h1>
                    <div className="post-meta">
                        <div className="meta-item">
                            <div className="author-avatar editorial-avatar">
                                <User size={18} color="#1fcb8f" />
                            </div>
                            {post.author || 'IAISR Editorial'}
                        </div>
                        <div className="meta-item">
                            <Calendar size={18} className="meta-icon" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                        <div className="meta-item">
                            <Clock size={18} className="meta-icon" />
                            {post.readTime || '5 min'} Read
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image Layout */}
            <div className="featured-image-container">
                {post.image ? (
                    <img src={post.image} alt={post.title} className="contained-hero-img" />
                ) : (
                    <div className="hero-fallback-contained" />
                )}
            </div>

            {/* Content Area */}
            <div className="content-container">
                <div className="layout-grid">
                    <article className="article-body">
                        <div
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: contentWithHeadingIds }}
                        />
                        <div className="author-bio-card">
                            <div className="author-bio-avatar">
                                {(post.author || 'IAISR Editorial').split(' ').filter(Boolean).slice(0, 2).map((segment: string) => segment[0]?.toUpperCase()).join('') || 'IA'}
                            </div>
                            <div>
                                <p className="author-bio-label">Written by</p>
                                <h3 className="author-bio-name">{post.author || 'IAISR Editorial'}</h3>
                                <p className="author-bio-text">
                                    IAISR editorial insights focused on practical, data-driven innovation across AgTech, climate resilience, and intelligent automation.
                                </p>
                            </div>
                        </div>

                    </article>

                    {/* Sidebar / Social */}
                    <BlogSidebar title={post.title} url={`${CONFERENCE_CONFIG.urls.canonical}/blog/${post.slug}`} tocItems={tocItems} />
                </div>
            </div>

            {relatedPosts.length > 0 && (
                <div className="related-articles-block">
                    <div className="related-inner">
                        <h2>You Might Also Like</h2>
                        <div className="related-articles-grid">
                            {relatedPosts.map((relatedPost: any) => (
                                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="related-article-card">
                                    <div className="related-article-meta">
                                        <span>{relatedPost.category}</span>
                                        <span>{relatedPost.readTime || '5 min read'}</span>
                                    </div>
                                    <h3>{relatedPost.title}</h3>
                                    <p>{relatedPost.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Related Sessions */}
            <div className="related-sessions">
                <div className="related-inner">
                    <h2>Dive Deeper at the Summit</h2>
                    <p>Continue exploring these topics with global experts at IAISR 2026.</p>

                    <div className="sessions-grid">
                        <Link href="/sessions" className="session-card">
                            <span className="session-track">AI in Robotics</span>
                            <h3>The Future of Autonomous Farming equipment</h3>
                            <button className="view-session-btn">View Session <ArrowRight size={16} /></button>
                        </Link>

                        <Link href="/sessions" className="session-card">
                            <span className="session-track">Data & Analytics</span>
                            <h3>Predictive Yield Models Using Machine Learning</h3>
                            <button className="view-session-btn">View Session <ArrowRight size={16} /></button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BlogPostPage;
