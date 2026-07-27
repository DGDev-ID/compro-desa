import destinations from '@/mock/destinations'

/**
 * Fetch all destinations.
 * Production: return api.get('/destinations')
 */
export async function getDestinations() {
  return Promise.resolve(destinations)
}

/**
 * Fetch featured destinations only.
 */
export async function getFeaturedDestinations() {
  return Promise.resolve(destinations.filter((d) => d.featured))
}

/**
 * Fetch a single destination by slug.
 * Production: return api.get(`/destinations/${slug}`)
 */
export async function getDestinationBySlug(slug) {
  const item = destinations.find((d) => d.slug === slug)
  return Promise.resolve(item ?? null)
}

/**
 * Fetch related destinations (exclude current slug, max 3).
 */
export async function getRelatedDestinations(currentSlug, limit = 3) {
  const related = destinations.filter((d) => d.slug !== currentSlug).slice(0, limit)
  return Promise.resolve(related)
}
