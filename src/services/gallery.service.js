import gallery from '@/mock/gallery'

export async function getGallery({ category = '' } = {}) {
  let filtered = [...gallery]
  if (category) {
    filtered = filtered.filter((g) => g.category === category)
  }
  return Promise.resolve(filtered)
}

export async function getGalleryPreview(limit = 6) {
  return Promise.resolve(gallery.slice(0, limit))
}
