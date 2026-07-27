/**
 * Postinstall script: patches @azure/msal-browser to remove "sideEffects": false
 * 
 * MSAL marks itself as side-effect-free, but its EventType object gets
 * incorrectly tree-shaken by Vite 8 / Rolldown in production builds.
 * Removing the flag ensures the bundler preserves all MSAL exports.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgPath = resolve(__dirname, '../node_modules/@azure/msal-browser/package.json')

if (!existsSync(pkgPath)) {
  console.log('[patch-msal] @azure/msal-browser not installed yet, skipping.')
  process.exit(0)
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

if (pkg.sideEffects === false) {
  delete pkg.sideEffects
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  console.log('[patch-msal] Removed "sideEffects": false from @azure/msal-browser')
} else {
  console.log('[patch-msal] @azure/msal-browser already patched or no sideEffects field.')
}
