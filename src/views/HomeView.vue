<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import StatisticCard from '@/components/common/StatisticCard.vue'
import DestinationCard from '@/components/destination/DestinationCard.vue'
import CommunityCard from '@/components/community/CommunityCard.vue'
import UMKMCard from '@/components/umkm/UMKMCard.vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import GalleryGrid from '@/components/common/GalleryGrid.vue'
import CtaSection from '@/components/common/CtaSection.vue'

import { usePageHead } from '@/composables/usePageHead'
import { getFeaturedDestinations } from '@/services/destination.service'
import { getFeaturedCommunities } from '@/services/community.service'
import { getFeaturedUMKM } from '@/services/umkm.service'
import { getFeaturedArticles } from '@/services/article.service'
import { getGalleryPreview } from '@/services/gallery.service'
import { getStats } from '@/services/stat.service'
import { getBanners } from '@/services/banner.service'

usePageHead({
  title: 'Beranda',
  description: 'Selamat datang di Desa Pandansari — desa wisata alam terpadu di Kecamatan Batang, Jawa Tengah.',
})

const heroSlides = ref([
  {
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=85',
    caption: 'Alam Asri Desa Pandansari',
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=85',
    caption: 'Keindahan Sungai Sambong',
  },
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85',
    caption: 'Hamparan Alam Hijau',
  },
])

const swiperModules = [Autoplay, Pagination, EffectFade]

const featuredDestinations = ref([])
const featuredCommunities = ref([])
const featuredUMKM = ref([])
const featuredArticles = ref([])
const galleryImages = ref([])
const statistics = ref([])

onMounted(async () => {
  let apiBanners
  ;[
    featuredDestinations.value,
    featuredCommunities.value,
    featuredUMKM.value,
    featuredArticles.value,
    galleryImages.value,
    statistics.value,
    apiBanners,
  ] = await Promise.all([
    getFeaturedDestinations(),
    getFeaturedCommunities(3),
    getFeaturedUMKM(3),
    getFeaturedArticles(3),
    getGalleryPreview(6),
    getStats(),
    getBanners(),
  ])

  if (apiBanners && apiBanners.length > 0) {
    heroSlides.value = apiBanners
  }
})
</script>

