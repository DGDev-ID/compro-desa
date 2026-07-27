<script setup>
import { SearchXIcon } from '@lucide/vue'

defineProps({
  title: { type: String, default: 'Data tidak ditemukan' },
  description: { type: String, default: 'Coba ubah kata kunci pencarian atau filter yang digunakan.' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="w-20 h-20 rounded-2xl bg-alt flex items-center justify-center mb-5 shadow-soft">
      <SearchXIcon class="w-10 h-10 text-forest/50" />
    </div>
    <h3 class="font-heading font-semibold text-lg text-heading mb-2">{{ title }}</h3>
    <p class="text-body text-sm max-w-xs">{{ description }}</p>
  </div>
</template>
