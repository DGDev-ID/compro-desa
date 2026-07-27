import { useHead } from '@unhead/vue'
// @unhead/vue v2 – requires createUnhead() called in main.ts and VueHeadMixin applied

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Desa Pandansari'
const BASE_DESCRIPTION =
  'Website resmi Desa Pandansari, Kecamatan Batang, Kabupaten Batang, Jawa Tengah. Desa wisata alam yang indah.'

/**
 * Composable for setting page <head> meta tags.
 * Usage: usePageHead({ title: 'Destinasi Wisata', description: '...' })
 */
export function usePageHead({ title, description, image, url } = {}) {
  const pageTitle = title ? `${title} – ${APP_NAME}` : APP_NAME
  const pageDesc = description || BASE_DESCRIPTION
  const pageImage = image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80'

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
