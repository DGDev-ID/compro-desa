<script setup>
defineProps({
  year: { type: String, required: true },
  event: { type: String, required: true },
  isLast: { type: Boolean, default: false },
})
</script>

<template>
  <div class="flex gap-4 relative">
    <!-- Timeline line -->
    <div class="flex flex-col items-center">
      <div class="w-4 h-4 rounded-full bg-primary border-4 border-forest flex-shrink-0 mt-1 shadow-soft" />
      <div v-if="!isLast" class="w-0.5 flex-1 bg-border mt-1" />
    </div>
    <!-- Content -->
    <div class="pb-6">
      <span class="font-heading font-bold text-primary text-sm">{{ year }}</span>
      <p class="text-body text-sm mt-0.5 leading-relaxed">{{ event }}</p>
    </div>
  </div>
</template>
