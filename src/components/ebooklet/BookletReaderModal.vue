<script setup>
import { ref, shallowRef, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import { PageFlip } from 'page-flip'
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  ZoomInIcon,
  ZoomOutIcon,
  LayoutGridIcon,
  Share2Icon
} from '@lucide/vue'

// ─── Props & Emits ────────────────────────────────────────────────────────────
const props = defineProps({
  booklet: {
    type: Object,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'download'])

// ─── State ────────────────────────────────────────────────────────────────────
const bookContainer = ref(null)
const pageFlipInstance = shallowRef(null)
const currentPage = ref(0)
const isFullscreen = ref(false)
const imagesLoaded = ref(false)
const loadingProgress = ref(0)
const showThumbs = ref(false)
const thumbsContainer = ref(null)

const totalPages = computed(() => props.booklet?.pageImages?.length ?? 0)
const pageLabel = computed(() => {
  if (totalPages.value === 0) return ''
  return `${currentPage.value} / ${totalPages.value - 1}`
})

// ─── PageFlip lifecycle ───────────────────────────────────────────────────────
let flipInitId = 0

async function initFlipBook() {
  const currentInitId = ++flipInitId

  if (!bookContainer.value || !props.booklet?.pageImages?.length) return

  destroyFlipBook()
  imagesLoaded.value = false
  loadingProgress.value = 0
  currentPage.value = 0

  const images = props.booklet.pageImages
  await preloadImages(images)

  if (currentInitId !== flipInitId) return

  // Berikan waktu sejenak agar container modal selesai transisi dan PageFlip punya waktu untuk render
  await new Promise(resolve => setTimeout(resolve, 400))

  if (currentInitId !== flipInitId || !bookContainer.value) return

  const containerW = bookContainer.value.parentElement.clientWidth
  const containerH = bookContainer.value.parentElement.clientHeight

  // Responsive logic maxing out available space for the book
  const pageH = Math.max(420, containerH - 60)
  // Two-page spread width
  const availableW = containerW - 240
  const pageWFromH = Math.round(pageH * 0.707)
  const pageWFromW = Math.round(availableW / 2)
  const pageW = Math.min(pageWFromH, pageWFromW, 800)
  const finalH = Math.min(pageH, Math.round(pageW / 0.707))

  const pf = new PageFlip(bookContainer.value, {
    width: pageW,
    height: finalH,
    size: 'fixed',
    minWidth: 260,
    maxWidth: 800,
    minHeight: 380,
    maxHeight: 1200,
    showCover: true,
    mobileScrollSupport: false,
    clickEventForward: true,
    usePortrait: false,
    startZIndex: 10,
    swipeDistance: 30,
    flippingTime: 650,
    useMouseEvents: true,
    drawShadow: true,
  })

  pf.loadFromImages(images)

  pf.on('flip', (e) => {
    currentPage.value = e.data
    scrollThumbIntoView(e.data)
  })

  pageFlipInstance.value = pf
  imagesLoaded.value = true // Sembunyikan loading screen setelah render selesai
}

function destroyFlipBook() {
  if (pageFlipInstance.value) {
    try { pageFlipInstance.value.destroy() } catch (_) {}
    pageFlipInstance.value = null
  }
}

function preloadImages(urls) {
  return new Promise((resolve) => {
    let loaded = 0
    const total = urls.length
    if (total === 0) { imagesLoaded.value = true; resolve(); return }

    urls.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        loaded++
        loadingProgress.value = Math.round((loaded / total) * 100)
        if (loaded === total) {
          resolve()
        }
      }
      img.src = src
    })
  })
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function prevPage() {
  pageFlipInstance.value?.flipPrev()
}
function nextPage() {
  pageFlipInstance.value?.flipNext()
}
function goToPage(index) {
  pageFlipInstance.value?.turnToPage(index)
  currentPage.value = index
}

function scrollThumbIntoView(index) {
  if (!thumbsContainer.value) return
  const thumb = thumbsContainer.value.children[index]
  if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

// ─── Fullscreen ───────────────────────────────────────────────────────────────
async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
function onKeyDown(e) {
  if (!props.open) return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage()
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage()
  if (e.key === 'Escape') emit('close')
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(
  () => props.open,
  async (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
      await nextTick()
      await initFlipBook()
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      destroyFlipBook()
    }
  },
)

onBeforeUnmount(() => {
  destroyFlipBook()
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeyDown)
})

