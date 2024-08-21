import Elysia from 'elysia'
import Auth from '../controller/auth/Auth'

export default new Elysia()
  .use(Auth)
  