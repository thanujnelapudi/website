export interface SavedSong {
    slug: string;
    title: string;
    titleTransliterated: string;
    ministry: string;
    mood: string[];
    era: string;
}

const safeParse = (key: string): SavedSong[] => {
    if (typeof window === 'undefined') return [];
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (e) {
        return [];
    }
};

const safeSet = (key: string, data: SavedSong[]) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
};

// RECENTLY VIEWED
export const getRecentlyViewed = (): SavedSong[] => safeParse('tcl_recent');

export const addRecentlyViewed = (song: SavedSong) => {
    let recent = getRecentlyViewed();
    recent = recent.filter(s => s.slug !== song.slug);
    recent.unshift(song);
    if (recent.length > 10) recent = recent.slice(0, 10);
    safeSet('tcl_recent', recent);
};

// FAVORITES
export const getFavorites = (): SavedSong[] => safeParse('tcl_favorites');

export const isFavorite = (slug: string): boolean => {
    return getFavorites().some(s => s.slug === slug);
};

export const addFavorite = (song: SavedSong) => {
    const favs = getFavorites();
    if (!favs.some(s => s.slug === song.slug)) {
        favs.push(song);
        safeSet('tcl_favorites', favs);
    }
};

export const removeFavorite = (slug: string) => {
    const favs = getFavorites().filter(s => s.slug !== slug);
    safeSet('tcl_favorites', favs);
};

export const toggleFavorite = (song: SavedSong) => {
    if (isFavorite(song.slug)) {
        removeFavorite(song.slug);
    } else {
        addFavorite(song);
    }
};

// SETLIST
export const getSetlist = (): SavedSong[] => safeParse('tcl_setlist');

export const addToSetlist = (song: SavedSong) => {
    const list = getSetlist();
    if (!list.some(s => s.slug === song.slug)) {
        list.push(song);
        safeSet('tcl_setlist', list);
    }
};

export const saveSetlist = (list: SavedSong[]) => {
    safeSet('tcl_setlist', list);
};

export const clearSetlist = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem('tcl_setlist');
    }
};
