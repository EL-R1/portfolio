<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const { isDark, toggleTheme } = useTheme()
const { t, lang, toggleLang, getThemeAriaLabel, getLangAriaLabel } = useI18n()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeSection = ref('hero')

const navLinks = computed(() => [
  { name: t('about'), href: '#about', id: 'about' },
  { name: t('skillsTitle'), href: '#skills', id: 'skills' },
  { name: t('projectsTitle'), href: '#projects', id: 'projects' },
  { name: t('experienceTitle').split(' & ')[0], href: '#resume', id: 'resume' }
])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  
  const sections = ['hero', 'about', 'skills', 'projects', 'resume']
  for (const id of sections) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 120) {
        activeSection.value = id
      }
    }
  }
}

const handleLinkClick = (e, href) => {
  e.preventDefault()
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['navbar', { scrolled: isScrolled }]" role="navigation" :aria-label="t('ariaNav')">
    <div class="container">
      <a href="#" class="logo" :aria-label="t('ariaLogo')">EL</a>
      
      <div class="nav-links desktop" role="menubar">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          :class="{ active: activeSection === link.id }"
          role="menuitem"
          @click="handleLinkClick($event, link.href)"
        >{{ link.name }}</a>
      </div>

      <div class="nav-actions">
        <button @click="toggleTheme" class="theme-toggle" :aria-label="getThemeAriaLabel(isDark)">
          <span v-if="isDark" aria-hidden="true">☀️</span>
          <span v-else aria-hidden="true">🌙</span>
        </button>
        <button @click="toggleLang" class="lang-toggle" :aria-label="getLangAriaLabel(lang)">
          {{ lang.toUpperCase() }}
        </button>
        
        <button 
          class="mobile-menu-toggle" 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="t('ariaMobileMenu')"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <div 
      id="mobile-menu"
      :class="['mobile-menu', { open: isMobileMenuOpen }]"
      role="menu"
      aria-hidden="!isMobileMenuOpen"
    >
      <a 
        v-for="link in navLinks" 
        :key="link.name" 
        href="#" 
        role="menuitem"
        :class="{ active: activeSection === link.id }"
        @click="handleLinkClick($event, link.href)"
      >{{ link.name }}</a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-links a.active {
  color: var(--color-primary);
  position: relative;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-hover);
}

.lang-toggle {
  background: none;
  border: 1px solid var(--color-border);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.lang-toggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--bg-card);
  padding: 2rem;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mobile-menu a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.mobile-menu a.active {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .desktop {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: none;
  }
  
  .mobile-menu.open {
    display: flex;
  }
}
</style>