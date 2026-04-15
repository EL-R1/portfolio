<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const stats = [
  { value: '3+', key: 'experience' },
  { value: 'RNCP niv 7', key: 'degree' }
]

const interests = [
  { key: 'interest1' },
  { key: 'interest2' },
  { key: 'interest3' },
  { key: 'interest4' },
  { key: 'interest5' },
  { key: 'interest6' }
]
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title">{{ t('aboutTitle') }}</h2>
      <div class="about-content">
        <div class="about-text">
          <p>{{ t('aboutText') }}</p>
        </div>
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.key" class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ t(stat.key) }}</span>
          </div>
        </div>
      </div>
      <div class="interests">
        <h3>{{ t('interests') }}</h3>
        <div class="interest-tags">
          <span v-for="interest in interests" :key="interest.key">{{ t(interest.key) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 6rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 3rem;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--color-primary);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-text p {
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.interests {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.interests h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  text-align: center;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.interest-tags span {
  background: var(--bg-card);
  color: var(--color-text-muted);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>