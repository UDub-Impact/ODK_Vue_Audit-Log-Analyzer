import { createRouter, createWebHistory } from 'vue-router'
import Instructions from '../views/Instructions'
import Home from '../views/Home'
import Summary from '../views/Summary'

const routes = [
    // Landing page prompting user to upload a file
    {
        path: '/',
        name: 'Home',
        component: Home,
    },

    // Instructions page provding details on how to upload files into analyzer
    {
      path: '/instructions',
      name: 'Instructions',
      component: Instructions,
    },

    // Summary page displaying analytics
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