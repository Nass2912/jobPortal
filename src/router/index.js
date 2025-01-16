import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomePage.vue'
import Login from '../components/LoginPage.vue'
import Signup from '../components/SignupPage.vue'
import AddJob from '../components/AddJob.vue'
import Profile from '../components/ProfilePage.vue'
import Job from '../components/JobPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/add-job',
    name: 'AddJob',
    component: AddJob
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/job',
    name: 'Job',
    component: Job
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router