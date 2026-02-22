"use client";
import React, { useEffect, useState } from 'react';
import { FileText, ArrowRight, Calendar, Leaf } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    image: string | null;
    createdAt: string;
    category: string;
    readTime: string | null;
}

const normalizeImageUrl = (rawUrl: string | null | undefined) => {
    if (!rawUrl || rawUrl === 'null') return '';
    try {
        const parsed = new URL(rawUrl);
        const cropParams = ['fit', 'crop', 'h', 'height', 'rect', 'fp-x', 'fp-y', 'fp-z'];
        cropParams.forEach((param) => parsed.searchParams.delete(param));
        return parsed.toString();
    } catch {
        return rawUrl;
    }
};

const SafeImage = ({ src, alt, className, fallbackIcon: FallbackIcon, iconSize }: any) => {
    const [error, setError] = useState(false);
    const normalizedSrc = normalizeImageUrl(src);
    if (!normalizedSrc || error || normalizedSrc === 'null') {
        return (
            <div className={`fallback-container ${className}`} style={{ background: '#0a192f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {FallbackIcon && <FallbackIcon size={iconSize} color="var(--primary)" opacity={0.5} />}
            </div>
        );
    }
    return (
        <img
            src={normalizedSrc}
            alt={alt || 'Blog thumbnail'}
            className={className}
            onError={() => setError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );
};

const LatestBlogs: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog?t=' + Date.now(), { cache: 'no-store' });
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Extract top 3 published
                    const published = data.filter((p: any) => p.isPublished).slice(0, 3);
                    setPosts(published);
                }
            } catch (error) {
                console.error('Error fetching latest blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <section className="latest-blogs-section">
            <div className="container">
                <div className="section-header">
                    <div className="header-left">
                        <span className="section-label">LATEST FROM THE SUMMIT</span>
                        <h2 className="section-title">Insights & <span className="gradient-text">Featured Posts</span></h2>
                    </div>
                    {posts.length > 0 && (
                        <Link href="/blog" className="view-all-btn desktop-only">
                            View All Insights <ArrowRight size={18} />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="pulse-loader"></div>
                        <p>Loading latest insights...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="coming-soon-container glass-card">
                        <div className="coming-soon-content">
                            <div className="icon-wrapper">
                                <FileText size={40} className="floating-icon" />
                            </div>
                            <h3 className="coming-soon-title">Knowledge Base <span className="highlight-text">Coming Soon for AgTech 2026</span></h3>
                            <p className="coming-soon-text">
                                We're curating exclusive insights, session summaries, and expert interviews from the AgTech Transformation Summit 2026.
                            </p>
                            <Link href="/blog" className="explore-btn">
                                Visit Blog <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="latest-blogs-grid">
                            {posts.map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-home-card">
                                    <div className="blog-img-wrapper">
                                        <SafeImage
                                            src={post.image}
                                            alt={post.title}
                                            className="blog-img"
                                            iconSize={40}
                                            fallbackIcon={Leaf}
                                        />
                                        <div className="blog-category">{post.category}</div>
                                    </div>
                                    <div className="blog-info">
                                        <div className="blog-meta">
                                            <span><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{post.readTime || '5 min'} read</span>
                                        </div>
                                        <h3 className="blog-title">{post.title}</h3>
                                        <p className="blog-excerpt">{post.excerpt}</p>
                                        <div className="read-more">Read Article <ArrowRight size={14} /></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mobile-view-all">
                            <Link href="/blog" className="view-all-btn">
                                View All Insights <ArrowRight size={18} />
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .latest-blogs-section {
                    padding: 100px 0;
                    background: var(--bg-secondary);
                    position: relative;
                }

                .container {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 50px;
                }

                .section-label {
                    display: inline-block;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.85rem;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-weight: 800;
                    margin: 0;
                }

                .gradient-text {
                    background: linear-gradient(135deg, var(--primary) 0%, #4facfe 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .view-all-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                .view-all-btn:hover {
                    gap: 12px;
                    text-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
                }

                .mobile-view-all {
                    display: none;
                    text-align: center;
                    margin-top: 40px;
                }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-view-all { display: block; }
                    .section-header { flex-direction: column; align-items: flex-start; }
                }

                /* GRID LAYOUT */
                .latest-blogs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                }

                .blog-home-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    overflow: hidden;
                    text-decoration: none;
                    color: var(--foreground);
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                }

                :global([data-theme="light"]) .blog-home-card {
                    background: #fff;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .blog-home-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(var(--primary-rgb), 0.5);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .blog-img-wrapper {
                    height: 200px;
                    position: relative;
                    overflow: hidden;
                    background: #061126;
                }

                .blog-category {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background: var(--primary);
                    color: #000;
                    font-size: 0.75rem;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 12px;
                }

                .blog-info {
                    padding: 30px 24px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .blog-meta {
                    display: flex;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    align-items: center;
                }

                .blog-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    line-height: 1.4;
                    margin-bottom: 12px;
                    color: var(--text-primary);
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .blog-excerpt {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin-bottom: 24px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .read-more {
                    margin-top: auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--primary);
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: gap 0.2s;
                }

                .blog-home-card:hover .read-more {
                    gap: 10px;
                }

                /* LOADING / COMING SOON */
                .loading-state {
                    text-align: center;
                    padding: 60px 0;
                    color: var(--text-secondary);
                }

                .pulse-loader {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 3px solid rgba(var(--primary-rgb), 0.2);
                    border-top-color: var(--primary);
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .coming-soon-container {
                    padding: 80px 20px;
                    text-align: center;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .coming-soon-title { font-size: 2rem; font-weight: 800; margin: 20px 0; }
                .highlight-text { color: var(--primary); }
                .coming-soon-text { color: var(--text-secondary); max-width: 600px; margin: 0 auto 30px; line-height: 1.6; }
                .explore-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--primary);
                    color: #000;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                }
            `}</style>
        </section>
    );
};

export default LatestBlogs;

