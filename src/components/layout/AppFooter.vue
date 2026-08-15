<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPinIcon, PhoneIcon, MailIcon } from '@lucide/vue'
import { getContactInfo } from '@/services/contact.service'
import { getDestinations } from '@/services/destination.service'

const quickLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil Desa' },
  { to: '/destinasi', label: 'Destinasi Wisata' },
  { to: '/komunitas', label: 'Komunitas' },
  { to: '/umkm', label: 'Potensi & Ekonomi' },
  { to: '/artikel', label: 'Artikel' },
  { to: '/e-booklet', label: 'E-Booklet' },
  { to: '/kontak', label: 'Kontak' },
]

const destinations = [
  { to: '/destinasi/tubing-pandansari', label: 'Tubing Pandansari' },
  { to: '/destinasi/outbound-adventure', label: 'Outbound Adventure' },
  { to: '/destinasi/river-camp-pandansari', label: 'River Camp' },
  { to: '/destinasi/wisata-gege', label: 'Wisata Bukit Gege' },
  { to: '/destinasi/riverside-walk', label: 'Riverside Walk' },
  { to: '/destinasi/agrowisata-pandansari', label: 'Agrowisata' },
]

const dynamicDestinations = ref([])
const currentYear = new Date().getFullYear()

const contact = ref(null)

onMounted(async () => {
  contact.value = await getContactInfo()
  try {
    const dests = await getDestinations({ perPage: 6 })
    if (dests && dests.data && dests.data.length > 0) {
      dynamicDestinations.value = dests.data.map(d => ({
        to: `/destinasi/${d.slug}`,
        label: d.title
      }))
    } else {
      dynamicDestinations.value = destinations
    }
  } catch (e) {
    dynamicDestinations.value = destinations
  }
})

// Helpers to build hrefs safely
function phoneHref(p) { return p ? `tel:${p.replace(/\s/g, '')}` : '#' }
function waHref(p) {
  if (!p) return '#'
  // Strip non-digit, ensure starts with country code
  const digits = p.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}
function mailHref(e) { return e ? `mailto:${e}` : '#' }
</script>

<template>
  <footer style="background-color: #2f4a3a" class="text-white">
    <!-- Main Footer -->
    <div class="container-site py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand Column -->
        <div class="lg:col-span-1">
          <RouterLink to="/" class="flex flex-col justify-center group mb-6 w-max">
            <span
              class="text-[10px] uppercase font-bold tracking-[0.3em] text-primary transition-all duration-300 group-hover:tracking-[0.4em]"
            >
              Desa Wisata
            </span>
            <span
              class="font-heading font-black text-3xl tracking-tight leading-none mt-1.5 text-white transition-colors duration-300 group-hover:text-gray-200"
            >
              Pandansari<span class="text-primary">.</span>
            </span>
          </RouterLink>
          <p class="text-sm text-white/70 leading-relaxed mb-5">
            Desa wisata alam terpadu di Kecamatan Batang. Nikmati keindahan alam dan keramahan Desa
            Pandansari
          </p>
          <!-- Social Media (dynamic) -->
          <div v-if="contact" class="flex items-center gap-3">
            <a
              v-if="contact.socialMedia.facebook"
              :href="contact.socialMedia.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:text-heading transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              v-if="contact.socialMedia.instagram"
              :href="contact.socialMedia.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:text-heading transition-colors"
              aria-label="Instagram"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              v-if="contact.socialMedia.youtube"
              :href="contact.socialMedia.youtube"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:text-heading transition-colors"
              aria-label="YouTube"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
            </a>
            <a
              v-if="contact.socialMedia.tiktok"
              :href="contact.socialMedia.tiktok"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:text-heading transition-colors"
              aria-label="TikTok"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.73a4.85 4.85 0 01-1.02-.04z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-4">
            Menu Cepat
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm text-white/65 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <span
                  class="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                ></span>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Destinations -->
        <div>
          <h3 class="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-4">
            Destinasi
          </h3>
          <ul class="space-y-2.5">
            <li v-for="dest in dynamicDestinations" :key="dest.to">
              <RouterLink
                :to="dest.to"
                class="text-sm text-white/65 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <span
                  class="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                ></span>
                {{ dest.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact (dynamic) -->
        <div>
          <h3 class="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-4">
            Kontak
          </h3>
          <template v-if="contact">
            <ul class="space-y-3.5">
              <li v-if="contact.address" class="flex gap-3 text-sm text-white/70">
                <MapPinIcon class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{{ contact.address }}</span>
              </li>
              <li v-if="contact.phone">
                <a
                  :href="phoneHref(contact.phone)"
                  class="flex gap-3 text-sm text-white/70 hover:text-primary transition-colors"
                >
                  <PhoneIcon class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{{ contact.phone }}</span>
                </a>
              </li>
              <li v-if="contact.email">
                <a
                  :href="mailHref(contact.email)"
                  class="flex gap-3 text-sm text-white/70 hover:text-primary transition-colors"
                >
                  <MailIcon class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{{ contact.email }}</span>
                </a>
              </li>
            </ul>

            <!-- WhatsApp CTA -->
            <a
              v-if="contact.whatsapp"
              :href="waHref(contact.whatsapp)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-5 inline-flex items-center gap-2 bg-success/90 hover:bg-success text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat WhatsApp
            </a>
          </template>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/10">
      <div
        class="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45"
      >
        <p>© {{ currentYear }} Desa Pandansari. Hak cipta dilindungi.</p>
        <p>Dirancang oleh TIM II KKN-R UNDIP 2026</p>
      </div>
    </div>
  </footer>
</template>
