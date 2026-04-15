<script setup>
import { ref, computed } from 'vue'
import ProjectDetail from './ProjectDetail.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const selectedProject = ref(null)

const getProjectData = (proj) => {
  const keyMap = {
    'Application Klépierre': 'projKlepierre',
    'Moteur de Tests Automatisés': 'projTests',
    'Application de Réservation': 'projReservation',
    'Site Mafianumérique': 'projMafianum',
    'Déploiement Humansix': 'projHumansix',
    'DGFIP - Python Flask': 'projDgfip'
  }
  const key = keyMap[proj.title]
  if (!key) return proj
  return {
    title: proj.title,
    company: proj.company,
    period: proj.period,
    description: t(key + 'Desc'),
    context: t(key + 'Context'),
    objectives: [
      t(key + 'Objectives')[0],
      t(key + 'Objectives')[1],
      t(key + 'Objectives')[2],
      t(key + 'Objectives')?.[3]
    ].filter(Boolean),
    technologies: t(key + 'Technologies'),
    realizations: [
      t(key + 'Realizations')[0],
      t(key + 'Realizations')[1],
      t(key + 'Realizations')[2],
      t(key + 'Realizations')?.[3],
      t(key + 'Realizations')?.[4],
      t(key + 'Realizations')?.[5]
    ].filter(Boolean)
  }
}

const translatedProjects = computed(() => projects.map(p => getProjectData(p)))

