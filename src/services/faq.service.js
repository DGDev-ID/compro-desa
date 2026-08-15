import api from '@/api/axios'

/**
 * Fetch FAQs from backend
 */
export async function getFaqs() {
  try {
    const res = await api.get('/faq')
    return (res.data.data || []).map(item => ({
      question: item.pertanyaan || item.question,
      answer: item.jawaban || item.answer
    }))
  } catch (error) {
    console.error('Failed to fetch FAQs', error)
    return []
  }
}
