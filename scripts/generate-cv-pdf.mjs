import { createServer } from 'node:http'
import { readFile, copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')
const PUBLIC_DIR = path.join(ROOT, 'public')
const BASE_PATH = '/portfolio/'
const PORT = 4173

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

function findChromeExecutable() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH
  }

  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.LOCALAPPDATA
            ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe')
            : null,
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        ].filter(Boolean)
      : [
          '/usr/bin/google-chrome-stable',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/snap/bin/chromium'
        ]

  return candidates.find((candidate) => existsSync(candidate)) || null
}

function startStaticServer(rootDir) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      const relative = urlPath.startsWith(BASE_PATH) ? urlPath.slice(BASE_PATH.length) : urlPath
      let filePath = path.join(rootDir, relative || 'index.html')
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403)
        res.end()
        return
      }
      if (!existsSync(filePath) || filePath === rootDir) {
        filePath = path.join(rootDir, 'index.html')
      }
      const content = await readFile(filePath)
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
      })
      res.end(content)
    } catch {
      res.writeHead(500)
      res.end()
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(PORT, () => resolve(server))
  })
}

async function generatePdfForLang(browser, url, pdfPath, lang) {
  const page = await browser.newPage()
  try {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
    await page.evaluateOnNewDocument(
      (value) => {
        localStorage.setItem('lang', value)
        localStorage.setItem('theme', 'light')
      },
      lang
    )
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    await page.waitForSelector('#cv .cv-document h1', { timeout: 15000 })
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true })
    console.log(`  Generated ${path.basename(pdfPath)} (${lang})`)
  } finally {
    await page.close()
  }
}

async function main() {
  const executablePath = findChromeExecutable()

  if (!executablePath) {
    console.warn(
      '[generate-cv-pdf] No Chrome/Edge executable found. Skipping PDF generation.\n' +
        '  Set CHROME_PATH to your browser executable to enable it.'
    )
    return
  }

  if (!existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.warn('[generate-cv-pdf] dist/index.html not found. Run "vite build" first. Skipping.')
    return
  }

  console.log(`[generate-cv-pdf] Using browser: ${executablePath}`)

  const server = await startStaticServer(DIST_DIR)
  const url = `http://localhost:${PORT}${BASE_PATH}`

  try {
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb']
    })

    try {
      await mkdir(PUBLIC_DIR, { recursive: true })

      // Skip si source manquante (ex: pas de cv.en.md → pas de cv-en.pdf)
      if (existsSync(path.join(ROOT, 'src', 'content', 'cv.fr.md'))) {
        await generatePdfForLang(browser, url, path.join(DIST_DIR, 'cv-fr.pdf'), 'fr')
        await copyFile(path.join(DIST_DIR, 'cv-fr.pdf'), path.join(PUBLIC_DIR, 'cv-fr.pdf'))
      } else {
        console.warn('[generate-cv-pdf] Source introuvable: src/content/cv.fr.md — skip fr')
      }

      if (existsSync(path.join(ROOT, 'src', 'content', 'cv.en.md'))) {
        await generatePdfForLang(browser, url, path.join(DIST_DIR, 'cv-en.pdf'), 'en')
        await copyFile(path.join(DIST_DIR, 'cv-en.pdf'), path.join(PUBLIC_DIR, 'cv-en.pdf'))
      } else {
        console.warn('[generate-cv-pdf] Source introuvable: src/content/cv.en.md — skip en')
      }
    } finally {
      await browser.close()
    }
  } finally {
    server.close()
  }
}

main().catch((error) => {
  console.error('[generate-cv-pdf] Failed:', error.message)
  process.exit(1)
})
