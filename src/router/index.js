import { createRouter, createWebHistory } from 'vue-router'
import Instructions from '../views/Instructions'
import Home from '../views/Home'
import Summary from '../views/Summary'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
      path: '/instructions',
      name: 'Instructions',
      component: Instructions,
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Summary,
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router