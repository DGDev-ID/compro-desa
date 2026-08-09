<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'

import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getProfile } from '@/services/profile.service'

usePageHead({
  title: 'Profil Desa',
  description: 'Sejarah, visi misi, dan struktur pemerintahan Desa Pandansari, Kecamatan Batang, Kabupaten Batang, Jawa Tengah.',
})

const profile = ref(null)
const loading = ref(true)

onMounted(async () => {
  profile.value = await getProfile()
  loading.value = false
})
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-72 md:h-96 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
        alt="Profil Desa Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label text-white/80 mb-3" style="--tw-text-opacity: 1;">
            Mengenal Kami
          </span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Profil Desa Pandansari</h1>
        </div>
      </div>
    </section>

    <div v-if="!loading && profile">
      <!-- ─── About ─── -->
      <section class="section-padding bg-white">
        <div class="container-site">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div data-aos="fade-right">
              <SectionTitle label="Tentang Desa" title="Pandansari — Alam Asri, Masyarakat Lestari" />
              <p class="text-body leading-relaxed mb-4">{{ profile.description }}</p>
              <p class="text-body leading-relaxed">{{ profile.shortDescription }}</p>

              <!-- Office Hours -->
              <div class="mt-8 bg-alt rounded-2xl p-5 border border-border">
                <h4 class="font-heading font-semibold text-heading text-sm mb-3">🕐 Jam Operasional Kantor Desa</h4>
                <ul class="space-y-1.5">
                  <li
                    v-for="h in profile.officeHours"
                    :key="h.day"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-body">{{ h.day }}</span>
                    <span class="font-medium text-heading">{{ h.hours }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Video Profile -->
            <div data-aos="fade-left" data-aos-delay="100">
              <div class="rounded-2xl overflow-hidden shadow-soft-lg aspect-video">
                <iframe
                  :src="profile.videoProfile"
                  title="Video Profil Desa Pandansari"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="w-full h-full"
                />
              </div>
              <p class="text-center text-sm text-body mt-3 italic">Video Profil Resmi Desa Pandansari</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── History ─── -->
      <section class="section-padding" style="background-color: #EEF5E3;">
        <div class="container-site max-w-3xl mx-auto">
          <SectionTitle label="Sejarah" title="Asal Usul Desa Pandansari" centered />
          <div class="prose prose-green max-w-none" data-aos="fade-up">
            <p
              v-for="(paragraph, i) in profile.about.history.split('\n\n')"
              :key="i"
              class="text-body leading-relaxed mb-4"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </section>

      <!-- ─── Vision & Mission ─── -->
      <section class="section-padding bg-white">
        <div class="container-site">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <!-- Vision -->
            <div
              class="rounded-2xl p-8 text-white relative overflow-hidden shadow-soft-lg"
              style="background-color: #4F6F52;"
              data-aos="fade-right"
            >
              <div class="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <span class="section-label text-primary/80 mb-4" style="--tw-text-opacity:1;">Visi</span>
              <h3 class="font-heading font-bold text-xl text-white leading-snug">
                {{ profile.about.vision }}
              </h3>
            </div>

            <!-- Missions -->
            <div data-aos="fade-left" data-aos-delay="100">
              <span class="section-label mb-4">Misi</span>
              <h3 class="font-heading font-bold text-xl text-heading mb-5">Misi Desa Pandansari</h3>
              <ul class="space-y-3">
                <li
                  v-for="(mission, i) in profile.about.missions"
                  :key="i"
                  class="flex gap-3 text-sm text-body"
                >
                  <span class="w-6 h-6 rounded-full bg-primary text-heading flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {{ i + 1 }}
                  </span>
                  {{ mission }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Government Structure ─── -->
      <section class="section-padding" style="background-color: #EEF5E3;">
        <div class="container-site">
          <SectionTitle label="Pemerintahan" title="Struktur Pemerintahan Desa" centered />

          <!-- Kepala Desa -->
          <div class="flex justify-center mb-8" data-aos="fade-up">
            <div class="card-base p-6 flex flex-col items-center text-center w-64 shadow-soft-lg">
              <img
                :src="profile.government.kepala.photo"
                :alt="profile.government.kepala.name"
                class="w-20 h-20 rounded-full mb-3 shadow-soft border-4 border-alt"
              />
              <p class="font-heading font-bold text-heading text-sm">{{ profile.government.kepala.name }}</p>
              <p class="text-forest text-xs font-semibold">{{ profile.government.kepala.title }}</p>
              <p class="text-body text-xs mt-1">Periode {{ profile.government.kepala.period }}</p>
            </div>
          </div>

          <!-- Sekretaris + Staff -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <div
              class="card-base p-4 flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <img
                :src="profile.government.sekretaris.photo"
                :alt="profile.government.sekretaris.name"
                class="w-14 h-14 rounded-full mb-2 border-2 border-border"
              />
              <p class="font-heading font-semibold text-heading text-xs">{{ profile.government.sekretaris.name }}</p>
              <p class="text-forest text-xs">{{ profile.government.sekretaris.title }}</p>
            </div>
            <div
              v-for="(staff, i) in profile.government.staff"
              :key="i"
              class="card-base p-4 flex flex-col items-center text-center"
              data-aos="fade-up"
              :data-aos-delay="(i + 1) * 60"
            >
              <div class="w-14 h-14 rounded-full bg-alt border-2 border-border flex items-center justify-center mb-2">
                <span class="text-xl">👤</span>
              </div>
              <p class="font-heading font-semibold text-heading text-xs">{{ staff.name }}</p>
              <p class="text-forest text-xs">{{ staff.title }}</p>
            </div>
          </div>

          <!-- Dukuh/RT/RW -->
          <h4 class="font-heading font-semibold text-heading text-center mb-4">Kepala Dusun</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="(dukuh, i) in profile.government.dukuh"
              :key="i"
              class="card-base p-5 text-center"
              data-aos="fade-up"
              :data-aos-delay="i * 80"
            >
              <div class="w-12 h-12 rounded-full bg-alt flex items-center justify-center mx-auto mb-3 text-xl">🏠</div>
              <p class="font-heading font-semibold text-heading text-sm">{{ dukuh.name }}</p>
              <p class="text-forest text-xs font-medium">{{ dukuh.title }}</p>
              <p class="text-body text-xs mt-1">{{ dukuh.rw }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Awards ─── -->
      <section class="section-padding bg-white">
        <div class="container-site">
          <SectionTitle label="Penghargaan" title="Pencapaian Kebanggaan" description="Penghargaan yang telah diraih Desa Pandansari di tingkat regional dan nasional." centered />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="(award, i) in profile.awards"
              :key="i"
              class="card-base p-6 text-center group"
              data-aos="fade-up"
              :data-aos-delay="i * 80"
            >
              <span class="text-4xl mb-3 block">{{ award.icon }}</span>
              <span class="badge badge-primary mb-2">{{ award.year }}</span>
              <h4 class="font-heading font-semibold text-heading text-sm mb-1">{{ award.title }}</h4>
              <p class="text-body text-xs">{{ award.issuer }}</p>
            </div>
          </div>
        </div>
      </section>


    </div>

    <CtaSection />
  </DefaultLayout>
</template>
