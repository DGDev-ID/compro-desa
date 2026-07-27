import umkmData, { umkmCategories } from '@/mock/umkm'

export async function getUMKMList({ category = '' } = {}) {
  let filtered = [...umkmData]
  if (category) {
    filtered = filtered.filter((u) => u.categorySlug === category)
  }
  return Promise.resolve(filtered)
}

export async function getFeaturedUMKM(limit = 3) {
  return Promise.resolve(umkmData.filter((u) => u.featured).slice(0, limit))
}

export async function getUMKMBySlug(slug) {
  const item = umkmData.find((u) => u.slug === slug)
  return Promise.resolve(item ?? null)
}

export async function getUMKMCategories() {
  return Promise.resolve(umkmCategories)
}
