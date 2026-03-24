// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';

const isBuild = process.env.npm_lifecycle_event === 'build';

// https://astro.build/config
export default defineConfig({
  site: 'https://keerthana.vercel.app',
  integrations: [
    sanity({
      projectId: 'ywnznmes',
      dataset: 'production',
      useCdn: true,
      apiVersion: '2024-03-24',
      stega: {
        studioUrl: '/studio',
      },
    }),
    react(),
    ...(isBuild ? [sitemap()] : [])
  ]
});