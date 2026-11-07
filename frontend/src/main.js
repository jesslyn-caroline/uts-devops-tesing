import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';


import App from './App.vue'; 

import ProductList from './components/ProductList.vue';
import ProductCreate from './components/ProductCreate.vue';
import ProductUpdate from './components/ProductUpdate.vue';

// Define routes 
const routes = [
  {
    name: 'ProductList',
    path: '/',
    component: ProductList,
  },
  {
    name: 'ProductCreate',
    path: '/create',
    component: ProductCreate,
  },
  {
    nama: 'ProductUpdate',
    path: '/update/:id',
    component: ProductUpdate,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router); 
app.mount('#app');