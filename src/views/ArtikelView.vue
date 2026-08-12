<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { usePagination } from '@/composables/usePagination'
import { getArticles, getCategories } from '@/services/article.service'
import { SearchIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'

usePageHead({
  title: 'Artikel',
  description: 'Baca artikel terbaru, berita, dan informasi seputar Desa Pandansari.',
})

const route = useRoute()
const router = useRouter()

const articles = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref(route.query.q || '')
const activeCategory = ref(route.query.cat || 'semua')

const pagination = usePagination(6)

async function loadArticles(page = 1) {
  loading.value = true
  const res = await getArticles({
    page,
    perPage: pagination.perPage.value,
    category: activeCategory.value,
    search: searchQuery.value,
  })
  articles.value = res.data
  pagination.setMeta(res)
  loading.value = false
}

async function init() {
  categories.value = await getCategories()
  await loadArticles(1)
}

function onSearch() {
  router.replace({ query: { q: searchQuery.value, cat: activeCategory.value } })
  loadArticles(1)
}

function setCategory(slug) {
  activeCategory.value = slug
  searchQuery.value = ''
  loadArticles(1)
}

function onPageChange(page) {
  pagination.goToPage(page)
  loadArticles(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(init)
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="/pict9.webp"
        alt="Artikel Desa Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Informasi Terkini</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Artikel & Berita</h1>
        </div>
      </div>
    </section>

    <section class="section-padding bg-background">
      <div class="container-site">
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Content -->
          <div class="flex-1">
            <!-- Search -->
            <form class="relative mb-6" @submit.prevent="onSearch">
              <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body" />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Cari artikel..."
                class="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>

            <!-- Loading -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="n in 6" :key="n" class="card-base overflow-hidden">
                <div class="skeleton h-40 w-full" />
                <div class="p-4 space-y-2">
                  <div class="skeleton h-4 w-20 rounded-full" />
                  <div class="skeleton h-5 w-full rounded-lg" />
                  <div class="skeleton h-3.5 w-3/4 rounded-md" />
                </div>
              </div>
            </div>

            <EmptyState v-else-if="articles.length === 0" title="Artikel tidak ditemukan" />

            <div v-else>
              <!-- Featured (first article) -->
              <div v-if="pagination.currentPage.value === 1 && activeCategory.value === 'semua' && !searchQuery && articles[0]" class="mb-8">
                <RouterLink :to="`/artikel/${articles[0].slug}`" class="card-base flex flex-col md:flex-row overflow-hidden group">
                  <div class="card-img-wrap md:w-5/12 aspect-video md:aspect-auto">
                    <img :src="articles[0].thumbnail" :alt="articles[0].title" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div class="p-6 flex flex-col justify-center md:w-7/12">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="badge badge-primary">{{ articles[0].category }}</span>
                      <span class="badge badge-forest">Unggulan</span>
                    </div>
                    <h2 class="font-heading font-bold text-heading text-xl mb-2 line-clamp-2 group-hover:text-forest transition-colors">
                      {{ articles[0].title }}
                    </h2>
                    <p class="text-body text-sm leading-relaxed line-clamp-2 mb-4">{{ articles[0].excerpt }}</p>
                    <span class="text-xs text-body">
                      {{ new Date(articles[0].publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                      · {{ articles[0].readingTime }} menit baca
                    </span>
                  </div>
                </RouterLink>
              </div>

              <!-- Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ArticleCard
                  v-for="(article, i) in (pagination.currentPage.value === 1 && !searchQuery && activeCategory.value === 'semua' ? articles.slice(1) : articles)"
                  :key="article.id"
                  :article="article"
                  data-aos="fade-up"
                  :data-aos-delay="(i % 2) * 60"
                />
              </div>

              <!-- Pagination -->
              <div class="mt-10">
                <AppPagination
                  :current-page="pagination.currentPage.value"
                  :last-page="pagination.lastPage.value"
                  :pages="pagination.pages.value"
                  @change="onPageChange"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="lg:w-64 shrink-0">
            <!-- Categories -->
            <div class="card-base p-5 mb-5">
              <h3 class="font-heading font-semibold text-heading mb-4 text-sm">Kategori</h3>
              <ul class="space-y-1">
                <li v-for="cat in categories" :key="cat.slug">
                  <button
                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    :class="
                      activeCategory === cat.slug
                        ? 'bg-alt text-forest font-semibold'
                        : 'text-body hover:bg-alt hover:text-forest'
                    "
                    @click="setCategory(cat.slug)"
                  >
                    {{ cat.label }}
                  </button>
                </li>
              </ul>
            </div>

            <!-- Total info -->
            <div class="card-base p-5 bg-alt">
              <p class="text-sm text-body">
                Menampilkan <strong class="text-heading">{{ articles.length }}</strong> dari
                <strong class="text-heading">{{ pagination.total.value }}</strong> artikel
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <CtaSection />
  </DefaultLayout>
</template>