<template>
  <DefaultLayout>
    <!-- ══════════════════════════════ HERO ══════════════════════════════ -->
    <section class="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      <Swiper
        :modules="swiperModules"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        effect="fade"
        loop
        class="h-full w-full"
      >
        <SwiperSlide v-for="(slide, i) in heroSlides" :key="i">
          <div class="relative h-full w-full">
            <img
              :src="slide.image"
              :alt="slide.caption"
              class="w-full h-full object-cover"
              :loading="i === 0 ? 'eager' : 'lazy'"
            />
            <div class="absolute inset-0 hero-overlay" />
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Hero Content -->
      <div class="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div class="container-site w-full">
          <div class="max-w-2xl pointer-events-auto" data-aos="fade-up">
            <span class="inline-block bg-primary/20 backdrop-blur-sm text-white text-xs font-semibold font-heading tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 mb-5">
              🌿 Desa Wisata Terbaik Jawa Tengah 2024
            </span>
            <h1 class="font-heading font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
              Selamat Datang di<br />
              <span class="text-primary">Desa Pandansari</span>
            </h1>
            <p class="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Nikmati keindahan alam sungai, bukit hijau, dan kearifan lokal Desa Pandansari — pengalaman wisata yang tak terlupakan untuk keluarga Anda.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <RouterLink to="/destinasi" class="btn-primary text-sm">
                🗺️ Jelajahi Destinasi
              </RouterLink>
              <RouterLink to="/kontak" class="btn-outline-white text-sm">
                Hubungi Kami
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/60 text-xs animate-bounce">
        <span>Scroll</span>
        <div class="w-px h-8 bg-white/40"></div>
      </div>
    </section>

    <!-- ══════════════════════════════ ABOUT SNIPPET ══════════════════════════════ -->
    <section class="section-padding bg-white">
      <div class="container-site">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <SectionTitle
              label="Tentang Kami"
              title="Pandansari — Alam Asri, Masyarakat Lestari"
              description="Desa Pandansari terletak di Kecamatan Batang, dikelilingi oleh alam yang memukau: sungai jernih, sawah hijau, dan perbukitan asri yang menjadi rumah bagi komunitas yang ramah dan bersemangat."
            />
            <div class="flex flex-col sm:flex-row gap-4 mt-6">
              <RouterLink to="/profil" class="btn-primary">Profil Lengkap</RouterLink>
              <RouterLink to="/destinasi" class="btn-outline">Destinasi Wisata</RouterLink>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4" data-aos="fade-left" data-aos-delay="100">
            <div class="rounded-2xl overflow-hidden aspect-square shadow-soft-lg">
              <img
                src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"
                alt="Keindahan alam Pandansari"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="rounded-2xl overflow-hidden aspect-square shadow-soft-lg mt-6">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"
                alt="Pertanian desa"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="rounded-2xl overflow-hidden aspect-square shadow-soft-lg -mt-6">
              <img
                src="https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=600&q=80"
                alt="Budaya Pandansari"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="rounded-2xl overflow-hidden aspect-square shadow-soft-lg">
              <img
                src="https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=600&q=80"
                alt="Wisata tubing"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ POTENSI DESA ══════════════════════════════ -->
    <section class="section-padding" style="background-color: #EEF5E3;">
      <div class="container-site">
        <SectionTitle
          label="Potensi"
          title="POTENSI DESA"
          description="Desa Wisata Pandansari memiliki beragam potensi alam, wisata, dan ekonomi lokal yang berkembang melalui semangat gotong royong masyarakat."
          centered
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div class="card-base p-6 hover:shadow-soft-xl transition-all duration-300">
            <h3 class="text-xl font-bold font-heading mb-3 flex items-center gap-2"><span class="text-2xl">🌊</span> Wisata Alam</h3>
            <p class="text-body leading-relaxed">Nikmati keindahan alam Desa Wisata Pandansari melalui berbagai destinasi wisata yang menawarkan pengalaman rekreasi, petualangan, dan suasana pedesaan yang asri.</p>
          </div>
          <div class="card-base p-6 hover:shadow-soft-xl transition-all duration-300">
            <h3 class="text-xl font-bold font-heading mb-3 flex items-center gap-2"><span class="text-2xl">🏕️</span> Aktivitas Wisata</h3>
            <p class="text-body leading-relaxed">Beragam aktivitas dapat dinikmati oleh wisatawan, mulai dari river tubing, outbound, camping, memancing, hingga bersantai di tepi sungai.</p>
          </div>
          <div class="card-base p-6 hover:shadow-soft-xl transition-all duration-300">
            <h3 class="text-xl font-bold font-heading mb-3 flex items-center gap-2"><span class="text-2xl">🛍️</span> UMKM & Ekonomi Lokal</h3>
            <p class="text-body leading-relaxed">Desa Pandansari memiliki potensi ekonomi lokal yang didukung oleh UMKM makanan khas Opak, UMKM Desa Wisata, pertanian, perikanan, serta Pasar Pandansari yang menjadi bagian dari kehidupan masyarakat.</p>
          </div>
          <div class="card-base p-6 hover:shadow-soft-xl transition-all duration-300">
            <h3 class="text-xl font-bold font-heading mb-3 flex items-center gap-2"><span class="text-2xl">🤝</span> Komunitas Aktif</h3>
            <p class="text-body leading-relaxed">Berbagai komunitas masyarakat berperan aktif dalam mendukung kegiatan sosial, olahraga, pelestarian lingkungan, serta pengembangan Desa Wisata Pandansari sehingga tercipta desa yang dinamis dan harmonis.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ FEATURED DESTINATIONS ══════════════════════════════ -->
    <section class="section-padding bg-white">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionTitle
            label="Destinasi Wisata"
            title="Jelajahi Keindahan Pandansari"
            description="Dari petualangan air hingga bukit panoramik — setiap sudut Pandansari menyimpan cerita indah."
          />
          <RouterLink to="/destinasi" class="btn-outline text-sm shrink-0 self-start md:self-end mb-12 md:mb-0">
            Lihat Semua →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DestinationCard
            v-for="(dest, i) in featuredDestinations"
            :key="dest.id"
            :destination="dest"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          />
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ COMMUNITIES ══════════════════════════════ -->
    <section class="section-padding" style="background-color: #EEF5E3;">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionTitle
            label="Komunitas Aktif"
            title="Semangat Gotong Royong Warga"
            description="Komunitas-komunitas dinamis yang menjadi kekuatan sosial dan budaya Desa Pandansari."
          />
          <RouterLink to="/komunitas" class="btn-outline text-sm shrink-0 self-start md:self-end mb-12 md:mb-0">
            Semua Komunitas →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CommunityCard
            v-for="(comm, i) in featuredCommunities"
            :key="comm.id"
            :community="comm"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          />
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ UMKM ══════════════════════════════ -->
    <section class="section-padding bg-white">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionTitle
            label="UMKM & Ekonomi Lokal"
            title="Produk Unggulan Desa"
            description="UMKM lokal yang menjadi motor penggerak perekonomian Desa Pandansari."
          />
          <RouterLink to="/umkm" class="btn-outline text-sm shrink-0 self-start md:self-end mb-12 md:mb-0">
            Semua UMKM →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UMKMCard
            v-for="(umkm, i) in featuredUMKM"
            :key="umkm.id"
            :umkm="umkm"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          />
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ ARTICLES ══════════════════════════════ -->
    <section class="section-padding" style="background-color: #EEF5E3;">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionTitle
            label="Artikel Terbaru"
            title="Berita & Informasi Desa"
            description="Kabar terkini, kegiatan, dan cerita inspiratif dari Desa Pandansari."
          />
          <RouterLink to="/artikel" class="btn-outline text-sm shrink-0 self-start md:self-end mb-12 md:mb-0">
            Semua Artikel →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="(article, i) in featuredArticles"
            :key="article.id"
            :article="article"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          />
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════ GALLERY ══════════════════════════════ -->
    <section class="section-padding bg-white">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionTitle
            label="Galeri"
            title="Momen Indah Pandansari"
            description="Cuplikan keindahan alam, budaya, dan kehidupan Desa Pandansari."
          />
        </div>
        <GalleryGrid :images="galleryImages" :columns="3" />
      </div>
    </section>

    <!-- ══════════════════════════════ CTA ══════════════════════════════ -->
    <CtaSection />
  </DefaultLayout>
</template>
