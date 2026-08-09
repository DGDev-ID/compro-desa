import api from '@/api/axios'

/**
 * Normalize a single gallery item from backend fields → frontend fields.
 */
function normalizeGalleryItem(item) {
  return {
    ...item,
    id: item.id,
    src: item.file_url || item.file || '',
    thumb: item.thumbnail_url || item.file_url || item.file || '',
    alt: item.judul || '',
    caption: item.deskripsi || item.judul || '',
    category: item.kategori || '',
    featured: item.featured,
    videoUrl: item.video_url || null,
  }
}

/**
 * Fetch paginated gallery items.
 * @param {string} [category] - Filter by kategori
 * @param {number} [perPage]
 */
export async function getGallery({ category = '', perPage = 20 } = {}) {
  const params = { per_page: perPage }
  if (category) params.kategori = category

  const res = await api.get('/galeri', { params })
  return (res.data.data || []).map(normalizeGalleryItem)
}

/**
 * Fetch a preview of gallery items (for homepage).
 */
export async function getGalleryPreview(limit = 6) {
  const res = await api.get('/galeri', { params: { per_page: limit } })
  return (res.data.data || []).map(normalizeGalleryItem)
}
