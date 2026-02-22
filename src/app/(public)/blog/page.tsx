'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Search, Trophy, Leaf, ArrowRight, Bookmark, BookmarkCheck, Twitter, Linkedin, Copy } from 'lucide-react';
import Link from 'next/link';
import AgriQuiz from '@/components/AgriQuiz';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    category: string;
    image: string | null;
    readTime: string | null;
    createdAt: string;
}

const BOOKMARKS_KEY = 'iaisr_blog_bookmarks_v1';
const POSTS_PER_PAGE = 6;

const normalizeImageUrl = (rawUrl: string | null | undefined) => {
    if (!rawUrl || rawUrl === 'null') return rawUrl || '';
    try {
        const parsed = new URL(rawUrl);
        const cropParams = ['fit', 'crop', 'h', 'height', 'rect', 'fp-x', 'fp-y', 'fp-z'];
        cropParams.forEach((param) => parsed.searchParams.delete(param));
        return parsed.toString();
    } catch {
        return rawUrl;
    }
};

const getAuthorInitials = (name: string | null | undefined) => {
    const safeName = (name || 'IAISR Editorial').trim();
    const initials = safeName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');
    return initials || 'IA';
};

const upsertMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
    if (typeof document === 'undefined') return;
    let metaElement = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!metaElement) {
        metaElement = document.createElement('meta');
        metaElement.setAttribute(attribute, key);
        document.head.appendChild(metaElement);
    }
    metaElement.setAttribute('content', content);
};

const upsertCanonicalLink = (href: string) => {
    if (typeof document === 'undefined') return;
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', href);
};

const SafeImage = ({ src, alt, className, fallbackClassName, fallbackIcon: FallbackIcon, iconSize }: any) => {
    const [error, setError] = useState(false);
    const normalizedSrc = normalizeImageUrl(src);
    if (!normalizedSrc || error || normalizedSrc === 'null') {
        return (
            <div className={`${fallbackClassName} fallback-container`}>
                {FallbackIcon && <FallbackIcon size={iconSize} className="fallback-icon" />}
            </div>
        );
    }
    return (
        <img
            src={normalizedSrc}
            alt={alt || 'AgTech article image'}
            className={className}
            onError={() => setError(true)}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
                imageRendering: 'auto',
                display: 'block'
            }}
        />
    );
};

