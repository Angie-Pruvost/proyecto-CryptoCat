<template>
  <div>

    <!-- OVERLAY -->
    <div class="overlay" v-if="props.abierto" @click="emit('toggle-menu')"></div>


    <!-- MENÚ LATERAL -->
    <nav v-if="props.abierto" class="menu abierto">

      <h2>CryptoCat</h2>

      <ul>
        <li><router-link to="/">🏠 Alta Cliente</router-link></li>
        <li><router-link to="/nueva-compra">🛒 Nueva Compra</router-link></li>
        <li><router-link to="/historial">📜 Historial</router-link></li>
        <li><router-link to="/ranking">📈 Dónde conviene comprar</router-link></li>
        <li><router-link to="/clientes">👥 Lista de Clientes</router-link></li>
      </ul>

      <button class="cerrar" @click="emit('toggle-menu')">Cerrar</button>

    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  abierto: Boolean
});

const emit = defineEmits(["toggle-menu"]);
</script>

<style scoped>


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0006;
  z-index: 1050;
}

.menu {
  position: fixed;
  top: 0;
  left: -260px;
  width: 250px;
  height: 100vh;
  background: white;
  padding: 20px;
  box-shadow: 2px 0 10px #0003;
  transition: left 0.3s ease;
  z-index: 1200;
}

.menu.abierto {
  left: 0;
}

.menu h2 {
  margin-bottom: 20px;
}

.menu ul {
  list-style: none;
  padding: 0;
}

.menu li {
  margin: 15px 0;
}

.menu a {
  text-decoration: none;
  font-size: 18px;
  color: #333;
}

.cerrar {
  margin-top: 40px;
  width: 100%;
  padding: 10px;
  background: #ff4444;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
</style>
