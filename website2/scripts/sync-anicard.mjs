import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Build a presentation snapshot without changing the original Anicard checkout.
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontend = path.resolve(process.argv[2] || '/Users/mathis/Documents/Anicard/Anicard/frontend');
const vitePath = path.join(frontend, 'node_modules/vite/dist/node/index.js');
if (!existsSync(vitePath)) throw new Error('Install Anicard frontend dependencies before synchronising its preview.');
const { build } = await import(pathToFileURL(vitePath).href);
const sourceRequire = createRequire(path.join(frontend, 'package.json'));
const react = (await import(pathToFileURL(sourceRequire.resolve('@vitejs/plugin-react')).href)).default;
const destination = path.join(project, 'public/demos/anicard');
await build({
  configFile: false,
  root: frontend,
  base: './',
  plugins: [
    {
      name: 'portfolio-presentation-routing',
      enforce: 'pre',
      transform(source, id) {
        if (id === path.join(frontend, 'src/main.tsx')) {
          return source.replaceAll('BrowserRouter', 'HashRouter')
            .replace('window.location.assign("/")', 'window.location.assign(window.location.pathname)')
            .replace('href="#main-content"', 'href="#/" onClick={(event) => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}')
            .replace('<main id="main-content"', '<main tabIndex={-1} id="main-content"');
        }
        if (/\.(tsx?|css)$/.test(id) && id.startsWith(path.join(frontend, 'src'))) {
          return source.replaceAll('"/art/', '"./art/');
        }
      },
    },
    react(),
  ],
  build: { outDir: destination, emptyOutDir: true, sourcemap: false },
});
const packageJson = JSON.parse(await readFile(path.join(frontend, 'package.json'), 'utf8'));
await writeFile(path.join(destination, 'snapshot.json'), JSON.stringify({ project: 'Anicard', version: packageJson.version, capturedAt: new Date().toISOString(), interfaceLanguage: 'en', requiresApi: true }, null, 2)+'\n');
console.log('Anicard presentation snapshot saved to public/demos/anicard.');

await writeFile(path.join(destination, 'SOURCE-LICENSE.txt'), await readFile(path.join(frontend, '..', 'LICENSE'), 'utf8'));
