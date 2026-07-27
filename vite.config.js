import crypto from 'node:crypto'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function bytesFromBase64(b64) {
  return Buffer.from(String(b64 || ''), 'base64')
}

function decryptEncV1({ encrypted, passphrase }) {
  const text = String(encrypted || '').trim()
  if (!text.startsWith('bbsenc:v1:')) {
    throw new Error('API_ENC is not in a supported format')
  }
  const raw = text.slice('bbsenc:v1:'.length)
  const parts = raw.split(':')
  if (parts.length !== 3) {
    throw new Error('API_ENC is not in a supported format')
  }

  const salt = bytesFromBase64(parts[0])
  const iv = bytesFromBase64(parts[1])
  const cipherAll = bytesFromBase64(parts[2])

  if (salt.length !== 16 || iv.length !== 12 || cipherAll.length < 17) {
    throw new Error('API_ENC is not in a supported format')
  }

  const key = crypto.pbkdf2Sync(String(passphrase || ''), salt, 120000, 32, 'sha256')
  const tag = cipherAll.subarray(cipherAll.length - 16)
  const cipher = cipherAll.subarray(0, cipherAll.length - 16)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const plain = Buffer.concat([decipher.update(cipher), decipher.final()])
  return plain.toString('utf8')
}

function parseKeyValueText(text) {
  const raw = String(text || '').trim()
  if (!raw) return {}

  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object') return obj
  } catch {}

  const obj = {}
  const cleaned = raw.replace(/^\s*\{/, '').replace(/\}\s*$/, '')
  const parts = cleaned.split(/[\r\n,]+/)
  for (const part of parts) {
    const line = String(part || '').trim()
    if (!line) continue
    const m = line.match(/^"?(API_URL|VITE_API_URL)"?\s*[:=]\s*(.+)$/)
    if (!m) continue
    const key = String(m[1] || '').trim()
    let value = String(m[2] || '').trim()
    if (value.endsWith(',')) value = value.slice(0, -1).trim()
    value = value.replace(/^"+/, '').replace(/"+$/, '')
    value = value.replace(/^'+/, '').replace(/'+$/, '')
    obj[key] = value
  }
  return obj
}

function normalizeApiEncKey(value) {
  const v = String(value || '').trim()
  if (!v) return ''
  return v.replace('A02oxp', 'A0oxp')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let viteApiUrl = env.VITE_API_URL || ''
  let apiUrl = env.API_URL || ''

  if ((!viteApiUrl || !apiUrl) && env.API_ENC) {
    const keyRaw = env.API_ENC_KEY || env.API_KEY || ''
    const key = normalizeApiEncKey(keyRaw)
    if (!key) {
      throw new Error('Missing required env var: API_ENC_KEY')
    }
    const decrypted = decryptEncV1({ encrypted: env.API_ENC, passphrase: key })
    const parsed = parseKeyValueText(decrypted)
    viteApiUrl = viteApiUrl || String(parsed.VITE_API_URL || '').trim()
    apiUrl = apiUrl || String(parsed.API_URL || '').trim()
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(viteApiUrl),
      'import.meta.env.API_URL': JSON.stringify(apiUrl),
    },
    optimizeDeps: {
      include: ['@azure/msal-browser'],
    },
  }
})
