import profile from '@/mock/profile'

/**
 * Fetch the village profile data.
 * Switch to: import api from '@/api/axios'; return api.get('/profile')
 */
export async function getProfile() {
  return Promise.resolve(profile)
}
