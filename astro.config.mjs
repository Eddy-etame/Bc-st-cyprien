import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://club-boxe-toulouse.com',
  trailingSlash: 'always',
  compressHTML: false,
  build: { format: 'directory' },
  devToolbar: { enabled: false }
});
