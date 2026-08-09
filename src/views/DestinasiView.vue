<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import DestinationCard from '@/components/destination/DestinationCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getDestinations } from '@/services/destination.service'

usePageHead({
  title: 'Destinasi Wisata',
  description: 'Temukan berbagai destinasi wisata alam unggulan di Desa Pandansari: Tubing, Outbound, River Camp, Agrowisata, dan lebih banyak lagi.',
})

const destinations = ref([])
const loading = ref(true)
const activeCategory = ref('Semua')

const categories = ref(['Semua'])

onMounted(async () => {
  const res = await getDestinations({ perPage: 50 })
  destinations.value = res.data
  const cats = [...new Set(destinations.value.map((d) => d.category).filter(Boolean))]
  categories.value = ['Semua', ...cats]
  loading.value = false
})

const filteredDestinations = computed(() => {
  if (activeCategory.value === 'Semua') return destinations.value
  return destinations.value.filter((d) => d.category === activeCategory.value)
})
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1920&q=80"
        alt="Destinasi Wisata Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Jelajahi</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Destinasi Wisata</h1>
        </div>
      </div>
    </section>

    <section class="section-padding bg-background">
      <div class="container-site">
        <SectionTitle
          label="Wisata Alam"
          title="Pilih Destinasi Favoritmu"
          description="Dari arung jeram hingga berkemah di alam terbuka — Pandansari punya segalanya."
          centered
        />

        <!-- Category Filter -->
        <div class="flex flex-wrap gap-2 justify-center mb-10">
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-5 py-2 rounded-full text-sm font-medium font-heading border transition-all"
            :class="
              activeCategory === cat
                ? 'bg-primary border-primary text-heading shadow-soft'
                : 'bg-white border-border text-body hover:border-primary hover:text-forest'
            "
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Cards -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="card-base overflow-hidden">
            <div class="skeleton h-56 w-full" />
            <div class="p-5 space-y-3">
              <div class="skeleton h-4 w-24 rounded-full" />
              <div class="skeleton h-5 w-3/4 rounded-lg" />
              <div class="skeleton h-3.5 w-full rounded-md" />
              <div class="skeleton h-3.5 w-2/3 rounded-md" />
            </div>
          </div>
        </div>

        <div v-else-if="filteredDestinations.length === 0">
          <EmptyState title="Destinasi tidak ditemukan" description="Coba pilih kategori lain." />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DestinationCard
            v-for="(dest, i) in filteredDestinations"
            :key="dest.id"
            :destination="dest"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 80"
          />
        </div>
      </div>
    </section>

    <CtaSection />
  </DefaultLayout>
</template>
