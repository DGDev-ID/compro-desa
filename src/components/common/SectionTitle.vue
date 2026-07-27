<script setup>
defineProps({
  label: String,
  title: String,
  description: String,
  centered: {
    type: Boolean,
    default: false,
  },
  light: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="['mb-10 md:mb-12', centered && 'text-center']">
    <span v-if="label" class="section-label mb-3" :class="centered && 'justify-center'">
      {{ label }}
    </span>
    <h2
      class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-3"
      :class="light ? 'text-white' : 'text-heading'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="max-w-2xl text-base leading-relaxed"
      :class="[light ? 'text-white/75' : 'text-body', centered && 'mx-auto']"
    >
      {{ description }}
    </p>
  </div>
</template>
