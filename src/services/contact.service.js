import api from '@/api/axios'

let _cache = null

/**
 * Fetch contact & social media info from the backend.
 * Returns a normalized contact object used by AppFooter and KontakView.
 * Result is cached so multiple components on the same page only call the API once.
 */
export async function getContactInfo() {
  if (_cache) return _cache

  try {
    const res = await api.get('/profil')
    const { contact, social_media, profile } = res.data.data

    _cache = {
      address: contact?.alamat || profile?.alamat || 'Desa Pandansari, Kec. Batang, Kab. Batang, Jawa Tengah',
      phone: contact?.telepon || profile?.telepon || '',
      whatsapp: contact?.whatsapp || contact?.telepon || profile?.telepon || '',
      email: contact?.email || profile?.email || '',
      googleMapsEmbed: contact?.google_maps || profile?.google_maps || null,
      officeHours: (() => {
        const raw = profile?.jam_operasional_kantor
        if (!raw) return null
        if (typeof raw === 'string') return raw
        return null
      })(),
      socialMedia: {
        facebook: social_media?.facebook || null,
        instagram: social_media?.instagram || null,
        youtube: social_media?.youtube || null,
        tiktok: social_media?.tiktok || null,
        twitter: social_media?.twitter || null,
      },
    }

    return _cache
  } catch (e) {
    console.error('[contact.service] Failed to load contact info:', e)
    // Return fallback so UI does not break
    return {
      address: '',
      phone: '',
      whatsapp: '',
      email: '',
      googleMapsEmbed: null,
      officeHours: null,
      socialMedia: { facebook: null, instagram: null, youtube: null, tiktok: null, twitter: null },
    }
  }
}
