import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('@/views/ProfilView.vue'),
    },
    {
      path: '/destinasi',
      name: 'destinasi',
      component: () => import('@/views/DestinasiView.vue'),
    },
    // {
    //   path: '/destinasi/:slug',
    //   name: 'destinasi-detail',
    //   component: () => import('@/views/DestinasiDetailView.vue'),
    // },
    // {
    //   path: '/komunitas',
    //   name: 'komunitas',
    //   component: () => import('@/views/KomunitasView.vue'),
    // },
    // {
    //   path: '/komunitas/:slug',
    //   name: 'komunitas-detail',
    //   component: () => import('@/views/KomunitasDetailView.vue'),
    // },
    // {
    //   path: '/umkm',
    //   name: 'umkm',
    //   component: () => import('@/views/UMKMView.vue'),
    // },
    // {
    //   path: '/umkm/:slug',
    //   name: 'umkm-detail',
    //   component: () => import('@/views/UMKMDetailView.vue'),
    // },
    // {
    //   path: '/artikel',
    //   name: 'artikel',
    //   component: () => import('@/views/ArtikelView.vue'),
    // },
    // {
    //   path: '/artikel/:slug',
    //   name: 'artikel-detail',
    //   component: () => import('@/views/ArtikelDetailView.vue'),
    // },
    // {
    //   path: '/kontak',
    //   name: 'kontak',
    //   component: () => import('@/views/KontakView.vue'),
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
