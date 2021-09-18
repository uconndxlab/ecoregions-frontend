import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/region/:region',
    name: 'Region',
    component: () => import(/* webpackChunkName: "region" */ '../views/Home.vue')
  },
  {
    path: '/location/:location',
    name: 'Location',
    component: () => import(/* webpackChunkName: "location" */ '../views/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
