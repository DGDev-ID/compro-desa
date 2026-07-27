<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import DestinationCard from '@/components/destination/DestinationCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getDestinationBySlug, getRelatedDestinations } from '@/services/destination.service'
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  CheckIcon,
  PhoneIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftIcon,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()

const destination = ref(null)
const related = ref([])
const loading = ref(true)
const notFound = ref(false)
const thumbsSwiper = ref(null)

const swiperModules = [Navigation, Thumbs]

function setThumbsSwiper(swiper) {
  thumbsSwiper.value = swiper
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

async function loadData(slug) {
  loading.value = true
  notFound.value = false
  destination.value = null

  const data = await getDestinationBySlug(slug)
  if (!data) {
    notFound.value = true
    loading.value = false
    return
  }
  destination.value = data
  related.value = await getRelatedDestinations(slug, 3)
  loading.value = false
}

onMounted(() => loadData(route.params.slug))
watch(() => route.params.slug, (slug) => {
  if (slug) {
    loadData(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="pt-24 min-h-screen flex items-center justify-center">
      <div class="flex flex-col items-center gap-4 text-body">
        <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p class="text-sm">Memuat destinasi...</p>
      </div>
    </div>

    <div v-else-if="notFound" class="pt-24 min-h-screen flex items-center justify-center text-center">
      <div>
        <span class="text-6xl mb-4 block">🌿</span>
        <h2 class="font-heading font-bold text-heading text-2xl mb-2">Destinasi Tidak Ditemukan</h2>
        <p class="text-body mb-6">Destinasi yang Anda cari tidak tersedia.</p>
        <RouterLink to="/destinasi" class="btn-primary">← Kembali ke Destinasi</RouterLink>
      </div>
    </div>

    <template v-else-if="destination">
      <!-- Breadcrumb -->
      <div class="pt-24 pb-4 bg-white border-b border-border">
        <div class="container-site">
          <AppBreadcrumb
            :items="[
              { label: 'Destinasi Wisata', to: '/destinasi' },
              { label: destination.title },
            ]"
          />
        </div>
      </div>

      <!-- Gallery Hero -->
      <section class="bg-white pb-6">
        <div class="container-site pt-6">
          <Swiper
            :modules="swiperModules"
            :thumbs="{ swiper: thumbsSwiper }"
            navigation
            class="rounded-2xl overflow-hidden aspect-[16/7] shadow-soft-lg"
          >
            <SwiperSlide v-for="(img, i) in destination.gallery" :key="i">
              <img :src="img" :alt="`${destination.title} ${i + 1}`" class="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>

          <Swiper
            v-if="destination.gallery.length > 1"
            :modules="[Thumbs]"
            :slides-per-view="4"
            :space-between="10"
            watch-slides-progress
            class="mt-3"
            @swiper="setThumbsSwiper"
          >
            <SwiperSlide
              v-for="(img, i) in destination.gallery"
              :key="i"
              class="cursor-pointer rounded-xl overflow-hidden aspect-video opacity-60 hover:opacity-100 transition-opacity"
            >
              <img :src="img" :alt="`thumb ${i + 1}`" class="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <!-- Content -->
      <section class="section-padding bg-background">
        <div class="container-site">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <div class="flex flex-wrap gap-2 mb-3">
                <AppBadge :label="destination.category" variant="primary" />
                <div v-for="tag in destination.tags" :key="tag" class="flex items-center gap-1">
                  <AppBadge :label="tag" variant="forest" />
                </div>
              </div>

              <h1 class="font-heading font-bold text-heading text-3xl md:text-4xl mb-3">
                {{ destination.title }}
              </h1>

              <div class="flex items-center gap-2 mb-6">
                <StarIcon class="w-4 h-4 fill-earth text-earth" />
                <span class="font-semibold text-heading text-sm">{{ destination.rating }}</span>
                <span class="text-body text-sm">({{ destination.reviewCount }} ulasan)</span>
              </div>

              <div class="prose-custom mb-8">
                <p
                  v-for="(para, i) in destination.description.split('\n\n')"
                  :key="i"
                  class="text-body leading-relaxed mb-4"
                >
                  {{ para }}
                </p>
              </div>

              <!-- Facilities -->
              <div class="card-base p-6 mb-6">
                <h3 class="font-heading font-semibold text-heading mb-4">✅ Fasilitas Tersedia</h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <li
                    v-for="fac in destination.facilities"
                    :key="fac"
                    class="flex items-start gap-2.5 text-sm text-body"
                  >
                    <CheckIcon class="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    {{ fac }}
                  </li>
                </ul>
              </div>

              <!-- Google Maps -->
              <div class="card-base overflow-hidden">
                <div class="p-4 border-b border-border flex items-center gap-2">
                  <MapPinIcon class="w-4 h-4 text-forest" />
                  <h3 class="font-heading font-semibold text-heading text-sm">Lokasi</h3>
                </div>
                <div class="aspect-video">
                  <iframe
                    :src="`https://www.google.com/maps?q=${destination.coordinates.lat},${destination.coordinates.lng}&z=15&output=embed`"
                    class="w-full h-full"
                    frameborder="0"
                    loading="lazy"
                    allowfullscreen
                  />
                </div>
              </div>
            </div>

            <!-- Sidebar Info -->
            <div class="space-y-5">
              <!-- Info Card -->
              <div class="card-base p-6 shadow-soft-lg sticky top-24">
                <h3 class="font-heading font-semibold text-heading mb-4">Informasi Kunjungan</h3>
                <ul class="space-y-3.5 text-sm mb-5">
                  <li class="flex gap-3">
                    <ClockIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs mb-0.5">Jam Buka</span>
                      <span class="font-medium text-heading">{{ destination.openHours }}</span>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <CalendarIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs mb-0.5">Durasi</span>
                      <span class="font-medium text-heading">{{ destination.duration }}</span>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <UsersIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs mb-0.5">Kapasitas</span>
                      <span class="font-medium text-heading">{{ destination.capacity }}</span>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <TagIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs mb-0.5">Usia Minimum</span>
                      <span class="font-medium text-heading">{{ destination.minAge }} tahun</span>
                    </div>
                  </li>
                </ul>

                <div class="border-t border-border pt-4 mb-5">
                  <p class="text-xs text-body mb-1">Harga Weekday</p>
                  <p class="font-heading font-bold text-forest text-xl">{{ formatPrice(destination.price.weekday) }}</p>
                  <p class="text-xs text-body mt-0.5">{{ destination.price.note }}</p>
                </div>

                <a
                  :href="`https://wa.me/6285123456789?text=Saya ingin reservasi ${destination.title}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary w-full justify-center text-sm"
                >
                  📱 Reservasi via WhatsApp
                </a>
                <a
                  href="tel:+62285123456"
                  class="btn-outline w-full justify-center text-sm mt-3 flex items-center gap-2"
                >
                  <PhoneIcon class="w-4 h-4" />
                  Telepon Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Destinations -->
      <section v-if="related.length" class="section-padding" style="background-color: #EEF5E3;">
        <div class="container-site">
          <div class="flex items-end justify-between mb-8">
            <div>
              <span class="section-label mb-2">Destinasi Lainnya</span>
              <h2 class="font-heading font-bold text-heading text-2xl">Wisata Lain di Pandansari</h2>
            </div>
            <RouterLink to="/destinasi" class="btn-outline text-sm">Lihat Semua</RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DestinationCard
              v-for="(dest, i) in related"
              :key="dest.id"
              :destination="dest"
              data-aos="fade-up"
              :data-aos-delay="i * 80"
            />
          </div>
        </div>
      </section>
    </template>

    <CtaSection />
  </DefaultLayout>
</template>
