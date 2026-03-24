import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

interface Song {
    id: string;
    title: string;
    titleTransliterated: string;
    slug: string;
    ministry: string;
    mood: string[];
    occasion: string[];
    era: string;
}

interface SongsBrowserProps {
    songs: Song[];
}

export default function SongsBrowser({ songs }: SongsBrowserProps) {
    const [query, setQuery] = useState('');
    const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
    const [selectedMood, setSelectedMood] = useState<string[]>([]);
    const [selectedEra, setSelectedEra] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<string>('A-Z');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    
    // Read URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const occasionParam = params.get('occasion');
        const moodParam = params.get('mood');
        
        if (occasionParam) setSelectedOccasion([occasionParam]);
        if (moodParam) setSelectedMood([moodParam]);
    }, []);

    const fuse = useMemo(() => new Fuse(songs, {
        keys: ['title', 'titleTransliterated'],
        threshold: 0.3,
    }), [songs]);

    const displaySongs = useMemo(() => {
        let result = [...songs];

        if (query.trim() !== '') {
            result = fuse.search(query).map(r => r.item);
        }

        if (selectedOccasion.length > 0) {
            result = result.filter(s => s.occasion && s.occasion.some(o => selectedOccasion.includes(o)));
        }

        if (selectedMood.length > 0) {
            result = result.filter(s => s.mood && s.mood.some(m => selectedMood.includes(m)));
        }

        if (selectedEra !== 'all') {
            result = result.filter(s => s.era === selectedEra);
        }

        result = result.sort((a, b) => {
            if (sortOrder === 'A-Z') return a.titleTransliterated.localeCompare(b.titleTransliterated);
            if (sortOrder === 'Z-A') return b.titleTransliterated.localeCompare(a.titleTransliterated);
            if (sortOrder === 'Ministry') return a.ministry.localeCompare(b.ministry);
            return 0;
        });

        return result;
    }, [songs, query, selectedOccasion, selectedMood, selectedEra, sortOrder, fuse]);

    const handleOccasionChange = (val: string) => {
        setSelectedOccasion(prev => prev.includes(val) ? prev.filter(o => o !== val) : [...prev, val]);
    };

    const handleMoodChange = (val: string) => {
        setSelectedMood(prev => prev.includes(val) ? prev.filter(m => m !== val) : [...prev, val]);
    };

    const clearAll = () => {
        setSelectedOccasion([]);
        setSelectedMood([]);
        setSelectedEra('all');
        setQuery('');
        window.history.replaceState({}, '', window.location.pathname);
    };

    const getMinistryColorClass = (ministry: string) => {
        const m = (ministry || '').toLowerCase();
        if (m.includes('hosanna')) return 'hosanna';
        if (m.includes('benny')) return 'benny';
        if (m.includes('raj')) return 'raj';
        return 'default';
    };

    return (
        <div className="browser-container">
            <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <aside className={`sidebar ${mobileFilterOpen ? 'open' : ''}`}>
                <h2 className="sidebar-title">Filters</h2>
                
                <div className="filter-group mt-24">
                    <div className="group-label">Occasion</div>
                    {[
                        { id: 'sunday-worship', label: 'Sunday Worship' },
                        { id: 'christmas', label: 'Christmas' },
                        { id: 'easter', label: 'Easter' },
                        { id: 'wedding', label: 'Wedding' },
                        { id: 'funeral', label: 'Funeral' },
                        { id: 'children', label: 'Children' }
                    ].map(occ => (
                        <label key={occ.id} className="custom-checkbox-label">
                            <input 
                                type="checkbox" 
                                className="hidden-checkbox" 
                                checked={selectedOccasion.includes(occ.id)} 
                                onChange={() => handleOccasionChange(occ.id)} 
                            />
                            <div className="custom-box">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="label-text">{occ.label}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-group">
                    <div className="group-label">Mood</div>
                    {[
                        { id: 'praise', label: 'Praise' },
                        { id: 'worship', label: 'Worship' },
                        { id: 'devotional', label: 'Devotional' },
                        { id: 'prayer', label: 'Prayer' },
                        { id: 'thanksgiving', label: 'Thanksgiving' }
                    ].map(mood => (
                        <label key={mood.id} className="custom-checkbox-label">
                            <input 
                                type="checkbox" 
                                className="hidden-checkbox" 
                                checked={selectedMood.includes(mood.id)} 
                                onChange={() => handleMoodChange(mood.id)} 
                            />
                            <div className="custom-box">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="label-text">{mood.label}</span>
                        </label>
                    ))}
                </div>

                <div className="filter-group">
                    <div className="group-label">Era</div>
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'classic', label: 'Classic' },
                        { id: 'contemporary', label: 'Contemporary' },
                        { id: 'modern', label: 'Modern' }
                    ].map(era => (
                        <label key={era.id} className="custom-checkbox-label radio-label">
                            <input 
                                type="radio" 
                                name="era"
                                className="hidden-checkbox" 
                                checked={selectedEra === era.id} 
                                onChange={() => setSelectedEra(era.id)} 
                            />
                            <div className="custom-box">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="label-text">{era.label}</span>
                        </label>
                    ))}
                </div>

                <button className="clear-btn" onClick={clearAll}>Clear All Filters</button>
            </aside>

            <main className="main-content">
                <div className="search-bar-top">
                    <div className="search-pill">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="Search songs..." 
                            value={query} 
                            onChange={e => setQuery(e.target.value)} 
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="results-meta">
                    <span className="results-count">{displaySongs.length} songs</span>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="sort-select">
                        <option value="A-Z">Sort: A-Z</option>
                        <option value="Z-A">Sort: Z-A</option>
                        <option value="Ministry">Sort: Ministry</option>
                    </select>
                </div>

                {displaySongs.length === 0 ? (
                    <div className="empty-state">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" style={{ marginBottom: '1rem', display: 'inline-block' }}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        <p className="empty-text">No songs found matching your criteria</p>
                        <button className="clear-link-btn" onClick={clearAll}>Clear Filters</button>
                    </div>
                ) : (
                    <div className="song-list-column">
                        {displaySongs.map(song => (
                            <a href={`/songs/${song.slug}`} key={song.id} className="list-song-card fade-in">
                                <div className={`accent-bar min-${getMinistryColorClass(song.ministry)}`}></div>
                                <div className="card-content">
                                    <h3 className="song-title">{song.title}</h3>
                                    <p className="ministry-name">{song.ministry}</p>
                                </div>
                                <div className="arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
                            </a>
                        ))}
                    </div>
                )}
            </main>

            <style>{`
                .browser-container {
                    display: flex;
                    max-width: 1400px;
                    margin: 0 auto;
                    min-height: calc(100vh - 64px);
                    position: relative;
                }
                
                .mobile-filter-btn {
                    display: none;
                    width: calc(100% - 32px);
                    margin: 16px;
                    padding: 12px;
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    color: var(--text);
                    border-radius: 8px;
                    font-family: var(--font-body);
                    font-weight: 600;
                    cursor: pointer;
                }

                .sidebar {
                    width: 260px;
                    flex-shrink: 0;
                    background: var(--surface);
                    border-right: 1px solid var(--border);
                    padding: var(--space-xl) var(--space-lg);
                    position: sticky;
                    top: 64px;
                    height: calc(100vh - 64px);
                    overflow-y: auto;
                }
                
                .sidebar::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }

                .sidebar-title {
                    font-family: var(--font-display);
                    font-size: 1.4rem;
                    color: var(--text);
                    margin-bottom: 24px;
                }

                .filter-group {
                    margin-bottom: 24px;
                }
                .mt-24 {
                    margin-top: 24px;
                }

                .group-label {
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-size: 0.7rem;
                    color: var(--text-subtle);
                    font-family: var(--font-body);
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .custom-checkbox-label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    cursor: pointer;
                    font-family: var(--font-body);
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    transition: color 0.2s ease;
                }

                .custom-checkbox-label:hover {
                    color: var(--text);
                }

                .hidden-checkbox {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .custom-box {
                    width: 16px;
                    height: 16px;
                    border: 1.5px solid var(--border);
                    border-radius: 4px;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    transition: all 0.2s ease;
                }
                
                .radio-label .custom-box {
                    border-radius: 50%;
                }

                .custom-box svg {
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all 0.2s ease;
                }

                .hidden-checkbox:checked ~ .custom-box {
                    background: var(--primary);
                    border-color: var(--primary);
                }

                .hidden-checkbox:checked ~ .custom-box svg {
                    opacity: 1;
                    transform: scale(1);
                }

                .hidden-checkbox:checked ~ .label-text {
                    color: var(--text);
                    font-weight: 500;
                }

                .clear-btn {
                    width: 100%;
                    padding: 8px;
                    background: transparent;
                    border: 1px solid var(--border);
                    color: var(--text-muted);
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: var(--font-body);
                    font-weight: 500;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    margin-top: 24px;
                }

                .clear-btn:hover {
                    color: var(--text);
                    border-color: var(--border-hover);
                }

                .main-content {
                    flex: 1;
                    padding: var(--space-xl) var(--space-xl) var(--space-3xl);
                    min-width: 0;
                }

                .search-bar-top {
                    margin-bottom: 24px;
                    width: 100%;
                }

                .search-pill {
                    width: 100%;
                    height: 44px;
                    background: var(--surface);
                    border: 1.5px solid var(--border);
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                
                .search-pill:focus-within {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px var(--accent-soft);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    padding: 0 16px 0 44px;
                    font-size: 1rem;
                    font-family: var(--font-body);
                    color: var(--text);
                }

                .results-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .results-count {
                    color: var(--text-subtle);
                    font-size: 0.85rem;
                    font-family: var(--font-body);
                }

                .sort-select {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-family: var(--font-body);
                    font-size: 0.85rem;
                    cursor: pointer;
                    outline: none;
                    font-weight: 500;
                }
                .sort-select:hover {
                    color: var(--text);
                }

                .song-list-column {
                    display: flex;
                    flex-direction: column;
                }

                .list-song-card {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    height: 68px;
                    padding: 0 16px 0 20px;
                    border-bottom: 1px solid var(--border);
                    background: transparent;
                    transition: background 0.2s ease;
                    position: relative;
                    gap: 12px;
                }
                
                .list-song-card:last-child {
                    border-bottom: none;
                }
                
                .accent-bar {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 2px;
                    height: 100%;
                    background-color: var(--border-hover);
                    transition: background-color 0.2s ease;
                    flex-shrink: 0;
                }

                .card-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-left: 16px;
                    flex: 1;
                    overflow: hidden;
                }
                
                .song-title {
                    font-family: var(--font-telugu);
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--telugu-color);
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin: 0;
                }
                
                .ministry-name {
                    font-family: var(--font-body);
                    font-size: 0.78rem;
                    color: var(--text-muted);
                    font-weight: 400;
                    letter-spacing: 0.03em;
                    text-transform: uppercase;
                    margin: 2px 0 0 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .arrow {
                    color: var(--text-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease;
                }
                
                .list-song-card:hover {
                    background: var(--surface-2);
                }
                .list-song-card:hover .accent-bar {
                    background-color: var(--accent);
                }
                .list-song-card:hover .arrow {
                    color: var(--text);
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 1rem;
                }

                .empty-text {
                    color: var(--text-muted);
                    font-family: var(--font-body);
                    margin-bottom: 16px;
                }

                .clear-link-btn {
                    background: none;
                    border: none;
                    color: var(--accent);
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .fade-in {
                    animation: fadeIn 0.4s ease forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 900px) {
                    .browser-container {
                        flex-direction: column;
                        padding: 0;
                    }
                    .mobile-filter-btn {
                        display: block;
                    }
                    .sidebar {
                        display: none;
                        width: 100%;
                        position: static;
                        height: auto;
                        border-right: none;
                        border-bottom: 1px solid var(--border);
                    }
                    .sidebar.open {
                        display: block;
                        animation: fadeIn 0.3s ease;
                    }
                    .main-content {
                        padding: var(--space-lg);
                    }
                }
            `}</style>
        </div>
    );
}
