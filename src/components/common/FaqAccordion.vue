<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@lucide/vue'

defineProps({
  items: {
    type: Array,
    required: true,
    // [{ question: '...', answer: '...' }]
  },
})

const openIndex = ref(null)

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="card-base overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
        @click="toggle(i)"
      >
        <span class="font-heading font-semibold text-heading text-sm md:text-base">
          {{ item.question }}
        </span>
        <ChevronDownIcon
          class="w-5 h-5 text-forest flex-shrink-0 transition-transform duration-300"
          :class="openIndex === i ? 'rotate-180' : ''"
        />
      </button>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="openIndex === i" class="px-6 pb-5">
          <p class="text-body text-sm leading-relaxed">{{ item.answer }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>
