<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  project: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      
      <span class="company-tag">{{ project.company }}</span>
      <span class="period">{{ project.period }}</span>
      <h2 class="project-title">{{ project.title }}</h2>
      
      <div class="detail-section">
        <h3>{{ t('modalContext') }}</h3>
        <p>{{ project.context }}</p>
      </div>
      
      <div class="detail-section">
        <h3>{{ t('modalObjectives') }}</h3>
        <ul>
          <li v-for="(obj, i) in project.objectives" :key="i">{{ obj }}</li>
        </ul>
      </div>
      
      <div class="detail-section">
        <h3>{{ t('modalTechnologies') }}</h3>
        <div class="tech-tags">
          <span v-for="tech in project.technologies" :key="tech">{{ tech }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>{{ t('modalRealizations') }}</h3>
        <ul>
          <li v-for="(real, i) in project.realizations" :key="i">{{ real }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid var(--color-border);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-hover);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

.company-tag {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.period {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.project-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.detail-section p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.detail-section ul {
  list-style: none;
  padding: 0;
}

.detail-section li {
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.detail-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tags span {
  background: var(--bg-hover);
  color: var(--color-text);
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
}
</style>