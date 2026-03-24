import React, { useEffect, useState } from 'react';
import { getFavorites, getRecentlyViewed, removeFavorite } from '../utils/localStorage';
import type { SavedSong } from '../utils/localStorage';
import FavoriteSongCard from './FavoriteSongCard';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<SavedSong[]>([]);
    const [recent, setRecent] = useState<SavedSong[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setFavorites(getFavorites());
        setRecent(getRecentlyViewed());
        setMounted(true);
    }, []);

    const handleRemoveFavorite = (slug: string) => {
        removeFavorite(slug);
        setFavorites(getFavorites());
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="container">
            <section className="fav-section">
                <h1 className="section-title">My Favorite Songs</h1>
                
                {favorites.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-text">You haven't saved any songs yet 😊</p>
                        <a href="/songs" className="browse-link">Browse Songs</a>
                    </div>
                ) : (
                    <div className="fav-grid">
                        {favorites.map(song => (
                            <FavoriteSongCard 
                                key={song.slug} 
                                song={song} 
                                showRemove={true} 
                                onRemove={handleRemoveFavorite} 
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="recent-section">
                <h2 className="section-title">Recently Viewed</h2>
                
                {recent.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-text">You haven't viewed any songs yet</p>
                    </div>
                ) : (
                    <div className="scroll-wrapper">
                        <div className="recent-row">
                            {recent.map((song, idx) => (
                                <div key={`recent-${song.slug}-${idx}`} className="recent-card-wrapper">
                                    <FavoriteSongCard song={song} showRemove={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <style>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                .fav-section {
                    margin-bottom: 5rem;
                }
                .section-title {
                    font-size: 2.2rem;
                    color: var(--color-text-telugu);
                    margin-bottom: 0.2rem;
                }
                .section-subtitle {
                    color: var(--color-text-muted);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                .empty-state {
                    padding: 4rem 2rem;
                    text-align: center;
                    background: var(--color-surface);
                    border-radius: 12px;
                    border: 1px dashed var(--color-border);
                }
                .empty-text {
                    font-size: 1.25rem;
                    color: var(--color-text-muted);
                    margin-bottom: 1.5rem;
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
                .fav-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .recent-section {
                    margin-bottom: 3rem;
                }
                .scroll-wrapper {
                    overflow-x: auto;
                    padding-bottom: 1.5rem;
                    scrollbar-width: thin;
                    scrollbar-color: var(--color-primary) var(--color-surface);
                }
                .scroll-wrapper::-webkit-scrollbar { height: 6px; }
                .scroll-wrapper::-webkit-scrollbar-track { background: var(--color-surface-2); border-radius: 10px; }
                .scroll-wrapper::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 10px; }
                
                .recent-row {
                    display: flex;
                    gap: 1.5rem;
                    min-width: max-content;
                }
                .recent-card-wrapper {
                    width: 320px;
                }
            `}</style>
        </div>
    );
}
