<script setup>
import { ref } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { ZoomInIcon } from '@lucide/vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    // [{ id, src, thumb, alt, caption }]
  },
  columns: { type: Number, default: 3 },
})

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

const imgs = props.images.map((img) => ({ src: img.src, title: img.caption || img.alt }))

function openLightbox(index) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}
</script>

<template>
  <div>
    <div
      class="grid gap-4"
      :class="{
        'grid-cols-2 md:grid-cols-3': columns === 3,
        'grid-cols-2': columns === 2,
        'grid-cols-2 md:grid-cols-4': columns === 4,
      }"
    >
      <div
        v-for="(image, i) in images"
        :key="image.id"
        class="relative group cursor-pointer rounded-2xl overflow-hidden aspect-square shadow-soft"
        @click="openLightbox(i)"
        data-aos="fade-up"
        :data-aos-delay="(i % columns) * 80"
      >
        <img
          :src="image.thumb || image.src"
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-heading/0 group-hover:bg-heading/40 transition-colors duration-300 flex items-center justify-center">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
            <ZoomInIcon class="w-6 h-6 text-white" />
          </div>
        </div>
        <!-- Caption overlay at bottom -->
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-heading/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p class="text-white text-xs font-medium line-clamp-1">{{ image.caption || image.alt }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="imgs"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </div>
</template>
