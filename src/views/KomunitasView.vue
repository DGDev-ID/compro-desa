<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import CommunityCard from '@/components/community/CommunityCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getCommunities } from '@/services/community.service'

usePageHead({
  title: 'Komunitas',
  description: 'Kenali komunitas-komunitas aktif yang menjadi kekuatan sosial dan budaya Desa Pandansari.',
})

const communities = ref([])
const loading = ref(true)

onMounted(async () => {
  communities.value = await getCommunities()
  loading.value = false
})
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=1920&q=80"
        alt="Komunitas Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Bersama Lebih Kuat</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Komunitas Desa</h1>
        </div>
      </div>
    </section>

    <section class="section-padding bg-background">
      <div class="container-site">
        <SectionTitle
          label="Komunitas Aktif"
          title="Kekuatan Bersama Pandansari"
          description="Komunitas-komunitas yang menjadi tulang punggung kehidupan sosial, budaya, dan olahraga Desa Pandansari."
          centered
        />

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 5" :key="n" class="card-base overflow-hidden">
            <div class="skeleton h-52 w-full" />
            <div class="p-5 space-y-3">
              <div class="skeleton h-4 w-20 rounded-full" />
              <div class="skeleton h-5 w-2/3 rounded-lg" />
              <div class="skeleton h-3.5 w-full rounded-md" />
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CommunityCard
            v-for="(comm, i) in communities"
            :key="comm.id"
            :community="comm"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 80"
          />
        </div>
      </div>
    </section>

    <CtaSection />
  </DefaultLayout>
</template>
