<script setup>
import { AlertTriangleIcon, RefreshCwIcon } from '@lucide/vue'

defineProps({
  message: { type: String, default: 'Terjadi kesalahan saat memuat data. Silakan coba lagi.' },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-5 shadow-soft">
      <AlertTriangleIcon class="w-10 h-10 text-red-400" />
    </div>
    <h3 class="font-heading font-semibold text-lg text-heading mb-2">Gagal Memuat Data</h3>
    <p class="text-body text-sm max-w-xs mb-5">{{ message }}</p>
    <button
      class="btn-outline text-sm flex items-center gap-2"
      @click="emit('retry')"
    >
      <RefreshCwIcon class="w-4 h-4" />
      Coba Lagi
    </button>
  </div>
</template>
