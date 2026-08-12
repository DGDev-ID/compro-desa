<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import GalleryGrid from '@/components/common/GalleryGrid.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getUMKMBySlug } from '@/services/umkm.service'
import { MapPinIcon, PhoneIcon, CheckIcon, ShoppingBagIcon, UserIcon, CalendarIcon } from '@lucide/vue'

const route = useRoute()
const umkm = ref(null)
const loading = ref(true)
const notFound = ref(false)

async function loadData(slug) {
  loading.value = true
  notFound.value = false
  const data = await getUMKMBySlug(slug)
  if (!data) { notFound.value = true; loading.value = false; return }
  umkm.value = data
  loading.value = false
}

onMounted(() => loadData(route.params.slug))
watch(() => route.params.slug, (s) => s && loadData(s))

const mapEmbedUrl = computed(() => {
  if (!umkm.value) return null
  const url = umkm.value.googleMapsUrl
  if (url && url.includes('google.com/maps/embed')) return url
  // Fallback to searching by name and address for reliable iframe embedding
  const query = encodeURIComponent(`${umkm.value.name}, ${umkm.value.address || ''}`)
  return `https://www.google.com/maps?q=${query}&output=embed`
})

function formatPrice(p) {
  if (!p) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
}
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="pt-24 min-h-screen flex items-center justify-center">
      <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>

    <div v-else-if="notFound" class="pt-24 min-h-screen flex items-center justify-center text-center">
      <div>
        <span class="text-6xl mb-4 block">🏪</span>
        <h2 class="font-heading font-bold text-heading text-2xl mb-2">UMKM tidak ditemukan</h2>
        <RouterLink to="/umkm" class="btn-primary mt-4">← Kembali</RouterLink>
      </div>
    </div>

    <template v-else-if="umkm">
      <div class="pt-24 pb-4 bg-white border-b border-border">
        <div class="container-site">
          <AppBreadcrumb :items="[{ label: 'UMKM', to: '/umkm' }, { label: umkm.name }]" />
        </div>
      </div>

      <!-- Hero -->
      <section class="relative h-64 md:h-80 overflow-hidden">
        <img :src="umkm.thumbnail" :alt="umkm.name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 hero-overlay flex items-end pb-8">
          <div class="container-site">
            <AppBadge :label="umkm.category" variant="earth" class="mb-2" />
            <h1 class="font-heading font-bold text-white text-3xl md:text-4xl">{{ umkm.name }}</h1>
          </div>
        </div>
      </section>

      <section class="section-padding bg-background">
        <div class="container-site">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Main -->
            <div class="lg:col-span-2 space-y-8">
              <div class="card-base p-6">
                <h2 class="font-heading font-semibold text-heading text-lg mb-3">Tentang Usaha</h2>
                <p class="text-body leading-relaxed whitespace-pre-line text-justify">{{ umkm.description }}</p>
              </div>

              <!-- Gallery -->
              <div v-if="umkm.gallery && umkm.gallery.length > 1">
                <h2 class="font-heading font-semibold text-heading text-lg mb-4">Galeri</h2>
                <GalleryGrid
                  :images="umkm.gallery.map((src, i) => ({ id: i, src, thumb: src, alt: umkm.name }))"
                  :columns="2"
                />
              </div>

              <!-- Maps -->
              <div class="card-base overflow-hidden">
                <div class="p-4 border-b border-border flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <MapPinIcon class="w-4 h-4 text-forest" />
                    <h3 class="font-heading font-semibold text-heading text-sm">Lokasi</h3>
                  </div>
                  <a
                    v-if="umkm.googleMapsUrl"
                    :href="umkm.googleMapsUrl"
                    target="_blank" rel="noopener noreferrer"
                    class="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Buka di Maps ↗
                  </a>
                </div>
                <div class="aspect-video relative">
                  <iframe
                    v-if="mapEmbedUrl"
                    :src="mapEmbedUrl"
                    class="w-full h-full" frameborder="0" loading="lazy" allowfullscreen
                  />
                  <div v-else class="absolute inset-0 flex items-center justify-center bg-background text-sm text-body">
                    Peta tidak tersedia
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div>
              <div class="card-base p-6 sticky top-24">
                <h3 class="font-heading font-semibold text-heading mb-4">Informasi Usaha</h3>
                <ul class="space-y-3.5 text-sm mb-5">
                  <li class="flex gap-3">
                    <UserIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs">Pemilik</span>
                      <span class="font-medium text-heading">{{ umkm.owner }}</span>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <CalendarIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs">Berdiri Sejak</span>
                      <span class="font-medium text-heading">{{ umkm.established }}</span>
                    </div>
                  </li>
                  <li class="flex gap-3">
                    <MapPinIcon class="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="text-body block text-xs">Alamat</span>
                      <span class="font-medium text-heading">{{ umkm.address }}</span>
                    </div>
                  </li>
                </ul>

                <div class="space-y-3">
                  <a
                    :href="`https://wa.me/${umkm.phone}`"
                    target="_blank" rel="noopener noreferrer"
                    class="btn-primary w-full justify-center text-sm flex items-center gap-2"
                  >
                    <PhoneIcon class="w-4 h-4" /> Hubungi WhatsApp
                  </a>
                  <a
                    v-if="umkm.socialMedia.instagram"
                    :href="`https://instagram.com/${umkm.socialMedia.instagram.replace('@','')}`"
                    target="_blank" rel="noopener noreferrer"
                    class="btn-outline w-full justify-center text-sm flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    {{ umkm.socialMedia.instagram }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <CtaSection />
  </DefaultLayout>
</template>
