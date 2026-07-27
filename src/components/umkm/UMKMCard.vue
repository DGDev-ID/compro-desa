<script setup>
import { RouterLink } from 'vue-router'
import { MapPinIcon, ArrowRightIcon } from '@lucide/vue'
import AppBadge from '@/components/common/AppBadge.vue'

defineProps({
  umkm: { type: Object, required: true },
})
</script>

<template>
  <article class="card-base flex flex-col group">
    <div class="card-img-wrap aspect-[4/3]">
      <img
        :src="umkm.thumbnail"
        :alt="umkm.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="p-5 flex flex-col flex-1">
      <AppBadge :label="umkm.category" variant="earth" class="mb-3" />

      <h3 class="font-heading font-semibold text-heading text-base mb-1.5 line-clamp-1">
        {{ umkm.name }}
      </h3>
      <p class="text-body text-sm leading-relaxed flex-1 line-clamp-2 mb-3">
        {{ umkm.shortDescription }}
      </p>

      <div class="flex items-center gap-1.5 text-xs text-body mb-4">
        <MapPinIcon class="w-3.5 h-3.5 text-forest flex-shrink-0" />
        <span class="line-clamp-1">{{ umkm.address }}</span>
      </div>

      <RouterLink
        :to="`/umkm/${umkm.slug}`"
        class="btn-outline text-sm flex items-center justify-center gap-2 w-full mt-auto"
      >
        Lihat Detail
        <ArrowRightIcon class="w-4 h-4" />
      </RouterLink>
    </div>
  </article>
</template>
