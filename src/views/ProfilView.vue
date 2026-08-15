<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'

import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getProfile } from '@/services/profile.service'

usePageHead({
  title: 'Profil Desa',
  description:
    'Sejarah, visi misi, dan struktur pemerintahan Desa Pandansari, Kecamatan Batang, Kabupaten Batang, Jawa Tengah.',
})

const profile = ref(null)
const loading = ref(true)

/**
 * Convert any YouTube URL to an embed URL.
 * Handles:
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID  (passthrough)
 */
function toYouTubeEmbed(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    let videoId = null

    if (u.hostname === 'youtu.be') {
      // https://youtu.be/VIDEO_ID
      videoId = u.pathname.replace('/', '')
    } else if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) {
        // already embed — just clean params
        videoId = u.pathname.replace('/embed/', '')
      } else {
        // watch?v=VIDEO_ID
        videoId = u.searchParams.get('v')
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0`
    }
  } catch (_) {
    /* invalid URL */
  }
  return url // fallback: return as-is
}

const videoEmbedUrl = computed(() => toYouTubeEmbed(profile.value?.videoProfile))

const kaur = computed(() => {
  if (!profile.value?.government?.staff) return []
  return profile.value.government.staff.filter(s => /kaur/i.test(s.title))
})

const kasi = computed(() => {
  if (!profile.value?.government?.staff) return []
  return profile.value.government.staff.filter(s => /kasi/i.test(s.title))
})

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
        src="/pict11.webp"
        alt="E-Booklet Desa Pandansari"
        class="w-full h-full object-cover object-[center_65%]"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label text-white/80 mb-3" style="--tw-text-opacity: 1">
            Mengenal Kami
          </span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">
            Profil Desa Pandansari
          </h1>
        </div>
      </div>
    </section>

    <div v-if="!loading && profile">
      <!-- ─── About ─── -->
      <section class="section-padding bg-white">
        <div class="container-site clearfix">
          <!-- Right Sidebar (Floated) with high z-index to stay on top of the text container and remain clickable -->
          <div
            class="lg:w-1/2 lg:float-right lg:ml-12 mb-8 relative z-20"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <!-- Video Profile -->
            <div class="rounded-2xl overflow-hidden shadow-soft-lg aspect-video">
              <iframe
                v-if="videoEmbedUrl"
                :src="videoEmbedUrl"
                title="Video Profil Desa Pandansari"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                  web-share;
                "
                allowfullscreen
                class="w-full h-full"
              />
            </div>
            <p class="text-center text-sm text-body mt-3 italic mb-8">
              Video Profil Resmi Desa Pandansari
            </p>

            <!-- Office Hours -->
            <div class="bg-alt rounded-2xl p-5 border border-border">
              <h4 class="font-heading font-semibold text-heading text-sm mb-3">
                🕐 Jam Operasional Kantor Desa
              </h4>
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

          <!-- Main Content with lower z-index -->
          <div data-aos="fade-right" class="relative z-10">
            <SectionTitle label="Tentang Desa" title="Pandansari — Alam Asri, Masyarakat Lestari" />
            <div class="text-body leading-relaxed mt-6 whitespace-pre-line text-justify">
              {{ profile.description }}
            </div>
          </div>
        </div>
      </section>

      <!-- ─── History ─── -->
      <section class="section-padding" style="background-color: #eef5e3">
        <div class="container-site max-w-3xl mx-auto">
          <SectionTitle label="Sejarah" title="Asal Usul Desa Pandansari" centered />
          <div class="prose prose-green max-w-none" data-aos="fade-up">
            <p
              v-for="(paragraph, i) in (profile.about.history || '').split('\n\n')"
              :key="i"
              class="text-body leading-relaxed mb-4 text-justify"
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
              style="background-color: #4f6f52"
              data-aos="fade-right"
            >
              <div
                class="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"
              />
              <span class="section-label text-primary/80 mb-4" style="--tw-text-opacity: 1"
                >Visi</span
              >
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
                  <span
                    class="w-6 h-6 rounded-full bg-primary text-heading flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                  >
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
      <section class="section-padding bg-background">
        <div class="container-site">
          <SectionTitle label="Pemerintahan" title="Struktur Organisasi Desa" centered />

          <div class="overflow-x-auto py-10 mt-4" data-aos="fade-up">
            <div class="min-w-[900px] max-w-[1100px] mx-auto" style="font-family: inherit;">
              
              <!-- UPPER SECTION -->
              <div class="relative">
                <!-- MAIN TRUNK UPPER -->
                <div class="absolute left-1/2 top-[50px] bottom-0 w-[2px] bg-slate-300 -translate-x-1/2 z-0"></div>

                <!-- ROW 1: KADES -->
                <div v-if="profile.government.kepala" class="flex justify-center relative z-10">
                  <div class="card-base p-4 flex flex-col items-center text-center w-56 relative z-10 shadow-soft-xl border-t-4 border-t-primary">
                    <img v-if="profile.government.kepala.photo" :src="profile.government.kepala.photo" class="w-16 h-16 rounded-full mb-2 border-2 border-primary/20 object-cover" />
                    <div v-else class="w-16 h-16 rounded-full bg-alt mb-2 flex items-center justify-center border-2 border-primary/20"><span class="text-xl">👤</span></div>
                    <p class="font-heading font-semibold text-heading text-sm">{{ profile.government.kepala.name }}</p>
                    <p class="text-forest text-[11px] font-bold mt-0.5">Kepala Desa</p>
                  </div>
                </div>

                <!-- ROW 2: SEKDES -->
                <div v-if="profile.government.sekretaris" class="flex relative z-10 mt-10">
                  <div class="w-1/2"></div>
                  <div class="w-1/2 relative flex justify-center">
                    <!-- Trunk to Sekdes -->
                    <div class="absolute top-1/2 left-0 w-[50%] h-[2px] bg-slate-300 z-0"></div>
                    
                    <div class="card-base p-4 flex flex-col items-center text-center w-52 relative z-10 shadow-soft-lg border-t-4 border-t-forest">
                      <img v-if="profile.government.sekretaris.photo" :src="profile.government.sekretaris.photo" class="w-12 h-12 rounded-full mb-2 border-2 border-border object-cover" />
                      <div v-else class="w-12 h-12 rounded-full bg-alt mb-2 flex items-center justify-center border-2 border-border"><span class="text-lg">👤</span></div>
                      <p class="font-heading font-semibold text-heading text-xs">{{ profile.government.sekretaris.name }}</p>
                      <p class="text-forest text-[10px] font-bold mt-0.5">Sekretaris Desa</p>
                    </div>
                    
                    <div class="absolute top-[100%] left-1/2 h-12 w-[2px] bg-slate-300 -translate-x-1/2 z-0"></div>
                  </div>
                </div>

                <!-- ROW 3: KASI & KAUR -->
                <div class="flex relative z-10 mt-12 pb-2">
                  <!-- LEFT: KASI -->
                  <div class="w-1/2 relative">
                    <div class="absolute top-0 right-0 w-[50%] h-[2px] bg-slate-300"></div>
                    <div class="w-[90%] mx-auto relative pt-6">
                      <div class="absolute top-0" :style="{ left: (100 / (Math.max(kasi.length, 1) * 2)) + '%', right: (100 / (Math.max(kasi.length, 1) * 2)) + '%' }" style="height: 2px; background-color: #cbd5e1;"></div>
                      <div class="flex justify-between w-full gap-3">
                        <div v-for="k in kasi" :key="k.name" class="relative flex-1 group">
                          <div class="absolute bottom-[100%] left-1/2 h-6 w-[2px] bg-slate-300 -translate-x-1/2"></div>
                          <div class="card-base p-3 flex flex-col items-center text-center h-full shadow-sm hover:shadow-soft-lg transition-shadow border-t-[3px] border-t-earth">
                            <div class="w-10 h-10 rounded-full bg-alt mb-2 flex items-center justify-center border border-border"><span class="text-sm">👤</span></div>
                            <p class="font-heading font-semibold text-heading text-[11px] leading-tight mb-1">{{ k.title }}</p>
                            <p class="text-body text-[10px]">{{ k.name }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- RIGHT: KAUR -->
                  <div class="w-1/2 relative">
                    <div class="w-[90%] mx-auto relative pt-6">
                      <div class="absolute top-0" :style="{ left: (100 / (Math.max(kaur.length, 1) * 2)) + '%', right: (100 / (Math.max(kaur.length, 1) * 2)) + '%' }" style="height: 2px; background-color: #cbd5e1;"></div>
                      <div class="flex justify-between w-full gap-3">
                        <div v-for="k in kaur" :key="k.name" class="relative flex-1 group">
                          <div class="absolute bottom-[100%] left-1/2 h-6 w-[2px] bg-slate-300 -translate-x-1/2"></div>
                          <div class="card-base p-3 flex flex-col items-center text-center h-full shadow-sm hover:shadow-soft-lg transition-shadow border-t-[3px] border-t-earth">
                            <div class="w-10 h-10 rounded-full bg-alt mb-2 flex items-center justify-center border border-border"><span class="text-sm">👤</span></div>
                            <p class="font-heading font-semibold text-heading text-[11px] leading-tight mb-1">{{ k.title }}</p>
                            <p class="text-body text-[10px]">{{ k.name }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MIDDLE TRUNK -->
              <div v-if="profile.government.dukuh && profile.government.dukuh.length > 0" class="relative h-12 w-full">
                <div class="absolute left-1/2 top-0 h-full w-[2px] bg-slate-300 -translate-x-1/2 z-0"></div>
              </div>

              <!-- ROW 4: KADUS -->
              <div v-if="profile.government.dukuh && profile.government.dukuh.length > 0" class="relative z-10 pt-6">
                <div class="absolute top-0" :style="{ left: (100 / (Math.max(profile.government.dukuh.length, 1) * 2)) + '%', right: (100 / (Math.max(profile.government.dukuh.length, 1) * 2)) + '%' }" style="height: 2px; background-color: #cbd5e1;"></div>
                
                <div class="flex justify-between px-[2%] w-full gap-2">
                  <div v-for="d in profile.government.dukuh" :key="d.name" class="relative flex-1 group">
                    <div class="absolute bottom-[100%] left-1/2 h-6 w-[2px] bg-slate-300 -translate-x-1/2"></div>
                    <div class="card-base p-2 flex flex-col items-center text-center h-full shadow-sm hover:shadow-soft-lg transition-shadow border-t-[3px] border-t-primary">
                      <div class="w-8 h-8 rounded-full bg-alt mb-1.5 flex items-center justify-center border border-border"><span class="text-xs">🏠</span></div>
                      <p class="font-heading font-semibold text-heading text-[10px] leading-tight mb-1">{{ d.title }}<br>{{ d.rw }}</p>
                      <p class="text-body text-[9px]">{{ d.name }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- ─── Awards ─── -->
      <section class="section-padding bg-white">
        <div class="container-site">
          <SectionTitle
            label="Penghargaan"
            title="Pencapaian Kebanggaan"
            description="Penghargaan yang telah diraih Desa Pandansari di tingkat regional dan nasional."
            centered
          />
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
              <h4 class="font-heading font-semibold text-heading text-sm mb-1">
                {{ award.title }}
              </h4>
              <p class="text-body text-xs">{{ award.issuer }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <CtaSection />
  </DefaultLayout>
</template>
