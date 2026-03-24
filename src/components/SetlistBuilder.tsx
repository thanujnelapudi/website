import React, { useEffect, useState } from 'react';
import { getSetlist, saveSetlist, clearSetlist } from '../utils/localStorage';
import type { SavedSong } from '../utils/localStorage';
import SetlistSongRow from './SetlistSongRow';

export default function SetlistBuilder() {
    const [songs, setSongs] = useState<SavedSong[]>([]);
    const [setlistName, setListName] = useState('My Setlist');
    const [isEditingName, setIsEditingName] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [isSharedView, setIsSharedView] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const songsParam = params.get('songs');

        if (songsParam) {
            setIsSharedView(true);
            setListName("Shared Setlist");
            // Parse custom slug format: slug1:Title1:Ministry1,slug2:Title2:Ministry2
            const parsedSongs: SavedSong[] = songsParam.split(',').map(s => {
                const [slug, title, ministry] = s.split(':');
                return { 
                    slug, 
                    title: decodeURIComponent(title || ''), 
                    ministry: decodeURIComponent(ministry || ''), 
                    titleTransliterated: '', 
                    mood: [], 
                    era: '' 
                };
            });
            setSongs(parsedSongs);
        } else {
            setSongs(getSetlist());
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleRemove = (index: number) => {
        const newSongs = [...songs];
        newSongs.splice(index, 1);
        setSongs(newSongs);
        saveSetlist(newSongs);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newSongs = [...songs];
        [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]];
        setSongs(newSongs);
        saveSetlist(newSongs);
    };

    const handleMoveDown = (index: number) => {
        if (index === songs.length - 1) return;
        const newSongs = [...songs];
        [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]];
        setSongs(newSongs);
        saveSetlist(newSongs);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear your entire setlist?')) {
            clearSetlist();
            setSongs([]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        const encoded = songs.map(s => `${s.slug}:${encodeURIComponent(s.title)}:${encodeURIComponent(s.ministry)}`).join(',');
        const url = `${window.location.origin}/setlist?songs=${encoded}`;
        
        navigator.clipboard.writeText(url).then(() => {
            setShareUrl(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    const handleSaveShared = () => {
        saveSetlist(songs);
        window.location.href = '/setlist';
    };

    return (
        <div className="setlist-container">
            <header className="setlist-header hide-print">
                <div className="header-top">
                    <div className="title-area">
                        {isEditingName && !isSharedView ? (
                            <input 
                                autoFocus
                                className="name-input" 
                                value={setlistName} 
                                onChange={e => setListName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                            />
                        ) : (
                            <h1 className="setlist-name" onClick={() => !isSharedView && setIsEditingName(true)}>
                                {setlistName} {(!isSharedView) && <span className="edit-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></span>}
                            </h1>
                        )}
                        <span className="count-badge">{songs.length} songs</span>
                    </div>

                    {!isSharedView ? (
                        <div className="actions">
                            <button className="action-btn clear-btn" onClick={handleClear} disabled={songs.length === 0}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> Clear All
                            </button>
                            <button className="action-btn" onClick={handlePrint} disabled={songs.length === 0}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print
                            </button>
                            <button className="action-btn share-btn" onClick={handleShare} disabled={songs.length === 0}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share
                            </button>
                        </div>
                    ) : (
                        <div className="actions">
                            <button className="action-btn primary-btn" onClick={handleSaveShared}>Save this Setlist</button>
                            <button className="action-btn" onClick={handlePrint}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print
                            </button>
                        </div>
                    )}
                </div>
                
                {shareUrl && (
                    <div className="share-box fade-in">
                        <input type="text" readOnly value={shareUrl} className="share-input" />
                        {copied && <span className="copied-text fade-in">Link copied!</span>}
                    </div>
                )}
            </header>

            <div className="print-only">
                <h1 className="print-title">{setlistName}</h1>
            </div>

            <main className="song-list">
                {songs.length === 0 ? (
                    <div className="empty-state hide-print fade-in">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" style={{ marginBottom: '1rem', display: 'inline-block' }}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        <h2>Your setlist is empty</h2>
                        <p>While browsing songs, tap '+ Add to Setlist' to add them here</p>
                        <a href="/songs" className="browse-link mt-4">Browse Songs →</a>
                    </div>
                ) : (
                    <div className="list-wrapper fade-in">
                        {songs.map((song, index) => (
                            <SetlistSongRow 
                                key={`${song.slug}-${index}`}
                                song={song}
                                index={index}
                                isSharedView={isSharedView}
                                onRemove={() => handleRemove(index)}
                                onMoveUp={() => handleMoveUp(index)}
                                onMoveDown={() => handleMoveDown(index)}
                                isFirst={index === 0}
                                isLast={index === songs.length - 1}
                            />
                        ))}
                    </div>
                )}
            </main>

            <style>{`
                .setlist-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .setlist-header {
                    margin-bottom: 2rem;
                    background: var(--color-surface);
                    padding: 2rem;
                    border-radius: 12px;
                    border: 1px solid var(--color-border);
                }
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }
                .title-area {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .setlist-name {
                    font-size: 2.2rem;
                    color: var(--color-text-telugu);
                    cursor: pointer;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }
                .setlist-name:hover .edit-icon {
                    opacity: 1;
                }
                .edit-icon {
                    font-size: 1.2rem;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .name-input {
                    font-size: 2.2rem;
                    background: var(--color-surface-2);
                    border: 1px dashed var(--color-border);
                    color: var(--color-text-telugu);
                    padding: 0.2rem 0.5rem;
                    border-radius: 8px;
                    outline: none;
                    width: 320px;
                }
                .name-input:focus {
                    border-color: var(--color-primary);
                }
                .count-badge {
                    background: rgba(124, 111, 205, 0.1);
                    color: var(--color-primary);
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    border: 1px solid var(--color-primary);
                }
                .actions {
                    display: flex;
                    gap: 0.8rem;
                }
                .action-btn {
                    padding: 0.7rem 1.4rem;
                    border-radius: 8px;
                    background: var(--color-surface-2);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn:hover:not(:disabled) {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }
                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .clear-btn:hover:not(:disabled) {
                    border-color: #ff4d4d;
                    color: #ff4d4d;
                }
                .primary-btn {
                    background: var(--color-primary);
                    color: #fff;
                    border-color: var(--color-primary);
                }
                .primary-btn:hover:not(:disabled) {
                    background: var(--color-primary-hover);
                    color: #fff;
                    border-color: var(--color-primary-hover);
                }
                .share-box {
                    margin-top: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--color-surface-2);
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    border: 1px solid var(--color-primary);
                }
                .share-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--color-text);
                    outline: none;
                    font-family: monospace;
                    font-size: 0.95rem;
                }
                .copied-text {
                    color: #4dffa6;
                    font-weight: 500;
                    flex-shrink: 0;
                }
                .print-only {
                    display: none;
                }
                .empty-state {
                    text-align: center;
                    padding: 5rem 2rem;
                    background: var(--color-surface);
                    border-radius: 12px;
                    border: 1px dashed var(--color-border);
                }
                .empty-state h2 {
                    color: var(--color-text-telugu);
                    font-size: 1.6rem;
                    margin-bottom: 0.8rem;
                }
                .empty-state p {
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                .browse-link {
                    display: inline-block;
                    background: var(--color-primary);
                    color: #fff;
                    padding: 0.8rem 1.8rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                .browse-link:hover {
                    background: var(--color-primary-hover);
                }
                .mt-4 {
                    margin-top: 1rem;
                }
                .list-wrapper {
                    display: flex;
                    flex-direction: column;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }
                
                .fade-in {
                    animation: fadeIn 0.3s ease forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media print {
                    .hide-print, .actions, .share-box, header, footer, .mobile-filter-btn {
                        display: none !important;
                    }
                    .setlist-container {
                        max-width: 100%;
                        padding: 0;
                    }
                    .print-only {
                        display: block;
                        margin-bottom: 2rem;
                        text-align: center;
                        border-bottom: 2px solid #000;
                        padding-bottom: 1.5rem;
                    }
                    .print-title {
                        color: #000;
                        font-size: 3rem;
                        margin: 0;
                    }
                    body {
                        background: #fff;
                        color: #000;
                    }
                    .list-wrapper {
                        box-shadow: none;
                    }
                }
                @media (max-width: 600px) {
                    .header-top {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .actions {
                        width: 100%;
                        justify-content: flex-start;
                        flex-wrap: wrap;
                    }
                    .name-input {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
