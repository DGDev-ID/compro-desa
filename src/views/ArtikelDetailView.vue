<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import ArticleCard from '@/components/article/ArticleCard.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { getArticleBySlug, getRelatedArticles } from '@/services/article.service'
import { CalendarIcon, ClockIcon, UserIcon, Share2Icon, LinkIcon } from '@lucide/vue'

const route = useRoute()
const article = ref(null)
const related = ref([])
const loading = ref(true)
const notFound = ref(false)
const copied = ref(false)

async function loadData(slug) {
  loading.value = true
  notFound.value = false
  const data = await getArticleBySlug(slug)
  if (!data) { notFound.value = true; loading.value = false; return }
  article.value = data
  related.value = await getRelatedArticles(slug, data.categorySlug || data.category?.slug, 3)
  loading.value = false
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(() => loadData(route.params.slug))
watch(() => route.params.slug, (s) => { if (s) { loadData(s); window.scrollTo({ top: 0 }) } })
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="pt-24 min-h-screen flex items-center justify-center">
      <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>

    <div v-else-if="notFound" class="pt-24 min-h-screen flex items-center justify-center text-center">
      <div>
        <span class="text-6xl mb-4 block">📰</span>
        <h2 class="font-heading font-bold text-heading text-2xl mb-2">Artikel tidak ditemukan</h2>
        <RouterLink to="/artikel" class="btn-primary mt-4">← Kembali ke Artikel</RouterLink>
      </div>
    </div>

    <template v-else-if="article">
      <!-- Breadcrumb -->
      <div class="pt-24 pb-4 bg-white border-b border-border">
        <div class="container-site">
          <AppBreadcrumb
            :items="[
              { label: 'Artikel', to: '/artikel' },
              { label: article.category, to: `/artikel?cat=${article.categorySlug}` },
              { label: article.title },
            ]"
          />
        </div>
      </div>

      <!-- Hero Image -->
      <div class="aspect-[16/6] overflow-hidden">
        <img :src="article.thumbnail" :alt="article.title" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <article class="section-padding bg-white">
        <div class="container-site max-w-3xl mx-auto">
          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <AppBadge :label="article.category" variant="primary" />
          </div>

          <h1 class="font-heading font-bold text-heading text-2xl md:text-4xl leading-tight mb-5">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-5 text-sm text-body mb-8 pb-6 border-b border-border">
            <span class="flex items-center gap-1.5">
              <img :src="article.authorAvatar" :alt="article.author" class="w-7 h-7 rounded-full" />
              {{ article.author }}
            </span>
            <span class="flex items-center gap-1.5">
              <CalendarIcon class="w-4 h-4 text-forest" />
              {{ formatDate(article.publishedAt) }}
            </span>
            <span class="flex items-center gap-1.5">
              <ClockIcon class="w-4 h-4 text-forest" />
              {{ article.readingTime }} menit baca
            </span>
          </div>

          <!-- Article Body -->
          <div class="space-y-4">
            <p
              v-for="(paragraph, i) in article.content.split('\n\n')"
              :key="i"
              class="text-body leading-relaxed text-base"
            >
              {{ paragraph }}
            </p>
          </div>

          <!-- Tags -->
          <div class="mt-8 pt-6 border-t border-border flex flex-wrap gap-2 items-center">
            <span class="text-xs text-body font-medium">Tags:</span>
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="text-xs px-3 py-1 bg-alt text-forest rounded-full border border-border hover:bg-primary/20 transition-colors cursor-pointer"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Share -->
          <div class="mt-6 pt-6 border-t border-border">
            <p class="text-sm font-medium text-heading mb-3 flex items-center gap-2">
              <Share2Icon class="w-4 h-4 text-forest" />
              Bagikan Artikel
            </p>
            <div class="flex gap-3 flex-wrap">
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`"
                target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`"
                target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-full text-sm hover:bg-sky-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </a>
              <button
                class="flex items-center gap-2 px-4 py-2 bg-alt text-forest rounded-full text-sm border border-border hover:bg-primary/20 transition-colors"
                @click="copyLink"
              >
                <LinkIcon class="w-4 h-4" />
                {{ copied ? 'Tersalin!' : 'Salin Link' }}
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- Related Articles -->
      <section v-if="related.length" class="section-padding" style="background-color: #EEF5E3;">
        <div class="container-site">
          <div class="flex items-end justify-between mb-8">
            <div>
              <span class="section-label mb-2">Artikel Terkait</span>
              <h2 class="font-heading font-bold text-heading text-2xl">Baca Juga</h2>
            </div>
            <RouterLink to="/artikel" class="btn-outline text-sm">Semua Artikel</RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleCard
              v-for="(art, i) in related"
              :key="art.id"
              :article="art"
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
