import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const excelPath = 'C:\\Users\\Thanuj\\OneDrive\\ドキュメント\\Book1 (1).xlsx';
const outputDir = path.join('src', 'content', 'songs');

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

try {
    const workbook = xlsx.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
    
    console.log(`Found ${rows.length} songs to import.`);
    
    let count = 0;
    for (const row of rows) {
        const titleRaw = row.title || row.TeluguTitle;
        const transliteratedRaw = row.titleTransliterated || row.EnglishName;
        
        if (!titleRaw || !transliteratedRaw) continue;
        
        const slug = slugify(row.slug || transliteratedRaw);
        const fileName = `${slug}.md`;
        const filePath = path.join(outputDir, fileName);
        
        const title = (titleRaw || '').replace(/"/g, '\\"');
        const englishName = (transliteratedRaw || '').replace(/"/g, '\\"');
        const ministryRaw = row.ministry || row.Ministry || 'Unknown Ministry';
        const ministry = ministryRaw.replace(/"/g, '\\"');
        const artist = (row.artist || row.Artist || ministryRaw || 'Unknown Artist').replace(/"/g, '\\"');
        const featuredRaw = row.featured !== undefined ? row.featured : row.Featured;
        const featured = featuredRaw === true || String(featuredRaw).toLowerCase() === 'true';
        
        const lyricsRaw = row.lyrics || row.Lyrics || '';
        const lyrics = lyricsRaw.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/"/g, '\\"');
        
        const occasionRaw = row.occasion || row.Occasion;
        const occasionParts = occasionRaw ? occasionRaw.split(',').map(s => s.trim()).filter(Boolean) : ["sunday-worship"];
        const occasionStr = JSON.stringify(occasionParts);
        
        const moodRaw = row.mood || row.Mood;
        const moodParts = moodRaw ? moodRaw.split(',').map(s => s.trim()).filter(Boolean) : ["praise"];
        const moodStr = JSON.stringify(moodParts);
        
        const eraRaw = row.era || row.Era;
        const era = eraRaw ? eraRaw.trim() : 'contemporary';
        
        const ytRaw = row.youtubeId || row.YoutubeId || row.YoutubeID;
        const youtubeId = ytRaw ? ytRaw.trim() : '';
        const chordsRow = row.chords || row.Chords;
        const chords = chordsRow ? chordsRow.trim() : '';
        
        const bibleVersesRaw = row.bibleVerses || row.BibleVerses;
        const bibleVersesParts = bibleVersesRaw ? String(bibleVersesRaw).split(',').map(s => s.trim()).filter(Boolean) : [];
        const bibleVersesStr = JSON.stringify(bibleVersesParts);
        
        const ytField = youtubeId ? `\nyoutubeId: "${youtubeId}"` : '';
        const chordsField = chords ? `\nchords: "${chords.replace(/"/g, '\\"')}"` : '';
        
        const mdContent = `---
title: "${title}"
titleTransliterated: "${englishName}"
slug: "${slug}"
artist: "${artist}"
ministry: "${ministry}"
lyrics: "${lyrics}"
bibleVerses: ${bibleVersesStr}
occasion: ${occasionStr}
mood: ${moodStr}
era: "${era}"
featured: ${featured}${ytField}${chordsField}
---

${lyricsRaw.replace(/\r\n/g, '\n')}
`;

        fs.writeFileSync(filePath, mdContent, 'utf8');
        count++;
    }
    
    console.log(`Successfully generated ${count} markdown files in src/content/songs/.`);
} catch (err) {
    console.error("Error importing songs:", err);
}
