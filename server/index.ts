import { application } from './src/application/index.ts'
import Router from '~/http/router'

application.start(void 0)
  .then(app => app.service.elysia.use(Router))