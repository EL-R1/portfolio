<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t, lang } = useI18n()

const name = 'Erwan LEBLANC'
const currentTitle = ref('')
const currentIndex = ref(0)
let animationId = null

const rolesFR = ['Développeur Full Stack', 'DevOps Junior']
const rolesEN = ['Full Stack Developer', 'Junior DevOps']

const getRoles = () => lang.value === 'fr' ? rolesFR : rolesEN

const typeWriter = () => {
  const roles = getRoles()
  const currentRole = roles[currentIndex.value]
  
  if (currentTitle.value.length < currentRole.length) {
    currentTitle.value = currentRole.slice(0, currentTitle.value.length + 1)
    animationId = setTimeout(typeWriter, 150)
  } else {
    animationId = setTimeout(eraseWriter, 3000)
  }
}

const eraseWriter = () => {
  if (currentTitle.value.length > 0) {
    currentTitle.value = currentTitle.value.slice(0, -1)
    animationId = setTimeout(eraseWriter, 80)
  } else {
    currentIndex.value = (currentIndex.value + 1) % getRoles().length
    animationId = setTimeout(typeWriter, 500)
  }
}

const startAnimation = () => {
  if (animationId) clearTimeout(animationId)
  currentIndex.value = 0
  currentTitle.value = ''
  animationId = setTimeout(typeWriter, 500)
}

watch(lang, startAnimation)

onMounted(() => {
  startAnimation()
})

onUnmounted(() => {
  if (animationId) clearTimeout(animationId)
})

const updateTilt = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = ((y - centerY) / centerY) * -15
  const rotateY = ((x - centerX) / centerX) * 15
  
  card.style.setProperty('--rotate-x', `${rotateX}deg`)
  card.style.setProperty('--rotate-y', `${rotateY}deg`)
}

const resetTilt = (e) => {
  const card = e.currentTarget
  card.style.setProperty('--rotate-x', '0deg')
  card.style.setProperty('--rotate-y', '0deg')
}
</script>

<template>
  <section id="hero" class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="hero-content">
        <span class="greeting" aria-live="polite">{{ t('greeting') }}</span>
        <h1 id="hero-title" class="name" @mousemove="updateTilt" @mouseleave="resetTilt" aria-label="Erwan LEBLANC">{{ name }}</h1>
        <h2 class="title" aria-live="polite" aria-atomic="true">
          {{ currentTitle }}<span class="cursor" aria-hidden="true">|</span>
        </h2>
        <p class="tagline">{{ t('tagline') }}</p>
        <div class="cta-buttons" role="group" :aria-label="t('ariaMainActions')">
          <a href="#projects" class="btn btn-primary">{{ t('viewProjects') }}</a>
          <a href="#about" class="btn btn-outline">{{ t('about') }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  position: relative;
}

.greeting {
  font-size: 1.25rem;
  color: var(--color-primary);
  font-weight: 500;
  display: block;
  margin-bottom: 1rem;
  animation: fadeInUp 0.6s ease forwards;
}

.name {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  display: inline-block;
  transform: perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  animation: fadeInUp 0.6s ease 0.2s forwards;
  opacity: 0;
}

.title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--color-text-muted);
  font-weight: 400;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease 0.4s forwards;
  opacity: 0;
}

.cursor {
  animation: blink 1s infinite;
  color: var(--color-primary);
}

.tagline {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 500px;
  margin: 0 auto 2rem;
  animation: fadeInUp 0.6s ease 0.6s forwards;
  opacity: 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeInUp 0.6s ease 0.8s forwards;
  opacity: 0;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border: 2px solid var(--color-primary);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>