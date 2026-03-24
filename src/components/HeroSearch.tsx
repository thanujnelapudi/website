import React, { useState, useMemo, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

interface SongData {
    id: string;
    title: string;
    titleTransliterated: string;
    slug: string;
    ministry: string;
}

interface HeroSearchProps {
    songs: SongData[];
}

export default function HeroSearch({ songs }: HeroSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SongData[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const fuse = useMemo(() => new Fuse(songs, {
        keys: ['title', 'titleTransliterated'],
        threshold: 0.3,
        distance: 100,
    }), [songs]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
        } else {
            const searchResults = fuse.search(query).map(result => result.item);
            setResults(searchResults.slice(0, 6)); // Show top 6 matches
        }
    }, [query, fuse]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-eyebrow fade-up" style={{ animationDelay: '0s' }}>Telugu Christian Worship</span>
                <h1 className="hero-heading">
                    <span className="line-one fade-up" style={{ animationDelay: '0.1s' }}>Find Every</span><br/>
                    <span className="line-two fade-up" style={{ animationDelay: '0.2s' }}>Song & Hymn</span>
                </h1>
                <p className="hero-subheading fade-up" style={{ animationDelay: '0.3s' }}>
                    Lyrics, chords, and Bible verses for Telugu Christian worship
                </p>

                <div className="search-container fade-up" style={{ animationDelay: '0.4s' }} ref={searchRef}>
                    <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search song name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                        />
                    </div>

                    {isFocused && (query.trim() !== '') && (
                        <div className="search-results">
                            {results.length > 0 ? (
                                results.map((song) => (
                                    <a href={`/songs/${song.slug}`} key={song.id} className="search-result-item">
                                        <div className="result-info">
                                            <span className="result-title">{song.title}</span>
                                            <span className="result-ministry">{song.ministry}</span>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="search-no-results">No songs found for "{query}"</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .hero-section {
                    width: 100%;
                    min-height: 75vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    padding: var(--space-xl) var(--space-xl);
                }

                html[data-theme="dark"] .hero-section {
                    background: radial-gradient(circle at center, #1a2744 0%, var(--bg) 70%);
                }
                html[data-theme="dark"] .hero-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: 
                        repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px),
                        repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px);
                    pointer-events: none;
                }

                html[data-theme="light"] .hero-section,
                html:not([data-theme="dark"]) .hero-section {
                    background: linear-gradient(180deg, #fdf6e3 0%, var(--bg) 100%);
                }

                .hero-content {
                    max-width: 700px;
                    margin: 0 auto;
                    width: 100%;
                    position: relative;
                    z-index: 10;
                }

                .hero-eyebrow {
                    display: inline-block;
                    color: var(--accent);
                    font-size: 0.8rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    font-family: var(--font-body);
                    font-weight: 600;
                    margin-bottom: var(--space-md);
                    border-left: 2px solid var(--accent);
                    padding-left: 10px;
                }

                .hero-heading {
                    line-height: 1.1;
                    margin-bottom: var(--space-sm);
                }

                .line-one {
                    font-family: var(--font-display);
                    font-size: clamp(3rem, 8vw, 5.5rem);
                    font-weight: 400;
                    font-style: italic;
                    color: var(--text);
                }

                .line-two {
                    font-family: var(--font-display);
                    font-size: clamp(3rem, 8vw, 5.5rem);
                    font-weight: 700;
                    color: var(--accent);
                }

                .hero-subheading {
                    font-size: 1.1rem;
                    color: var(--text-muted);
                    font-family: var(--font-body);
                    margin-top: 16px;
                }

                .search-container {
                    margin-top: 40px;
                    position: relative;
                    max-width: 560px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .search-input-wrapper {
                    height: 56px;
                    background: var(--surface);
                    border: 1.5px solid var(--border);
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .search-input-wrapper.focused {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px var(--accent-soft);
                }

                .search-icon {
                    position: absolute;
                    left: 20px;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .search-input {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    padding: 0 24px 0 52px;
                    font-size: 1rem;
                    font-family: var(--font-body);
                    color: var(--text);
                }

                .search-input::placeholder {
                    color: var(--text-subtle);
                }

                .search-results {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: var(--surface);
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 50;
                    overflow: hidden;
                    text-align: left;
                }

                .search-result-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    text-decoration: none;
                    border-bottom: 1px solid var(--border);
                    transition: background 0.2s ease;
                }
                
                .search-result-item:last-child {
                    border-bottom: none;
                }

                .search-result-item:hover {
                    background: var(--surface-2);
                }

                .result-title {
                    font-family: var(--font-telugu);
                    font-size: 1.05rem;
                    color: var(--telugu-color);
                    margin-right: 8px;
                    font-weight: 600;
                }

                .result-ministry {
                    font-family: var(--font-body);
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                }

                .search-no-results {
                    padding: 16px;
                    color: var(--text-muted);
                    text-align: center;
                    font-size: 0.95rem;
                }
            `}</style>
        </section>
    );
}
