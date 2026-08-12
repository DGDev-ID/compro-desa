<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import FaqAccordion from '@/components/common/FaqAccordion.vue'
import CtaSection from '@/components/common/CtaSection.vue'
import { usePageHead } from '@/composables/usePageHead'
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, MessageCircleIcon, CheckIcon } from '@lucide/vue'
import { getContactInfo } from '@/services/contact.service'

usePageHead({
  title: 'Kontak',
  description: 'Hubungi Desa Pandansari melalui telepon, WhatsApp, email, atau kunjungi kantor desa kami di Kecamatan Batang.',
})

const formData = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)
const formError = ref('')

// Contact info from backend
const contact = ref(null)

onMounted(async () => {
  contact.value = await getContactInfo()
})

const waHref = computed(() => {
  if (!contact.value?.whatsapp) return '#'
  const digits = contact.value.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${digits}`
})

const phoneHref = computed(() => {
  if (!contact.value?.phone) return '#'
  return `tel:${contact.value.phone.replace(/\s/g, '')}`
})

const mailHref = computed(() => {
  if (!contact.value?.email) return '#'
  return `mailto:${contact.value.email}`
})

async function submitForm() {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    formError.value = 'Nama, email, dan pesan wajib diisi.'
    return
  }
  submitting.value = true
  formError.value = ''
  try {
    // Map frontend fields → backend fields
    await api.post('/kontak', {
      nama: formData.value.name,
      email: formData.value.email,
      subjek: formData.value.subject || null,
      pesan: formData.value.message,
    })
    submitted.value = true
  } catch (e) {
    formError.value =
      e.response?.data?.message ||
      'Terjadi kesalahan, silakan coba lagi.'
  } finally {
    submitting.value = false
  }
}

const faqs = [
  {
    question: 'Bagaimana cara reservasi wisata Tubing Pandansari?',
    answer: 'Anda bisa melakukan reservasi melalui WhatsApp atau langsung datang ke lokasi. Untuk grup lebih dari 20 orang, pemesanan minimal H-2.',
  },
  {
    question: 'Apakah ada penginapan di sekitar Desa Pandansari?',
    answer: 'Tersedia homestay di desa dan beberapa penginapan di Kota Batang yang berjarak ±15 menit dari desa. Kami juga menyediakan opsi River Camp untuk pengalaman berkemah di tepi sungai.',
  },
  {
    question: 'Apa waktu terbaik untuk berkunjung ke Pandansari?',
    answer: 'Pandansari dapat dikunjungi sepanjang tahun. Musim kemarau (April–Oktober) ideal untuk tubing dan outdoor. Musim hujan (November–Maret) menawarkan pemandangan alam yang lebih hijau dan segar.',
  },
  {
    question: 'Apakah anak-anak bisa mengikuti wisata tubing?',
    answer: 'Ya, wisata tubing tersedia untuk anak usia 7 tahun ke atas dengan pengawasan penuh dari pemandu berpengalaman dan peralatan keselamatan lengkap. Untuk anak di bawah 7 tahun, tersedia area bermain air yang lebih aman.',
  },
  {
    question: 'Bagaimana cara mendaftarkan produk UMKM ke website ini?',
    answer: 'Silakan hubungi kantor desa melalui nomor telepon atau WhatsApp yang tersedia. Tim kami akan membantu proses pendaftaran dan verifikasi usaha Anda.',
  },
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative h-64 md:h-72 overflow-hidden">
      <img
        src="/pict10.webp"
        alt="Kontak Desa Pandansari"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 hero-overlay flex items-end pb-10">
        <div class="container-site">
          <span class="section-label mb-3 text-white/80">Kami Siap Membantu</span>
          <h1 class="font-heading font-bold text-white text-3xl md:text-5xl">Hubungi Kami</h1>
        </div>
      </div>
    </section>

    <!-- Contact Info + Form -->
    <section class="section-padding bg-white">
      <div class="container-site">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Info -->
          <div data-aos="fade-right">
            <SectionTitle
              label="Informasi Kontak"
              title="Kami Ada untuk Anda"
              description="Jangan ragu untuk menghubungi kami. Tim Desa Pandansari siap membantu pertanyaan dan kebutuhan Anda."
            />

            <div class="space-y-5 mb-8">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-2xl bg-alt flex items-center justify-center flex-shrink-0">
                  <MapPinIcon class="w-5 h-5 text-forest" />
                </div>
                <div>
                  <p class="font-heading font-semibold text-heading text-sm mb-0.5">Alamat</p>
                  <p class="text-body text-sm">{{ contact?.address || 'Kantor Desa Pandansari, Kecamatan Batang, Kabupaten Batang, Jawa Tengah' }}</p>
                </div>
              </div>

              <div v-if="contact?.phone" class="flex gap-4">
                <div class="w-12 h-12 rounded-2xl bg-alt flex items-center justify-center flex-shrink-0">
                  <PhoneIcon class="w-5 h-5 text-forest" />
                </div>
                <div>
                  <p class="font-heading font-semibold text-heading text-sm mb-0.5">Telepon</p>
                  <a :href="phoneHref" class="text-body text-sm hover:text-forest transition-colors">{{ contact.phone }}</a>
                </div>
              </div>

              <div v-if="contact?.email" class="flex gap-4">
                <div class="w-12 h-12 rounded-2xl bg-alt flex items-center justify-center flex-shrink-0">
                  <MailIcon class="w-5 h-5 text-forest" />
                </div>
                <div>
                  <p class="font-heading font-semibold text-heading text-sm mb-0.5">Email</p>
                  <a :href="mailHref" class="text-body text-sm hover:text-forest transition-colors">{{ contact.email }}</a>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-2xl bg-alt flex items-center justify-center flex-shrink-0">
                  <ClockIcon class="w-5 h-5 text-forest" />
                </div>
                <div>
                  <p class="font-heading font-semibold text-heading text-sm mb-1">Jam Operasional</p>
                  <p v-if="contact?.officeHours" class="text-body text-sm whitespace-pre-line">{{ contact.officeHours }}</p>
                  <ul v-else class="space-y-0.5 text-sm text-body">
                    <li>Senin – Jumat: 08.00 – 16.00 WIB</li>
                    <li>Sabtu: 08.00 – 12.00 WIB</li>
                    <li>Minggu & Libur: Tutup</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- WhatsApp CTA -->
            <a
              :href="waHref"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 bg-success text-white font-semibold font-heading px-6 py-3.5 rounded-2xl hover:bg-success/90 transition-colors shadow-soft"
            >
              <MessageCircleIcon class="w-5 h-5" />
              Chat WhatsApp Sekarang
            </a>

            <!-- Google Maps -->
            <div class="mt-8 rounded-2xl overflow-hidden shadow-soft-lg aspect-video">
              <iframe
                v-if="contact?.googleMapsEmbed"
                :src="contact.googleMapsEmbed"
                class="w-full h-full"
                frameborder="0"
                loading="lazy"
                allowfullscreen
              />
              <iframe
                v-else
                src="https://www.google.com/maps?q=-6.9105,109.7344&z=15&output=embed"
                class="w-full h-full"
                frameborder="0"
                loading="lazy"
                allowfullscreen
              />
            </div>
          </div>

          <!-- Contact Form -->
          <div data-aos="fade-left" data-aos-delay="100">
            <div class="card-base p-8 shadow-soft-lg">
              <h3 class="font-heading font-bold text-heading text-xl mb-6">Kirim Pesan</h3>

              <!-- Success State -->
              <div v-if="submitted" class="flex flex-col items-center text-center py-8">
                <div class="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-4">
                  <CheckIcon class="w-8 h-8 text-success" />
                </div>
                <h4 class="font-heading font-bold text-heading text-lg mb-2">Pesan Terkirim!</h4>
                <p class="text-body text-sm mb-5">Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda dalam 1×24 jam.</p>
                <button class="btn-primary text-sm" @click="submitted = false; formData = { name: '', email: '', phone: '', subject: '', message: '' }">
                  Kirim Pesan Lain
                </button>
              </div>

              <form v-else class="space-y-5" @submit.prevent="submitForm">
                <p v-if="formError" class="text-red-500 text-xs bg-red-50 px-4 py-2 rounded-lg">{{ formError }}</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium font-heading text-heading mb-1.5">Nama Lengkap *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="Nama Anda"
                      class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium font-heading text-heading mb-1.5">Nomor WhatsApp</label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      placeholder="08xx xxxx xxxx"
                      class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium font-heading text-heading mb-1.5">Email *</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="email@contoh.com"
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium font-heading text-heading mb-1.5">Subjek</label>
                  <input
                    v-model="formData.subject"
                    type="text"
                    placeholder="Pertanyaan tentang wisata, UMKM, dll."
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium font-heading text-heading mb-1.5">Pesan *</label>
                  <textarea
                    v-model="formData.message"
                    rows="5"
                    placeholder="Tuliskan pesan Anda di sini..."
                    class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-heading placeholder-body/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="btn-primary w-full justify-center text-sm"
                >
                  <span v-if="submitting" class="flex items-center gap-2">
                    <span class="w-4 h-4 border-2 border-heading/30 border-t-heading rounded-full animate-spin" />
                    Mengirim...
                  </span>
                  <span v-else>Kirim Pesan</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section-padding" style="background-color: #EEF5E3;">
      <div class="container-site max-w-3xl mx-auto">
        <SectionTitle
          label="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          description="Temukan jawaban cepat untuk pertanyaan umum seputar Desa Pandansari."
          centered
        />
        <FaqAccordion :items="faqs" />
      </div>
    </section>

    <CtaSection />
  </DefaultLayout>
</template>
