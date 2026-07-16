import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://st-cyprien.boxingcenter.fr',
  trailingSlash: 'always',
  compressHTML: false,
  build: { format: 'directory' },
  devToolbar: { enabled: false }
});
