<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MenuIcon, XIcon } from '@lucide/vue'

const route = useRoute()
const isScrolled = ref(false)
const mobileOpen = ref(false)

// Navbar solid di semua halaman KECUALI Home (path '/') sebelum di-scroll.
// Home tetap punya efek transparan -> solid saat scroll,
// semua halaman lain (detail, list, dll) langsung solid dari awal.
const isSolid = computed(() => isScrolled.value || route.path !== '/')

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/profil', label: 'Profil Desa' },
  { to: '/destinasi', label: 'Destinasi Wisata' },
  { to: '/komunitas', label: 'Komunitas' },
  { to: '/umkm', label: 'Potensi & Ekonomi' },
  { to: '/artikel', label: 'Artikel' },
  { to: '/e-booklet', label: 'E-Booklet' },
  { to: '/kontak', label: 'Kontak' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 60
}

function closeMobile() {
  mobileOpen.value = false
}

function isActive(link) {
  if (link.exact) return route.path === link.to
  return route.path.startsWith(link.to)
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isSolid ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent',
    ]"
  >
    <div class="container-site">
      <nav class="flex items-center justify-between h-18 md:h-20 py-3">
        <!-- Logo -->
        <RouterLink to="/" class="flex flex-col justify-center group py-1" @click="closeMobile">
          <span
            class="text-[10px] uppercase font-bold tracking-[0.3em] transition-all duration-300 group-hover:tracking-[0.4em]"
            :class="isSolid ? 'text-forest' : 'text-primary'"
          >
            Desa Wisata
          </span>
          <span
            class="font-heading font-black text-2xl md:text-[1.75rem] tracking-tight leading-none mt-1 transition-colors duration-300"
            :class="
              isSolid
                ? 'text-heading group-hover:text-forest'
                : 'text-white group-hover:text-primary'
            "
          >
            Pandansari<span class="text-primary">.</span>
          </span>
        </RouterLink>

        <!-- Desktop Menu -->
        <ul class="hidden lg:flex items-center gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium font-heading transition-colors duration-200 relative',
                isActive(link)
                  ? 'text-forest bg-primary/20'
                  : isSolid
                    ? 'text-heading hover:text-forest hover:bg-alt'
                    : 'text-white/90 hover:text-white hover:bg-white/10',
              ]"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <!-- CTA Button (desktop) -->
        <RouterLink to="/kontak" class="hidden lg:inline-flex btn-primary text-sm py-2.5 px-5">
          Hubungi Kami
        </RouterLink>

        <!-- Mobile Toggle -->
        <button
          class="lg:hidden p-2 rounded-lg transition-colors"
          :class="isSolid ? 'text-heading hover:bg-alt' : 'text-white hover:bg-white/10'"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <XIcon v-if="mobileOpen" class="w-6 h-6" />
          <MenuIcon v-else class="w-6 h-6" />
        </button>
      </nav>
    </div>

    <!-- Mobile Drawer -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileOpen" class="lg:hidden bg-white border-t border-border shadow-soft-lg">
        <div class="container-site py-4">
          <ul class="flex flex-col gap-1">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                :class="[
                  'flex items-center px-4 py-3 rounded-xl text-sm font-medium font-heading transition-colors',
                  isActive(link)
                    ? 'text-forest bg-alt font-semibold'
                    : 'text-heading hover:text-forest hover:bg-alt',
                ]"
                @click="closeMobile"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
          <div class="mt-4 pt-4 border-t border-border">
            <RouterLink to="/kontak" class="btn-primary w-full justify-center" @click="closeMobile">
              Hubungi Kami
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
