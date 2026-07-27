import communities from '@/mock/communities'

export async function getCommunities() {
  return Promise.resolve(communities)
}

export async function getFeaturedCommunities(limit = 3) {
  return Promise.resolve(communities.filter((c) => c.featured).slice(0, limit))
}

export async function getCommunityBySlug(slug) {
  const item = communities.find((c) => c.slug === slug)
  return Promise.resolve(item ?? null)
}
