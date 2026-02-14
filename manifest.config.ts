import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'Dim Mode for X',
  description: 'Restores the classic Dim theme on X (Twitter).',
  version: pkg.version,
  icons: {
    16: 'public/icons/icon16.png',
    48: 'public/icons/icon48.png',
    128: 'public/icons/icon128.png',
  },
  action: {
    default_icon: {
      16: 'public/icons/icon16.png',
      48: 'public/icons/icon48.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: ['storage'],
  content_scripts: [{
    js: ['src/content/main.ts'],
    matches: ['https://x.com/*', 'https://twitter.com/*', 'https://pro.x.com/*'],
    run_at: 'document_start',
  }],
})
