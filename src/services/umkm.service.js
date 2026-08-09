import api from '@/api/axios'

/**
 * Normalize a single UMKM item from backend fields → frontend fields.
 */
function normalizeUmkm(item) {
  return {
    ...item,
    // Field mapping
    name: item.nama,
    description: item.deskripsi,
    shortDescription: item.deskripsi, // backend hanya punya satu field deskripsi
    owner: item.pemilik,
    established: item.tahun_berdiri,
    phone: item.whatsapp,
    thumbnail: item.thumbnail_url || item.thumbnail,
    logo: item.logo_url || item.logo,
    category: item.category?.nama || '',
    categorySlug: item.category?.slug || '',
    // koordinat
    coordinates: item.coordinate
      ? (() => {
          try {
            const coords = typeof item.coordinate === 'string'
              ? JSON.parse(item.coordinate)
              : item.coordinate
            return coords
          } catch {
            return null
          }
        })()
      : null,
    // social media (flat fields → object)
    socialMedia: {
      instagram: item.instagram || null,
      facebook: item.facebook || null,
      marketplace: item.marketplace || null,
      whatsapp: item.whatsapp || null,
    },
  }
}

/**
 * Normalize UMKM detail (includes photos_urls).
 */
function normalizeUmkmDetail(item) {
  const base = normalizeUmkm(item)
  return {
    ...base,
    gallery: item.photos_urls || [],
  }
}

/**
 * Fetch paginated UMKM list.
 */
export async function getUMKMList({
  page = 1,
  perPage = 12,
  category = '',
  search = '',
} = {}) {
  const params = { page, per_page: perPage }
  if (category) params.category = category
  if (search) params.search = search

  const res = await api.get('/umkm', { params })
  const paginated = res.data

  return {
    data: (paginated.data || []).map(normalizeUmkm),
    current_page: paginated.current_page,
    last_page: paginated.last_page,
    per_page: paginated.per_page,
    total: paginated.total,
  }
}

/**
 * Fetch featured UMKM only.
 */
export async function getFeaturedUMKM(limit = 3) {
  const res = await api.get('/umkm', {
    params: { featured: true, per_page: limit },
  })
  return (res.data.data || []).map(normalizeUmkm)
}

/**
 * Fetch a single UMKM by slug.
 * Returns null if not found.
 */
export async function getUMKMBySlug(slug) {
  try {
    const res = await api.get(`/umkm/${slug}`)
    return normalizeUmkmDetail(res.data.data)
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}

/**
 * Fetch UMKM categories.
 */
export async function getUMKMCategories() {
  const res = await api.get('/umkm-kategori')
  return (res.data.data || []).map((c) => ({
    slug: c.slug,
    label: c.nama,
    icon: c.icon || '🏪',
    description: c.deskripsi || '',
  }))
}
