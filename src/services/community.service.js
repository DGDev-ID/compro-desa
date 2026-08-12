import api from '@/api/axios'

/**
 * Normalize a single community item from backend fields → frontend fields.
 */
function normalizeCommunity(item) {
  return {
    ...item,
    // Field mapping
    name: item.nama,
    fullName: item.nama_lengkap || item.nama,
    description: item.tentang,
    shortDescription: item.deskripsi_singkat || (item.tentang ? item.tentang.slice(0, 150) + '...' : ''),
    founded: item.tahun_berdiri,
    memberCount: item.jumlah_anggota,
    achievements: (() => {
      if (!item.prestasi) return []
      if (Array.isArray(item.prestasi)) return item.prestasi
      return item.prestasi.split('\n').filter(Boolean)
    })(),
    thumbnail: item.thumbnail_url || item.thumbnail,
    category: item.category?.nama || '',
    categorySlug: item.category?.slug || '',
    // Contact info
    contact: {
      ketua: item.ketua || '',
      phone: item.kontak || item.whatsapp || '',
      instagram: item.instagram || '',
      facebook: item.facebook || '',
      website: item.website || '',
      whatsapp: item.whatsapp || '',
    },
  }
}

/**
 * Normalize community detail (includes photos_urls).
 */
function normalizeCommunityDetail(item) {
  const base = normalizeCommunity(item)
  return {
    ...base,
    gallery: item.photos_urls || [],
    visi: item.visi || '',
    misi: item.misi || '',
    kegiatan: item.kegiatan || '',
    kontribusi: item.kontribusi || '',
  }
}

/**
 * Fetch paginated communities.
 */
export async function getCommunities({ page = 1, perPage = 12, search = '' } = {}) {
  const params = { page, per_page: perPage }
  if (search) params.search = search

  const res = await api.get('/komunitas', { params })
  const paginated = res.data

  return {
    data: (paginated.data || []).map(normalizeCommunity),
    current_page: paginated.current_page,
    last_page: paginated.last_page,
    per_page: paginated.per_page,
    total: paginated.total,
  }
}

/**
 * Fetch featured communities (no native featured filter — sort by latest, take limit).
 */
export async function getFeaturedCommunities(limit = 3) {
  const res = await api.get('/komunitas', { params: { per_page: limit } })
  return (res.data.data || []).map(normalizeCommunity)
}

/**
 * Fetch a single community by slug.
 * Returns null if not found.
 */
export async function getCommunityBySlug(slug) {
  try {
    const res = await api.get(`/komunitas/${slug}`)
    return normalizeCommunityDetail(res.data.data)
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}
