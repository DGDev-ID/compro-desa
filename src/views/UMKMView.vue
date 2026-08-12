<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import UMKMCard from '@/components/umkm/UMKMCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getUMKMList, getUMKMCategories } from '@/services/umkm.service'

usePageHead({
  title: 'Potensi & Ekonomi',
  description: 'Temukan berbagai produk dan usaha UMKM unggulan Desa Pandansari: opak, pertanian organik, batik, dan banyak lagi.',
})

const umkmList = ref([])
const categories = ref([])
const activeCategory = ref('')
const loading = ref(true)

async function loadData() {
  loading.value = true
  const [cats, res] = await Promise.all([
    getUMKMCategories(),
    getUMKMList({ category: activeCategory.value, perPage: 20 }),
  ])
  categories.value = cats
  umkmList.value = res.data
  loading.value = false
}

async function setCategory(slug) {
  activeCategory.value = slug
  loading.value = true
  const res = await getUMKMList({ category: slug, perPage: 20 })
  umkmList.value = res.data
  loading.value = false
}

onMounted(loadData)
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="/pict7.webp"
        alt="UMKM Desa Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Ekonomi Desa</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Potensi & Ekonomi</h1>
        </div>
      </div>
    </section>

    <section class="section-padding bg-background">
      <div class="container-site">
        <SectionTitle
          label="Produk Lokal"
          title="Dukung UMKM Pandansari"
          description="Berbagai produk dan usaha lokal yang menjadi tulang punggung perekonomian warga Desa Pandansari."
          centered
        />

        <!-- Category Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10">
          <button
            class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all"
            :class="
              activeCategory === ''
                ? 'bg-primary border-primary shadow-soft'
                : 'bg-white border-border hover:border-primary hover:bg-alt'
            "
            @click="setCategory('')"
          >
            <span class="text-2xl">🏪</span>
            <span class="text-xs font-medium font-heading text-heading">Semua</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.slug"
            class="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all"
            :class="
              activeCategory === cat.slug
                ? 'bg-primary border-primary shadow-soft'
                : 'bg-white border-border hover:border-primary hover:bg-alt'
            "
            @click="setCategory(cat.slug)"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-xs font-medium font-heading text-heading">{{ cat.label }}</span>
          </button>
        </div>

        <!-- Cards -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="card-base overflow-hidden">
            <div class="skeleton h-52 w-full" />
            <div class="p-5 space-y-3">
              <div class="skeleton h-4 w-20 rounded-full" />
              <div class="skeleton h-5 w-2/3 rounded-lg" />
              <div class="skeleton h-3.5 w-full rounded-md" />
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UMKMCard
            v-for="(umkm, i) in umkmList"
            :key="umkm.id"
            :umkm="umkm"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 80"
          />
        </div>
      </div>
    </section>

    <CtaSection />
  </DefaultLayout>
</template>
