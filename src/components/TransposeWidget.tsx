import React, { useState } from 'react';

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

export default function TransposeWidget({ initialKey = "G" }) {
    const [keyOffset, setKeyOffset] = useState(0);

    const transposeChord = (chord: string, offset: number) => {
        const match = chord.match(/^([A-G][#b]?)(.*)$/);
        if (!match) return chord;
        let [, root, rest] = match;
        if (root === 'Bb') root = 'A#';
        if (root === 'Eb') root = 'D#';
        if (root === 'Ab') root = 'G#';
        if (root === 'Db') root = 'C#';
        if (root === 'Gb') root = 'F#';
        const index = NOTES.indexOf(root);
        if (index === -1) return chord;
        let newIndex = (index + offset) % 12;
        if (newIndex < 0) newIndex += 12;
        return NOTES[newIndex] + rest;
    };

    const displayKey = transposeChord(initialKey, keyOffset);

    const handleLower = () => {
        const newOffset = keyOffset - 1;
        setKeyOffset(newOffset);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('tcl-transpose', { detail: { offset: newOffset } }));
        }
    };

    const handleHigher = () => {
        const newOffset = keyOffset + 1;
        setKeyOffset(newOffset);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('tcl-transpose', { detail: { offset: newOffset } }));
        }
    };

    return (
        <div className="transpose-box">
            <div className="transpose-header">
                <span className="transpose-label">Transpose</span>
                <span className="current-key">{displayKey}</span>
            </div>
            <div className="transpose-buttons">
                <button onClick={handleLower} className="t-btn">♭ Lower</button>
                <button onClick={handleHigher} className="t-btn">♯ Higher</button>
            </div>
            <style>{`
                .transpose-box {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                }
                .transpose-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .transpose-label {
                    font-family: var(--font-display);
                    font-size: 1rem;
                    color: var(--text);
                }
                .current-key {
                    color: var(--accent);
                    font-size: 1.4rem;
                    font-family: var(--font-display);
                    font-weight: 600;
                }
                .transpose-buttons {
                    display: flex;
                    gap: 8px;
                }
                .t-btn {
                    flex: 1;
                    border: 1px solid var(--border);
                    background: transparent;
                    padding: 8px 16px;
                    border-radius: 8px;
                    color: var(--text);
                    font-family: var(--font-body);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .t-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
