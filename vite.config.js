import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function teamRosterPlugin() {
  const VIRTUAL_ID = 'virtual:team-roster';
  const RESOLVED_ID = '\0virtual:team-roster';
  return {
    name: 'vite-plugin-team-roster',
    resolveId(id) { if (id === VIRTUAL_ID) return RESOLVED_ID; },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const dir = path.resolve(process.cwd(), 'public', 'צוות');
      let files = [];
      try {
        files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
      } catch (_) {}
      return `export const rosterFiles = ${JSON.stringify(files)};`;
    },
  };
}

export default defineConfig({
  plugins: [react(), teamRosterPlugin()],
})