const projects = [
  {
    title: 'Application Klépierre',
    company: 'KLEE Group',
    period: '2025-2024',
    description: "Application web type réseau social pour entreprise (client Klépierre). Centralisation des facturations clients pour un centre commercial.",
    tags: ['C#', 'React', 'TypeScript', 'SQL Server'],
    context: "Développement et maintenance d'une application web pour un client (Klépierre) qui avait pour but de centralisé toutes les facturations clients des chiffres d'affaires de toutes les boutiques d'un centre commercial.",
    objectives: [
      "Développer de nouvelles fonctionnalités pour enrichir l'expérience utilisateur selon le besoin client",
      "Maintenir et améliorer la stabilité de l'application selon les retours clients",
      "Optimiser les performances et la qualité du code",
      "Assurer la pérennité et l'évolutivité de la plateforme"
    ],
    technologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure Repos', 'DDD'],
    realizations: [
      "Développement de nouvelles fonctionnalités frontend et backend",
      "Maintenance corrective et évolutive de l'application",
      "Optimisation des performances et correction de bugs",
      "Participation à l'amélioration de l'expérience utilisateur",
      "Contribution à la qualité globale du code (revues, bonnes pratiques)"
    ]
  },
  {
    title: 'Moteur de Tests Automatisés',
    company: 'MANITOU Group',
    period: '2024-2022',
    description: "Création d'un moteur de test avec entrée JSON et sortie fonctionnelle pour les business analysts, automatisation quotidienne via Azure DevOps.",
    tags: ['TypeScript', 'Playwright', 'Azure'],
    context: "Manitou Group avait besoin de tester toutes ses solutions en interne. Ils avaient un prestataire qui rendait ses tests payant et limité par mois. Le but est d'avoir en entrée et en sorti des résultats le moins technique possible et le plus fonctionnel possible comme cette partie de gestion de tests est orienté pour les business analysts.",
    objectives: [
      "Créer un moteur de test qui puisse prendre en entrée des cas de tests sous format JSON",
      "Pouvoir afficher en sortie les résultats de façon clair et fonctionnel",
      "Pouvoir automatiser l'exécution des tests de façon régulières"
    ],
    technologies: ['TypeScript', 'Playwright', 'Azure', 'Azure DevOps'],
    realizations: [
      "Conception et développement d'une application WEB de A à Z",
      "Création d'une API avec une architecture complète (Helper, Mapper, Repository, Model)",
      "Mise en place d'une CI/CD avec Azure DevOps",
      "Participation à l'amélioration des performances et de la sécurité",
      "Automatisation des tests pour améliorer la qualité logicielle",
      "Participation aux choix d'architecture technique"
    ]
  },
  {
    title: 'Application de Réservation',
    company: 'MANITOU Group',
    period: '2024-2022',
    description: "Application de gestion de places limitées pour les locaux Manitou Group à Nantes avec système de file d'attente, priorités et authentification SSO (OKTA).",
    tags: ['C#', 'React', 'TypeScript', 'SQL Server', 'Terraform'],
    context: "Manitou Group avait besoin d'une nouvelle application pour gérer la réservation de places limitées dans des locaux sur Nantes. Il fallait remplacer le Google Sheet (Excel) actuel pour implémenter des priorités et des complexités de file d'attente.",
    objectives: [
      "Implémenter des priorités et des complexités de file d'attente",
      "Gérer la connexion via des outils externes (téléphone/ordi perso) via la sécurisation SSO interne (OKTA)",
      "Eviter la dette technique de la solution",
      "Automatiser les déploiements et les intégrations de l'application"
    ],
    technologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure', 'Azure DevOps', 'Terraform'],
    realizations: [
      "Développement d'une application complète de réservation",
      "Implémentation d'un système de file d'attente avec priorités",
      "Intégration SSO avec OKTA",
      "Mise en place CI/CD avec Azure DevOps et Terraform",
      "Participation à l'architecture technique"
    ]
  },
  {
    title: 'Site Mafianumérique',
    company: 'Mafianumérique',
    period: '2022-2021',
    description: "Mise en place environnements de développement, versioning (Git), CI/CD Azure DevOps, maintenance et sécurisation site interne.",
    tags: ['PHP', 'Azure DevOps', 'Bootstrap'],
    context: "Participation au développement, à la maintenance et à la sécurisation d'un site interne, avec mise en place d'outils de développement et de déploiement.",
    objectives: [
      "Structurer et améliorer les environnements de développement",
      "Mettre en place des bonnes pratiques de versioning et de déploiement",
      "Assurer la maintenance et la sécurité du site interne",
      "Fiabiliser les processus techniques et les outils",
      "Améliorer des fonctionnalités internes"
    ],
    technologies: ['PHP', 'Azure DevOps', 'HTML', 'CSS', 'Bootstrap'],
    realizations: [
      "Mise en place de plusieurs environnements de développement (développement, production)",
      "Implémentation d'un système de gestion de version (Git avec Azure Repos)",
      "Création et configuration de pipelines CI/CD via Azure DevOps",
      "Maintenance corrective et évolutive du site interne",
      "Sécurisation du portail de connexion",
      "Chiffrement des mots de passe utilisateurs dans la base de données",
      "Amélioration des fonctionnalités internes",
      "Gestion des différentes devises mondiales"
    ]
  },
  {
    title: 'Déploiement Humansix',
    company: 'Humansix',
    period: '2022',
    description: "Mise en conteneur d'un site interne. Migration de site partenaire (bretagne.bzh).",
    tags: ['PHP', 'Symfony', 'Docker', 'GitLab'],
    context: "Migration et mise en conteneur d'un site interne pour Humansix.",
    objectives: [
      "Mise en conteneur du site interne avec Docker",
      "Migration du site partenaire bretagne.bzh"
    ],
    technologies: ['PHP', 'Symfony', 'Docker', 'GitLab'],
    realizations: [
      "Mise en conteneur Docker du site",
      "Migration du site partenaire"
    ]
  },
  {
    title: 'DGFIP - Python Flask',
    company: 'DGFIP',
    period: '2021',
    description: "Application avec IHM et affichage simplifié de données pour les utilisateurs.",
    tags: ['Python', 'Flask', 'SQL'],
    context: "Application pour la DGFIP avec IHM et affichage simplifié de données.",
    objectives: [
      "Créer une IHM simple pour les utilisateurs",
      "Afficher des données de façon simplifiée"
    ],
    technologies: ['Python', 'Flask', 'SQL'],
    realizations: [
      "Création d'une IHM utilisateur",
      "Affichage simplifié de données"
    ]
  }
]

