<script setup>
defineProps({
  label: { type: String, required: true },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'earth', 'forest', 'success'].includes(v),
  },
})
</script>

<template>
  <span :class="['badge', `badge-${variant}`]">{{ label }}</span>
</template>
