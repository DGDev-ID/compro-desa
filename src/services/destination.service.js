import api from '@/api/axios'

/**
 * Normalize a destination list item (harga sudah jadi array/object dari backend).
 */
function normalizeDestination(item) {
  return {
    ...item,
    // Field mapping
    title: item.nama,
    short_description: item.deskripsi_singkat,
    description: item.deskripsi_lengkap,
    facilities: item.fasilitas || [],
    openHours: item.jam_operasional,
    capacity: item.kapasitas,
    minAge: item.usia_minimum,
    certifications: item.sertifikat || [],
    thumbnail: item.thumbnail_url || item.thumbnail,
    category: item.category?.nama || '',
    categorySlug: item.category?.slug || '',
    tags: item.tags || [],
    // harga sudah di-cast sebagai array/object oleh backend
    price: item.harga || null,
    // koordinat
    coordinates: (item.latitude && item.longitude)
      ? { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }
      : null,
  }
}

/**
 * Normalize a destination detail (includes gallery_urls & packages).
 */
function normalizeDestinationDetail(item) {
  const base = normalizeDestination(item)
  return {
    ...base,
    gallery: item.gallery_urls || [],
    packages: item.packages || [],
  }
}

/**
 * Fetch paginated destinations.
 */
export async function getDestinations({
  page = 1,
  perPage = 12,
  category = '',
  search = '',
  featured = null,
} = {}) {
  const params = { page, per_page: perPage }
  if (category) params.category = category
  if (search) params.search = search
  if (featured) params.featured = true

  const res = await api.get('/destinasi', { params })
  const paginated = res.data

  return {
    data: (paginated.data || []).map(normalizeDestination),
    current_page: paginated.current_page,
    last_page: paginated.last_page,
    per_page: paginated.per_page,
    total: paginated.total,
  }
}

/**
 * Fetch featured destinations only.
 */
export async function getFeaturedDestinations(limit = 6) {
  const res = await api.get('/destinasi', {
    params: { featured: true, per_page: limit },
  })
  return (res.data.data || []).map(normalizeDestination)
}

/**
 * Fetch a single destination by slug (includes gallery & packages).
 * Returns null if not found.
 */
export async function getDestinationBySlug(slug) {
  try {
    const res = await api.get(`/destinasi/${slug}`)
    return normalizeDestinationDetail(res.data.data)
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}

/**
 * Fetch related destinations (exclude current slug, max `limit`).
 */
export async function getRelatedDestinations(currentSlug, limit = 3) {
  const res = await api.get('/destinasi', { params: { per_page: limit + 1 } })
  return (res.data.data || [])
    .filter((d) => d.slug !== currentSlug)
    .slice(0, limit)
    .map(normalizeDestination)
}

/**
 * Fetch destination categories.
 */
export async function getDestinationCategories() {
  const res = await api.get('/destinasi-kategori')
  return res.data.data || []
}
