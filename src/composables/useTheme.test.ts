import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should toggle theme correctly', async () => {
    const { useTheme } = await import('../composables/useTheme')
    const { isDark, toggleTheme } = useTheme()
    expect(isDark.value).toBe(false)
    
    toggleTheme()
    expect(isDark.value).toBe(true)
    
    toggleTheme()
    expect(isDark.value).toBe(false)
  })
})

describe('useI18n', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should translate key to French by default', async () => {
    const { useI18n } = await import('../composables/useI18n')
    const { t } = useI18n()
    expect(t('about')).toBe('À propos')
    expect(t('skillsTitle')).toBe('Compétences')
  })

  it('should toggle language correctly', async () => {
    const { useI18n } = await import('../composables/useI18n')
    const { lang, toggleLang } = useI18n()
    expect(lang.value).toBe('fr')
    
    toggleLang()
    expect(lang.value).toBe('en')
    
    toggleLang()
    expect(lang.value).toBe('fr')
  })

  it('should translate key to English when language is en', async () => {
    const { useI18n } = await import('../composables/useI18n')
    const { lang, t } = useI18n()
    lang.value = 'en'
    
    expect(t('about')).toBe('About')
    expect(t('skillsTitle')).toBe('Skills')
  })

  it('should return key if translation is missing', async () => {
    const { useI18n } = await import('../composables/useI18n')
    const { t } = useI18n()
    expect(t('unknownKey')).toBe('unknownKey')
  })
})