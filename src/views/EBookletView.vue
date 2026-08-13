<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import BookletReaderModal from '@/components/ebooklet/BookletReaderModal.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getEBooklets } from '@/services/ebooklet.service'
import { DownloadIcon, BookOpenIcon, FileTextIcon, LayersIcon, TagIcon } from '@lucide/vue'

usePageHead({
  title: 'E-Booklet',
  description:
    'Unduh E-Booklet digital Desa Pandansari — panduan wisata, profil desa, UMKM, budaya, dan banyak lagi secara gratis.',
})

// ─── Data ─────────────────────────────────────────────────────────────────────
const booklets = ref([])
const loading = ref(true)
const activeCategory = ref('Semua')

// ─── Reader Modal ─────────────────────────────────────────────────────────────
const readerOpen = ref(false)
const readerBooklet = ref(null)

function openReader(booklet) {
  readerBooklet.value = booklet
  readerOpen.value = true
}
function closeReader() {
  readerOpen.value = false
}
function handleDownload(booklet) {
  if (booklet?.fileUrl && booklet.fileUrl !== '#') {
    window.open(booklet.fileUrl, '_blank', 'noopener,noreferrer')
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const categories = computed(() => {
  const cats = booklets.value.map((b) => b.category).filter(Boolean)
  return ['Semua', ...new Set(cats)]
})

const filtered = computed(() => {
  if (activeCategory.value === 'Semua') return booklets.value
  return booklets.value.filter((b) => b.category === activeCategory.value)
})

const featured = computed(() => booklets.value.find((b) => b.featured) || null)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  booklets.value = await getEBooklets()
  loading.value = false
})
</script>

