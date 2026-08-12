/**
 * Static mock data for E-Booklet
 * Replace with API calls when backend is ready.
 *
 * pageImages: array of image URLs representing each page spread.
 * When backend is ready, this will come from the API (e.g. PDF pages converted to images).
 */
export const MOCK_EBOOKLETS = [
  {
    id: 1,
    title: 'E-Booklet Potensi Wisata Desa Pandansari',
    description:
      'E-booklet ini memuat berbagai informasi lengkap tentang potensi wisata alam, budaya, dan kuliner yang ada di Desa Pandansari. Temukan keindahan desa kami dan rencanakan kunjungan Anda bersama kami.',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85',
    fileUrl: '#', // Ganti dengan URL PDF / Google Drive ketika backend siap
    category: 'Wisata',
    publishedAt: '2025-01-15',
    pages: 8,
    fileSize: '2.4 MB',
    featured: true,
    // pageImages: halaman-halaman booklet (satu array = satu halaman)
    pageImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=85',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=85',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=85',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=85',
      'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=85',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=85',
    ],
  },
  {
    id: 2,
    title: 'Panduan UMKM & Produk Lokal Pandansari',
    description:
      'Mengenal berbagai produk unggulan UMKM Desa Pandansari — mulai dari kerajinan tangan, produk pertanian, hingga kuliner khas yang siap menemani aktivitas Anda sehari-hari.',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85',
    fileUrl: '#',
    category: 'UMKM',
    publishedAt: '2025-03-10',
    pages: 6,
    fileSize: '1.8 MB',
    featured: false,
    pageImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=85',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=85',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=85',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=85',
    ],
  },
  {
    id: 3,
    title: 'Profil Lengkap Desa Pandansari',
    description:
      'Gambaran komprehensif tentang sejarah, demografi, infrastruktur, dan program pembangunan Desa Pandansari. Cocok sebagai referensi bagi peneliti, pelajar, dan mitra desa.',
    cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=85',
    fileUrl: '#',
    category: 'Profil Desa',
    publishedAt: '2024-11-20',
    pages: 8,
    fileSize: '3.1 MB',
    featured: false,
    pageImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=85',
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&q=85',
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=85',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=85',
      'https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?w=600&q=85',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85',
      'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=600&q=85',
      'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600&q=85',
    ],
  },
  {
    id: 4,
    title: 'E-Booklet Budaya & Tradisi Lokal',
    description:
      'Kekayaan budaya dan tradisi Desa Pandansari terdokumentasi dalam satu panduan lengkap. Dari seni pertunjukan, upacara adat, hingga festival tahunan yang wajib Anda saksikan.',
    cover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=85',
    fileUrl: '#',
    category: 'Budaya',
    publishedAt: '2025-05-01',
    pages: 6,
    fileSize: '2.0 MB',
    featured: false,
    pageImages: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=85',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=85',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=85',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=85',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=85',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=85',
    ],
  },
]

export const MOCK_EBOOKLET_HERO = {
  title: 'E-Booklet Desa Pandansari',
  subtitle:
    'Unduh dan nikmati berbagai panduan digital tentang potensi, budaya, dan keindahan Desa Pandansari — gratis untuk semua.',
}

