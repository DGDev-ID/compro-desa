import api from '@/api/axios'

/**
 * Fetch active banners from backend.
 */
export async function getBanners() {
  const res = await api.get('/banner')
  return (res.data.data || []).map((b) => ({
    image: b.background_image_url,
    caption: b.title || b.judul || '',
    subtitle: b.subtitle || '',
    link: b.link || '',
  }))
}
