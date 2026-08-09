import api from '@/api/axios'

/**
 * Fetch global stats from backend (/api/v1/stats).
 * Returns an array in the same format as the old mock/statistics.js
 * so StatisticCard components can be reused without changes.
 *
 * Backend returns: { data: { destinasi, umkm, komunitas, artikel } }
 * We merge with static entries (visitors, population) that are not tracked by backend.
 */
export async function getStats() {
  const res = await api.get('/stats')
  const d = res.data.data || {}

  return [
    {
      id: 'destinations',
      value: d.destinasi ?? 0,
      label: 'Destinasi Wisata',
      suffix: '+',
      icon: 'MapPin',
      description: 'Destinasi alam & petualangan',
    },
    {
      id: 'umkm',
      value: d.umkm ?? 0,
      label: 'UMKM Aktif',
      suffix: '+',
      icon: 'Store',
      description: 'Usaha mikro & kecil lokal',
    },
    {
      id: 'communities',
      value: d.komunitas ?? 0,
      label: 'Komunitas Aktif',
      suffix: '',
      icon: 'Users',
      description: 'Komunitas sosial & olahraga',
    },
    {
      id: 'articles',
      value: d.artikel ?? 0,
      label: 'Artikel Terbit',
      suffix: '',
      icon: 'FileText',
      description: 'Berita & informasi desa',
    },
  ]
}
