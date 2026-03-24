import React, { useState, useEffect } from 'react';

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

interface Props {
    lyrics: string;
    chords?: string;
    currentKey?: string;
}

export default function ChordLyricsDisplay({ lyrics, chords, currentKey = "G" }: Props) {
    const [keyOffset, setKeyOffset] = useState<number>(0); 

    useEffect(() => {
        const handleTranspose = (e: any) => {
            if (e.detail !== undefined && e.detail.offset !== undefined) {
                setKeyOffset(e.detail.offset);
            }
        };
        window.addEventListener('tcl-transpose', handleTranspose);
        return () => window.removeEventListener('tcl-transpose', handleTranspose);
    }, []);

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

    const renderChords = () => {
        if (!chords || chords.trim() === '') return null;
        
        const transposedChords = chords.split('\n').map(line => {
            return line.replace(/\b([A-G][#b]?(m|min|maj|dim|aug|sus\d|add\d)?([/\w]*))\b/g, (match) => {
                if (match.includes('/')) {
                    const [c1, c2] = match.split('/');
                    return transposeChord(c1, keyOffset) + '/' + transposeChord(c2, keyOffset);
                }
                return transposeChord(match, keyOffset);
            });
        }).join('\n');

        return (
            <div className="chords-display fade-up">
                <div className="chords-label">Chords</div>
                <pre>{transposedChords}</pre>
            </div>
        );
    };

    const renderLyricsLine = (line: string, idx: number) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={idx} className="lyric-spacer" />;
        
        const isLabel = (trimmed.startsWith('[') && trimmed.endsWith(']')) || 
                        /^(pallavi|charanam|verse|chorus|bridge)[^a-z]/i.test(trimmed);
        
        if (isLabel) {
            const cleanLabel = trimmed.replace(/[\[\]]/g, '').replace(/:$/, '');
            return (
                <div key={idx} className="lyric-label">
                    {cleanLabel}
                </div>
            );
        }
        
        return (
            <div key={idx} className="lyric-line">
                {trimmed}
            </div>
        );
    };

    return (
        <div className="lyrics-wrapper">
            {renderChords()}
            
            <div className="lyrics-display">
                {lyrics.split('\n').map((line, idx) => renderLyricsLine(line, idx))}
            </div>

            <style>{`
                .lyrics-wrapper {
                    width: 100%;
                }

                .chords-display {
                    margin-bottom: 2rem;
                    background: var(--surface-2);
                    padding: 1.5rem;
                    border-radius: 12px;
                    overflow-x: auto;
                    border: 1px solid var(--border);
                }

                .chords-label {
                    font-family: var(--font-body);
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1rem;
                }

                .chords-display pre {
                    margin: 0;
                    font-family: monospace;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: var(--primary);
                }

                .lyrics-display {
                    font-family: var(--font-telugu);
                    font-size: 1.15rem;
                    line-height: 2.2;
                    color: var(--telugu-color);
                }

                .lyric-spacer {
                    height: 32px;
                }

                .lyric-label {
                    font-family: var(--font-body);
                    font-size: 0.75rem;
                    color: var(--accent);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 4px;
                    margin-top: 16px;
                }

                .lyric-line {
                    margin-bottom: 4px;
                }

                /* Print optimizations */
                @media print {
                    .chords-display {
                        background: none;
                        border: 1px solid #ccc;
                        color: #000;
                    }
                    .chords-display pre { color: #000; }
                    .lyrics-display { color: #000; }
                    .lyric-label { color: #555; }
                }
            `}</style>
        </div>
    );
}
