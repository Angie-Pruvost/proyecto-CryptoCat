<template>
  <header class="nav-wrap">
    <div class="nav-inner">

      <!-- BOTÓN HAMBURGUESA -->
      <button class="hamburger" @click="$emit('toggle-menu')">
        ☰
      </button>

      <div class="brand">
        <h2 class="logo">CryptoCat</h2>
      </div>



      <div class="actions">
        <button class="theme-toggle" @click="toggleTheme" :aria-pressed="darkMode">
          <span v-if="!darkMode">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </div>
  </header>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const darkMode = ref(false)

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  aplicarTema()
})

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkMode', darkMode.value)
  aplicarTema()
}

const aplicarTema = () => {
  if (darkMode.value) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}
</script>

<style>
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: var(--color-card);
  padding: 1rem 2rem;
  border-radius: 0 0 12px 12px;
  border-bottom: 1px solid var(--color-border);
}

.nav-wrap {
  width: 100%;
  background: var(--color-card);
   border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}

.nav-link {
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  color: var(--color-text);
  text-decoration: none;
  transition: 0.2s;
}

.nav-link.router-link-exact-active {
  background: var(--color-btn);
  color: white;
}

.nav-link:hover {
  background: var(--color-btn-hover);
  color: white;
}

.theme-toggle {
  background: var(--color-btn);
  color: white;
}

.theme-toggle:hover {
  background: var(--color-btn-hover);
}

@media (max-width: 640px) {
  .nav-inner {
    flex-direction: column;
    align-items: stretch;
  }
}

.hamburger {
  background: var(--color-btn);
  border: none;
  color: white;
  padding: 8px 12px;
  font-size: 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
}

.hamburger:hover {
  background: var(--color-btn-hover);
}

</style>
