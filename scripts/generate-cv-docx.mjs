/**
 * Génère les CV publics en .docx (Word) — design ATS 1 colonne, épuré.
 * Sources : src/content/cv.fr.md, src/content/cv.en.md (skip si absent)
 * Sorties : dist/cv-fr.docx, dist/cv-en.docx → public/
 * Usage: node scripts/generate-cv-docx.mjs  (appelé via npm run build — ne touche jamais private/)
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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

// Couleurs ATS (hex sans #)
const COLOR_PRIMARY = '2B579A' // bleu pro sobre
const COLOR_BODY = '1F1F1F'
const COLOR_MUTED = '595959'
const COLOR_BORDER = 'D1D5DB'
const FONT_BODY = 'Calibri'
const FONT_HEADING = 'Calibri'

// Marges A4 : 1.8cm côtés (~0.71"), 1.5cm haut/bas (~0.59") — ATS aéré
const MARGIN_TOP = convertInchesToTwip(0.59)
const MARGIN_BOTTOM = convertInchesToTwip(0.59)
const MARGIN_LEFT = convertInchesToTwip(0.71)
const MARGIN_RIGHT = convertInchesToTwip(0.71)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')
const PUBLIC_DIR = path.join(ROOT, 'public')

const STRIP_HTML_COMMENTS = /<!--[\s\S]*?-->/g
const SECTION_SEPARATOR = /^---\s*$/m

// --- Inline markdown parser minimal (gras, liens, séparateurs) ---
// Gère : **bold**, [text](url), · et espaces. Pas de gestion italique complexe nécessaire pour le CV.

function parseInline(text) {
  // Découper par liens d'abord, puis gras à l'intérieur
  const parts = []
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIdx = 0
  let m
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(...parseBold(text.slice(lastIdx, m.index)))
    }
    parts.push({ text: m[1], bold: false, link: m[2] })
    lastIdx = m.index + m[0].length
  }
  if (lastIdx < text.length) {
    parts.push(...parseBold(text.slice(lastIdx)))
  }
  if (parts.length === 0 && text.length > 0) {
    // aucun lien → juste gras
    return parseBold(text)
  }
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
  return segments.map((seg) => {
    const runOpts = {
      text: seg.text,
      font: FONT_BODY,
      size: size ?? 21, // 10.5pt en half-points
      color: seg.link ? COLOR_PRIMARY : (color ?? COLOR_BODY),
      bold: boldForce ?? seg.bold ?? false,
      italics: italics ?? false,
      underline: seg.link ? {} : undefined
    }
    return { runOpts, link: seg.link }
  })
}

function buildParagraChildren(segments, opts) {
  const runs = toTextRuns(segments, opts)
  return runs.map(({ runOpts, link }) => {
    const tr = new TextRun(runOpts)
    if (link) {
      return new ExternalHyperlink({ children: [tr], link })
    }
    return tr
  })
}

// --- Construction document ATS ---

function buildDocument(source) {
  const blocks = source.split(SECTION_SEPARATOR).map((b) => b.trim()).filter(Boolean)
  const children = []

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx]
    const lines = block.split('\n')

    if (idx === 0) {
      // Header : # Titre + ## Nom + paragraphe contacts
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed.startsWith('# ')) {
          const title = trimmed.replace(/^#\s+/, '').trim()
          children.push(
            new Paragraph({
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [new TextRun({ text: title.toUpperCase(), font: FONT_HEADING, size: 28, color: COLOR_BODY, bold: true })]
            })
          )
        } else if (trimmed.startsWith('## ')) {
          const name = trimmed.replace(/^##\s+/, '').trim()
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
              children: [new TextRun({ text: name, font: FONT_HEADING, size: 32, color: COLOR_PRIMARY, bold: true })]
            })
          )
        } else if (trimmed.startsWith('[') || trimmed.includes('](')) {
          // Contacts ligne : liens · séparateurs — ATS : une ligne centrée, petite taille
          // On découpe par "·" pour garder le séparateur visuel
          const segments = parseInline(trimmed)
          // Remplacer " · " déjà présent dans les segments — les TextRuns incluent le séparateur
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
              children: buildParagraChildren(segments, { size: 18, color: COLOR_MUTED })
            })
          )
        }
      }
      continue
    }

    // Sections suivantes : ## Titre puis contenu
    let sectionTitle = ''
    let contentStart = 0
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim()
      if (t.startsWith('## ')) {
        sectionTitle = t.replace(/^##\s+/, '').trim()
        contentStart = i + 1
        break
      }
    }

    if (sectionTitle) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 280, after: 120 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER, space: 4 }
          },
          children: [new TextRun({ text: sectionTitle.toUpperCase(), font: FONT_HEADING, size: 22, color: COLOR_PRIMARY, bold: true })]
        })
      )
    }

    // Parser le reste du bloc ligne par ligne (ATS : 1 colonne, pas de columns)
    let i = contentStart
    while (i < lines.length) {
      const raw = lines[i]
      const trimmed = raw.trim()

      if (!trimmed) { i++; continue }

      if (trimmed.startsWith('### ')) {
        const h3 = trimmed.replace(/^###\s+/, '').trim()
        const segs = parseInline(h3)
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 40 },
            children: buildParagraChildren(segs, { size: 22, color: COLOR_BODY, boldForce: true })
          })
        )
      } else if (trimmed.startsWith('- ')) {
        // Item de liste à puce — collecter toutes les lignes consécutives "- "
        const items = []
        while (i < lines.length && lines[i].trim().startsWith('- ')) {
          items.push(lines[i].trim().replace(/^-+\s+/, ''))
          i++
        }
        for (const item of items) {
          const segs = parseInline(item)
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              indent: { left: convertInchesToTwip(0.2), hanging: convertInchesToTwip(0.18) },
              children: buildParagraChildren(segs, { size: 20, color: COLOR_BODY })
            })
          )
        }
        continue
      } else if (trimmed.startsWith('**') || trimmed.startsWith('__')) {
        // Dates / meta en gras isolé : ex **2024 – 2025 · Client**
        const segs = parseInline(trimmed)
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: buildParagraChildren(segs, { size: 19, color: COLOR_MUTED, italics: false })
          })
        )
      } else {
        // Paragraphe normal
        const segs = parseInline(trimmed)
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: buildParagraChildren(segs, { size: 20, color: COLOR_BODY })
          })
        )
      }
      i++
    }
  }

  // Footer discret ATS
  children.push(
    new Paragraph({
      spacing: { before: 400 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '—', font: FONT_BODY, size: 16, color: COLOR_BORDER })]
    })
  )

  return new Document({
    numbering: {
      config: [
        {
          reference: 'cv-bullet',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } }
            }
          ]
        }
      ]
    },
    styles: {
      default: {
        document: { run: { font: FONT_BODY, size: 20, color: COLOR_BODY } },
        heading1: { run: { font: FONT_HEADING, color: COLOR_PRIMARY } },
        heading2: { run: { font: FONT_HEADING, color: COLOR_PRIMARY } }
      }
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: convertInchesToTwip(8.27), height: convertInchesToTwip(11.69) }, // A4
            margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT }
          }
        },
        children
      }
    ]
  })
}

async function generateOne(srcPath, outPath, label) {
  if (!existsSync(srcPath)) {
    console.warn(`[generate-cv-docx] Source introuvable: ${path.relative(ROOT, srcPath)} — skip ${label}`)
    return false
  }
  const raw = await readFile(srcPath, 'utf8')
  const source = raw.replace(STRIP_HTML_COMMENTS, '').trim()
  const doc = buildDocument(source)
  const buffer = await Packer.toBuffer(doc)
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, buffer)
  console.log(`  Generated ${path.relative(ROOT, outPath)} (${label})`)
  return true
}

async function main() {
  console.log('[generate-cv-docx] ATS 1-colonne, sans navigateur — public uniquement')

  const results = []
  results.push(await generateOne(path.join(ROOT, 'src', 'content', 'cv.fr.md'), path.join(DIST_DIR, 'cv-fr.docx'), 'fr'))
  results.push(await generateOne(path.join(ROOT, 'src', 'content', 'cv.en.md'), path.join(DIST_DIR, 'cv-en.docx'), 'en'))

  // Copie vers public/ si build a produit dist/
  for (const lang of ['fr', 'en']) {
    const from = path.join(DIST_DIR, `cv-${lang}.docx`)
    const to = path.join(PUBLIC_DIR, `cv-${lang}.docx`)
    if (existsSync(from)) {
      await mkdir(PUBLIC_DIR, { recursive: true })
      await copyFile(from, to)
    }
  }

  if (results.every((r) => !r)) {
    console.warn('[generate-cv-docx] Aucun fichier généré (sources manquantes).')
  }
}

main().catch((e) => {
  console.error('[generate-cv-docx] Échec:', e)
  process.exit(1)
})