<template>
  <DefaultLayout>
    <!-- ─── Flipbook Reader Modal ─── -->
    <BookletReaderModal
      :open="readerOpen"
      :booklet="readerBooklet"
      @close="closeReader"
      @download="handleDownload"
    />

    <!-- ─── Hero ─── -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="/pict12.webp"
        alt="E-Booklet Desa Pandansari"
        class="w-full h-full object-cover object-[center_40%]"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Unduh Gratis</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">E-Booklet</h1>
        </div>
      </div>
    </section>

    <!-- ─── Featured Booklet ─── -->
    <section v-if="!loading && featured" class="section-padding bg-alt">
      <div class="container-site">
        <span class="section-label mb-4">E-Booklet Unggulan</span>
        <div class="card-base flex flex-col md:flex-row overflow-hidden group">
          <!-- Cover clickable to open reader -->
          <button
            class="md:w-72 shrink-0 aspect-[3/4] md:aspect-auto relative overflow-hidden text-left cursor-pointer focus:outline-none"
            :title="`Baca: ${featured.title}`"
            @click="openReader(featured)"
          >
            <img
              :src="featured.cover"
              :alt="featured.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Hover overlay on cover -->
            <div
              class="absolute inset-0 bg-forest/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              <div class="flex flex-col items-center gap-2 text-white">
                <BookOpenIcon class="w-10 h-10" />
                <span class="text-sm font-heading font-semibold">Baca Sekarang</span>
              </div>
            </div>
            <!-- Badge overlay -->
            <div
              class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-soft"
            >
              <BookOpenIcon class="w-3.5 h-3.5 text-forest" />
              <span class="text-xs font-semibold text-forest font-heading">Klik Untuk Membaca</span>
            </div>
          </button>

          <!-- Info -->
          <div class="flex-1 p-8 flex flex-col justify-center">
            <span class="badge badge-forest mb-3">{{ featured.category }}</span>
            <h2 class="font-heading font-bold text-heading text-2xl md:text-3xl mb-4 leading-tight">
              {{ featured.title }}
            </h2>
            <p class="text-body text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              {{ featured.description }}
            </p>

            <!-- Meta -->
            <div class="flex flex-wrap gap-4 mb-6 text-xs text-body">
              <span v-if="featured.pages" class="flex items-center gap-1.5">
                <FileTextIcon class="w-3.5 h-3.5 text-forest" />
                {{ featured.pages }} Halaman
              </span>
              <span v-if="featured.fileSize" class="flex items-center gap-1.5">
                <LayersIcon class="w-3.5 h-3.5 text-forest" />
                {{ featured.fileSize }}
              </span>
              <span v-if="featured.publishedAt" class="flex items-center gap-1.5">
                <TagIcon class="w-3.5 h-3.5 text-forest" />
                {{ formatDate(featured.publishedAt) }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-3">
              <button
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': featured.fileUrl === '#' }"
                :disabled="featured.fileUrl === '#'"
                :title="featured.fileUrl === '#' ? 'Segera tersedia' : 'Unduh PDF'"
                @click="handleDownload(featured)"
              >
                <DownloadIcon class="w-4 h-4" />
                Download PDF
              </button>
              <button class="btn-outline" @click="openReader(featured)">
                <BookOpenIcon class="w-4 h-4" />
                Baca Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Booklet List ─── -->
    <section class="section-padding bg-background">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span class="section-label mb-2">Koleksi E-Booklet</span>
            <h2 class="font-heading font-bold text-heading text-2xl md:text-3xl">
              Semua Panduan Digital
            </h2>
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat"
              class="px-4 py-1.5 rounded-full text-sm font-medium font-heading transition-all duration-200 border"
              :class="
                activeCategory === cat
                  ? 'bg-forest text-white border-forest shadow-soft'
                  : 'bg-white text-body border-border hover:border-forest hover:text-forest'
              "
              @click="activeCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div v-for="n in 4" :key="n" class="card-base overflow-hidden">
            <div class="skeleton aspect-[3/4] w-full" />
            <div class="p-4 space-y-2">
              <div class="skeleton h-3.5 w-20 rounded-full" />
              <div class="skeleton h-5 w-full rounded-lg" />
              <div class="skeleton h-3.5 w-3/4 rounded-md" />
              <div class="skeleton h-9 w-full rounded-full mt-4" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="text-center py-20 text-body">
          <BookOpenIcon class="w-12 h-12 text-border mx-auto mb-3" />
          <p class="font-heading font-semibold text-heading mb-1">Belum Ada E-Booklet</p>
          <p class="text-sm">E-Booklet untuk kategori ini akan segera tersedia.</p>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <article
            v-for="(booklet, i) in filtered"
            :key="booklet.id"
            class="card-base group flex flex-col"
            data-aos="fade-up"
            :data-aos-delay="(i % 4) * 60"
          >
            <!-- Cover Image -->
            <div class="relative aspect-[3/4] card-img-wrap overflow-hidden">
              <img
                :src="booklet.cover"
                :alt="booklet.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <!-- Hover overlay — two actions -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <!-- Baca Online -->
                <button
                  class="flex items-center gap-2 bg-primary text-heading font-heading font-semibold text-sm px-5 py-2.5 rounded-full shadow-soft hover:bg-primary-hover transition-all duration-200 hover:-translate-y-0.5"
                  @click="openReader(booklet)"
                >
                  <BookOpenIcon class="w-4 h-4" />
                  Baca Online
                </button>
                <!-- Download -->
                <button
                  class="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/25 font-heading font-medium text-xs px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-200"
                  :class="{ 'opacity-40 cursor-not-allowed': booklet.fileUrl === '#' }"
                  :disabled="booklet.fileUrl === '#'"
                  @click="handleDownload(booklet)"
                >
                  <DownloadIcon class="w-3.5 h-3.5" />
                  {{ booklet.fileUrl === '#' ? 'Segera Hadir' : 'Download PDF' }}
                </button>
              </div>
              <!-- Featured badge -->
              <div v-if="booklet.featured" class="absolute top-3 left-3 z-10">
                <span class="badge badge-primary text-xs shadow-soft">Unggulan</span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-5 flex flex-col flex-1">
              <span class="badge badge-forest text-xs mb-2 self-start">{{ booklet.category }}</span>
              <h3
                class="font-heading font-semibold text-heading text-base leading-snug mb-2 line-clamp-2 group-hover:text-forest transition-colors cursor-pointer"
                @click="openReader(booklet)"
              >
                {{ booklet.title }}
              </h3>
              <p class="text-body text-xs leading-relaxed line-clamp-2 mb-4">
                {{ booklet.description }}
              </p>

              <!-- Meta row -->
              <div class="flex items-center gap-3 text-xs text-body mt-auto mb-4">
                <span v-if="booklet.pages" class="flex items-center gap-1">
                  <FileTextIcon class="w-3 h-3" /> {{ booklet.pages }} hal
                </span>
                <span v-if="booklet.fileSize" class="flex items-center gap-1">
                  <LayersIcon class="w-3 h-3" /> {{ booklet.fileSize }}
                </span>
              </div>

              <!-- CTA Buttons -->
              <div class="flex gap-2">
                <button
                  class="flex-1 btn-primary justify-center text-xs py-2"
                  @click="openReader(booklet)"
                >
                  <BookOpenIcon class="w-3.5 h-3.5" />
                  Baca
                </button>
                <button
                  class="btn-outline justify-center text-xs py-2 px-3"
                  :class="{ 'opacity-50 cursor-not-allowed': booklet.fileUrl === '#' }"
                  :disabled="booklet.fileUrl === '#'"
                  :title="booklet.fileUrl === '#' ? 'Segera tersedia' : 'Download PDF'"
                  @click="handleDownload(booklet)"
                >
                  <DownloadIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ─── Info Banner ─── -->
    <!-- <section class="bg-forest py-12">
      <div class="container-site">
        <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
          <div
            class="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 mx-auto md:mx-0"
          >
            <BookOpenIcon class="w-8 h-8 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="font-heading font-bold text-white text-xl md:text-2xl mb-2">
              Akses Gratis untuk Semua
            </h3>
            <p class="text-white/75 text-sm md:text-base leading-relaxed max-w-xl">
              Semua E-Booklet Desa Pandansari dapat dibaca dan diunduh secara gratis. Bagikan kepada
              siapa saja yang ingin mengenal lebih dekat potensi dan keindahan desa kami.
            </p>
          </div>
          <div class="shrink-0">
            <RouterLink to="/kontak" class="btn-primary"> Hubungi Kami </RouterLink>
          </div>
        </div>
      </div>
    </section> -->

    <CtaSection />
  </DefaultLayout>
</template>
