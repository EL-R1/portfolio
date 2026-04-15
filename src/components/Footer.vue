<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo">EL</span>
        </div>
        <div class="footer-links">
          <a href="#about">{{ t('about') }}</a>
          <a href="#skills">{{ t('skillsTitle') }}</a>
          <a href="#projects">{{ t('projectsTitle') }}</a>
          <a href="#resume">{{ t('experienceTitle').split(' & ')[0] }}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Erwan LEBLANC. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 3rem 0 1.5rem;
  background: var(--bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: 1.5rem;
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>