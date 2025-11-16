
import { createRouter, createWebHistory } from 'vue-router'
import AltaClienteView from '@/views/AltaClienteView.vue';


const routes= [
{path:'/',
  name:'Cliente',
  component: AltaClienteView,
},
  {path: '/nueva-compra',
  name: 'NuevaCompra',
  component: ()=> import ('@/views/NuevaCompraView.vue'),
},

  {path: '/historial',
  name: 'Historial',
  component: ()=> import('@/views/HistorialView.vue'),
  }
]
const router = createRouter({
  history: createWebHistory(), routes
})

  export default router;

