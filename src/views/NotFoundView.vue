<script setup>
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <section class="min-h-[70vh] flex items-center justify-center section-padding bg-background">
      <div class="text-center" data-aos="fade-up">
        <div class="text-8xl mb-6">🌿</div>
        <h1 class="font-heading font-bold text-heading text-4xl mb-3">404</h1>
        <h2 class="font-heading font-semibold text-heading text-xl mb-3">Halaman Tidak Ditemukan</h2>
        <p class="text-body mb-8 max-w-sm mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan atau URL salah.
        </p>
        <div class="flex gap-4 justify-center">
          <RouterLink to="/" class="btn-primary">Kembali ke Beranda</RouterLink>
          <RouterLink to="/kontak" class="btn-outline">Hubungi Kami</RouterLink>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
