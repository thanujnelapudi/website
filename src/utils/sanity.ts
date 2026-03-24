import { sanityClient } from "sanity:client";

// Core Types
export interface SanityMinistry {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  founded?: string;
  website?: string;
}

export interface SanityArtist {
  _id: string;
  name: string;
  nameTransliterated: string;
  slug: string;
  bio?: string;
  ministry?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface SanitySong {
  _id: string;
  title: string;
  titleTransliterated: string;
  slug: string;
  lyrics: string;
  chords?: string;
  bibleVerses?: string[];
  occasion?: string[];
  mood?: string[];
  era?: string;
  youtubeId?: string;
  featured?: boolean;
  ministry?: {
    _id: string;
    name: string;
    slug: string;
  };
  artist?: {
    _id: string;
    name: string;
    slug: string;
  };
}

// GROQ Queries
export async function getSongs(): Promise<SanitySong[]> {
  const query = `*[_type == "song"] | order(titleTransliterated asc) {
    _id,
    title,
    titleTransliterated,
    "slug": slug.current,
    lyrics,
    chords,
    bibleVerses,
    occasion,
    mood,
    era,
    youtubeId,
    featured,
    ministry->{
      _id,
      name,
      "slug": slug.current
    },
    artist->{
      _id,
      name,
      "slug": slug.current
    }
  }`;
  return await sanityClient.fetch(query);
}

export async function getMinistries(): Promise<SanityMinistry[]> {
  const query = `*[_type == "ministry"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    founded,
    website
  }`;
  return await sanityClient.fetch(query);
}

export async function getArtists(): Promise<SanityArtist[]> {
  const query = `*[_type == "artist"] | order(name asc) {
    _id,
    name,
    nameTransliterated,
    "slug": slug.current,
    bio,
    ministry->{
      _id,
      name,
      "slug": slug.current
    }
  }`;
  return await sanityClient.fetch(query);
}
