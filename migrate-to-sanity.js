import { createClient } from '@sanity/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Initialize Sanity Client
const client = createClient({
  projectId: 'ywnznmes',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-24',
  token: process.env.SANITY_API_TOKEN || '', // User will need to provide this
});

const SONGS_DIR = path.join(process.cwd(), 'src', 'content', 'songs');

async function migrate() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN environment variable is missing.');
    console.log('To get a token:');
    console.log('1. Go to https://manage.sanity.io/projects/ywnznmes/api');
    console.log('2. Click "Add API token" -> Name it "Migration" -> Editor permissions.');
    console.log('3. Run the script with: SANITY_API_TOKEN="your_token" node migrate-to-sanity.js');
    process.exit(1);
  }

  console.log('🚀 Starting migration to Sanity...');
  
  try {
    const files = await fs.readdir(SONGS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} markdown songs to migrate.`);

    // First pass: Collect all unique ministries and artists
    const ministries = new Set();
    const artists = new Set();
    const songsData = [];

    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(SONGS_DIR, file), 'utf-8');
      
      // Basic Frontmatter parser
      const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) continue;
      
      const frontmatter = frontmatterMatch[1];
      const body = content.replace(frontmatterMatch[0], '').trim();
      
      const data = {};
      const lines = frontmatter.split('\n');
      
      for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > -1) {
          const key = line.slice(0, colonIdx).trim();
          let value = line.slice(colonIdx + 1).trim();
          // Remove quotes
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          data[key] = value;
        }
      }

      // Arrays parsing
      if (typeof data.mood === 'string') {
          try {
              data.mood = JSON.parse(data.mood.replace(/'/g, '"'));
          } catch(e) { /* ignore */ }
      }
      
      if (data.ministry) ministries.add(data.ministry);
      if (data.artist) artists.add({ name: data.artist, ministry: data.ministry });
      
      songsData.push({
        ...data,
        body,
        slug: file.replace('.md', '')
      });
    }

    // Create Ministries
    console.log(`\n📦 Creating ${ministries.size} Ministries...`);
    const ministryMap = {}; // name -> _id
    for (const minName of ministries) {
        const id = 'min-' + crypto.createHash('md5').update(minName).digest('hex').substring(0, 10);
        const doc = {
            _type: 'ministry',
            _id: id,
            name: minName,
            slug: { _type: 'slug', current: minName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        };
        await client.createIfNotExists(doc);
        ministryMap[minName] = id;
    }

    // Create Artists
    console.log(`\n🎤 Creating ${artists.size} Artists...`);
    const artistMap = {}; // name -> _id
    for (const artistObj of artists) {
        const id = 'art-' + crypto.createHash('md5').update(artistObj.name).digest('hex').substring(0, 10);
        const doc = {
            _type: 'artist',
            _id: id,
            name: artistObj.name,
            nameTransliterated: artistObj.name, // Use same for now since we don't have separate in MD
            slug: { _type: 'slug', current: artistObj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        };
        
        if (artistObj.ministry && ministryMap[artistObj.ministry]) {
            doc.ministry = { _type: 'reference', _ref: ministryMap[artistObj.ministry] };
        }
        
        await client.createIfNotExists(doc);
        artistMap[artistObj.name] = id;
    }

    // Create Songs
    console.log(`\n🎵 Migrating ${songsData.length} Songs...`);
    let count = 0;
    
    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < songsData.length; i += batchSize) {
        const batch = songsData.slice(i, i + batchSize);
        const transaction = client.transaction();
        
        for (const data of batch) {
            const id = 'song-' + crypto.createHash('md5').update(data.slug).digest('hex').substring(0, 10);
            
            const doc = {
                _id: id,
                _type: 'song',
                title: data.title || 'Unknown Title',
                titleTransliterated: data.titleTransliterated || data.title,
                slug: { _type: 'slug', current: data.slug },
                lyrics: data.body,
                era: 'contemporary',
                featured: false
            };
            
            if (data.ministry && ministryMap[data.ministry]) {
                doc.ministry = { _type: 'reference', _ref: ministryMap[data.ministry] };
            }
            
            if (data.artist && artistMap[data.artist]) {
                doc.artist = { _type: 'reference', _ref: artistMap[data.artist] };
            }
            
            if (data.mood && Array.isArray(data.mood)) {
                // Map frontend moods to sanity predefined values
                const validMoods = ['praise', 'worship', 'thanksgiving', 'prayer', 'devotional', 'comfort', 'joyful', 'reflective', 'victory'];
                doc.mood = data.mood.map(m => m.toLowerCase()).filter(m => validMoods.includes(m));
            }
            
            transaction.createOrReplace(doc);
            count++;
        }
        
        await transaction.commit();
        console.log(`Migrated batch ${i / batchSize + 1}... (${count}/${songsData.length})`);
    }

    console.log('\n✅ Migration Complete! All songs are now in Sanity Studio.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
