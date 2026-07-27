<script setup>
import { MapPinIcon, TrophyIcon, UsersIcon, TrendingUpIcon, StoreIcon, HomeIcon } from '@lucide/vue'
import { useCounterOnVisible } from '@/composables/useCounter'

const props = defineProps({
  stat: { type: Object, required: true },
})

const iconMap = {
  MapPin: MapPinIcon,
  Trophy: TrophyIcon,
  Users: UsersIcon,
  TrendingUp: TrendingUpIcon,
  Store: StoreIcon,
  Home: HomeIcon,
}

const { count, elRef } = useCounterOnVisible(props.stat.value, 2200)
</script>

<template>
  <div
    ref="elRef"
    class="card-base p-6 flex flex-col items-center text-center group"
    data-aos="fade-up"
  >
    <div class="w-14 h-14 rounded-2xl bg-alt flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
      <component :is="iconMap[stat.icon] || MapPinIcon" class="w-7 h-7 text-forest transition-colors group-hover:text-forest" />
    </div>
    <div class="font-heading font-bold text-3xl text-heading mb-1">
      {{ count.toLocaleString('id-ID') }}{{ stat.suffix }}
    </div>
    <div class="font-heading font-semibold text-sm text-heading mb-1">{{ stat.label }}</div>
    <div class="text-xs text-body">{{ stat.description }}</div>
  </div>
</template>
