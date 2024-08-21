import { edenTreaty } from '@elysiajs/eden'
import type { ElysiaServer } from '../../server/dist/index'

const target = import.meta.env.VITE_SERVER_URL || window.location.origin

// @ts-expect-error
export default edenTreaty<ElysiaServer>(target)