function handleDownload() {
  emit('download', props.booklet)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] bg-[#52555A] flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="`Membaca: ${booklet?.title}`"
      >
        <!-- Absolute Close Button -->
        <button
          class="absolute top-4 right-6 z-50 text-white/40 hover:text-white transition-colors p-2"
          title="Tutup (Esc)"
          @click="$emit('close')"
        >
          <XIcon class="w-8 h-8" stroke-width="1.5" />
        </button>

        <!-- Absolute Prev/Next Navigation (Middle Edges) -->
        <button
          class="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white/30 hover:text-white transition-colors disabled:opacity-0"
          :disabled="currentPage === 0"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-16 h-16" stroke-width="1" />
        </button>
        <button
          class="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white/30 hover:text-white transition-colors disabled:opacity-0"
          :disabled="currentPage >= totalPages - 1"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-16 h-16" stroke-width="1" />
        </button>

        <!-- Loading overlay -->
        <Transition
          enter-active-class="transition-opacity duration-200"
          leave-active-class="transition-opacity duration-500"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div v-if="!imagesLoaded" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#52555A]">
             <div class="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
             <p class="text-white/70 text-sm font-body mt-4">Memuat halaman…</p>
             <div class="w-48 h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-300" :style="{ width: loadingProgress + '%' }" />
             </div>
             <p class="text-white/40 text-xs mt-2">{{ loadingProgress }}%</p>
          </div>
        </Transition>

        <!-- Book Stage -->
        <div class="flex-1 w-full h-full flex items-center justify-center relative z-10 p-6 pb-20">
          <div ref="bookContainer" class="shadow-2xl" />
        </div>

        <!-- Thumbstrip (Absolute above bottom toolbar) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div v-if="showThumbs && imagesLoaded" class="absolute bottom-[4.5rem] left-0 w-full bg-black/40 backdrop-blur-sm z-30 py-3 px-4 border-t border-white/10">
            <div ref="thumbsContainer" class="flex gap-3 overflow-x-auto justify-center pb-2 custom-scrollbar">
              <button
                v-for="(img, i) in booklet?.pageImages"
                :key="i"
                class="flex-shrink-0 flex flex-col items-center gap-1.5 transition-all p-1 rounded-md border-2"
                :class="currentPage === i ? 'border-white bg-white/20' : 'border-transparent hover:border-white/50'"
                @click="goToPage(i)"
              >
                <img :src="img" class="w-12 h-16 object-cover rounded-sm shadow-md" loading="lazy" />
                <span class="text-[10px] font-medium" :class="currentPage === i ? 'text-white' : 'text-white/60'">{{ i === 0 ? 'Cover' : i }}</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Floating Bottom Toolbar -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white rounded-md shadow-2xl flex items-center px-2 py-1.5 gap-1 text-gray-500">
          <button class="toolbar-btn" @click="prevPage" :disabled="currentPage === 0"><ChevronLeftIcon class="w-5 h-5"/></button>
          <span class="text-sm font-medium px-3 text-gray-700 min-w-[60px] text-center">{{ pageLabel }}</span>
          <button class="toolbar-btn" @click="nextPage" :disabled="currentPage >= totalPages - 1"><ChevronRightIcon class="w-5 h-5"/></button>
          
          <div class="w-px h-6 bg-gray-200 mx-2"></div>
          
          <button class="toolbar-btn" :class="{'text-primary bg-primary/10': showThumbs}" @click="showThumbs = !showThumbs" title="Thumbnails"><LayoutGridIcon class="w-4 h-4"/></button>
          <button class="toolbar-btn" title="Zoom In"><ZoomInIcon class="w-4 h-4"/></button>
          <button class="toolbar-btn" title="Zoom Out"><ZoomOutIcon class="w-4 h-4"/></button>
          <button class="toolbar-btn" title="Layar Penuh" @click="toggleFullscreen">
            <MinimizeIcon v-if="isFullscreen" class="w-4 h-4" />
            <MaximizeIcon v-else class="w-4 h-4" />
          </button>
          
          <div class="w-px h-6 bg-gray-200 mx-2"></div>
          
          <button class="toolbar-btn" title="Bagikan"><Share2Icon class="w-4 h-4"/></button>
          <button class="toolbar-btn" title="Unduh PDF" @click="handleDownload" :disabled="booklet?.fileUrl === '#'"><DownloadIcon class="w-4 h-4"/></button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.toolbar-btn:hover:not(:disabled) {
  background-color: #f3f4f6; /* gray-100 */
  color: #111827; /* gray-900 */
}
.toolbar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 9999px; }
</style>
