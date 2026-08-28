<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { useI18n } from '../composables/useI18n'
import cvFr from '../content/cv.fr.md?raw'
import cvEn from '../content/cv.en.md?raw'

const { t, lang } = useI18n()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

const STRIP_HTML_COMMENTS = /<!--[\s\S]*?-->/g
const SECTION_SEPARATOR = /^---\s*$/m
const H2_TITLE = /^##\s+(.+)$/m

const TWO_COL_TITLES = [
  'Formation',
  'Education',
  'Compétences',
  'Skills',
  'Bénévolat',
  'Volunteer Work'
]

const EXP_TITLES = ['Expérience Professionnelle', 'Professional Experience']

const cvSource = computed(() =>
  ((lang.value === 'fr' ? cvFr : cvEn) || '').replace(STRIP_HTML_COMMENTS, '').trim()
)

const renderedHtml = computed(() => {
  const blocks = cvSource.value.split(SECTION_SEPARATOR).map((b) => b.trim()).filter(Boolean)
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
})

const pdfHref = computed(() => `${import.meta.env.BASE_URL}cv-${lang.value}.pdf`)

const pdfName = computed(() =>
  lang.value === 'fr' ? 'CV-Erwan-LEBLANC.pdf' : 'Resume-Erwan-LEBLANC.pdf'
)

const docxHref = computed(() => `${import.meta.env.BASE_URL}cv-${lang.value}.docx`)

const docxName = computed(() =>
  lang.value === 'fr' ? 'CV-Erwan-LEBLANC.docx' : 'Resume-Erwan-LEBLANC.docx'
)

const downloadMarkdown = () => {
  const blob = new Blob([cvSource.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = lang.value === 'fr' ? 'CV-Erwan-LEBLANC.md' : 'Resume-Erwan-LEBLANC.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section id="cv" class="cv">
    <div class="container">
      <h2 class="section-title">{{ t('cvTitle') }}</h2>

      <div class="cv-actions">
        <a class="cv-btn cv-btn-primary" :href="pdfHref" :download="pdfName">{{
          t('cvDownloadPdf')
        }}</a>
        <a class="cv-btn cv-btn-outline" :href="docxHref" :download="docxName">{{
          t('cvDownloadDocx')
        }}</a>
        <button class="cv-btn cv-btn-outline" @click="downloadMarkdown">{{ t('cvDownloadMd') }}</button>
      </div>

      <article class="cv-document" aria-label="Curriculum Vitae" v-html="renderedHtml"></article>
    </div>
  </section>
</template>

<style scoped>
.cv {
  padding: 6rem 0;
  background: var(--bg-secondary);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.cv-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.cv-btn {
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
}

.cv-btn-primary {
  background: var(--color-primary);
  color: #fff;
  border: 2px solid var(--color-primary);
}

.cv-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.cv-btn-outline {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.cv-btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.cv-document {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 3rem 4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  line-height: 1.65;
}

.cv-document :deep(h1) {
  font-size: 2.25rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

/* Sous-titre : le h2 juste après le h1 */
.cv-document :deep(h1 + h2) {
  font-size: 1.15rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  border-bottom: none;
  padding-bottom: 0;
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: 0.5rem;
}

/* Sections issues du markdown (blocs séparés par ---) */
.cv-document :deep(.cv-sec) {
  margin-top: 2rem;
}

/* En-têtes de section : le h2 de chaque bloc */
.cv-document :deep(.cv-sec > h2) {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-top: 0;
  margin-bottom: 1.25rem;
}

.cv-document :deep(h3) {
  font-size: 1.05rem;
  color: var(--color-text);
  margin-top: 1.5rem;
  margin-bottom: 0.25rem;
}

/* Titres d'expériences plus visibles */
.cv-document :deep(.cv-sec--exp h3) {
  font-size: 1.2rem;
  margin-top: 2rem;
}

.cv-document :deep(h3 + p strong) {
  color: var(--color-text-muted);
  font-weight: 500;
}

.cv-document :deep(p) {
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.cv-document :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.cv-document :deep(a:hover) {
  text-decoration: underline;
}

.cv-document :deep(ul) {
  margin: 0 0 1rem 1.5rem;
  color: var(--color-text);
}

.cv-document :deep(li) {
  margin-bottom: 0.35rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .cv-actions {
    flex-direction: column;
    align-items: stretch;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }

  .cv-document {
    padding: 2rem 1.5rem;
  }
}
</style>

<style>
@media print {
  @page {
    size: A4;
    margin: 9mm 12mm;
  }

  /* Canvas blanc : sans ça, le fond sombre du thème se propage aux zones vides (ex. page 2) */
  html,
  body {
    background: #fff !important;
    margin: 0 !important;
  }

  /* On retire tout sauf le document CV (display:none = pas de pages fantômes) */
  .skip-link,
  .navbar,
  footer,
  .modal-overlay,
  main > section:not(#cv),
  #cv .section-title,
  #cv .cv-actions {
    display: none !important;
  }

  #cv {
    padding: 0 !important;
    background: #fff !important;
  }

  .cv-document {
    max-width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    font-size: 10.5px !important;
    line-height: 1.4 !important;
  }

  .cv-document h1 {
    font-size: 20px !important;
    letter-spacing: 0.04em !important;
    margin: 0 0 1px !important;
  }

  .cv-document h1 + h2 {
    font-size: 11.5px !important;
    margin: 0 0 3px !important;
  }

  .cv-document .cv-sec {
    margin-top: 9px !important;
  }

  .cv-document .cv-sec > h2 {
    font-size: 11.5px !important;
    padding-bottom: 2px !important;
    border-bottom-width: 1px !important;
    margin: 0 0 4px !important;
  }

  .cv-document h3 {
    font-size: 10.5px !important;
    margin: 6px 0 1px !important;
    break-after: avoid;
  }

  .cv-document .cv-sec--exp h3 {
    font-size: 12px !important;
    margin: 9px 0 2px !important;
  }

  .cv-document p {
    margin: 0 0 2px !important;
  }

  .cv-document ul {
    margin: 0 0 3px 14px !important;
  }

  .cv-document li {
    margin-bottom: 1px !important;
  }

  .cv-document .cv-sec--2col {
    columns: 2 !important;
    column-gap: 24px;
  }

  .cv-document .cv-sec--exp ul {
    columns: 2 !important;
    column-gap: 24px;
    margin-bottom: 2px !important;
  }

  .cv-document .cv-sec--2col h3,
  .cv-document .cv-sec--2col p,
  .cv-document .cv-sec--2col li,
  .cv-document .cv-sec--exp li {
    break-inside: avoid;
  }

  .cv-document h1,
  .cv-document h2,
  .cv-document h3,
  .cv-document p,
  .cv-document li,
  .cv-document strong {
    color: #000 !important;
  }

  .cv-document .cv-sec > h2 {
    color: #333 !important;
  }

  .cv-document a {
    color: #000 !important;
    text-decoration: none !important;
  }
}
</style>
