<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t, lang } = useI18n()

const methodsSkills = computed(() => {
  return lang.value === 'fr' 
    ? ['Agile', 'Planification', 'Gestion de projet', 'Cycle en V']
    : ['Agile', 'Planning', 'Project Management', 'V-Model']
})

const skillCategories = computed(() => [
  {
    name: t('development') || 'Développement',
    skills: ['C#', 'TypeScript', 'Vue.js', 'React', 'Python', 'Angular', 'PHP', 'JavaScript', 'SQL']
  },
  {
    name: 'Infrastructure',
    skills: ['Docker', 'Kubernetes', 'Linux', 'Windows', 'Bash', 'Volatility']
  },
  {
    name: 'Cloud & DevOps',
    skills: ['Azure', 'Azure DevOps', 'Terraform', 'CI/CD', 'Git']
  },
  {
    name: t('tools') || 'Outils',
    skills: ['Wireshark', 'Burpsuite', 'VMWare', 'VirtualBox', 'Visual Studio', 'VS Code', 'Notion']
  },
  {
    name: t('methods') || 'Méthodes',
    skills: methodsSkills.value
  }
])
</script>

<template>
  <section id="skills" class="skills">
    <div class="container">
      <h2 class="section-title">{{ t('skillsTitle') }}</h2>
      <div class="skills-grid">
        <div v-for="category in skillCategories" :key="category.name" class="skill-category">
          <h3 class="category-name">{{ category.name }}</h3>
          <div class="skill-tags">
            <span v-for="skill in category.skills" :key="skill" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  padding: 6rem 0;
  background: var(--bg-secondary);
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.skill-category {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.skill-category:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
}

.category-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  background: var(--bg-hover);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>