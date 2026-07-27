<script setup>
defineProps({
  lines: { type: Number, default: 3 },
  showImage: { type: Boolean, default: false },
  imageAspect: { type: String, default: '56.25%' },
  count: { type: Number, default: 1 },
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6" :class="`grid-cols-1`">
    <div
      v-for="n in count"
      :key="n"
      class="card-base p-5"
    >
      <!-- Image placeholder -->
      <div
        v-if="showImage"
        class="skeleton rounded-xl mb-4 w-full"
        :style="{ paddingTop: imageAspect }"
      />
      <!-- Lines -->
      <div class="space-y-3">
        <div class="skeleton h-5 rounded-lg w-3/4" />
        <div v-for="i in lines - 1" :key="i" class="skeleton h-3.5 rounded-md" :class="i === lines - 1 ? 'w-1/2' : 'w-full'" />
      </div>
    </div>
  </div>
</template>
