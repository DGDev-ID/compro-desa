import { ref, computed } from 'vue'

/**
 * Client-side pagination composable.
 *
 * When switching to API, pass metadata directly:
 *   setPagination({ current_page, last_page, per_page, total })
 */
export function usePagination(initialPerPage = 6) {
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(initialPerPage)
  const total = ref(0)

  const hasPrev = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < lastPage.value)

  const pages = computed(() => {
    const range = []
    const delta = 2
    const left = Math.max(1, currentPage.value - delta)
    const right = Math.min(lastPage.value, currentPage.value + delta)

    if (left > 1) {
      range.push(1)
      if (left > 2) range.push('...')
    }
    for (let i = left; i <= right; i++) range.push(i)
    if (right < lastPage.value) {
      if (right < lastPage.value - 1) range.push('...')
      range.push(lastPage.value)
    }
    return range
  })

  function setMeta({ current_page, last_page, per_page, total: t }) {
    currentPage.value = current_page
    lastPage.value = last_page
    perPage.value = per_page
    total.value = t
  }

  function goToPage(page) {
    if (page < 1 || page > lastPage.value) return
    currentPage.value = page
  }

  function nextPage() {
    goToPage(currentPage.value + 1)
  }

  function prevPage() {
    goToPage(currentPage.value - 1)
  }

  return {
    currentPage,
    lastPage,
    perPage,
    total,
    hasPrev,
    hasNext,
    pages,
    setMeta,
    goToPage,
    nextPage,
    prevPage,
  }
}
