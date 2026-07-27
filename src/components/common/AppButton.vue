<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'outline', 'outline-white', 'forest', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  to: String,
  href: String,
  disabled: Boolean,
  type: {
    type: String,
    default: 'button',
  },
})

const sizeClass = {
  sm: 'text-xs py-2 px-4',
  md: 'text-sm py-2.5 px-5',
  lg: 'text-base py-3.5 px-7',
}

const variantClass = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  'outline-white': 'btn-outline-white',
  forest: 'btn-forest',
  ghost: 'inline-flex items-center gap-2 text-forest font-semibold font-heading hover:text-primary transition-colors',
}
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[variantClass[variant], sizeClass[size], disabled && 'opacity-50 pointer-events-none']"
  >
    <slot />
  </RouterLink>
  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="[variantClass[variant], sizeClass[size], disabled && 'opacity-50 pointer-events-none']"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[variantClass[variant], sizeClass[size], disabled && 'opacity-50 cursor-not-allowed']"
  >
    <slot />
  </button>
</template>
