<template>
  <div class="page">
    <div class="form-container">
    <h2>Cargue sus datos</h2>

    <form @submit.prevent ="handleSubmit">
      <div class="form-group">
        <label>Nombre y Apellido:</label><br>
        <input id="name" v-model="name" type="text"/>
      </div>

      <div class = "form-group">
        <label for="Email">Email:</label><br>
        <input id="email" v-model="email" type="email"/>
      </div>

      <button type="submit" >Guardar Cliente</button>
    </form>
  </div>


    <p v-if="error" class="error-text">{{ error }}</p>
    <p v-if="success" class="success-text">{{ success }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const error = ref('');
const success = ref('');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const cleanCliente = () => {
  return {
    name: name.value.trim(),
    email: email.value.trim(),
    transacciones: [] // limpio el modelo de la Api
  };
};

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!name.value.trim()) {
    error.value = 'El nombre no puede estar vacío.'
    return
  }

  if (!email.value.trim()) {
    error.value = 'El email no puede estar vacío.'
    return
  }

  if (!validateEmail(email.value)) {
    error.value = 'El formato del email no es válido.'
    return
  }

  if (Object.keys(error.value).length > 0) return

  try {

    const cliente = cleanCliente()

    const response = await fetch('https://localhost:7006/api/Clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    })
    if (response.ok) {
      success.value = 'Cliente guardado correctamente.';
      name.value = '';
      email.value = '';
    } else {
      const err = await response.json();
      error.value = err.message || 'Error al guardar el cliente.';
    }
  } catch (error) {
    error.value = 'No se pudo conectar al servidor.';
  }
};

</script>

<style scope>

</style>
