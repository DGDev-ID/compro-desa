import api from '@/api/axios'

/**
 * Normalize a single article from backend fields → frontend fields
 */
function normalizeArticle(item) {
  return {
    ...item,
    // Field mapping
    title: item.judul,
    excerpt: item.ringkasan,
    content: item.isi,
    author: item.pengarang || item.user?.name || '',
    authorAvatar: item.author_avatar_url || item.user?.avatar_url || null,
    publishedAt: item.published_at,
    readingTime: item.perkiraan_membaca,
    thumbnail: item.thumbnail_url || item.thumbnail,
    cover: item.cover_url || item.cover,
    category: item.category?.nama || '',
    categorySlug: item.category?.slug || '',
    tags: item.tags || [],
    featured: item.featured,
  }
}

/**
 * Fetch paginated articles from backend.
 */
export async function getArticles({
  page = 1,
  perPage = 6,
  category = '',
  search = '',
  featured = null,
} = {}) {
  const params = { page, per_page: perPage }
  if (category && category !== 'semua') params.category = category
  if (search) params.search = search
  if (featured) params.featured = true

  const res = await api.get('/artikel', { params })
  const paginated = res.data

  return {
    data: (paginated.data || []).map(normalizeArticle),
    current_page: paginated.current_page,
    last_page: paginated.last_page,
    per_page: paginated.per_page,
    total: paginated.total,
  }
}

/**
 * Fetch featured articles (up to `limit` items).
 */
export async function getFeaturedArticles(limit = 3) {
  const res = await api.get('/artikel', {
    params: { featured: true, per_page: limit },
  })
  return (res.data.data || []).map(normalizeArticle)
}

/**
 * Fetch a single article by slug.
 * Returns null if not found.
 */
export async function getArticleBySlug(slug) {
  try {
    const res = await api.get(`/artikel/${slug}`)
    return normalizeArticle(res.data.data)
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}

/**
 * Fetch related articles (same category, exclude current slug).
 */
export async function getRelatedArticles(currentSlug, categorySlug, limit = 3) {
  const params = { per_page: limit + 1 }
  if (categorySlug) params.category = categorySlug

  const res = await api.get('/artikel', { params })
  return (res.data.data || [])
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit)
    .map(normalizeArticle)
}

/**
 * Fetch all article categories.
 * Prepends a "Semua" entry for filter UI.
 */
export async function getCategories() {
  const res = await api.get('/artikel-kategori')
  const cats = (res.data.data || []).map((c) => ({
    slug: c.slug,
    label: c.nama,
  }))
  return [{ slug: 'semua', label: 'Semua' }, ...cats]
}
