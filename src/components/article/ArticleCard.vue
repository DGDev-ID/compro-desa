<script setup>
import { RouterLink } from 'vue-router'
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@lucide/vue'
import AppBadge from '@/components/common/AppBadge.vue'

defineProps({
  article: { type: Object, required: true },
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <article class="card-base flex flex-col group">
    <div class="card-img-wrap aspect-[16/9]">
      <img
        :src="article.thumbnail"
        :alt="article.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="p-5 flex flex-col flex-1">
      <div class="flex items-center gap-2 mb-3">
        <AppBadge :label="article.category" variant="primary" />
      </div>

      <h3 class="font-heading font-semibold text-heading text-base mb-2 line-clamp-2 leading-snug">
        {{ article.title }}
      </h3>
      <p class="text-body text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
        {{ article.excerpt }}
      </p>

      <div class="flex items-center justify-between pt-3 border-t border-border">
        <div class="flex items-center gap-3 text-xs text-body">
          <span class="flex items-center gap-1">
            <CalendarIcon class="w-3.5 h-3.5 text-forest" />
            {{ formatDate(article.publishedAt) }}
          </span>
          <span class="flex items-center gap-1">
            <ClockIcon class="w-3.5 h-3.5 text-forest" />
            {{ article.readingTime }} menit
          </span>
        </div>
        <RouterLink
          :to="`/artikel/${article.slug}`"
          class="text-forest hover:text-primary transition-colors"
          aria-label="Baca selengkapnya"
        >
          <ArrowRightIcon class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
