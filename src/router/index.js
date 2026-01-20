import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import SignupPage from '../components/SignupPage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import PostJob from '../components/PostJob.vue';
import JobPage from '../components/JobPage.vue';


import { supabase } from '../supabaseClient';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/post-job', component: PostJob, meta: { requiresAuth: true } },
  { path: '/job/:id', component: JobPage, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
