<script setup>
import { RouterLink } from 'vue-router'
import { UsersIcon, CalendarIcon, ArrowRightIcon } from '@lucide/vue'
import AppBadge from '@/components/common/AppBadge.vue'

defineProps({
  community: { type: Object, required: true },
})
</script>

<template>
  <article class="card-base flex flex-col group">
    <div class="card-img-wrap aspect-[4/3]">
      <img
        :src="community.thumbnail"
        :alt="community.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="p-5 flex flex-col flex-1">
      <AppBadge :label="community.category" variant="forest" class="mb-3" />

      <h3 class="font-heading font-bold text-lg text-heading mb-0.5">{{ community.name }}</h3>
      <p class="text-xs text-forest font-medium mb-2">{{ community.fullName }}</p>
      <p class="text-body text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
        {{ community.shortDescription }}
      </p>

      <div v-if="community.memberCount || community.founded" class="flex items-center gap-4 text-xs text-body mb-4 pt-3 border-t border-border">
        <span v-if="community.memberCount" class="flex items-center gap-1.5">
          <UsersIcon class="w-3.5 h-3.5 text-forest" />
          {{ community.memberCount }} Anggota
        </span>
        <span v-if="community.founded" class="flex items-center gap-1.5">
          <CalendarIcon class="w-3.5 h-3.5 text-forest" />
          Sejak {{ community.founded }}
        </span>
      </div>

      <RouterLink
        :to="`/komunitas/${community.slug}`"
        class="btn-outline text-sm flex items-center justify-center gap-2 w-full"
      >
        Lihat Komunitas
        <ArrowRightIcon class="w-4 h-4" />
      </RouterLink>
    </div>
  </article>
</template>
