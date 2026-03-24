import React from 'react';
import type { SavedSong } from '../utils/localStorage';

interface Props {
    song: SavedSong;
    index: number;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
    isSharedView?: boolean;
}

export default function SetlistSongRow({ song, index, onRemove, onMoveUp, onMoveDown, isFirst, isLast, isSharedView }: Props) {
    return (
        <div className="song-row">
            <div className="left-group">
                {!isSharedView && <div className="drag-handle hide-print" aria-hidden="true">⠿</div>}
                <div className="number-badge">{index + 1}</div>
                <div className="titles">
                    <a href={`/songs/${song.slug}`} className="telugu title-link">{song.title}</a>
                    {song.titleTransliterated && <span className="trans-title hide-print">{song.titleTransliterated}</span>}
                </div>
            </div>

            <div className="right-group">
                {song.ministry && <span className="ministry hide-print">{song.ministry}</span>}
                
                {!isSharedView && (
                    <div className="row-actions hide-print">
                        <div className="order-btns">
                            <button onClick={onMoveUp} disabled={isFirst} className="icon-btn" aria-label="Move Up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg></button>
                            <button onClick={onMoveDown} disabled={isLast} className="icon-btn" aria-label="Move Down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg></button>
                        </div>
                        <button onClick={onRemove} className="icon-btn remove-btn" aria-label="Remove Song"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                )}
            </div>

            <style>{`
                .song-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    margin-bottom: -1px;
                    transition: background 0.2s;
                }
                .song-row:first-child {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                }
                .song-row:last-child {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    margin-bottom: 0;
                }
                .song-row:hover {
                    background: var(--color-surface-2);
                    z-index: 1;
                    position: relative;
                }
                .left-group {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                }
                .drag-handle {
                    color: var(--color-text-muted);
                    font-size: 1.2rem;
                    cursor: grab;
                    opacity: 0.3;
                    user-select: none;
                    transition: opacity 0.2s;
                }
                .song-row:hover .drag-handle {
                    opacity: 0.8;
                }
                .number-badge {
                    background: var(--color-surface-2);
                    border: 1px solid var(--color-border);
                    color: var(--color-text);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1rem;
                    flex-shrink: 0;
                }
                .titles {
                    display: flex;
                    flex-direction: column;
                }
                .title-link {
                    color: var(--color-text-telugu);
                    font-size: 1.25rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color 0.2s;
                    margin-bottom: 0.2rem;
                }
                .title-link:hover {
                    color: var(--color-primary);
                }
                .trans-title {
                    color: var(--color-text-muted);
                    font-size: 0.95rem;
                }
                .right-group {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .ministry {
                    font-size: 0.85rem;
                    background-color: var(--color-bg);
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-muted);
                }
                .row-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .order-btns {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .icon-btn {
                    background: transparent;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    padding: 0;
                    font-size: 0.8rem;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon-btn:hover:not(:disabled) {
                    color: var(--color-text);
                }
                .icon-btn:disabled {
                    opacity: 0.2;
                    cursor: not-allowed;
                }
                .remove-btn {
                    font-size: 1.2rem;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                }
                .remove-btn:hover {
                    color: #ff4d4d;
                    border-color: #ff4d4d;
                    background: rgba(255, 77, 77, 0.1);
                }

                @media print {
                    .song-row {
                        background: none !important;
                        border: none;
                        border-bottom: 1px solid #ddd;
                        padding: 1rem 0;
                        color: #000;
                    }
                    .number-badge {
                        background: none;
                        border: 2px solid #000;
                        color: #000;
                    }
                    .title-link {
                        color: #000;
                    }
                }
                
                @media (max-width: 600px) {
                    .trans-title {
                        display: none;
                    }
                    .right-group {
                        gap: 0.8rem;
                    }
                    .drag-handle {
                        display: none;
                    }
                    .ministry {
                        display: none;
                    }
                    .song-row {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
