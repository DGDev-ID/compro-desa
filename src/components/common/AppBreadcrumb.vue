<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRightIcon, HomeIcon } from '@lucide/vue'

defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label: 'Home', to: '/' }, { label: 'Destinasi', to: '/destinasi' }, { label: 'Tubing' }]
  },
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-sm flex-wrap">
    <RouterLink to="/" class="flex items-center text-body hover:text-forest transition-colors">
      <HomeIcon class="w-3.5 h-3.5" />
    </RouterLink>
    <ChevronRightIcon class="w-3.5 h-3.5 text-border flex-shrink-0" />
    <template v-for="(item, i) in items" :key="i">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="text-body hover:text-forest transition-colors"
      >
        {{ item.label }}
      </RouterLink>
      <span v-else class="text-heading font-medium">{{ item.label }}</span>
      <ChevronRightIcon v-if="i < items.length - 1" class="w-3.5 h-3.5 text-border flex-shrink-0" />
    </template>
  </nav>
</template>
