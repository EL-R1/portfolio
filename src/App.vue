<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Resume from './components/Resume.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <Navbar />
  <main id="main-content">
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Resume />
  </main>
  <Footer />
</template>