export default function BlogListingPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [email, setEmail] = useState('');
    const [mounted, setMounted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, true>>({});
    const [siteOrigin, setSiteOrigin] = useState('');

    useEffect(() => {
        setMounted(true);
        setSiteOrigin(window.location.origin);
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog?t=' + Date.now(), { cache: 'no-store' });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPosts(data.filter((p: any) => p.isPublished));
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!mounted || !siteOrigin) return;
        document.title = 'AgTech Insights Blog | IAISR';
        const description = 'Explore IAISR AgTech insights on robotics, sustainability, precision agriculture, and innovation.';
        upsertMetaTag('name', 'description', description);
        upsertMetaTag('property', 'og:title', 'AgTech Insights Blog | IAISR');
        upsertMetaTag('property', 'og:description', description);
        upsertMetaTag('property', 'og:type', 'website');
        upsertMetaTag('name', 'twitter:card', 'summary_large_image');
        upsertMetaTag('name', 'twitter:title', 'AgTech Insights Blog | IAISR');
        upsertMetaTag('name', 'twitter:description', description);
        upsertCanonicalLink(`${siteOrigin}/blog`);
    }, [mounted, siteOrigin]);

    useEffect(() => {
        try {
            const storedBookmarks = window.localStorage.getItem(BOOKMARKS_KEY);
            if (storedBookmarks) {
                const parsedBookmarks = JSON.parse(storedBookmarks);
                if (parsedBookmarks && typeof parsedBookmarks === 'object') {
                    setBookmarkedPosts(parsedBookmarks);
                }
            }
        } catch (error) {
            console.error('Failed to load bookmarks', error);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedPosts));
    }, [bookmarkedPosts, mounted]);

    const baseCategories = ['All', 'Precision Agriculture', 'Robotics', 'Sustainability', 'Financial inclusion', 'Climate-Smart Farming', 'Startup Ecosystem', 'AI in AgTech'];
    const activeCategories = Array.from(new Set(['All', ...posts.map(p => p.category), ...baseCategories]));

    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        setVisibleCount(POSTS_PER_PAGE);
    }, [selectedCategory, searchQuery, posts.length]);

    const postsForGrid = useMemo(() => filteredPosts.slice(1), [filteredPosts]);
    const visiblePosts = useMemo(() => postsForGrid.slice(0, visibleCount), [postsForGrid, visibleCount]);
    const hasMorePosts = visiblePosts.length < postsForGrid.length;

    const toggleBookmark = (slug: string) => {
        setBookmarkedPosts((previousBookmarks) => {
            const nextBookmarks = { ...previousBookmarks };
            if (nextBookmarks[slug]) {
                delete nextBookmarks[slug];
            } else {
                nextBookmarks[slug] = true;
            }
            return nextBookmarks;
        });
    };

    const getArticleUrl = (slug: string) => {
        if (siteOrigin) return `${siteOrigin}/blog/${slug}`;
        return `/blog/${slug}`;
    };

    const copyArticleLink = async (slug: string) => {
        try {
            const absoluteUrl = getArticleUrl(slug).startsWith('http')
                ? getArticleUrl(slug)
                : `${window.location.origin}${getArticleUrl(slug)}`;
            await navigator.clipboard.writeText(absoluteUrl);
        } catch (error) {
            console.error('Failed to copy article link', error);
        }
    };

    return (
        <div className="blog-page">
            {/* HERO SECTION */}
            <header className="blog-hero">
                <div className="hero-content">
                    <div className="badge-wrapper">
                        <span className="insights-badge">NEW INSIGHTS AVAILABLE</span>
                    </div>
                    <div className="title-stack">
                        <h1 className="hero-title">
                            Intelligence for the<br />
                            <span className="highlight">Future of AgTech</span>
                        </h1>
                        <p className="hero-subtitle">
                            Accelerate your understanding with cutting-edge research, trends, and breakthroughs in global agriculture and robotics.
                        </p>
                    </div>
                </div>

                {/* DYNAMIC FEATURED POST */}
                {filteredPosts.length > 0 && (
                    <div className="featured-card-v2">
                        <div className="featured-tag">FEATURED / {filteredPosts[0].category.toUpperCase()}</div>
                        <div className="featured-image-box">
                            <SafeImage
                                src={filteredPosts[0].image || '/banner1.jpeg'}
                                alt={filteredPosts[0].title}
                                className="featured-img-main"
                                fallbackClassName="featured-fallback-box"
                                iconSize={80}
                                fallbackIcon={Leaf}
                            />
                        </div>
                        <div className="featured-info">
                            <div className="meta-row">
                                <span><Calendar size={14} /> {mounted ? new Date(filteredPosts[0].createdAt).toLocaleDateString() : ''}</span>
                                <span><Clock size={14} /> {filteredPosts[0].readTime || '5 min'}</span>
                                <span className="top-read-label">📈 Top Read</span>
                            </div>
                            <h2 className="featured-title-main">{filteredPosts[0].title}</h2>
                            <p className="featured-paragraph">
                                {filteredPosts[0].excerpt}
                            </p>
                            <div className="featured-footer-row">
                                <div className="author-info">
                                    <div className="author-avatar author-avatar-initials">{getAuthorInitials(filteredPosts[0].author)}</div>
                                    <span className="author-name">{filteredPosts[0].author || 'IAISR Editorial'}</span>
                                </div>
                                <div className="featured-actions">
                                    <button
                                        type="button"
                                        className={`bookmark-btn ${bookmarkedPosts[filteredPosts[0].slug] ? 'active' : ''}`}
                                        onClick={() => toggleBookmark(filteredPosts[0].slug)}
                                        aria-label={bookmarkedPosts[filteredPosts[0].slug] ? 'Remove bookmark' : 'Save article'}
                                    >
                                        {bookmarkedPosts[filteredPosts[0].slug] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        <span>{bookmarkedPosts[filteredPosts[0].slug] ? 'Saved' : 'Save'}</span>
                                    </button>
                                    <Link href={`/blog/${filteredPosts[0].slug}`} className="read-btn-v2">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEARCH BAR (Bottom of Hero) */}
                <div className="search-section">
                    <div className="search-container-v2">
                        <Search className="search-icon-dim" size={20} />
                        <input
                            type="text"
                            placeholder="Discover insights by keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* CATEGORY & POSTS SECTION */}
            <main className="posts-section">
                <div className="section-header">
                    <div className="category-tabs">
                        {activeCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={selectedCategory === cat ? 'tab active' : 'tab'}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="pulse-loader"></div>
                        <p>Loading latest insights...</p>
                    </div>
                ) : (
                    <>
                    <div className="posts-grid-v2">
                        {visiblePosts.map((post, idx) => (
                            <React.Fragment key={post.slug}>
                                <article className="blog-card-v2">
                                    <Link href={`/blog/${post.slug}`} className="card-image-link" aria-label={`Read ${post.title}`}>
                                        <div className="card-image-v2">
                                        <SafeImage
                                            src={post.image}
                                            alt={post.title}
                                            className="card-img-fit"
                                            fallbackClassName="card-fallback-box"
                                            iconSize={40}
                                            fallbackIcon={Leaf}
                                        />
                                            <div className="card-tag-v2">{post.category}</div>
                                        </div>
                                    </Link>
                                    <div className="card-content-v2">
                                        <div className="card-meta-v2">
                                            <span><Calendar size={12} /> {mounted ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                                            <span>•</span>
                                            <span>{post.readTime || '5 min'} read</span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`} className="card-title-link">
                                            <h3 className="card-title-v2">{post.title}</h3>
                                        </Link>
                                        <p className="card-excerpt-v2">{post.excerpt}</p>
                                        <div className="card-footer-v2">
                                            <div className="author-meta">
                                                <div className="author-mini-avatar">{getAuthorInitials(post.author)}</div>
                                                <span>{post.author || 'IAISR Editorial'}</span>
                                            </div>
                                            <Link href={`/blog/${post.slug}`} className="read-more-link">Read More</Link>
                                        </div>
                                        <div className="card-actions-row">
                                            <button
                                                type="button"
                                                className={`card-action-btn bookmark-btn ${bookmarkedPosts[post.slug] ? 'active' : ''}`}
                                                onClick={() => toggleBookmark(post.slug)}
                                                aria-label={bookmarkedPosts[post.slug] ? `Remove bookmark for ${post.title}` : `Save ${post.title}`}
                                            >
                                                {bookmarkedPosts[post.slug] ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                                                <span>{bookmarkedPosts[post.slug] ? 'Saved' : 'Save'}</span>
                                            </button>
                                            <a
                                                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Read this on IAISR: ${post.title}`)}&url=${encodeURIComponent(getArticleUrl(post.slug).startsWith('http') ? getArticleUrl(post.slug) : `${siteOrigin}${getArticleUrl(post.slug)}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="card-action-btn icon-only"
                                                aria-label={`Share ${post.title} on X`}
                                            >
                                                <Twitter size={15} />
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getArticleUrl(post.slug).startsWith('http') ? getArticleUrl(post.slug) : `${siteOrigin}${getArticleUrl(post.slug)}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="card-action-btn icon-only"
                                                aria-label={`Share ${post.title} on LinkedIn`}
                                            >
                                                <Linkedin size={15} />
                                            </a>
                                            <button
                                                type="button"
                                                className="card-action-btn icon-only"
                                                onClick={() => copyArticleLink(post.slug)}
                                                aria-label={`Copy ${post.title} link`}
                                            >
                                                <Copy size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </article>

                                {/* Insert Quiz Card after the first 2 grid items (which are posts 2 and 3) */}
                                {idx === 1 && (
                                    <div
                                        className="quiz-card-v2"
                                        onClick={() => document.getElementById('knowledge-harvest')?.scrollIntoView({ behavior: 'smooth' })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="quiz-card-inner">
                                            <div className="quiz-icon-hex"><Trophy size={24} /></div>
                                            <span className="quiz-badge">KNOWLEDGE CHALLENGE</span>
                                            <h3 className="quiz-title-v2">Ready to Harvest?</h3>
                                            <p className="quiz-text-v2">Test your AgTech expertise and earn exclusive digital rewards.</p>
                                            <button className="quiz-start-btn">Take the Quiz</button>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Fallback Quiz Card if there are fewer than 2 items in the grid */}
                        {visiblePosts.length <= 2 && (
                            <div
                                className="quiz-card-v2"
                                onClick={() => document.getElementById('knowledge-harvest')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="quiz-card-inner">
                                    <div className="quiz-icon-hex"><Trophy size={24} /></div>
                                    <span className="quiz-badge">KNOWLEDGE CHALLENGE</span>
                                    <h3 className="quiz-title-v2">Ready to Harvest?</h3>
                                    <p className="quiz-text-v2">Test your AgTech expertise and earn exclusive digital rewards.</p>
                                    <button className="quiz-start-btn">Take the Quiz</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {hasMorePosts && (
                        <div className="load-more-wrap">
                            <button
                                type="button"
                                className="load-more-btn"
                                onClick={() => setVisibleCount((prevCount) => prevCount + POSTS_PER_PAGE)}
                                aria-label="Load more articles"
                            >
                                Load More Insights
                            </button>
                        </div>
                    )}
                    </>
                )}
            </main>

            {/* NEWSLETTER STRIPE */}
            <section className="newsletter-stripe-v2">
                <div className="stripe-inner">
                    <div className="stripe-text">
                        <h2 className="stripe-title">Stay Ahead of the Curve</h2>
                        <p className="stripe-subtitle">Get the latest AgTech breakthroughs and trends delivered to your inbox weekly.</p>
                    </div>
                    <form className="stripe-form" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your business email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <button type="submit">Join Insiders</button>
                    </form>
                </div>
            </section>

            <AgriQuiz />

            <style jsx>{`
                .blog-page {
                    background-color: var(--background);
                    min-height: 100vh;
                    color: var(--foreground);
                    font-family: 'Inter', sans-serif;
                    padding-bottom: 24px;
                    max-width: 100%;
                    overflow-x: hidden;
                    overflow-x: clip;
                }
                :global(.main-footer) { margin-top: 32px; }

                .blog-hero {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    padding: 40px 20px;
                    position: relative;
                }

                .hero-content {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .insights-badge {
                    background: rgba(31, 203, 143, 0.1);
                    color: var(--primary);
                    padding: 8px 16px;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    border: 1px solid rgba(31, 203, 143, 0.2);
                }

                .hero-title {
                    font-size: clamp(2rem, 7vw, 4rem);
                    font-weight: 900;
                    line-height: 1.1;
                    margin: 24px 0;
                    letter-spacing: -0.02em;
                    color: var(--text-primary);
                }

                .highlight {
                    background: var(--gradient-main);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    color: var(--text-secondary);
                    font-size: 1.125rem;
                    line-height: 1.6;
                    max-width: 700px;
                    margin: 0 auto;
                }

                /* FEATURED CARD */
                .featured-card-v2 {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 40px;
                    overflow: hidden;
                    margin-bottom: 60px;
                    position: relative;
                    box-shadow: var(--shadow-md);
                }

                .featured-tag {
                    position: absolute;
                    top: 30px;
                    left: 30px;
                    z-index: 5;
                    background: var(--primary);
                    color: black;
                    padding: 6px 14px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                    box-shadow: var(--shadow-sm);
                }

                .featured-image-box {
                    width: 100%;
                    height: 450px;
                    overflow: hidden;
                    background: #061126;
                }

                .featured-img-main {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center center;
                    image-rendering: auto;
                }

                .featured-info {
                    padding: 40px;
                    background: var(--bg-secondary);
                }

                .meta-row {
                    display: flex;
                    gap: 20px;
                    color: var(--text-secondary);
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    row-gap: 8px;
                }

                .top-read-label {
                    color: var(--primary);
                }

                .featured-title-main {
                    font-size: clamp(1.75rem, 5vw, 2.5rem);
                    font-weight: 900;
                    line-height: 1.2;
                    margin-bottom: 20px;
                    color: var(--text-primary);
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                .featured-paragraph {
                    color: var(--text-secondary);
                    font-size: 1.125rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    max-width: 800px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                .featured-footer-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 30px;
                    border-top: 1px solid var(--border-color);
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .author-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .author-avatar {
                    width: 36px;
                    height: 36px;
                    background: var(--bg-elevated);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .author-avatar-initials {
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                }
                .featured-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-left: auto;
                    flex-wrap: wrap;
                }

                .read-btn-v2 {
                    background: var(--primary);
                    color: black;
                    padding: 12px 30px;
                    border-radius: 16px;
                    font-weight: 900;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                    box-shadow: var(--shadow-sm);
                }
                .read-btn-v2:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
                .bookmark-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    border-radius: 12px;
                    padding: 10px 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .bookmark-btn:hover {
                    color: var(--text-primary);
                    border-color: var(--primary);
                }
                .bookmark-btn.active {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(31, 203, 143, 0.08);
                }

                /* SEARCH */
                .search-section {
                    display: flex;
                    justify-content: center;
                }

                .search-container-v2 {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    padding: 0 25px;
                    width: 100%;
                    max-width: 800px;
                    display: flex;
                    align-items: center;
                    height: 70px;
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-md);
                }

                .search-icon-dim { color: var(--text-muted); margin-right: 15px; }

                .search-container-v2 input {
                    background: transparent;
                    border: none;
                    color: var(--foreground);
                    font-size: 1.125rem;
                    flex: 1 1 auto;
                    min-width: 0;
                    width: auto;
                    outline: none;
                }
                .search-container-v2 input::placeholder { color: var(--text-muted); }

                /* MAIN SECTION */
                .posts-section {
                    max-width: var(--max-width);
                    margin: 80px auto 0;
                    padding: 0 20px;
                }

                .category-tabs {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    max-width: 100%;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior-x: contain;
                    scrollbar-width: none;
                    padding-bottom: 20px;
                    margin-bottom: 40px;
                }
                .category-tabs::-webkit-scrollbar { display: none; }

                .tab {
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    padding: 10px 24px;
                    border-radius: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    flex: 0 0 auto;
                    transition: all 0.2s;
                }
                .tab.active {
                    background: linear-gradient(120deg, var(--primary), var(--primary-hover));
                    color: black;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(31, 203, 143, 0.16);
                }
                .tab:focus-visible {
                    outline: 2px solid var(--primary);
                    outline-offset: 2px;
                }

                /* GRID */
                .posts-grid-v2 {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                    align-items: stretch;
                }
                .posts-grid-v2 > * { min-width: 0; }
                @media (max-width: 1024px) {
                    .posts-grid-v2 {
                        grid-template-columns: minmax(0, 1fr);
                    }
                }

                .blog-card-v2 {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 22px;
                    overflow: hidden;
                    color: var(--foreground);
                    transition: all 0.3s;
                    max-width: 100%;
                    width: 100%;
                    min-width: 0;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }
                .blog-card-v2:hover { transform: translateY(-10px); background: var(--bg-elevated); }
                .card-image-link {
                    display: block;
                    text-decoration: none;
                    color: inherit;
                }

                .card-image-v2 {
                    width: 100%;
                    height: 220px;
                    max-height: 220px;
                    position: relative;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: #061126;
                }

                .card-img-fit { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: contain;
                    object-position: center center;
                    image-rendering: auto;
                    display: block;
                }
                .card-tag-v2 { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.6); padding: 5px 12px; border-radius: 10px; font-size: 10px; font-weight: 900; z-index: 2; }

                .card-content-v2 { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; gap: 8px; width: 100%; min-width: 0; }
                .card-meta-v2 { color: var(--text-muted); font-size: 12px; display: flex; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; row-gap: 6px; white-space: normal; }
                .card-title-link {
                    text-decoration: none;
                    color: inherit;
                }
                .card-title-v2 { font-size: 1.35rem; font-weight: 800; line-height: 1.3; margin-bottom: 4px; color: var(--text-primary); overflow-wrap: anywhere; word-break: break-word; white-space: normal !important; max-width: 100%; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
                .card-excerpt-v2 { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.55; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; word-break: break-word; white-space: normal !important; }

                .card-footer-v2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                    margin-top: auto;
                }

                .author-meta { font-size: 12px; color: var(--text-muted); display: flex; gap: 8px; align-items: center; min-width: 0; white-space: normal; }
                .author-mini-avatar {
                    width: 20px;
                    height: 20px;
                    border-radius: 999px;
                    background: rgba(31, 203, 143, 0.15);
                    color: var(--primary);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.62rem;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    flex-shrink: 0;
                }
                .read-more-link { font-size: 12px; font-weight: 800; color: var(--primary); min-width: 0; text-align: right; text-decoration: none; }
                .card-actions-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                    padding-top: 4px;
                }
                .card-action-btn {
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-secondary);
                    border-radius: 999px;
                    height: 32px;
                    padding: 0 12px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .card-action-btn:hover {
                    border-color: var(--primary);
                    color: var(--text-primary);
                }
                .card-action-btn:focus-visible,
                .load-more-btn:focus-visible,
                .bookmark-btn:focus-visible {
                    outline: 2px solid var(--primary);
                    outline-offset: 2px;
                }
                .card-action-btn.icon-only {
                    width: 32px;
                    justify-content: center;
                    padding: 0;
                }
                .load-more-wrap {
                    display: flex;
                    justify-content: center;
                    margin-top: 28px;
                }
                .load-more-btn {
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border-radius: 14px;
                    padding: 12px 22px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .load-more-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    transform: translateY(-1px);
                }

                /* LOADER */
                .loading-state { text-align: center; padding: 100px; color: #475569; }
                .pulse-loader { width: 40px; height: 40px; background: #1fcb8f; border-radius: 50%; margin: 0 auto 20px; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(0.8); opacity: 0.5; } }

                /* QUIZ CARD IN GRID */
                .quiz-card-v2 {
                    background: var(--bg-tertiary);
                    border: 2px dashed var(--primary);
                    border-radius: 32px;
                    padding: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    min-height: 400px;
                    width: 100%;
                    transition: all 0.3s ease;
                }
                .quiz-card-v2:hover { background: var(--bg-elevated); border-style: solid; box-shadow: var(--shadow-md); }

                .quiz-icon-hex {
                    width: 50px;
                    height: 50px;
                    background: var(--primary);
                    color: black;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    transform: rotate(45deg);
                }
                .quiz-icon-hex > :global(svg) { transform: rotate(-45deg); }

                .quiz-badge { font-size: 10px; font-weight: 900; color: var(--primary); letter-spacing: 0.1em; display: block; margin-bottom: 10px; }
                .quiz-title-v2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 15px; color: var(--text-primary); }
                .quiz-text-v2 { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; }
                .quiz-start-btn { 
                    background: var(--primary); 
                    border: none; 
                    color: black; 
                    padding: 12px 30px; 
                    border-radius: 12px; 
                    font-weight: 800; 
                    cursor: pointer; 
                    transition: all 0.2s; 
                    box-shadow: var(--shadow-sm);
                }
                .quiz-start-btn:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }

                /* NEWSLETTER STRIPE */
                .newsletter-stripe-v2 {
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    padding: 80px 20px;
                    margin-top: 80px;
                    position: relative;
                    z-index: 5;
                }

                .stripe-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                    align-items: center;
                    text-align: center;
                }
                @media (min-width: 1024px) {
                    .stripe-inner { flex-direction: row; justify-content: space-between; text-align: left; }
                }

                .stripe-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 10px; color: var(--text-primary); }
                .stripe-subtitle { color: var(--text-secondary); font-size: 1.125rem; max-width: 500px; }

                .stripe-form {
                    display: flex;
                    gap: 10px;
                    width: 100%;
                    max-width: 500px;
                }
                
                .stripe-form input {
                    flex: 1;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    padding: 15px 25px;
                    border-radius: 16px;
                    color: var(--foreground);
                    outline: none;
                }
                .stripe-form button {
                    background: var(--primary);
                    color: black;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 16px;
                    font-weight: 900;
                    cursor: pointer;
                    white-space: nowrap;
                    box-shadow: var(--shadow-sm);
                }
                .stripe-form button:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

                /* Prevent mobile overlap by forcing clear layout flow */
                @media (max-width: 768px) {
                    .blog-page { padding-bottom: 0; }
                    :global(.main-footer) { margin-top: 20px; }
                    .blog-hero { padding: 20px 15px; }
                    .hero-content { margin-bottom: 25px; }
                    .hero-title { font-size: 1.65rem; line-height: 1.2; margin: 8px 0; }
                    .hero-subtitle { font-size: 0.82rem; line-height: 1.45; max-width: 92%; }
                    
                    .search-container-v2 { height: 50px; border-radius: 16px; margin-top: 20px; }
                    .search-icon-dim { width: 16px; margin-right: 10px; }
                    .search-container-v2 input { font-size: 0.95rem; }

                    .posts-section { margin-top: 40px; padding: 0 15px; overflow-x: hidden; }
                    .category-tabs { margin-bottom: 25px; padding-bottom: 10px; }
                    .tab { padding: 8px 16px; font-size: 0.85rem; border-radius: 12px; }

                    .featured-card-v2 { border-radius: 16px; margin-bottom: 25px; width: 100%; max-width: 100%; }
                    .featured-image-box { height: 160px; background: #061126; }
                    .featured-img-main {
                        object-fit: contain;
                        object-position: center center;
                        image-rendering: auto;
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                    .featured-info { padding: 15px; }
                    .featured-title-main { font-size: 1.1rem; margin-bottom: 10px; }
                    .featured-paragraph { font-size: 0.85rem; line-height: 1.4; margin-bottom: 15px; -webkit-line-clamp: 2; }
                    .featured-tag { top: 12px; left: 12px; padding: 2px 6px; font-size: 8px; }
                    .meta-row { gap: 8px; font-size: 11px; margin-bottom: 12px; }
                    .featured-footer-row { flex-direction: column; align-items: stretch; gap: 12px; }
                    .featured-actions { width: 100%; margin-left: 0; }
                    .bookmark-btn { width: 100%; justify-content: center; }
                    .read-btn-v2 { width: 100%; justify-content: center; padding: 8px; border-radius: 10px; font-size: 13px; }

                    .posts-grid-v2 { gap: 15px; margin-bottom: 25px; justify-items: stretch; min-width: 0; grid-template-columns: minmax(0, 1fr); }
                    .blog-card-v2 { border-radius: 14px; width: 100%; max-width: 100%; min-width: 0; }
                    .blog-card-v2:hover { transform: none; }
                    .card-image-v2 { height: 150px; background: #061126; }
                    .card-img-fit {
                        object-fit: contain;
                        object-position: center center;
                        image-rendering: auto;
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                    .card-tag-v2 { top: 12px; left: 12px; padding: 4px 10px; font-size: 9px; border-radius: 8px; }
                    .card-content-v2 { padding: 14px; min-width: 0; gap: 8px; }
                    .card-meta-v2 { flex-wrap: wrap; row-gap: 6px; }
                    .card-title-v2 { font-size: 1.1rem; line-height: 1.3; margin-bottom: 4px; -webkit-line-clamp: 2; }
                    .card-excerpt-v2 { font-size: 0.85rem; line-height: 1.4; margin-bottom: 15px; -webkit-line-clamp: 2; }
                    .card-footer-v2 { padding-top: 15px; align-items: flex-start; }
                    .author-mini-avatar { width: 18px; height: 18px; font-size: 0.55rem; }
                    .card-actions-row { gap: 6px; }
                    .card-action-btn { height: 30px; padding: 0 10px; font-size: 0.72rem; }
                    .card-action-btn.icon-only { width: 30px; }
                    .load-more-wrap { margin-top: 18px; }
                    .load-more-btn { width: 100%; padding: 10px 14px; border-radius: 12px; }

                    .quiz-card-v2 { min-height: auto; padding: 25px 15px; border-radius: 16px; margin-bottom: 20px; width: 100%; max-width: 100%; }
                    .quiz-icon-hex { width: 40px; height: 40px; margin-bottom: 15px; }
                    .quiz-title-v2 { font-size: 1.35rem; margin-bottom: 10px; }
                    .quiz-text-v2 { font-size: 0.85rem; margin-bottom: 20px; }
                    .quiz-start-btn { width: 100%; padding: 10px; }

                    .newsletter-stripe-v2 { padding: 40px 15px; margin-top: 40px; text-align: center; }
                    .stripe-inner { gap: 25px; }
                    .stripe-title { font-size: 1.5rem; margin-bottom: 8px; }
                    .stripe-subtitle { font-size: 0.9rem; margin: 0 auto; }
                    .stripe-form { flex-direction: column; gap: 12px; }
                    .stripe-form input { width: 100%; border-radius: 12px; padding: 12px 15px; }
                    .stripe-form button { width: 100%; border-radius: 12px; padding: 12px; }
                }
            `}</style>
        </div>
    );
}
