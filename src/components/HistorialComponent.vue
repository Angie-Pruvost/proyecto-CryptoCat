<template>
  <h1>Historial de transacciones</h1>

  <!-- SELECTOR DE CLIENTE -->
  <div class="form-group">
    <label>Seleccionar Cliente</label>
    <select v-model="selectedClientId" @change="fetchTransacciones">
      <option value="">Seleccionar</option>
      <option v-for="client in clients" :key="client.Id" :value="client.Id">
        {{ client.Name }}
      </option>
    </select>
  </div>

  <!-- TABLA -->
  <table v-if="transacciones.length" class="transacciones-table">
    <thead>
      <tr>
        <th>Acción</th>
        <th>Criptomoneda</th>
        <th>Cantidad</th>
        <th>Monto (ARS)</th>
        <th>Fecha</th>
        <th>Opciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="tx in transacciones" :key="tx.Id">
        <td :class="tx.Action === 'purchase' ? 'text-green' : 'text-red'">
          {{ tx.Action === "purchase" ? "Compra" : "Venta" }}
        </td>

        <td>{{ tx.CryptoCode.toUpperCase() }}</td>
        <td>{{ formatCantidad(tx.CryptoAmount) }}</td>
        <td>{{ formatMoney(tx.Money) }}</td>
        <td>{{ formatFecha(tx.Date) }}</td>

        <td>
          <button v-if="tx.Action === 'purchase'" @click="abrirVenta(tx)">
            Vender
          </button>

          <button @click="editar(tx)">Editar</button>
          <button @click="eliminar(tx.Id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else-if="selectedClientId">No hay transacciones para este cliente.</div>

  <!-- MODAL VENTA -->
  <div v-if="modalVentaVisible" class="modal-overlay">
  <div class="modal-content">

    <h3>Vender {{ ventaActual.CryptoCode.toUpperCase() }}</h3>

    <p>Cantidad disponible: {{ formatCantidad(ventaActual.CryptoAmount) }}</p>

    <label>Cantidad a vender:</label>
    <input type="number" v-model="cantidadVenta" step="0.000001">

    <p style="color: green">{{ mensaje }}</p>

    <button @click="confirmarVenta">Confirmar</button>
    <button @click="modalVentaVisible = false">Cancelar</button>

  </div>
</div>


  <!-- MODAL EDITAR -->
  <div v-if="mostrarModal" class="modal-overlay">
  <div class="modal-content">

    <h2>Editar Transacción</h2>

    <label>Crypto</label>
    <input v-model="editForm.CryptoCode" />

    <label>Cantidad</label>
    <input type="number" step="0.00001" v-model="editForm.CryptoAmount" />

    <label>Monto ARS</label>
    <input type="number" step="0.01" v-model="editForm.Money" />

    <label>Fecha</label>
    <input type="datetime-local" v-model="editForm.Date" />

    <label>Acción</label>
    <select v-model="editForm.Action">
      <option value="purchase">Compra</option>
      <option value="sale">Venta</option>
    </select>

    <button @click="guardarEdicion">Guardar</button>
    <button @click="cerrarModal">Cancelar</button>

  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from "vue";
import "../styles/historial.css";
import axios from "axios";

const clients = ref([]);
const selectedClientId = ref("");
const transacciones = ref([]);

// ----- MODAL VENTA -----
const modalVentaVisible = ref(false);
const ventaActual = ref(null);
const cantidadVenta = ref(0);
const mensaje = ref("");

// ----- MODAL EDITAR -----
const mostrarModal = ref(false);
const editForm = ref({
  Id: null,
  ClienteId: null,
  CryptoCode: "",
  CryptoAmount: 0,
  Money: 0,
  Action: "",
  Date: "",
});

onMounted(async () => {
  try {
    const response = await fetch("https://localhost:7006/api/Clientes");
    clients.value = await response.json();
  } catch (error) {
    console.error("Error cargando clientes", error);
  }
});

// ----- CARGAR TRANSACCIONES -----
const fetchTransacciones = async () => {
  if (!selectedClientId.value) return;

  try {
    const res = await fetch(
      `https://localhost:7006/api/Transacciones/cliente/${selectedClientId.value}`
    );
    transacciones.value = await res.json();
  } catch (err) {
    console.error("Error cargando transacciones", err);
  }
};

// ----- VENTAS -----
function abrirVenta(tx) {
  ventaActual.value = tx;
  cantidadVenta.value = 0;
  mensaje.value = "";
  modalVentaVisible.value = true;
}

async function obtenerPrecio(crypto) {
  const res = await fetch(
    `https://criptoya.com/api/bybit/${crypto}/ARS/0.1`
  );
  const data = await res.json();
  return data.totalAsk;
}

async function confirmarVenta() {
  if (cantidadVenta.value <= 0) {
    mensaje.value = "La cantidad debe ser mayor a cero.";
    return;
  }

  if (cantidadVenta.value > ventaActual.value.CryptoAmount) {
    mensaje.value = "No podés vender más de lo comprado.";
    return;
  }

  const precio = await obtenerPrecio(ventaActual.value.CryptoCode);
  const total = cantidadVenta.value * precio;

  const payload = {
    ClienteId: ventaActual.value.ClienteId,
    CryptoCode: ventaActual.value.CryptoCode,
    Action: "sale",
    CryptoAmount: cantidadVenta.value,
    Money: total,
    Date: new Date().toISOString(),
  };

  const res = await fetch("https://localhost:7006/api/Transacciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    mensaje.value = "Error registrando la venta.";
    return;
  }

  // actualizar UI
  ventaActual.value.CryptoAmount -= cantidadVenta.value;

  mensaje.value = "Venta registrada correctamente.";

  setTimeout(() => {
    modalVentaVisible.value = false;
  }, 800);
}

// ----- ELIMINAR -----
const eliminar = async (id) => {
  if (!confirm("¿Seguro que querés eliminar?")) return;

  const res = await fetch(`https://localhost:7006/api/Transacciones/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Error eliminando");
    return;
  }

  transacciones.value = transacciones.value.filter((t) => t.Id !== id);

  alert("Eliminado");
};

// ----- EDITAR -----
const editar = (tx) => {
  editForm.value = {
    ...tx,
    Date: tx.Date.slice(0, 16),
  };

  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const guardarEdicion = async () => {
  const id = editForm.value.Id;

  const payload = {
    ClienteId: editForm.value.ClienteId,
    CryptoCode: editForm.value.CryptoCode,
    CryptoAmount: editForm.value.CryptoAmount,
    Money: editForm.value.Money,
    Action: editForm.value.Action,
    Date: new Date(editForm.value.Date).toISOString(),
  };

  const res = await fetch(
    `https://localhost:7006/api/Transacciones/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    alert("Error actualizando");
    return;
  }

  const index = transacciones.value.findIndex((t) => t.Id === id);
  transacciones.value[index] = { ...payload, Id: id };

  mostrarModal.value = false;
  alert("Transacción actualizada");
};

// ----- FORMATOS -----
const formatFecha = (f) => new Date(f).toLocaleString("es-AR");

const formatCantidad = (v) => parseFloat(v).toFixed(6);

const formatMoney = (v) => `$${parseFloat(v).toFixed(2)}`;
</script>

<style scoped>
/* tus estilos */
</style>
