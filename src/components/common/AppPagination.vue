<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true },
  pages: { type: Array, required: true },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div v-if="lastPage > 1" class="flex items-center justify-center gap-1.5 flex-wrap">
    <!-- Prev -->
    <button
      class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
      :class="
        currentPage <= 1
          ? 'border-border text-body/40 cursor-not-allowed'
          : 'border-border text-body hover:bg-alt hover:text-forest hover:border-primary'
      "
      :disabled="currentPage <= 1"
      @click="emit('change', currentPage - 1)"
      aria-label="Halaman sebelumnya"
    >
      <ChevronLeftIcon class="w-4 h-4" />
    </button>

    <!-- Page numbers -->
    <template v-for="(page, i) in pages" :key="i">
      <span v-if="page === '...'" class="w-9 h-9 flex items-center justify-center text-body text-sm">
        …
      </span>
      <button
        v-else
        class="w-9 h-9 rounded-xl text-sm font-medium font-heading transition-colors border"
        :class="
          page === currentPage
            ? 'bg-primary border-primary text-heading shadow-soft'
            : 'border-border text-body hover:bg-alt hover:text-forest hover:border-primary'
        "
        @click="emit('change', page)"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      class="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
      :class="
        currentPage >= lastPage
          ? 'border-border text-body/40 cursor-not-allowed'
          : 'border-border text-body hover:bg-alt hover:text-forest hover:border-primary'
      "
      :disabled="currentPage >= lastPage"
      @click="emit('change', currentPage + 1)"
      aria-label="Halaman berikutnya"
    >
      <ChevronRightIcon class="w-4 h-4" />
    </button>
  </div>
</template>
