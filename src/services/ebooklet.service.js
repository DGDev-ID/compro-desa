import api from '@/api/axios'

/**
 * Normalize a single e-booklet item from backend fields → frontend fields.
 */
function normalizeEBooklet(item) {
  return {
    id: item.id,
    title: item.judul ?? item.title,
    description: item.deskripsi ?? item.description,
    cover: item.cover_url ?? item.cover ?? null,
    fileUrl: item.file_url ?? item.fileUrl ?? '#',
    category: item.kategori ?? item.category ?? '',
    publishedAt: item.published_at ?? item.publishedAt ?? null,
    pages: item.halaman ?? item.pages ?? null,
    fileSize: item.ukuran_file ?? item.fileSize ?? null,
    featured: item.featured ?? false,
    // page_images: backend returns array of full Storage URLs
    pageImages: item.page_images ?? item.pageImages ?? [],
  }
}

/**
 * Fetch all e-booklets from the API (paginated).
 * @param {object} params
 * @param {number}  params.page     - page number (default 1)
 * @param {number}  params.perPage  - items per page (default 12)
 * @param {string}  params.category - filter by kategori
 * @param {boolean} params.featured - filter featured only
 * @returns {Promise<Object[]>} flat array of normalized booklets
 */
export async function getEBooklets({ page = 1, perPage = 12, category, featured } = {}) {
  const params = { page, per_page: perPage }
  if (category) params.category = category
  if (featured) params.featured = 1

  const res = await api.get('/e-booklet', { params })
  const paginated = res.data

  // Backend returns Laravel paginator: { data: [...], current_page, last_page, ... }
  const items = (paginated.data ?? []).map(normalizeEBooklet)
  return items
}

/**
 * Fetch a single e-booklet by id from the API.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function getEBookletById(id) {
  try {
    const res = await api.get(`/e-booklet/${id}`)
    return normalizeEBooklet(res.data.data)
  } catch (e) {
    if (e.response?.status === 404) return null
    throw e
  }
}
