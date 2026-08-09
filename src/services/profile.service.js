import api from '@/api/axios'

/**
 * Fetch the village profile data from backend.
 * Normalizes the combined response (profile + setting + contact + social_media)
 * to match the structure used by ProfilView and other components.
 */
export async function getProfile() {
  const [profileRes, officialsRes] = await Promise.all([
    api.get('/profil'),
    api.get('/perangkat'),
  ])

  const { profile, setting, contact, social_media } = profileRes.data.data
  const officials = officialsRes.data.data || []

  // Parse office hours — backend stores as single string or structured text
  // We keep it flexible: if it's already an array use it, otherwise wrap as single entry
  const officeHours = (() => {
    const raw = profile?.jam_operasional_kantor
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    // If it's a string, return as single info line
    return [{ day: 'Jam Operasional', hours: raw }]
  })()

  // Parse missions — may be JSON array or newline-separated string
  const missions = (() => {
    const raw = profile?.misi
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    // Try JSON parse first
    try { return JSON.parse(raw) } catch { /* not JSON */ }
    // Fall back: split by newline
    return raw.split('\n').filter(Boolean)
  })()

  // Build government structure from officials (perangkat)
  const kepala = officials.find((o) => /kepala desa/i.test(o.jabatan))
  const sekretaris = officials.find((o) => /sekretaris/i.test(o.jabatan))
  const staff = officials.filter(
    (o) =>
      !/kepala desa/i.test(o.jabatan) &&
      !/sekretaris/i.test(o.jabatan) &&
      !/kepala dusun|kadus/i.test(o.jabatan),
  )
  const dukuh = officials.filter((o) => /kepala dusun|kadus/i.test(o.jabatan))

  return {
    // Basic info
    name: profile?.nama_desa || setting?.nama_desa || '',
    tagline: setting?.tagline || '',
    description: profile?.tentang || '',
    shortDescription: profile?.tentang || '',
    address: profile?.alamat || contact?.alamat || '',
    phone: contact?.telepon || profile?.telepon || '',
    whatsapp: contact?.whatsapp || '',
    email: contact?.email || profile?.email || '',
    website: profile?.website || '',
    postalCode: '',
    coordinates: null,
    videoProfile: profile?.video_profil || null,
    googleMaps: profile?.google_maps || contact?.google_maps || null,

    officeHours,

    // Social media
    socialMedia: {
      facebook: social_media?.facebook || null,
      instagram: social_media?.instagram || null,
      youtube: social_media?.youtube || null,
      tiktok: social_media?.tiktok || null,
      twitter: social_media?.twitter || null,
    },

    // About section
    about: {
      history: profile?.sejarah || '',
      vision: profile?.visi || '',
      missions,
    },

    // Awards from profile.penghargaan (array of objects)
    awards: Array.isArray(profile?.penghargaan) ? profile.penghargaan : [],

    // Government structure from perangkat endpoint
    government: {
      kepala: kepala
        ? {
            name: kepala.nama,
            title: kepala.jabatan,
            period: kepala.periode || '',
            photo: kepala.foto_url || null,
          }
        : null,
      sekretaris: sekretaris
        ? {
            name: sekretaris.nama,
            title: sekretaris.jabatan,
            photo: sekretaris.foto_url || null,
          }
        : null,
      staff: staff.map((o) => ({ name: o.nama, title: o.jabatan })),
      dukuh: dukuh.map((o) => ({
        name: o.nama,
        title: o.jabatan,
        rw: o.wilayah || '',
      })),
    },

    // Population data from profile
    jumlahPenduduk: profile?.jumlah_penduduk || null,
    luasWilayah: profile?.luas_wilayah || null,

    // timeline is not in backend — keep undefined so view can fallback to hardcode
    timeline: undefined,
  }
}
