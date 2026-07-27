<script setup>
import { RouterLink } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  title: { type: String, default: 'Siap Jelajahi Pandansari?' },
  description: {
    type: String,
    default:
      'Rencanakan kunjungan Anda ke Desa Pandansari dan rasakan pengalaman wisata alam yang tak terlupakan bersama keluarga.',
  },
  primaryLabel: { type: String, default: 'Jelajahi Destinasi' },
  primaryTo: { type: String, default: '/destinasi' },
  secondaryLabel: { type: String, default: 'Hubungi Kami' },
  secondaryTo: { type: String, default: '/kontak' },
  light: { type: Boolean, default: false },
})
</script>

<template>
  <section
    class="section-padding relative overflow-hidden"
    :class="light ? 'bg-background' : ''"
    :style="light ? '' : 'background-color: #4F6F52;'"
  >
    <!-- Decorative background element -->
    <div
      v-if="!light"
      class="absolute inset-0 pointer-events-none"
      style="background-image: radial-gradient(circle at 80% 50%, rgba(178,214,96,0.15) 0%, transparent 60%);"
    />

    <div class="container-site relative z-10 text-center">
      <h2
        class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-4"
        :class="light ? 'text-heading' : 'text-white'"
        data-aos="fade-up"
      >
        {{ title }}
      </h2>
      <p
        class="max-w-xl mx-auto text-base mb-8 leading-relaxed"
        :class="light ? 'text-body' : 'text-white/80'"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {{ description }}
      </p>
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <AppButton :to="primaryTo" :variant="light ? 'primary' : 'primary'">
          {{ primaryLabel }}
        </AppButton>
        <AppButton :to="secondaryTo" :variant="light ? 'outline' : 'outline-white'">
          {{ secondaryLabel }}
        </AppButton>
      </div>
    </div>
  </section>
</template>
