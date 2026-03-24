import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const songs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/songs' }),
  schema: z.object({
    title: z.string(),
    titleTransliterated: z.string(),
    slug: z.string(),
    artist: z.string(),
    ministry: z.string(),
    lyrics: z.string(),
    chords: z.string().optional(),
    bibleVerses: z.array(z.string()).optional(),
    occasion: z.array(z.string()),
    mood: z.array(z.string()),
    era: z.enum(['classic', 'contemporary', 'modern']),
    youtubeId: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: z.object({
    name: z.string(),
    nameTransliterated: z.string(),
    bio: z.string().optional(),
    ministry: z.string(),
    image: z.string().optional(),
  }),
});

const ministries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ministries' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    website: z.string().optional(),
    founded: z.number().int().optional(),
  }),
});

export const collections = {
  songs,
  artists,
  ministries,
};