const personalProjects = [
  {
    title: 'POC Banking (Design Patterns)',
    description: "POC d'un système API de banque basic sous différents design pattern (MVC, MVVM, DDD, Architecture Hexagonale)",
    tags: ['C#', 'Design Patterns', 'TDD'],
    links: [
      { text: 'BankingKata', url: 'https://github.com/EL-R1/BankingKata' },
      { text: 'BankingKata-DDD', url: 'https://github.com/EL-R1/BankingKata-DDD' },
      { text: 'BankingKata-MVVM', url: 'https://github.com/EL-R1/BankingKata-MVVM' },
      { text: 'BankingKata-MVC', url: 'https://github.com/EL-R1/BankingKata-MVC' }
    ]
  },
  {
    title: 'Home Lab',
    description: "Mise en place de différents services multimédias pour le quotidien.",
    tags: ['Docker', 'Media Server'],
    links: [
      { text: 'Jellyfin', url: 'https://github.com/jellyfin/jellyfin' },
      { text: 'Sonarr', url: 'https://github.com/Sonarr/Sonarr' },
      { text: 'Radarr', url: 'https://github.com/Radarr/Radarr' },
      { text: 'Prowlarr', url: 'https://github.com/prowlarr/prowlarr' },
      { text: 'Seerr', url: 'https://github.com/seerr-team/seerr' },
      { text: 'Homepage', url: 'https://github.com/gethomepage/homepage' }
    ]
  },
  {
    title: 'Reverse Services',
    description: "Reverse de sites web pour voir comment ils fonctionnaient.",
    tags: ['Python', 'Web Scraping'],
    link: 'https://github.com/EL-R1/reverse-services'
  },
  {
    title: 'Utils-Subs',
    description: "Utilitaires pour la gestion de sous-titres de médias.",
    tags: ['Python', 'FFmpeg'],
    link: 'https://github.com/EL-R1/utils-subs'
  },
  {
    title: 'Tampermonkey Scripts',
    description: "Scripts pour ajouter des fonctionnalités sur des sites quotidiens.",
    tags: ['JavaScript', 'Tampermonkey'],
    link: 'https://github.com/EL-R1/tampermonkey-scripts'
  },
  {
    title: 'BandersnatchInteractive',
    description: "Bandersnatch Interactive Player (based on html5 video player)",
    tags: ['JavaScript', 'HTML5', 'Video'],
    links: [
      { text: 'PR #40', url: 'https://github.com/mehotkhan/BandersnatchInteractive/pull/40' },
      { text: 'Repo', url: 'https://github.com/mehotkhan/BandersnatchInteractive' }
    ]
  },
  {
    title: 'MegaLinkChecker',
    description: "Python based tool to check if mega.nz shared link is dead or not",
    tags: ['Python', 'Mega.nz'],
    link: 'https://github.com/EL-R1/MegaLinkChecker'
  },
  {
    title: 'Portfolio Vue.js',
    description: "Ce portfolio ! Développé avec Vue.js, responsive avec thème sombre/clair",
    tags: ['Vue.js', 'Vite', 'CSS'],
    links: [
      { text: 'GitHub', url: 'https://github.com/EL-R1/portfolio' },
      { text: 'Live', url: 'https://el-r1.github.io/portfolio' }
    ]
  }
]

const personalProjectsData = computed(() => {
  const keyMap = {
    'POC Banking (Design Patterns)': 'projPocBanking',
    'Home Lab': 'projHomeLab',
    'Reverse Services': 'projReverseServices',
    'Utils-Subs': 'projUtilsSubs',
    'Tampermonkey Scripts': 'projTampermonkey',
    'BandersnatchInteractive': 'projBandersnatch',
    'MegaLinkChecker': 'projMegaLinkChecker',
    'Portfolio Vue.js': 'projPortfolio'
  }
  return personalProjects.map(proj => {
    const key = keyMap[proj.title]
    if (!key) return proj
    return {
      ...proj,
      description: t(key + 'Desc')
    }
  })
})

const openDetail = (project) => {
  selectedProject.value = getProjectData(project)
}

const closeDetail = () => {
  selectedProject.value = null
}
</script>

<template>
  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title">{{ t('projectsTitle') }}</h2>
      <div class="projects-grid">
        <div v-for="project in translatedProjects" :key="project.title" class="project-card" @click="openDetail(project)">
          <div class="project-content">
            <span class="company-tag">{{ project.company }}</span>
            <span class="period">{{ project.period }}</span>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="project-arrow">
            <span>→</span>
          </div>
        </div>
      </div>

      <h2 class="section-title personal-title">{{ t('personalProjects') }} <span class="period">(2024-2026)</span></h2>
      <div class="projects-grid">
        <div v-for="project in personalProjectsData" :key="project.title" class="project-card personal">
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
            <div v-if="project.links" class="project-links">
              <a v-for="link in project.links" :key="link.text" :href="link.url" target="_blank" rel="noopener" class="link-tag">
                {{ link.text }}
              </a>
            </div>
            <a v-else-if="project.link" :href="project.link" target="_blank" rel="noopener" class="project-link">
              {{ t('viewLink') }} →
            </a>
          </div>
        </div>
      </div>
    </div>

    <ProjectDetail v-if="selectedProject" :project="selectedProject" @close="closeDetail" />
  </section>
</template>

<style scoped>
.projects {
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

.personal-title {
  margin-top: 4rem;
}

.personal-title .period {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.project-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
}

.project-card.personal {
  cursor: default;
}

.project-content {
  flex: 1;
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
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0.5rem 0;
}

.project-description {
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tags span {
  background: var(--bg-hover);
  color: var(--color-text-muted);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.link-tag {
  background: var(--bg-hover);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--color-primary);
}

.link-tag:hover {
  background: var(--color-primary);
  color: #fff;
}

.project-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.project-arrow {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-hover);
  margin-left: 1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.project-arrow span {
  color: var(--color-text-muted);
  font-size: 1.25rem;
}

.project-card:hover .project-arrow {
  background: var(--color-primary);
}

.project-card:hover .project-arrow span {
  color: #fff;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>