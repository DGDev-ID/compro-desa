import articles, { articleCategories } from '@/mock/articles'

export async function getArticles({ page = 1, perPage = 6, category = 'semua', search = '' } = {}) {
  let filtered = [...articles]

  if (category && category !== 'semua') {
    filtered = filtered.filter((a) => a.categorySlug === category)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
    )
  }

  const total = filtered.length
  const lastPage = Math.ceil(total / perPage)
  const data = filtered.slice((page - 1) * perPage, page * perPage)

  return Promise.resolve({ data, current_page: page, last_page: lastPage, per_page: perPage, total })
}

export async function getFeaturedArticles(limit = 3) {
  return Promise.resolve(articles.filter((a) => a.featured).slice(0, limit))
}

export async function getArticleBySlug(slug) {
  const item = articles.find((a) => a.slug === slug)
  return Promise.resolve(item ?? null)
}

export async function getRelatedArticles(currentSlug, categorySlug, limit = 3) {
  const related = articles
    .filter((a) => a.slug !== currentSlug && a.categorySlug === categorySlug)
    .slice(0, limit)
  return Promise.resolve(related)
}

export async function getCategories() {
  return Promise.resolve(articleCategories)
}
