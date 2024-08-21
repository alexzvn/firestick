import { createMemoryHistory } from 'vue-router'

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html
  history: (base: string) => import.meta.client ? createMemoryHistory(base) : null /* default */
}