<script setup>
import { RouterLink } from 'vue-router'
import { StarIcon, ClockIcon, ArrowRightIcon } from '@lucide/vue'
import AppBadge from '@/components/common/AppBadge.vue'

defineProps({
  destination: { type: Object, required: true },
})

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}
</script>

<template>
  <article class="card-base flex flex-col group">
    <!-- Image -->
    <div class="card-img-wrap aspect-[4/3]">
      <img
        :src="destination.thumbnail"
        :alt="destination.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1">
      <div class="flex items-start justify-between gap-2 mb-2">
        <AppBadge :label="destination.category" variant="primary" />
      </div>

      <h3 class="font-heading font-semibold text-heading text-base mb-1.5 line-clamp-1">
        {{ destination.title }}
      </h3>
      <p class="text-body text-sm leading-relaxed flex-1 line-clamp-2 mb-3">
        {{ destination.short_description }}
      </p>

      <div class="flex items-center gap-2 text-xs text-body mb-4">
        <ClockIcon class="w-3.5 h-3.5 text-forest flex-shrink-0" />
        <span>{{ destination.duration }}</span>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div>
          <span class="text-xs text-body">Mulai dari</span>
          <p class="font-heading font-bold text-forest text-sm">
            {{ formatPrice(destination.price.weekday) }}
          </p>
        </div>
        <RouterLink
          :to="`/destinasi/${destination.slug}`"
          class="btn-forest text-xs py-2 px-4 flex items-center gap-1"
        >
          Detail
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
