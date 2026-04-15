import { ref, watch, onMounted, onUnmounted } from 'vue'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false
  
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
}

const isDark = ref(getInitialTheme())

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
    }
  })
}

watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', val)
}, { immediate: true })

export function useTheme() {
  const toggleTheme = () => isDark.value = !isDark.value
  return { isDark, toggleTheme }
}