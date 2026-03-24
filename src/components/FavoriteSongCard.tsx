import React from 'react';
import type { SavedSong } from '../utils/localStorage';

interface Props {
    song: SavedSong;
    showRemove?: boolean;
    onRemove?: (slug: string) => void;
}

export default function FavoriteSongCard({ song, showRemove, onRemove }: Props) {
    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) onRemove(song.slug);
    };

    const getMinistryColorClass = (ministry: string) => {
        const m = (ministry || '').toLowerCase();
        if (m.includes('hosanna')) return 'hosanna';
        if (m.includes('benny')) return 'benny';
        if (m.includes('raj')) return 'raj';
        return 'default';
    };

    return (
        <a href={`/songs/${song.slug}`} className="fav-list-row fade-up">
            <div className={`accent-bar min-${getMinistryColorClass(song.ministry)}`}></div>
            <div className="card-content">
                <h3 className="song-title">{song.title}</h3>
                <p className="ministry-name">{song.ministry}</p>
            </div>
            {showRemove && (
                <button className="remove-btn" onClick={handleRemove} aria-label="Remove from favorites">
                    ✕
                </button>
            )}
            
            <style>{`
                .fav-list-row {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    height: 72px;
                    padding-right: 16px;
                    border-bottom: 1px solid var(--border);
                    background: transparent;
                    transition: background 0.2s ease;
                    position: relative;
                }
                .accent-bar {
                    width: 3px;
                    height: 100%;
                    background-color: var(--ministry-default);
                    transition: filter 0.2s ease;
                    flex-shrink: 0;
                }
                .min-hosanna { background-color: var(--ministry-hosanna); }
                .min-benny { background-color: var(--ministry-benny); }
                .min-raj { background-color: var(--ministry-raj); }
                .min-default { background-color: var(--ministry-default); }

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

                .fav-list-row:hover {
                    background: var(--accent-soft);
                }
                .fav-list-row:hover .accent-bar {
                    filter: brightness(1.2);
                }

                .remove-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0.2rem;
                    transition: all 0.2s;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 16px;
                }
                .remove-btn:hover {
                    color: #ff4d4d;
                    background: rgba(255, 77, 77, 0.1);
                }
            `}</style>
        </a>
    );
}
