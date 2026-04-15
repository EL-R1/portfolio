<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const experience = computed(() => [
  {
    role: t('exp1Role'),
    company: 'KLEE Group',
    period: '2025 - 2024',
    description: t('exp1Desc'),
    technologies: t('exp1Tech')
  },
  {
    role: t('exp2Role'),
    company: 'MANITOU Group',
    period: '2024 - 2022',
    description: t('exp2Desc'),
    technologies: t('exp2Tech')
  },
  {
    role: t('exp3Role'),
    company: 'Mafianumérique',
    period: '2022 - 2021',
    description: t('exp3Desc'),
    technologies: t('exp3Tech')
  }
])

const education = computed(() => [
  {
    degree: t('edu1Degree'),
    school: t('edu1School'),
    period: '2024'
  },
  {
    degree: t('edu2Degree'),
    school: t('edu2School'),
    period: '2022'
  },
  {
    degree: t('edu3Degree'),
    school: t('edu3School'),
    period: '2020'
  }
])

const associative = computed(() => [
  {
    event: t('vol1Event'),
    location: t('vol1Loc'),
    year: '2019',
    organization: 'Animaje'
  },
  {
    event: t('vol2Event'),
    location: t('vol2Loc'),
    year: '2018',
    organization: 'Animaje'
  },
  {
    event: t('vol3Event'),
    location: t('vol3Loc'),
    year: '2018',
    organization: 'Animaje'
  }
])
</script>

<template>
  <section id="resume" class="resume">
    <div class="container">
      <h2 class="section-title">{{ t('experienceTitle') }}</h2>
      
      <div class="resume-section">
        <h3 class="resume-section-title">{{ t('professionalExperience') }}</h3>
        <div class="timeline">
          <div v-for="(job, index) in experience" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="period">{{ job.period }}</span>
              <h4 class="role">{{ job.role }}</h4>
              <span class="company">{{ job.company }}</span>
              <p class="description">{{ job.description }}</p>
              <p class="tech">{{ job.technologies }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="resume-section">
        <h3 class="resume-section-title">{{ t('education') }}</h3>
        <div class="timeline">
          <div v-for="(edu, index) in education" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="period">{{ edu.period }}</span>
              <h4 class="role">{{ edu.degree }}</h4>
              <span class="company">{{ edu.school }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="resume-section">
        <h3 class="resume-section-title">{{ t('volunteer') }}</h3>
        <div class="associative-grid">
          <div v-for="(item, index) in associative" :key="index" class="associative-card">
            <span class="year">{{ item.year }}</span>
            <h4>{{ item.event }}</h4>
            <p>{{ item.location }} - {{ item.organization }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume {
  padding: 6rem 0;
  background: var(--bg-secondary);
}

.container {
  max-width: 900px;
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

.resume-section {
  margin-bottom: 3rem;
}

.resume-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  transform: translateX(-5px);
}

.period {
  display: block;
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.role {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.company {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.description {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.tech {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 500;
}

.associative-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.associative-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  text-align: center;
}

.associative-card .year {
  display: block;
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.associative-card h4 {
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.associative-card p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .associative-grid {
    grid-template-columns: 1fr;
  }
}
</style>