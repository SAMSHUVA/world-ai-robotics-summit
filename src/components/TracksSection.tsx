"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sprout, Cpu, Brain, Leaf, ShieldCheck, Wrench, ArrowRight, Plus, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { conferenceTracks, getIcon } from '../config/conferenceData';

interface ProposedTrack {
    id: string;
    title: string;
    author: string;
    description?: string;
    created_at: string;
    votes: number;
}

export default function TracksSection() {
    const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Community Tracks State
    const [proposedTracks, setProposedTracks] = useState<ProposedTrack[]>([]);
    const [isProposing, setIsProposing] = useState(false);
    const [proposalTitle, setProposalTitle] = useState('');
    const [proposalAuthor, setProposalAuthor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

    React.useEffect(() => {
        setIsMounted(true);
        fetchProposedTracks();
        // Load previously voted IDs from localStorage
        const stored = localStorage.getItem('voted_tracks');
        if (stored) setVotedIds(new Set(JSON.parse(stored)));

        // Subscribe to real-time changes
        const channel = supabase
            .channel('proposed_tracks_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'proposed_tracks' },
                (payload) => {
                    const newTrack = payload.new as ProposedTrack;
                    setProposedTracks(current => [newTrack, ...current]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchProposedTracks = async () => {
        const { data, error } = await supabase
            .from('proposed_tracks')
            .select('*')
            .eq('is_approved', true)
            .order('votes', { ascending: false })
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProposedTracks(data);
        }
    };

    const handleVote = async (id: string) => {
        if (votedIds.has(id)) return; // already voted
        const track = proposedTracks.find(t => t.id === id);
        if (!track) return;

        // Optimistic UI update
        setProposedTracks(curr =>
            curr.map(t => t.id === id ? { ...t, votes: (t.votes || 0) + 1 } : t)
                .sort((a, b) => (b.votes || 0) - (a.votes || 0))
        );

        const newVoted = new Set(votedIds);
        newVoted.add(id);
        setVotedIds(newVoted);
        localStorage.setItem('voted_tracks', JSON.stringify(Array.from(newVoted)));

        // Persist to DB
        await supabase
            .from('proposed_tracks')
            .update({ votes: (track.votes || 0) + 1 })
            .eq('id', id);
    };

    const handlePropose = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proposalTitle.trim()) return;

        setIsSubmitting(true);
        const { error } = await supabase
            .from('proposed_tracks')
            .insert([{
                title: proposalTitle,
                author: proposalAuthor || 'Anonymous',
                is_approved: true
            }]);

        if (error) {
            console.error('Supabase insert error:', error);
            alert(`Failed to submit proposal: ${error.message}`);
        } else {
            setProposalTitle('');
            setProposalAuthor('');
            setIsProposing(false);
            await fetchProposedTracks(); // Refresh the list immediately
        }
        setIsSubmitting(false);
    };

    const toggleTrack = (id: string) => {
        setExpandedTrack(expandedTrack === id ? null : id);
    };

    if (!isMounted) return null;

    return (
        <section className="tracks-section" id="tracks">
            <div className="container">
                <div className="section-header">
                    <span className="badge">CONFERENCE FOCUS</span>
                    <h2>Sessions & <span className="text-gradient">Tracks</span></h2>
                    <p>An academic-led exploration into the future of agriculture, structured into 6 critical tracks.</p>
                </div>

                <div className="tracks-grid">
                    {conferenceTracks.map((track) => {
                        const isExpanded = expandedTrack === track.id;

                        return (
                            <div
                                key={track.id}
                                className={`track-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => toggleTrack(track.id)}
                            >
                                <div className="track-header">
                                    <div className="track-icon-wrapper" style={{ '--track-color': track.color } as any}>
                                        {getIcon(track.iconName, { size: 24, color: track.color })}
                                    </div>
                                    <div className="track-info">
                                        <h3>{track.title}</h3>
                                        <p className="track-theme">{track.theme}</p>
                                        <span className="topic-count">{track.topics.length} Specified Tracks</span>
                                    </div>
                                    <div className="expand-icon">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="track-content"
                                        >
                                            <ul className="topics-list">
                                                {track.topics.map((topic, i) => (
                                                    <li key={i}>
                                                        <ArrowRight size={14} className="list-icon" />
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="academic-relevance">
                                                <h4>Academic Relevance</h4>
                                                <p>{track.academicRelevance}</p>
                                            </div>

                                            <a href="/call-for-papers" className="track-link">
                                                Submit Abstract for this Track →
                                            </a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* --- Community Proposed Tracks Section --- */}
                <div className="community-tracks-container">
                    <div className="community-header-row">
                        <div className="header-info">
                            <div className="community-badge">Audience Choice</div>
                            <h2>Community Suggestions</h2>
                            <p>Topics proposed by our global attendees. Vote or suggest your own area of interest!</p>
                        </div>
                        <button
                            className={`btn-propose ${isProposing ? 'active' : ''}`}
                            onClick={() => setIsProposing(!isProposing)}
                        >
                            {isProposing ? 'Cancel Suggestion' : '+ Suggest a Topic'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isProposing && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="proposal-form-wrapper"
                            >
                                <form onSubmit={handlePropose} className="proposal-form glass-card">
                                    <div className="form-group">
                                        <label>Suggested Topic Title</label>
                                        <input
                                            type="text"
                                            value={proposalTitle}
                                            onChange={(e) => setProposalTitle(e.target.value)}
                                            placeholder="e.g., Quantum Machine Learning"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Your Name / Institution</label>
                                        <input
                                            type="text"
                                            value={proposalAuthor}
                                            onChange={(e) => setProposalAuthor(e.target.value)}
                                            placeholder="e.g., John Smith, MIT"
                                        />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="submit-proposal-btn">
                                        {isSubmitting ? 'Submitting...' : <><Send size={18} /> Send Proposal</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="community-tracks-list">
                        {proposedTracks.length > 0 ? (
                            <div className="community-grid">
                                {proposedTracks.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="community-card"
                                    >
                                        <div className="card-inner">
                                            <div className="card-meta-row">
                                                <span className="date">{new Date(track.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="status-tag">Live</span>
                                            </div>
                                            <h4 className="card-title">{track.title}</h4>
                                            <p className="author">Suggested by <strong>{track.author}</strong></p>
                                            <button
                                                className={`vote-btn ${votedIds.has(track.id) ? 'voted' : ''}`}
                                                onClick={() => handleVote(track.id)}
                                                disabled={votedIds.has(track.id)}
                                            >
                                                {votedIds.has(track.id) ? (
                                                    <>
                                                        <span className="vote-icon">✓</span>
                                                        <span className="vote-label">You voted &nbsp;·&nbsp; {track.votes || 0} {(track.votes || 0) === 1 ? 'vote' : 'votes'}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="vote-icon">👍</span>
                                                        <span className="vote-label">Vote for this topic &nbsp;·&nbsp; {track.votes || 0} {(track.votes || 0) === 1 ? 'vote' : 'votes'}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-community glass-card">
                                <p>No community suggestions yet. Be the first to shape the summit!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tracks-section {
                    padding: 100px 0;
                    background: transparent;
                    position: relative;
                    overflow: hidden;
                    color: var(--text-primary, white);
                    transition: background 0.3s ease, color 0.3s ease;
                }
                
                :global([data-theme="light"]) .tracks-section {
                    background: transparent;
                }

                .container {
                    position: relative;
                    z-index: 2;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .badge {
                    font-size: 0.8rem;
                    color: #5B4DFF;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 16px;
                    display: block;
                }

                h2 {
                    font-size: clamp(2.5rem, 5vw, 3.5rem);
                    font-weight: 800;
                    margin-bottom: 20px;
                    background: linear-gradient(to right, var(--text-primary, #fff), #a5b4fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                :global([data-theme="light"]) h2 {
                    background: linear-gradient(to right, #1e293b, #6366f1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .section-desc {
                    color: var(--text-secondary, rgba(255, 255, 255, 0.6));
                    font-size: 1.2rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                /* Tracks Grid */
                .tracks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                    gap: 24px;
                    margin-bottom: 120px;
                }
                
                .track-card {
                    background: var(--glass-bg, rgba(255, 255, 255, 0.03));
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
                    border-radius: 24px;
                    padding: 32px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                    overflow: hidden;
                }

                :global([data-theme="light"]) .track-card {
                    background: white;
                    border-color: rgba(91, 77, 255, 0.1);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                }
                
                .track-card:hover {
                    background: var(--glass-bg-hover, rgba(255, 255, 255, 0.05));
                    border-color: var(--primary, rgba(255, 255, 255, 0.2));
                    transform: translateY(-4px);
                }

                :global([data-theme="light"]) .track-card:hover {
                    background: white;
                    border-color: #5B4DFF;
                    box-shadow: 0 10px 30px rgba(91, 77, 255, 0.1);
                }

                .track-card.expanded {
                    background: var(--glass-bg-active, rgba(255, 255, 255, 0.08));
                    border-color: rgba(91, 77, 255, 0.4);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }

                :global([data-theme="light"]) .track-card.expanded {
                    background: white;
                    border-color: #5B4DFF;
                    box-shadow: 0 20px 40px rgba(91, 77, 255, 0.1);
                }
                
                .track-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                
                .track-icon-wrapper {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: rgba(var(--track-color-rgb), 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(var(--track-color-rgb), 0.2);
                    font-size: 24px;
                }
                
                .track-info h3 {
                    font-size: 1.35rem; /* Slightly smaller top title */
                    font-weight: 800;
                    margin: 0 0 6px 0;
                    color: var(--text-primary, #fff);
                    line-height: 1.2;
                }
                
                .track-theme {
                    font-size: 0.95rem;
                    color: var(--primary);
                    opacity: 0.9;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .topic-count {
                    font-size: 0.8rem;
                    color: var(--text-muted, rgba(255, 255, 255, 0.4));
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 700;
                }
                
                .expand-icon {
                    margin-left: auto;
                    color: var(--text-muted, rgba(255, 255, 255, 0.3));
                    transition: transform 0.3s ease;
                }
                
                .track-card.expanded .expand-icon {
                    transform: rotate(180deg);
                    color: #5B4DFF;
                }

                .track-content {
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid var(--glass-border, rgba(255, 255, 255, 0.05));
                }

                .topics-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 24px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .topics-list li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-secondary, rgba(255, 255, 255, 0.7));
                    font-size: 0.95rem;
                }

                .list-icon {
                    color: #5B4DFF;
                    opacity: 0.6;
                    flex-shrink: 0;
                }

                .academic-relevance {
                    margin: 24px 0;
                    padding: 20px;
                    background: rgba(var(--track-color-rgb, 91, 77, 255), 0.05);
                    border-radius: 16px;
                    border-left: 3px solid var(--primary);
                }

                .academic-relevance h4 {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--primary);
                    margin-bottom: 10px;
                    font-weight: 800;
                }

                .academic-relevance p {
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    line-height: 1.5;
                    font-style: italic;
                    margin: 0;
                    opacity: 0.9;
                }

                .track-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #5B4DFF;
                    font-weight: 700;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .track-link:hover {
                    gap: 12px;
                    filter: brightness(1.2);
                }

                /* Community Section */
                .community-tracks-container {
                    padding: 80px 40px;
                    background: var(--glass-bg, rgba(255, 255, 255, 0.02));
                    border-radius: 32px;
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.05));
                }

                :global([data-theme="light"]) .community-tracks-container {
                    background: rgba(91, 77, 255, 0.02);
                    border-color: rgba(91, 77, 255, 0.1);
                }

                .community-header-row {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 40px;
                    margin-bottom: 60px;
                }

                .community-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    background: rgba(31, 203, 143, 0.1);
                    color: #1FCB8F;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                }

                .header-info h2 {
                    text-align: left;
                    margin-bottom: 12px;
                }

                .header-info p {
                    text-align: left;
                    margin: 0;
                    color: var(--text-secondary, rgba(255, 255, 255, 0.6));
                }

                .btn-propose {
                    padding: 14px 28px;
                    background: #5B4DFF;
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .btn-propose:hover {
                    box-shadow: 0 10px 20px rgba(91, 77, 255, 0.3);
                    transform: translateY(-2px);
                }

                .btn-propose.active {
                    background: var(--glass-bg-active, rgba(255, 255, 255, 0.1));
                    color: var(--text-primary, white);
                }

                /* Form Styling */
                .proposal-form-wrapper {
                    margin-bottom: 60px;
                }

                .proposal-form {
                    padding: 40px;
                    background: var(--glass-bg, rgba(255, 255, 255, 0.03));
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 24px;
                    align-items: flex-end;
                    border-radius: 20px;
                }

                :global([data-theme="light"]) .proposal-form {
                    background: white;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .form-group label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-muted, rgba(255, 255, 255, 0.5));
                }

                .form-group input {
                    background: var(--input-bg, rgba(0, 0, 0, 0.3));
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
                    padding: 14px 18px;
                    border-radius: 12px;
                    color: var(--text-primary, white);
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                :global([data-theme="light"]) .form-group input {
                    background: #f1f5f9;
                    border-color: #e2e8f0;
                    color: #1e293b;
                }

                .form-group input:focus {
                    border-color: #5B4DFF;
                    background: var(--input-bg-focus, rgba(0, 0, 0, 0.5));
                }

                .submit-proposal-btn {
                    padding: 14px 28px;
                    background: #1FCB8F;
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .submit-proposal-btn:hover {
                    filter: brightness(1.1);
                    transform: scale(1.02);
                }

                /* Community List Grid */
                .community-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }

                .community-card {
                    background: var(--glass-bg, rgba(255, 255, 255, 0.03));
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                :global([data-theme="light"]) .community-card {
                    background: #ffffff;
                    border: 1.5px solid #e2e8f0;
                    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
                }

                .community-card:hover {
                    border-color: #1FCB8F;
                    background: rgba(31, 203, 143, 0.03);
                    box-shadow: 0 8px 24px rgba(31, 203, 143, 0.08);
                }

                :global([data-theme="light"]) .community-card:hover {
                    border-color: #16a97a;
                    box-shadow: 0 8px 24px rgba(31, 203, 143, 0.12);
                }

                .card-meta-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .card-title {
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-primary, white);
                    margin-bottom: 6px;
                    line-height: 1.4;
                }

                .vote-btn {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 12px 16px;
                    margin-top: 20px;
                    background: rgba(31, 203, 143, 0.06);
                    border: 1.5px dashed rgba(31, 203, 143, 0.35);
                    border-radius: 12px;
                    color: #1FCB8F;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.25s ease;
                    letter-spacing: 0.01em;
                }

                :global([data-theme="light"]) .vote-btn {
                    background: rgba(31, 203, 143, 0.05);
                    border-color: rgba(22, 163, 74, 0.4);
                    color: #16a97a;
                }

                .vote-btn:hover:not(:disabled) {
                    background: rgba(31, 203, 143, 0.14);
                    border-style: solid;
                    border-color: #1FCB8F;
                    box-shadow: 0 0 12px rgba(31, 203, 143, 0.15);
                    transform: translateY(-1px);
                }

                :global([data-theme="light"]) .vote-btn:hover:not(:disabled) {
                    background: rgba(31, 203, 143, 0.1);
                    border-color: #16a97a;
                    color: #16a97a;
                }

                .vote-btn.voted {
                    background: rgba(31, 203, 143, 0.1);
                    border-style: solid;
                    border-color: rgba(31, 203, 143, 0.5);
                    cursor: default;
                    color: rgba(31, 203, 143, 0.7);
                }

                :global([data-theme="light"]) .vote-btn.voted {
                    background: rgba(31, 203, 143, 0.08);
                    border-color: rgba(22, 163, 74, 0.5);
                    color: #16a97a;
                }

                .vote-icon {
                    font-size: 1rem;
                    line-height: 1;
                }

                .vote-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                }


                .community-card h4, .card-title {
                    font-size: 1.15rem;
                    margin-bottom: 6px;
                    font-weight: 700;
                    color: var(--text-primary, white);
                }

                :global([data-theme="light"]) .community-card h4,
                :global([data-theme="light"]) .card-title {
                    color: #0f172a;
                }

                .author {
                    font-size: 0.875rem;
                    color: var(--text-muted, rgba(255, 255, 255, 0.45));
                    margin-bottom: 0;
                }

                :global([data-theme="light"]) .author {
                    color: #64748b;
                }

                .date {
                    font-size: 0.75rem;
                    color: var(--text-muted, rgba(255, 255, 255, 0.35));
                }

                :global([data-theme="light"]) .date {
                    color: #94a3b8;
                }

                .status-tag {
                    color: #1FCB8F;
                    font-weight: 700;
                    font-size: 0.72rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                }

                .status-tag::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #1FCB8F;
                    border-radius: 50%;
                    display: block;
                    flex-shrink: 0;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.5); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .empty-community {
                    text-align: center;
                    padding: 80px;
                    background: var(--glass-bg, rgba(255, 255, 255, 0.01));
                    border: 1px dashed var(--glass-border, rgba(255, 255, 255, 0.1));
                    border-radius: 24px;
                    color: var(--text-muted, rgba(255, 255, 255, 0.3));
                }

                @media (max-width: 992px) {
                    .community-header-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 24px;
                    }

                    .btn-propose {
                        width: 100%;
                    }

                    .proposal-form {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .tracks-section { padding: 60px 0; }
                    .tracks-grid { grid-template-columns: 1fr; }
                    .community-tracks-container { padding: 40px 20px; }
                    h2 { font-size: 2.2rem; }
                }
            `}</style>
        </section>
    );
}
