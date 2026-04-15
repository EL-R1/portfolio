import { ref, watch } from 'vue'

type Lang = 'fr' | 'en'

interface Translations {
  [key: string]: string | string[] | undefined
}

interface TranslationsSet {
  [key: string]: Translations
}

const translations: TranslationsSet = {
  fr: {
    greeting: 'Bonjour, je suis',
    tagline: "Concepteur et développeur d'applications",
    viewProjects: 'Voir mes projets',
    viewLink: 'Voir',
    about: 'À propos',
    aboutTitle: 'À propos de moi',
    experience: "Années d'expérience",
    degree: 'Diplôme',
    interests: "Centres d'intérêt",
    skillsTitle: 'Compétences',
    projectsTitle: 'Projets',
    personalProjects: 'Projets Perso',
    experienceTitle: 'Expérience & Formation',
    professionalExperience: 'Expérience Professionnelle',
    education: 'Formation',
    volunteer: 'Bénévolat',
    development: 'Développement',
    tools: 'Outils',
    methods: 'Méthodes',
    exp1Role: 'Developer Full Stack',
    exp1Desc: "Développement et maintenance d'une application web type réseau social pour entreprise (client Klépierre).",
    exp1Tech: 'C#, React, TypeScript, SQL Server, Azure Repo',
    exp2Role: 'Software Engineer',
    exp2Desc: "Création d'IHM/API/BDD pour application de réservation. Mise en place CI/CD. Création d'un moteur de tests automatisés.",
    exp2Tech: 'C#, React, TypeScript, SQL Server, Terraform, Azure',
    exp3Role: 'Développeur Junior / DevOps',
    exp3Desc: "Mise en place environnements de développement, versioning (Git), CI/CD Azure DevOps, maintenance et sécurisation site interne.",
    exp3Tech: 'PHP, HTML, SQL, Azure DevOps, Bootstrap',
    edu1Degree: 'Expert en informatique & système d\'information (RNCP niv 7)',
    edu1School: 'EPSI Nantes - Ecole d\'ingénierie informatique',
    edu2Degree: 'CDA (Concepteur et développeur d\'Applications)',
    edu2School: 'EPSI Nantes',
    edu3Degree: 'Développeur Junior',
    edu3School: 'EPSI Nantes',
    vol1Event: 'Chantier international',
    vol1Loc: 'Tunisie',
    vol2Event: 'Chantier international',
    vol2Loc: 'La Chevrolière',
    vol3Event: 'Bénévole petit-déjeuner et nettoyage',
    vol3Loc: 'Mégascène et Hellfest',
    aboutText: "Concepteur et développeur d'applications depuis 3 ans, mon but est d'agrandir mes compétences et mes connaissances autour du développement. Les parties conception et réflexion m'ont aussi passionné pendant ma formation. Je suis passionné par la recherche en tout genre.",
    interest1: 'Cybersécurité (2040pts Root-me, CTF)',
    interest2: 'Jeux de Réflexions',
    interest3: 'Baby-Foot, Billard',
    interest4: 'Restaurations de médias',
    interest5: 'OSINT/Stéganographie',
    interest6: 'Etude de specs techniques vidéos',
    projKlepierreTitle: 'Application Klépierre',
    projKlepierreDesc: "Application web type réseau social pour entreprise (client Klépierre). Centralisation des facturations clients pour un centre commercial.",
    projKlepierreContext: "Développement et maintenance d'une application web pour un client (Klépierre) qui avait pour but de centralisé toutes les facturations clients des chiffres d'affaires de toutes les boutiques d'un centre commercial.",
    projKlepierreObjectives: [
      "Développer de nouvelles fonctionnalités pour enrichir l'expérience utilisateur selon le besoin client",
      "Maintenir et améliorer la stabilité de l'application selon les retours clients",
      "Optimiser les performances et la qualité du code",
      "Assurer la pérennité et l'évolutivité de la plateforme"
    ],
    projKlepierreTechnologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure Repos', 'DDD'],
    projKlepierreRealizations: [
      "Développement de nouvelles fonctionnalités frontend et backend",
      "Maintenance corrective et évolutive de l'application",
      "Optimisation des performances et correction de bugs",
      "Participation à l'amélioration de l'expérience utilisateur",
      "Contribution à la qualité globale du code (revues, bonnes pratiques)"
    ],
    projTestsTitle: 'Moteur de Tests Automatisés',
    projTestsDesc: "Création d'un moteur de test avec entrée JSON et sortie fonctionnelle pour les business analysts, automatisation quotidienne via Azure DevOps.",
    projTestsContext: "Manitou Group avait besoin de tester toutes ses solutions en interne. Ils avaient un prestataire qui rendait ses tests payable et limité par mois. Le but est d'avoir en entrée et en sorti des résultats le moins technique possible et le plus fonctionnel possible comme cette partie de gestion de tests est orienté pour les business analysts.",
    projTestsObjectives: [
      "Créer un moteur de test qui puisse prendre en entrée des cas de tests sous format JSON",
      "Pouvoir afficher en sortie les résultats de façon clair et fonctionnel",
      "Pouvoir automatiser l'exécution des tests de façon régulières"
    ],
    projTestsTechnologies: ['TypeScript', 'Playwright', 'Azure', 'Azure DevOps'],
    projTestsRealizations: [
      "Conception et développement d'une application WEB de A à Z",
      "Création d'une API avec une architecture complète (Helper, Mapper, Repository, Model)",
      "Mise en place d'une CI/CD avec Azure DevOps",
      "Participation à l'amélioration des performances et de la sécurité",
      "Automatisation des tests pour améliorer la qualité logicielle",
      "Participation aux choix d'architecture technique"
    ],
    projReservationTitle: 'Application de Réservation',
    projReservationDesc: "Application de gestion de places limitées pour les locaux Manitou Group à Nantes avec système de file d'attente, priorités et authentification SSO (OKTA).",
    projReservationContext: "Manitou Group avait besoin d'une nouvelle application pour gérer la réservation de places limitées dans des locaux sur Nantes. Il fallait remplacer le Google Sheet (Excel) actuel pour implémenter des priorités et des complexités de file d'attente.",
    projReservationObjectives: [
      "Implémenter des priorités et des complexités de file d'attente",
      "Gérer la connexion via des outils externos (téléphone/ordi perso) via la sécurisation SSO interne (OKTA)",
      "Eviter la dette technique de la solution",
      "Automatiser les déploiements et les intégrations de l'application"
    ],
    projReservationTechnologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure', 'Azure DevOps', 'Terraform'],
    projReservationRealizations: [
      "Développement d'une application complète de réservation",
      "Implémentation d'un système de file d'attente avec priorités",
      "Intégration SSO avec OKTA",
      "Mise en place CI/CD avec Azure DevOps et Terraform",
      "Participation à l'architecture technique"
    ],
    projMafianumTitle: 'Site Mafianumérique',
    projMafianumDesc: "Mise en place environnements de développement, versioning (Git), CI/CD Azure DevOps, maintenance et sécurisation site interne.",
    projMafianumContext: "Participation au développement, à la maintenance et à la sécurisation d'un site interne, avec mise en place d'outils de développement et de déploiement.",
    projMafianumObjectives: [
      "Structurer et améliorer les environnements de développement",
      "Mettre en place des bonnes pratiques de versioning et de déploiement",
      "Assurer la maintenance et la sécurité du site interne",
      "Fiabiliser les processus techniques et les outils",
      "Améliorer des fonctionnalités internes"
    ],
    projMafianumTechnologies: ['PHP', 'Azure DevOps', 'HTML', 'CSS', 'Bootstrap'],
    projMafianumRealizations: [
      "Mise en place de plusieurs environnements de développement (développement, production)",
      "Implémentation d'un système de gestion de version (Git avec Azure Repos)",
      "Création et configuration de pipelines CI/CD via Azure DevOps",
      "Maintenance corrective et évolutive du site interne",
      "Sécurisation du portail de connexion",
      "Chiffrement des mots de passe utilisateurs dans la base de données",
      "Amélioration des fonctionnalités internes",
      "Gestion des différentes devises mondiales"
    ],
    projHumansixTitle: 'Déploiement Humansix',
    projHumansixDesc: "Mise en conteneur d'un site interne. Migration de site partenaire (bretagne.bzh).",
    projHumansixContext: "Migration et mise en conteneur d'un site interne pour Humansix.",
    projHumansixObjectives: [
      "Mise en conteneur du site interne avec Docker",
      "Migration du site partenaire bretagne.bzh"
    ],
    projHumansixTechnologies: ['PHP', 'Symfony', 'Docker', 'GitLab'],
    projHumansixRealizations: [
      "Mise en conteneur Docker du site",
      "Migration du site partenaire"
    ],
    projDgfipTitle: 'DGFIP - Python Flask',
    projDgfipDesc: "Application avec IHM et affichage simplifié de données pour les utilisateurs.",
    projDgfipContext: "Application pour la DGFIP avec IHM et affichage simplifié de données.",
    projDgfipObjectives: [
      "Créer une IHM simple pour les utilisateurs",
      "Afficher des données de façon simplifiée"
    ],
    projDgfipTechnologies: ['Python', 'Flask', 'SQL'],
    projDgfipRealizations: [
      "Création d'une IHM utilisateur",
      "Affichage simplifié de données"
    ],
    projPocBankingDesc: "POC d'un système API de banque basic sous différents design pattern (MVC, MVVM, DDD, Architecture Hexagonale)",
    projHomeLabDesc: "Mise en place de différents services multimédias pour le quotidien.",
    projReverseServicesDesc: "Reverse de sites web pour voir comment ils fonctionnaient.",
    projUtilsSubsDesc: "Utilitaires pour la gestion de sous-titres de médias.",
    projTampermonkeyDesc: "Scripts pour ajouter des fonctionnalités sur des sites quotidiens.",
    projBandersnatchDesc: "Bandersnatch Interactive Player (based on html5 video player)",
    projMegaLinkCheckerDesc: "Python based tool to check if mega.nz shared link is dead or not",
    projPortfolioDesc: "Ce portfolio ! Développé avec Vue.js, responsive avec thème sombre/clair",
    modalContext: 'Contexte',
    modalObjectives: 'Objectifs',
    modalTechnologies: 'Compétences et technologies',
    modalRealizations: 'Réalisations globales',
    ariaNav: 'Navigation principale',
    ariaLogo: 'Erwan LEBLANC - Accueil',
    ariaMobileMenu: 'Menu mobile',
    ariaMainActions: 'Actions principales'
  },
  en: {
    greeting: "Hello, I'm",
    tagline: 'Application Developer & Designer',
    viewProjects: 'View Projects',
    viewLink: 'View',
    about: 'About',
    aboutTitle: 'About Me',
    experience: 'Years Experience',
    degree: 'Degree',
    interests: 'Interests',
    skillsTitle: 'Skills',
    projectsTitle: 'Projects',
    personalProjects: 'Personal Projects',
    experienceTitle: 'Experience & Education',
    professionalExperience: 'Professional Experience',
    education: 'Education',
    volunteer: 'Volunteer Work',
    development: 'Development',
    tools: 'Tools',
    methods: 'Methods',
    exp1Role: 'Developer Full Stack',
    exp1Desc: "Development and maintenance of a web application like a social network for a company (Klépierre client).",
    exp1Tech: 'C#, React, TypeScript, SQL Server, Azure Repo',
    exp2Role: 'Software Engineer',
    exp2Desc: "Creation of UI/API/DB for a booking application. CI/CD setup. Creation of an automated test engine.",
    exp2Tech: 'C#, React, TypeScript, SQL Server, Terraform, Azure',
    exp3Role: 'Junior Developer / DevOps',
    exp3Desc: "Setup of development environments, versioning (Git), CI/CD Azure DevOps, maintenance and securing of internal website.",
    exp3Tech: 'PHP, HTML, SQL, Azure DevOps, Bootstrap',
    edu1Degree: 'Expert in Computer Science & Information Systems (RNCP lvl 7)',
    edu1School: 'EPSI Nantes - Engineering School',
    edu2Degree: 'CDA (Application Designer & Developer)',
    edu2School: 'EPSI Nantes',
    edu3Degree: 'Junior Developer',
    edu3School: 'EPSI Nantes',
    vol1Event: 'International Workcamp',
    vol1Loc: 'Tunisia',
    vol2Event: 'International Workcamp',
    vol2Loc: 'La Chevrolière',
    vol3Event: 'Volunteer breakfast & cleaning',
    vol3Loc: 'Mégascène and Hellfest',
    aboutText: "Application designer and developer for 3 years, my goal is to expand my skills and knowledge in development. The design and conceptualization aspects also fascinated me during my training. I am passionate about research of all kinds.",
    interest1: 'Cybersecurity (2040pts Root-me, CTF)',
    interest2: 'Puzzle Games',
    interest3: 'Foosball, Billiards',
    interest4: 'Media Restoration',
    interest5: 'OSINT/Steganography',
    interest6: 'Video Tech Specs Study',
    projKlepierreTitle: 'Application Klépierre',
    projKlepierreDesc: "Social network-type web application for a company (Klépierre client). Centralization of customer billings for a shopping center.",
    projKlepierreContext: "Development and maintenance of a web application for a client (Klépierre) whose purpose was to centralize all customer billings of revenue for all stores in a shopping center.",
    projKlepierreObjectives: [
      "Develop new features to enhance the user experience according to client needs",
      "Maintain and improve application stability based on client feedback",
      "Optimize performance and code quality",
      "Ensure platform longevity and scalability"
    ],
    projKlepierreTechnologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure Repos', 'DDD'],
    projKlepierreRealizations: [
      "Development of new frontend and backend features",
      "Corrective and evolutionary maintenance of the application",
      "Performance optimization and bug fixes",
      "Contribution to improving user experience",
      "Contribution to overall code quality (reviews, best practices)"
    ],
    projTestsTitle: 'Automated Test Engine',
    projTestsDesc: "Creation of a test engine with JSON input and functional output for business analysts, daily automation via Azure DevOps.",
    projTestsContext: "Manitou Group needed to test all their solutions internally. They had a provider who charged for tests and limited them per month. The goal was to have input and output results that were as non-technical as possible and as functional as possible since this testing part is oriented for business analysts.",
    projTestsObjectives: [
      "Create a test engine that can take test cases in JSON format as input",
      "Display results clearly and functionally as output",
      "Automate test execution on a regular basis"
    ],
    projTestsTechnologies: ['TypeScript', 'Playwright', 'Azure', 'Azure DevOps'],
    projTestsRealizations: [
      "Design and development of a WEB application from A to Z",
      "Creation of an API with complete architecture (Helper, Mapper, Repository, Model)",
      "CI/CD setup with Azure DevOps",
      "Contribution to improving performance and security",
      "Test automation to improve software quality",
      "Participation in technical architecture decisions"
    ],
    projReservationTitle: 'Booking Application',
    projReservationDesc: "Limited space booking management application for Manitou Group premises in Nantes with queue system, priorities and SSO authentication (OKTA).",
    projReservationContext: "Manitou Group needed a new application to manage limited space bookings at their premises in Nantes. They needed to replace the current Google Sheet (Excel) to implement priorities and queue complexities.",
    projReservationObjectives: [
      "Implement priorities and queue complexities",
      "Manage connection via external tools (personal phone/computer) via internal SSO security (OKTA)",
      "Avoid technical debt in the solution",
      "Automate deployments and integrations of the application"
    ],
    projReservationTechnologies: ['C#', 'React', 'TypeScript', 'SQL Server', 'Azure', 'Azure DevOps', 'Terraform'],
    projReservationRealizations: [
      "Development of a complete booking application",
      "Implementation of a priority queue system",
      "SSO integration with OKTA",
      "CI/CD setup with Azure DevOps and Terraform",
      "Participation in technical architecture"
    ],
    projMafianumTitle: 'Mafianumérique Website',
    projMafianumDesc: "Setup of development environments, versioning (Git), CI/CD Azure DevOps, maintenance and securing of internal website.",
    projMafianumContext: "Participation in the development, maintenance and securing of an internal website, with setup of development and deployment tools.",
    projMafianumObjectives: [
      "Structure and improve development environments",
      "Implement best practices for versioning and deployment",
      "Ensure maintenance and security of the internal website",
      "Reliabilize technical processes and tools",
      "Improve internal functionalities"
    ],
    projMafianumTechnologies: ['PHP', 'Azure DevOps', 'HTML', 'CSS', 'Bootstrap'],
    projMafianumRealizations: [
      "Setup of several development environments (development, production)",
      "Implementation of a version management system (Git with Azure Repos)",
      "Creation and configuration of CI/CD pipelines via Azure DevOps",
      "Corrective and evolutionary maintenance of the internal website",
      "Securing of the login portal",
      "Encryption of user passwords in the database",
      "Improvement of internal functionalities",
      "Management of different world currencies"
    ],
    projHumansixTitle: 'Humansix Deployment',
    projHumansixDesc: "Containerization of an internal website. Partner site migration (bretagne.bzh).",
    projHumansixContext: "Migration and containerization of an internal website for Humansix.",
    projHumansixObjectives: [
      "Containerize the internal website with Docker",
      "Migrate the partner site bretagne.bzh"
    ],
    projHumansixTechnologies: ['PHP', 'Symfony', 'Docker', 'GitLab'],
    projHumansixRealizations: [
      "Docker containerization of the website",
      "Partner site migration"
    ],
    projDgfipTitle: 'DGFIP - Python Flask',
    projDgfipDesc: "Application with UI and simplified data display for users.",
    projDgfipContext: "Application for DGFIP with UI and simplified data display.",
    projDgfipObjectives: [
      "Create a simple UI for users",
      "Display data in a simplified way"
    ],
    projDgfipTechnologies: ['Python', 'Flask', 'SQL'],
    projDgfipRealizations: [
      "Creation of a user UI",
      "Simplified data display"
    ],
    projPocBankingDesc: "POC of a basic bank API system under different design patterns (MVC, MVVM, DDD, Hexagonal Architecture)",
    projHomeLabDesc: "Setup of various multimedia services for daily use.",
    projReverseServicesDesc: "Reverse engineering of websites to see how they worked.",
    projUtilsSubsDesc: "Utilities for managing media subtitles.",
    projTampermonkeyDesc: "Scripts to add features to daily websites.",
    projBandersnatchDesc: "Bandersnatch Interactive Player (based on html5 video player)",
    projMegaLinkCheckerDesc: "Python based tool to check if mega.nz shared link is dead or not",
    projPortfolioDesc: "This portfolio! Developed with Vue.js, responsive with dark/light theme",
    modalContext: 'Context',
    modalObjectives: 'Objectives',
    modalTechnologies: 'Skills & Technologies',
    modalRealizations: 'Overall Achievements',
    ariaNav: 'Main navigation',
    ariaLogo: 'Erwan LEBLANC - Home',
    ariaMobileMenu: 'Mobile menu',
    ariaMainActions: 'Main actions'
  }
}

const currentLang = ref<Lang>(localStorage.getItem('lang') as Lang || 'fr')

watch(currentLang, (val) => {
  localStorage.setItem('lang', val)
})

export function useI18n() {
  const t = (key: string): string => translations[currentLang.value][key] as string || key
  const setLang = (lang: Lang) => currentLang.value = lang
  
  const getThemeAriaLabel = (isDark: boolean): string => {
    return isDark 
      ? (currentLang.value === 'fr' ? 'Passer en mode clair' : 'Switch to light mode')
      : (currentLang.value === 'fr' ? 'Passer en mode sombre' : 'Switch to dark mode')
  }
  
  const getLangAriaLabel = (currentLangValue: Lang): string => {
    return currentLangValue === 'fr' 
      ? 'Passer en anglais' 
      : 'Passer en français'
  }
  
  return { 
    t, 
    lang: currentLang, 
    setLang,
    toggleLang: () => currentLang.value = currentLang.value === 'fr' ? 'en' : 'fr',
    getThemeAriaLabel,
    getLangAriaLabel
  }
}