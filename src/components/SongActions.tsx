import React, { useEffect, useState } from 'react';
import { addRecentlyViewed, isFavorite, toggleFavorite, addToSetlist } from '../utils/localStorage';
import type { SavedSong } from '../utils/localStorage';

export default function SongActions({ song }: { song: SavedSong }) {
    const [favorited, setFavorited] = useState(false);
    const [setlistAdded, setSetlistAdded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        addRecentlyViewed(song);
        setFavorited(isFavorite(song.slug));
        setMounted(true);
    }, [song]);

    const handleFavClick = () => {
        toggleFavorite(song);
        setFavorited(isFavorite(song.slug));
    };

    const handleSetlistClick = () => {
        addToSetlist(song);
        setSetlistAdded(true);
        setTimeout(() => setSetlistAdded(false), 2000);
    };

    // Prevent hydration flashes for buttons
    if (!mounted) {
        return (
            <>
                <button className="action-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save Song
                </button>
                <button className="action-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg> Add to Setlist
                </button>
            </>
        );
    }

    return (
        <>
            <button 
                className={`action-btn ${favorited ? 'active' : ''}`} 
                onClick={handleFavClick}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> {favorited ? 'Saved' : 'Save Song'}
            </button>
            <button 
                className={`action-btn ${setlistAdded ? 'active' : ''}`} 
                onClick={handleSetlistClick}
            >
                {setlistAdded ? 'Added!' : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg> Add to Setlist</>}
            </button>
        </>
    );
}
