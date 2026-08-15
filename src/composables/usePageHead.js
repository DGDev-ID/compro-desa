import { useHead } from '@unhead/vue'
import { ref, computed } from 'vue'
import api from '@/api/axios'

// @unhead/vue v2 – requires createUnhead() called in main.ts and VueHeadMixin applied

const envAppName = import.meta.env.VITE_APP_NAME || 'Desa Pandansari'
const BASE_DESCRIPTION =
  'Website resmi Desa Pandansari, Kecamatan Batang, Kabupaten Batang, Jawa Tengah. Desa wisata alam yang indah.'

// Store global SEO data reactively so all pages automatically update when data is fetched
const globalSeoData = ref(null)
let fetchPromise = null

function fetchGlobalSeo() {
  if (globalSeoData.value) return
  if (!fetchPromise) {
    fetchPromise = api.get('/profil').then(res => {
      globalSeoData.value = res.data.data.setting || {}
    }).catch(e => {
      console.error('[usePageHead] Failed to fetch SEO settings:', e)
    })
  }
}

/**
 * Composable for setting page <head> meta tags.
 * Usage: usePageHead({ title: 'Destinasi Wisata', description: '...' })
 */
export function usePageHead({ title, description, image, url } = {}) {
  // Trigger the fetch if not already done
  fetchGlobalSeo()

  const pageTitle = computed(() => {
    const appName = globalSeoData.value?.nama_website || envAppName
    if (title) return `${title} – ${appName}`
    return globalSeoData.value?.meta_title || appName
  })

  const pageDesc = computed(() => {
    if (description) return description
    return globalSeoData.value?.meta_description || globalSeoData.value?.footer_description || BASE_DESCRIPTION
  })

  const pageImage = computed(() => {
    return image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80'
  })

  useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDesc },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDesc },
      { property: 'og:image', content: pageImage },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDesc },
      { name: 'twitter:image', content: pageImage },
    ],
  })
}
