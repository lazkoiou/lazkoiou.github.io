import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Replace with your real URL once deployed (used for RSS and the sitemap).
export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
