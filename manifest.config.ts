import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'Dim Mode for X',
  description: 'Restores the classic Dim theme on X (Twitter).',
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: ['storage'],
  content_scripts: [{
    js: ['src/content/main.ts'],
    matches: ['https://x.com/*', 'https://twitter.com/*'],
    run_at: 'document_start',
  }],
})
