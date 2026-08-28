/**
 * Génère les CV privés (dossier private/) — local uniquement, jamais commité.
 * Sources : private/cv.prive.fr.md → cv-fr-prive.*, private/cv.prive.en.md → cv-en-prive.*
 *           Skip silencieux si source manquante (pas d'EN → pas de fichier EN).
 * Sorties : private/cv-fr-prive.pdf, private/cv-en-prive.pdf,
 *           private/cv-fr-prive.docx, private/cv-en-prive.docx
 * Usage: npm run build:private  (alias build:prive)
 * PDF : puppeteer-core (comme CvSection.vue) ; DOCX : docx ATS 1 colonne (comme generate-cv-docx.mjs)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import puppeteer from 'puppeteer-core'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  BorderStyle,
  convertInchesToTwip,
  LevelFormat
} from 'docx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

const STRIP_HTML_COMMENTS = /<!--[\s\S]*?-->/g
const SECTION_SEPARATOR = /^---\s*$/m
const H2_TITLE = /^##\s+(.+)$/m

const TWO_COL_TITLES = ['Formation', 'Education', 'Compétences', 'Skills', 'Bénévolat', 'Volunteer Work']
const EXP_TITLES = ['Expérience Professionnelle', 'Professional Experience']

// --- DOCX ATS (copié de generate-cv-docx.mjs pour build privé autonome) ---
const COLOR_PRIMARY = '2B579A'
const COLOR_BODY = '1F1F1F'
const COLOR_MUTED = '595959'
const COLOR_BORDER = 'D1D5DB'
const FONT_BODY = 'Calibri'
const FONT_HEADING = 'Calibri'
const MARGIN_TOP = convertInchesToTwip(0.59)
const MARGIN_BOTTOM = convertInchesToTwip(0.59)
const MARGIN_LEFT = convertInchesToTwip(0.71)
const MARGIN_RIGHT = convertInchesToTwip(0.71)

function parseInline(text) {
  const parts = []
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIdx = 0
  let m
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(...parseBold(text.slice(lastIdx, m.index)))
    parts.push({ text: m[1], bold: false, link: m[2] })
    lastIdx = m.index + m[0].length
  }
  if (lastIdx < text.length) parts.push(...parseBold(text.slice(lastIdx)))
  if (parts.length === 0 && text.length > 0) return parseBold(text)
  return parts
}
function parseBold(text) {
  const out = []
  const boldRe = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), bold: false })
    out.push({ text: m[1], bold: true })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false })
  if (out.length === 0 && text.length > 0) out.push({ text, bold: false })
  return out
}
function toTextRuns(segments, opts = {}) {
  const { size, color, boldForce, italics } = opts
  return segments.map((seg) => ({
    runOpts: {
      text: seg.text,
      font: FONT_BODY,
      size: size ?? 21,
      color: seg.link ? COLOR_PRIMARY : (color ?? COLOR_BODY),
      bold: boldForce ?? seg.bold ?? false,
      italics: italics ?? false,
      underline: seg.link ? {} : undefined
    },
    link: seg.link
  }))
}
function buildParagraChildren(segments, opts) {
  const runs = toTextRuns(segments, opts)
  return runs.map(({ runOpts, link }) => {
    const tr = new TextRun(runOpts)
    if (link) return new ExternalHyperlink({ children: [tr], link })
    return tr
  })
}
function buildDocument(source) {
  const blocks = source.split(SECTION_SEPARATOR).map((b) => b.trim()).filter(Boolean)
  const children = []
  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx]
    const lines = block.split('\n')
    if (idx === 0) {
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed.startsWith('# ')) {
          const title = trimmed.replace(/^#\s+/, '').trim()
          children.push(new Paragraph({ heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: title.toUpperCase(), font: FONT_HEADING, size: 28, color: COLOR_BODY, bold: true })] }))
        } else if (trimmed.startsWith('## ')) {
          const name = trimmed.replace(/^##\s+/, '').trim()
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: name, font: FONT_HEADING, size: 32, color: COLOR_PRIMARY, bold: true })] }))
        } else if (trimmed.startsWith('[') || trimmed.includes('](')) {
          const segments = parseInline(trimmed)
          children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: buildParagraChildren(segments, { size: 18, color: COLOR_MUTED }) }))
        }
      }
      continue
    }
    let sectionTitle = ''
    let contentStart = 0
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim()
      if (t.startsWith('## ')) { sectionTitle = t.replace(/^##\s+/, '').trim(); contentStart = i + 1; break }
    }
    if (sectionTitle) {
      children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER, space: 4 } }, children: [new TextRun({ text: sectionTitle.toUpperCase(), font: FONT_HEADING, size: 22, color: COLOR_PRIMARY, bold: true })] }))
    }
    let i = contentStart
    while (i < lines.length) {
      const raw = lines[i]
      const trimmed = raw.trim()
      if (!trimmed) { i++; continue }
      if (trimmed.startsWith('### ')) {
        const h3 = trimmed.replace(/^###\s+/, '').trim()
        const segs = parseInline(h3)
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 40 }, children: buildParagraChildren(segs, { size: 22, color: COLOR_BODY, boldForce: true }) }))
      } else if (trimmed.startsWith('- ')) {
        const items = []
        while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().replace(/^-+\s+/, '')); i++ }
        for (const item of items) {
          const segs = parseInline(item)
          children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.2), hanging: convertInchesToTwip(0.18) }, children: buildParagraChildren(segs, { size: 20, color: COLOR_BODY }) }))
        }
        continue
      } else if (trimmed.startsWith('**') || trimmed.startsWith('__')) {
        const segs = parseInline(trimmed)
        children.push(new Paragraph({ spacing: { after: 40 }, children: buildParagraChildren(segs, { size: 19, color: COLOR_MUTED }) }))
      } else {
        const segs = parseInline(trimmed)
        children.push(new Paragraph({ spacing: { after: 80 }, children: buildParagraChildren(segs, { size: 20, color: COLOR_BODY }) }))
      }
      i++
    }
  }
  children.push(new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: '—', font: FONT_BODY, size: 16, color: COLOR_BORDER })] }))
  return new Document({
    numbering: { config: [{ reference: 'cv-bullet', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } } }] }] },
    styles: { default: { document: { run: { font: FONT_BODY, size: 20, color: COLOR_BODY } }, heading1: { run: { font: FONT_HEADING, color: COLOR_PRIMARY } }, heading2: { run: { font: FONT_HEADING, color: COLOR_PRIMARY } } } },
    sections: [{ properties: { page: { size: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) }, margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT } } }, children }]
  })
}

// --- PDF html (inchangé, paramétré par source) ---
function findChromeExecutable() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe') : null,
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
        ].filter(Boolean)
      : ['/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium', '/snap/bin/chromium']
  return candidates.find((c) => existsSync(c)) || null
}
function buildHtml(rendered) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{background:#fff !important;margin:0 !important;font-family:'Inter',system-ui,sans-serif;color:#111}
  @page{size:A4;margin:9mm 12mm}
  .cv-document{max-width:100%;background:#fff;font-size:10.5px;line-height:1.4;padding:0}
  .cv-document h1{font-size:20px;letter-spacing:0.04em;margin:0 0 1px;color:#000}
  .cv-document h1 + h2{font-size:11.5px;font-weight:500;text-transform:none;letter-spacing:normal;border:none;padding:0;color:#4f46e5;margin:0 0 3px}
  .cv-document h1 + h2 + p{font-size:9.5px;color:#333;margin:0 0 6px;word-break:break-all}
  .cv-document .cv-sec{margin-top:9px}
  .cv-document .cv-sec > h2{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#333;border-bottom:1px solid #e5e7eb;padding-bottom:2px;margin:0 0 4px}
  .cv-document h3{font-size:10.5px;margin:6px 0 1px;break-after:avoid;color:#000}
  .cv-document .cv-sec--exp h3{font-size:12px;margin:9px 0 2px}
  .cv-document p{margin:0 0 2px;color:#000}
  .cv-document a{color:#000;text-decoration:none}
  .cv-document ul{margin:0 0 3px 14px;color:#000}
  .cv-document li{margin-bottom:1px;break-inside:avoid}
  .cv-document .cv-sec--2col{columns:2;column-gap:24px}
  .cv-document .cv-sec--exp ul{columns:2;column-gap:24px;margin-bottom:2px}
  .cv-document .cv-sec--2col h3,.cv-document .cv-sec--2col p,.cv-document .cv-sec--2col li,.cv-document .cv-sec--exp li{break-inside:avoid}
  .cv-document h1,.cv-document h2,.cv-document h3,.cv-document p,.cv-document li,.cv-document strong{color:#000}
  .cv-document .cv-sec > h2{color:#333}
</style>
</head>
<body><article class="cv-document">${rendered}</article></body>
</html>`
}
function renderMarkdown(source) {
  const blocks = source.split(SECTION_SEPARATOR).map((b) => b.trim()).filter(Boolean)
  return blocks
    .map((block, i) => {
      const html = md.render(block)
      if (i === 0) return html
      const titleMatch = block.match(H2_TITLE)
      const title = titleMatch ? titleMatch[1].trim() : ''
      const twoCol = TWO_COL_TITLES.includes(title)
      const isExp = EXP_TITLES.includes(title)
      const h2Match = html.match(/^<h2[^>]*>[\s\S]*?<\/h2>/)
      if (!h2Match) return `<section class="cv-sec">${html}</section>`
      const body = html.slice(h2Match[0].length)
      const bodyCls = twoCol ? 'cv-sec-body cv-sec--2col' : 'cv-sec-body'
      const secCls = isExp ? 'cv-sec cv-sec--exp' : 'cv-sec'
      return `<section class="${secCls}">${h2Match[0]}<div class="${bodyCls}">${body}</div></section>`
    })
    .join('')
}

async function generatePdf(source, outPath, browser) {
  const rendered = renderMarkdown(source)
  const html = buildHtml(rendered)
  const page = await browser.newPage()
  try {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({ path: outPath, format: 'A4', printBackground: true })
    console.log(`[build:private] Généré: ${path.relative(ROOT, outPath)}`)
  } finally {
    await page.close()
  }
}
async function generateDocx(source, outPath, label) {
  const doc = buildDocument(source)
  const buffer = await Packer.toBuffer(doc)
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, buffer)
  console.log(`[build:private] Généré: ${path.relative(ROOT, outPath)} (${label} docx)`)
}

async function main() {
  const entries = [
    { src: path.join(ROOT, 'private', 'cv.prive.fr.md'), pdf: path.join(ROOT, 'private', 'cv-fr-prive.pdf'), docx: path.join(ROOT, 'private', 'cv-fr-prive.docx'), label: 'fr' },
    { src: path.join(ROOT, 'private', 'cv.prive.en.md'), pdf: path.join(ROOT, 'private', 'cv-en-prive.pdf'), docx: path.join(ROOT, 'private', 'cv-en-prive.docx'), label: 'en' }
  ]

  // Filtrer les sources existantes — si aucune, warn et exit
  const existing = entries.filter((e) => {
    if (!existsSync(e.src)) {
      console.warn(`[build:private] Source introuvable: ${path.relative(ROOT, e.src)} — skip ${e.label}`)
      return false
    }
    return true
  })
  if (existing.length === 0) {
    console.warn('[build:private] Aucune source privée trouvée (private/cv.prive.{fr,en}.md) — rien à générer.')
    return
  }

  const needPdf = existing.length > 0
  let browser = null
  if (needPdf) {
    const executablePath = findChromeExecutable()
    if (!executablePath) {
      console.warn('[build:private] Aucun navigateur Chrome/Edge trouvé — PDF privé skippé, DOCX seul généré. Définis CHROME_PATH.')
    } else {
      browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'] })
    }
  }

  try {
    for (const e of existing) {
      const raw = await readFile(e.src, 'utf8')
      const source = raw.replace(STRIP_HTML_COMMENTS, '').trim()
      // DOCX toujours (pas de dépendance navigateur)
      await generateDocx(source, e.docx, e.label)
      // PDF si browser dispo
      if (browser) await generatePdf(source, e.pdf, browser)
      else console.warn(`[build:private] PDF ${e.label} skippé (pas de navigateur)`)
    }
  } finally {
    if (browser) await browser.close()
  }
}

main().catch((e) => {
  console.error('[build:private] Échec:', e.message)
  process.exit(1)
})
